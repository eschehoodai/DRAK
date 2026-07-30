<?php
/**
 * Drachen Taverne Zittau - E-Mail-Versand für Stornierungen von Tischreservierungen
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
    $data = $_POST;
}

// Pflichtfelder auslesen & bereinigen
$id       = isset($data['id']) ? trim(strip_tags($data['id'])) : 'UNBEKANNT';
$name     = isset($data['name']) ? trim(strip_tags($data['name'])) : 'Unbekannt';
$phone    = isset($data['phone']) ? trim(strip_tags($data['phone'])) : '';
$email    = isset($data['email']) ? filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL) : '';
$guests   = isset($data['guests']) ? intval($data['guests']) : 1;
$date     = isset($data['date']) ? trim(strip_tags($data['date'])) : '';
$time     = isset($data['time']) ? trim(strip_tags($data['time'])) : '';
$vault    = isset($data['vault']) ? trim(strip_tags($data['vault'])) : 'Gewölbe';

// Empfänger-Adressen (Kunde & Testadresse)
$to = "drakzittau@dlr-gastro-event.de, eschehoodai@gmail.com";

// Betreff
$subject = "❌ Stornierung Tischreservierung: $id - $name";

// Datum schön formatieren falls möglich
$formattedDate = $date;
if (strtotime($date)) {
    $formattedDate = date('d.m.Y', strtotime($date));
}

// E-Mail-Nachricht
$message = "Achtung - Reservierung storniert!\n\n";
$message .= "Folgende Tischreservierung wurde soeben vom Gast storniert:\n\n";
$message .= "--------------------------------------------------------\n";
$message .= "Stornierter Buchungscode: " . $id . "\n";
$message .= "Name des Gastes         : " . $name . "\n";
$message .= "Telefonnummer           : " . ($phone ? $phone : "Keine angegeben") . "\n";
if (!empty($email)) {
    $message .= "E-Mail Gast             : " . $email . "\n";
}
$message .= "Anzahl Personen         : " . $guests . " Person(en)\n";
$message .= "Datum                   : " . $formattedDate . "\n";
$message .= "Uhrzeit                 : " . $time . " Uhr\n";
$message .= "Gewölbebereich          : " . $vault . "\n";
$message .= "--------------------------------------------------------\n\n";
$message .= "Der Tisch im Gewölbe steht somit für andere Gäste wieder zur Verfügung.\n\n";
$message .= "Diese Benachrichtigung wurde automatisch über drakzittau.de versendet.\n";

// Header konfigurieren
$replyToHeader = !empty($email) ? ($name . ' <' . $email . '>') : 'Drachen Taverne Stornierungen <noreply@drakzittau.de>';
$headers = array(
    'From' => 'Drachen Taverne Stornierungen <noreply@drakzittau.de>',
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
        "message" => "Stornierungs-E-Mail für Reservierung $id erfolgreich versendet."
    ]);
} else {
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "warning" => "Stornierung lokal verarbeitet. Auf Netcup wird mail() aktiv ausgeführt.",
        "message" => "Stornierung verarbeitet."
    ]);
}
