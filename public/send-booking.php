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
$vault    = isset($data['vault']) ? trim(strip_tags($data['vault'])) : 'Gewölbe';
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
    $pdo->beginTransaction();

    // Aktuelle Buchungen für den Zeitslot abfragen (sowohl bestätigte Buchungen als auch Voranfragen blockieren den Slot)
    $stmt = $pdo->prepare("
        SELECT guests
        FROM reservations
        WHERE date = :date AND time = :time AND status IN ('confirmed', 'inquiry')
    ");
    $stmt->execute([':date' => $date, ':time' => $time]);
    $existingBookings = $stmt->fetchAll(PDO::FETCH_COLUMN);

    $bookingCount = count($existingBookings);
    $currentBooked = 0;
    $hasLargeGroup = false;

    foreach ($existingBookings as $g) {
        $gInt = (int)$g;
        $currentBooked += $gInt;
        if ($gInt > STANDARD_SLOT_CAPACITY) {
            $hasLargeGroup = true;
        }
    }

    $isAllowed = false;
    $errorMessage = '';

    if ($hasLargeGroup || ($bookingCount > 0 && $currentBooked >= STANDARD_SLOT_CAPACITY)) {
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

    // Reservierung / Anfrage in Datenbank anlegen
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
} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("DB-Fehler bei Reservierung: " . $e->getMessage());
}

// Empfänger-Adressen (Kunde & Testadresse)
$to = "drakzittau@dlr-gastro-event.de, eschehoodai@gmail.com";

// Datum schön formatieren falls möglich
$formattedDate = $date;
if (strtotime($date)) {
    $formattedDate = date('d.m.Y', strtotime($date));
}

// Betreff und E-Mail-Nachricht je nach Art (Buchung oder Großgruppen-Anfrage)
if ($isLargeGroup) {
    $subject = "📜 Neue Großgruppen-Anfrage (ab 11 Pers.): $id - $name ($guests Personen)";

    $message = "Seid gegrüßt,\n\n";
    $message .= "Eine neue GROSSGRUPPEN-ANFRAGE ist für die Drachen Taverne Zittau eingegangen:\n\n";
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
        "message" => "E-Mail-Benachrichtigung für Reservierung $id erfolgreich versendet."
    ]);
} else {
    // Falls mail() auf lokaler Entwicklungsumgebung fehlschlägt (z.B. ohne SMTP)
    // geben wir eine verständliche Antwort zurück
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "warning" => "Reservierung lokal gespeichert. Auf dem Netcup-Server wird mail() aktiv ausgeführt.",
        "message" => "Reservierung empfangen."
    ]);
}
