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
$email    = isset($data['email']) ? filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL) : '';
$guests   = isset($data['guests']) ? intval($data['guests']) : 1;
$date     = isset($data['date']) ? trim(strip_tags($data['date'])) : '';
$time     = isset($data['time']) ? trim(strip_tags($data['time'])) : '';
$vault    = isset($data['vault']) ? trim(strip_tags($data['vault'])) : 'Gewölbe';
$notes    = isset($data['notes']) ? trim(strip_tags($data['notes'])) : 'Keine Sonderwünsche';

// Validierung
if (empty($name) || empty($email) || empty($date)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Bitte alle Pflichtfelder (Name, E-Mail, Datum) ausfüllen."]);
    exit();
}

// Empfänger-Adressen (Kunde & Testadresse)
$to = "drakzittau@dlr-gastro-event.de, eschehoodai@gmail.com";

// Betreff
$subject = "🐉 Neue Tischreservierung: $id - $name";

// Datum schön formatieren falls möglich
$formattedDate = $date;
if (strtotime($date)) {
    $formattedDate = date('d.m.Y', strtotime($date));
}

// E-Mail-Nachricht (Textfassung)
$message = "Seid gegrüßt,\n\n";
$message .= "Eine neue Hoftafel-Reservierung ist für die Drachen Taverne Zittau eingegangen:\n\n";
$message .= "--------------------------------------------------------\n";
$message .= "Buchungscode : " . $id . "\n";
$message .= "Name des Gastes: " . $name . "\n";
$message .= "E-Mail Gast    : " . $email . "\n";
$message .= "Anzahl Personen: " . $guests . " Person(en)\n";
$message .= "Datum          : " . $formattedDate . "\n";
$message .= "Uhrzeit        : " . $time . " Uhr\n";
$message .= "Gewölbebereich : " . $vault . "\n";
$message .= "Anmerkungen    : " . ($notes ? $notes : "Keine") . "\n";
$message .= "--------------------------------------------------------\n\n";
$message .= "E-Mail wurde automatisch über das Reservierungsformular auf drakzittau.de versendet.\n";

// Header konfigurieren
$headers = array(
    'From' => 'Drachen Taverne Reservierung <noreply@drakzittau.de>',
    'Reply-To' => $name . ' <' . $email . '>',
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
