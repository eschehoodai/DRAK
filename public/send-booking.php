<?php
/**
 * Drachen Taverne Zittau - E-Mail-Versand für Tischreservierungen
 * Verwendet die native PHP mail() Funktion.
 */

// Headers für JSON Response & CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Nur POST erlaubt
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Methode nicht erlaubt."]);
    exit();
}

// JSON-Eingabe lesen
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    // Fallback auf standard POST-Parameter
    $data = $_POST;
}

// Pflichtfelder auslesen & bereinigen
$id       = isset($data['id']) ? trim(strip_tags($data['id'])) : 'DRAK-PROTOTYP';
$name     = isset($data['name']) ? trim(strip_tags($data['name'])) : '';
$phone    = isset($data['phone']) ? trim(strip_tags($data['phone'])) : '';
$email    = isset($data['email']) ? filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL) : '';
$guests   = isset($data['guests']) ? intval($data['guests']) : 1;
$date     = isset($data['date']) ? trim(strip_tags($data['date'])) : '';
$time     = isset($data['time']) ? trim(strip_tags($data['time'])) : '';
$vault    = isset($data['vault']) ? trim(strip_tags($data['vault'])) : 'Die Grosse Kathedrale';
$notes    = isset($data['notes']) ? trim(strip_tags($data['notes'])) : 'Keine Sonderwünsche';

require_once __DIR__ . '/db.php';

// Validierung
if (empty($name) || empty($date) || empty($time)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Bitte alle Pflichtfelder (Name, Datum, Uhrzeit) ausfüllen."]);
    exit();
}

$isLargeGroup = ($guests >= 11);
$status = $isLargeGroup ? 'inquiry' : 'confirmed';

// Handynummer ist ab 11 Personen Pflicht
if ($isLargeGroup && empty($phone)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Für Gruppen ab 11 Personen ist die Handynummer zwingend erforderlich."]);
    exit();
}

