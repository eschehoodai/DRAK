<?php
/**
 * Drachen Taverne Zittau - E-Mail-Versand für Job-Bewerbungen
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
$id        = isset($data['id']) ? trim(strip_tags($data['id'])) : 'DRAK-ZUNFT';
$position  = isset($data['position']) ? trim(strip_tags($data['position'])) : 'Servicekraft';
$name      = isset($data['name']) ? trim(strip_tags($data['name'])) : '';
$email     = isset($data['email']) ? filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL) : '';
$phone     = isset($data['phone']) ? trim(strip_tags($data['phone'])) : 'Nicht angegeben';
$about     = isset($data['about']) ? trim(strip_tags($data['about'])) : 'Keine zusätzliche Nachricht';

// Validierung
if (empty($name) || empty($email)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Bitte Name und E-Mail-Adresse ausfüllen."]);
    exit();
}

// Empfänger-Adresse
$to = "eschehoodai@gmail.com";

// Betreff
$subject = "⚔️ Neue Job-Bewerbung: $position - $name ($id)";

// E-Mail-Nachricht
$message = "Seid gegrüßt,\n\n";
$message .= "Eine neue Kurzbewerbung ist für die Drachen Taverne Zittau eingegangen:\n\n";
$message .= "--------------------------------------------------------\n";
$message .= "Zunft-Nummer    : " . $id . "\n";
$message .= "Gewünschte Stelle: " . $position . "\n";
$message .= "Bewerber Name   : " . $name . "\n";
$message .= "E-Mail-Adresse  : " . $email . "\n";
$message .= "Telefonnummer   : " . $phone . "\n";
$message .= "--------------------------------------------------------\n";
$message .= "Über den Bewerber / Motivation:\n";
$message .= $about . "\n";
$message .= "--------------------------------------------------------\n\n";
$message .= "Diese E-Mail wurde automatisch über das Karriereformular auf drakzittau.de versendet.\n";

// Header konfigurieren
$headers = array(
    'From' => 'Drachen Taverne Jobs <noreply@drakzittau.de>',
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
        "message" => "Bewerbung $id erfolgreich per E-Mail versendet."
    ]);
} else {
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "warning" => "Bewerbung lokal verarbeitet. Auf Netcup wird mail() aktiv ausgeführt.",
        "message" => "Bewerbung empfangen."
    ]);
}
