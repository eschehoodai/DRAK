<?php
/**
 * Drachen Taverne Zittau - API-Endpunkt zur Abfrage der Auslastung je Zeitslot
 * Liefert für ein Datum alle bereits belegten Plätze zurück.
 */

// Headers für JSON Response & CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/db.php';

$date = isset($_GET['date']) ? trim($_GET['date']) : '';

// Validierung: Datum muss im Format YYYY-MM-DD vorliegen
if (empty($date) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error"   => "Ungültiges oder fehlendes Datumsformat (erwartet: YYYY-MM-DD)."
    ]);
    exit();
}

try {
    $pdo = getDb();
    $occupancy = getOccupancyForDate($pdo, $date);

    $slotsData = [];
    foreach ($occupancy as $slotTime => $bookedGuests) {
        $remaining = max(0, MAX_SLOT_CAPACITY - $bookedGuests);
        $slotsData[$slotTime] = [
            "booked"    => $bookedGuests,
            "remaining" => $remaining,
            "isFull"    => ($remaining <= 0)
        ];
    }

    echo json_encode([
        "success"     => true,
        "date"        => $date,
        "maxCapacity" => MAX_SLOT_CAPACITY,
        "slots"       => $slotsData
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error"   => "Datenbankfehler bei der Verfügbarkeitsabfrage: " . $e->getMessage()
    ]);
}
