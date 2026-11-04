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

// Modus 1: Monatsabfrage für den Kunden-Kalender (?month=YYYY-MM)
// Liefert alle Tage des Monats, die VOLLSTÄNDIG gesperrt sind (unanklickbar im Kalender).
if (isset($_GET['month'])) {
    $month = trim($_GET['month']);
    if (!preg_match('/^\d{4}-\d{2}$/', $month)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error"   => "Ungültiges Monatsformat (erwartet: YYYY-MM)."
        ]);
        exit();
    }

    try {
        $pdo = getDb();
        $blockedDates = getBlockedDaysForMonth($pdo, $month);
        echo json_encode([
            "success"      => true,
            "month"        => $month,
            "blockedDates" => $blockedDates
        ]);
        exit();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error"   => "Datenbankfehler bei der Monatsabfrage: " . $e->getMessage()
        ]);
        exit();
    }
}

// Modus 2: Tagesabfrage (?date=YYYY-MM-DD)
$date = isset($_GET['date']) ? trim($_GET['date']) : '';

// Validierung: Datum muss im Format YYYY-MM-DD vorliegen
if (empty($date) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error"   => "Ungültiges oder fehlendes Datumsformat (erwartet: YYYY-MM-DD oder ?month=YYYY-MM)."
    ]);
    exit();
}

try {
    $pdo = getDb();
    $dayLock = isDayBlocked($pdo, $date);
    $occupancy = getOccupancyDetailsForDate($pdo, $date);

    // Standard-Slots des Wochentags ermitteln, um auch bei 0 Buchungen alle Slots zu kennen
    $openingHours = getStandardOpeningHours();
    $dayOfWeek = (int)date('w', strtotime($date));
    $dayConfig = $openingHours[$dayOfWeek] ?? null;
    $standardSlots = $dayConfig ? getSlotsForDayConfig($dayConfig) : [];

    // Alle Standard-Slots in die Belegungsdaten einmischen, falls sie noch nicht vorkommen
    foreach ($standardSlots as $stdSlot) {
        if (!isset($occupancy[$stdSlot])) {
            $occupancy[$stdSlot] = [
                'total_guests'    => 0,
                'booking_count'   => 0,
                'has_large_group' => false,
                'is_blocked'      => !empty($dayLock),
            ];
        }
    }

    $slotsData = [];
    foreach ($occupancy as $slotTime => $info) {
        $booked = $info['total_guests'];
        $count = $info['booking_count'];
        $hasLarge = $info['has_large_group'];
        $isBlocked = !empty($info['is_blocked']) || !empty($dayLock);

        // Plan B + Wirt-Sperre:
        // - Wenn durch Wirt gesperrt ($isBlocked): sofort 0 Plätze frei
        // - Hat eine Großgruppe (> 10 Gäste) gebucht, ist der Slot sofort voll (0 Plätze frei).
        // - Bei normalen Gruppen schließt der Slot bei STANDARD_SLOT_CAPACITY (10 Personen).
        $isFull = $isBlocked || $hasLarge || ($count > 0 && $booked >= STANDARD_SLOT_CAPACITY);
        $remaining = $isFull ? 0 : max(0, STANDARD_SLOT_CAPACITY - $booked);
        $maxSingleGroup = ($count === 0 && !$isBlocked) ? MAX_EXCLUSIVE_GROUP_CAPACITY : $remaining;

        $slotsData[$slotTime] = [
            "booked"         => $booked,
            "bookingCount"   => $count,
            "hasLargeGroup"  => $hasLarge,
            "isBlocked"      => $isBlocked,
            "remaining"      => $remaining,
            "maxSingleGroup" => $maxSingleGroup,
            "isFull"         => $isFull
        ];
    }

    ksort($slotsData);

    echo json_encode([
        "success"              => true,
        "date"                 => $date,
        "isDayBlocked"         => !empty($dayLock),
        "dayBlockReason"       => $dayLock ? (!empty($dayLock['notes']) ? $dayLock['notes'] : 'Geschlossene Gesellschaft') : null,
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
