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
    $occupancy = getOccupancyDetailsForDate($pdo, $date);

    $slotsData = [];
    foreach ($occupancy as $slotTime => $info) {
        $booked = $info['total_guests'];
        $count = $info['booking_count'];
        $hasLarge = $info['has_large_group'];

        // Plan B:
        // - Hat eine Großgruppe (> 10 Gäste) gebucht, ist der Slot sofort voll (0 Plätze frei).
        // - Bei normalen Gruppen schließt der Slot bei STANDARD_SLOT_CAPACITY (10 Personen).
        $isFull = $hasLarge || ($count > 0 && $booked >= STANDARD_SLOT_CAPACITY);
        $remaining = $isFull ? 0 : max(0, STANDARD_SLOT_CAPACITY - $booked);
        $maxSingleGroup = ($count === 0) ? MAX_EXCLUSIVE_GROUP_CAPACITY : $remaining;

        $slotsData[$slotTime] = [
            "booked"         => $booked,
            "bookingCount"   => $count,
            "hasLargeGroup"  => $hasLarge,
            "remaining"      => $remaining,
            "maxSingleGroup" => $maxSingleGroup,
            "isFull"         => $isFull
        ];
    }

    echo json_encode([
        "success"              => true,
        "date"                 => $date,
        "standardCapacity"     => STANDARD_SLOT_CAPACITY,
        "maxExclusiveCapacity" => MAX_EXCLUSIVE_GROUP_CAPACITY,
        "slots"                => $slotsData
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error"   => "Datenbankfehler bei der Verfügbarkeitsabfrage: " . $e->getMessage()
    ]);
}