// Transaktionssichere Kapazitätsprüfung & Speicherung nach Plan B in SQLite
try {
    $pdo = getDb();

    // Eventuell vorherige Notfall-Buchungen bei Gelegenheit in SQLite übertragen
    try {
        drainFallbackQueue($pdo);
    } catch (Exception $e) {
        // Leise ignorieren
    }

    // Eindeutigkeit der ID sicherstellen (Ursache B Kollisionsschutz)
    try {
        $checkIdStmt = $pdo->prepare("SELECT 1 FROM reservations WHERE id = :id");
        $checkIdStmt->execute([':id' => $id]);
        if ($checkIdStmt->fetchColumn()) {
            $id = $id . '-' . mt_rand(10, 99);
        }
    } catch (Exception $e) {
        $id = $id . '-' . mt_rand(10, 99);
    }

    $pdo->beginTransaction();

    // Aktuelle Buchungen und Sperren (inkl. Ganztagssperre time = 'ALL') für den Tag abfragen
    $stmt = $pdo->prepare("
        SELECT time, guests, status, notes
        FROM reservations
        WHERE date = :date AND (time = :time OR time = 'ALL') AND status IN ('confirmed', 'inquiry', 'blocked')
    ");
    $stmt->execute([':date' => $date, ':time' => $time]);
    $existingRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $bookingCount = 0;
    $currentBooked = 0;
    $hasLargeGroup = false;
    $isBlocked = false;
    $isDayBlocked = false;
    $dayBlockReason = '';

    foreach ($existingRows as $row) {
        if ($row['status'] === 'blocked') {
            $isBlocked = true;
            if (trim($row['time']) === 'ALL') {
                $isDayBlocked = true;
                $dayBlockReason = trim($row['notes'] ?? '');
            }
        } else {
            // Nur echte Zeitslots zur Belegung zählen (nicht time = 'ALL')
            if (trim($row['time']) !== 'ALL') {
                $gInt = (int)$row['guests'];
                $currentBooked += $gInt;
                $bookingCount++;
                if ($gInt > STANDARD_SLOT_CAPACITY) {
                    $hasLargeGroup = true;
                }
            }
        }
    }

    $isAllowed = false;
    $errorMessage = '';

    if ($isDayBlocked) {
        $isAllowed = false;
        $reasonText = !empty($dayBlockReason) ? " (" . htmlspecialchars($dayBlockReason) . ")" : "";
        $errorMessage = "Die Taverne ist an diesem Tag für Reservierungen geschlossen" . $reasonText . ".";
    } else if ($isBlocked) {
        $isAllowed = false;
        $errorMessage = "Dieser Termin (" . htmlspecialchars($time) . " Uhr) ist durch die Wirtsleute gesperrt.";
    } else if ($hasLargeGroup || ($bookingCount > 0 && $currentBooked >= STANDARD_SLOT_CAPACITY)) {
        $isAllowed = false;
        $errorMessage = "Dieser Termin (" . htmlspecialchars($time) . " Uhr) ist leider bereits vollständig ausgebucht.";
    } else if ($bookingCount === 0) {
        // Slot ist noch komplett ungebucht: Einzelne Großgruppe bis zu 20 Personen erlaubt
        if ($guests <= MAX_EXCLUSIVE_GROUP_CAPACITY) {
            $isAllowed = true;
        } else {
            $isAllowed = false;
            $errorMessage = "Online-Reservierungen sind auf maximal " . MAX_EXCLUSIVE_GROUP_CAPACITY . " Personen begrenzt. Bitte ruft uns persönlich an.";
        }
    } else {
        // Slot hat bereits Buchungen: Es dürfen nur noch kleinere Gruppen bis zur Standard-Kapazität (10) auffüllen
        $remaining = max(0, STANDARD_SLOT_CAPACITY - $currentBooked);
        if ($guests <= $remaining) {
            $isAllowed = true;
        } else {
            $isAllowed = false;
            $errorMessage = "Für " . htmlspecialchars($time) . " Uhr sind leider nur noch " . $remaining . " Plätze frei. Für größere Gruppen wählt bitte einen anderen freien Termin.";
        }
    }

    if (!$isAllowed) {
        $pdo->rollBack();
        http_response_code(409); // Conflict: Slot voll oder nicht genügend Plätze
        echo json_encode([
            "success" => false,
            "error"   => $errorMessage
        ]);
        exit();
    }

    // Reservierung mit bis zu 3 Versuchen in Datenbank anlegen (Ursache A Auto-Retry)
    $inserted = false;
    $maxAttempts = 3;
    for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
        try {
            $insert = $pdo->prepare("
                INSERT INTO reservations (id, name, phone, email, guests, date, time, vault, notes, status)
                VALUES (:id, :name, :phone, :email, :guests, :date, :time, :vault, :notes, :status)
            ");
            $insert->execute([
                ':id'     => $id,
                ':name'   => $name,
                ':phone'  => $phone,
                ':email'  => $email,
                ':guests' => $guests,
                ':date'   => $date,
                ':time'   => $time,
                ':vault'  => $vault,
                ':notes'  => $notes,
                ':status' => $status
            ]);
            $pdo->commit();
            $inserted = true;
            break;
        } catch (Exception $attemptEx) {
            if ($attempt < $maxAttempts) {
                usleep(100000); // 100ms warten
            } else {
                throw $attemptEx;
            }
        }
    }
} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("DB-Fehler bei Reservierung: " . $e->getMessage());

    // NOTFALL-PUFFER (Ursache A Fallback):
    // Buchung sofort in fallback_queue.json sichern, damit sie nicht verloren geht
    // und sofort im Tischplan erscheint!
    saveFallbackReservation([
        'id'         => $id,
        'name'       => $name,
        'phone'      => $phone,
        'email'      => $email,
        'guests'     => $guests,
        'date'       => $date,
        'time'       => $time,
        'vault'      => $vault,
        'notes'      => $notes,
        'status'     => $status,
        'created_at' => date('Y-m-d H:i:s')
    ]);
}

// Empfänger-Adressen (Kunde & Testadresse)
$to = "drakzittau@dlr-gastro-event.de, eschehoodai@gmail.com";

// Datum schön formatieren falls möglich
$formattedDate = $date;
if (strtotime($date)) {
    $formattedDate = date('d.m.Y', strtotime($date));
}

// Betreff und E-Mail-Nachricht je nach Art (Buchung, Voranfrage oder Großgruppen-Anfrage)
if ($guests >= 20) {
    $subject = "📜 Neue Großgruppen-Anfrage (ab 20 Pers.): $id - $name (20+ Personen)";

    $message = "Seid gegrüßt,\n\n";
    $message .= "Eine neue GROSSGRUPPEN-ANFRAGE (20+ Personen) ist für die Drachen Taverne Zittau eingegangen:\n\n";
    $message .= "ACHTUNG: Dies ist eine UNVERBINDLICHE VORANFRAGE (noch keine feste Buchung)!\n";
    $message .= "Bitte schnellstmöglich den Gast telefonisch kontaktieren:\n";
    $message .= "--------------------------------------------------------\n";
    $message .= "Buchungscode   : " . $id . "\n";
    $message .= "Name des Gastes: " . $name . "\n";
    $message .= "Handy/Telefon  : " . ($phone ? $phone : "Keine angegeben") . " (RÜCKRUF ERFORDERLICH)\n";
    if (!empty($email)) {
        $message .= "E-Mail Gast    : " . $email . "\n";
    }
    $message .= "Anzahl Personen: 20+ Personen (Großgruppe)\n";
    $message .= "Wunsch-Datum   : " . $formattedDate . "\n";
    $message .= "Wunsch-Uhrzeit : " . $time . " Uhr\n";
    $message .= "Gewölbebereich : " . $vault . "\n";
    $message .= "Anmerkungen    : " . ($notes ? $notes : "Keine") . "\n";
    $message .= "--------------------------------------------------------\n\n";
    $message .= "E-Mail wurde automatisch über das Reservierungsformular auf drakzittau.de versendet.\n";
} else if ($isLargeGroup) {
    $subject = "📜 Neue Voranfrage (11-19 Pers.): $id - $name ($guests Personen)";

    $message = "Seid gegrüßt,\n\n";
    $message .= "Eine neue TISCH-VORANFRAGE ($guests Personen) ist für die Drachen Taverne Zittau eingegangen:\n\n";
    $message .= "ACHTUNG: Dies ist eine UNVERBINDLICHE VORANFRAGE (noch keine feste Buchung)!\n";
    $message .= "Bitte schnellstmöglich den Gast telefonisch kontaktieren:\n";
    $message .= "--------------------------------------------------------\n";
    $message .= "Buchungscode   : " . $id . "\n";
    $message .= "Name des Gastes: " . $name . "\n";
    $message .= "Handy/Telefon  : " . ($phone ? $phone : "Keine angegeben") . " (RÜCKRUF ERFORDERLICH)\n";
    if (!empty($email)) {
        $message .= "E-Mail Gast    : " . $email . "\n";
    }
    $message .= "Anzahl Personen: " . $guests . " Person(en)\n";
    $message .= "Wunsch-Datum   : " . $formattedDate . "\n";
    $message .= "Wunsch-Uhrzeit : " . $time . " Uhr\n";
    $message .= "Gewölbebereich : " . $vault . "\n";
    $message .= "Anmerkungen    : " . ($notes ? $notes : "Keine") . "\n";
    $message .= "--------------------------------------------------------\n\n";
    $message .= "E-Mail wurde automatisch über das Reservierungsformular auf drakzittau.de versendet.\n";
} else {
    $subject = "🐉 Neue Tischreservierung: $id - $name";

    $message = "Seid gegrüßt,\n\n";
    $message .= "Eine neue Hoftafel-Reservierung ist für die Drachen Taverne Zittau eingegangen:\n\n";
    $message .= "--------------------------------------------------------\n";
    $message .= "Buchungscode : " . $id . "\n";
    $message .= "Name des Gastes: " . $name . "\n";
    $message .= "Telefonnummer  : " . ($phone ? $phone : "Keine angegeben") . "\n";
    if (!empty($email)) {
        $message .= "E-Mail Gast    : " . $email . "\n";
    }
    $message .= "Anzahl Personen: " . $guests . " Person(en)\n";
    $message .= "Datum          : " . $formattedDate . "\n";
    $message .= "Uhrzeit        : " . $time . " Uhr\n";
    $message .= "Gewölbebereich : " . $vault . "\n";
    $message .= "Anmerkungen    : " . ($notes ? $notes : "Keine") . "\n";
    $message .= "--------------------------------------------------------\n\n";
    $message .= "E-Mail wurde automatisch über das Reservierungsformular auf drakzittau.de versendet.\n";
}

// Header konfigurieren
$replyToHeader = !empty($email) ? ($name . ' <' . $email . '>') : 'Drachen Taverne <noreply@drakzittau.de>';
$headers = array(
    'From' => 'Drachen Taverne Reservierung <noreply@drakzittau.de>',
    'Reply-To' => $replyToHeader,
    'X-Mailer' => 'PHP/' . phpversion(),
    'Content-Type' => 'text/plain; charset=UTF-8'
);

// E-Mail versenden
$mailSent = @mail($to, $subject, $message, implode("\r\n", array_map(
    function ($v, $k) { return sprintf("%s: %s", $k, $v); },
    $headers,
    array_keys($headers)
)));

if ($mailSent) {
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "id"      => $id,
        "message" => "E-Mail-Benachrichtigung für Reservierung $id erfolgreich versendet."
    ]);
} else {
    // Falls mail() auf lokaler Entwicklungsumgebung fehlschlägt (z.B. ohne SMTP)
    // geben wir eine verständliche Antwort zurück
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "id"      => $id,
        "warning" => "Reservierung lokal gespeichert. Auf dem Netcup-Server wird mail() aktiv ausgeführt.",
        "message" => "Reservierung empfangen."
    ]);
}
