<?php
/**
 * Drachen Taverne Zittau - Eigenständiger digitaler Tischplan & Slot-Belegungsmanager
 * Speziell optimiert für Apple iPad (9. Generation, iOS / Safari).
 * Mit Monatskalender-Übersicht (Tag/Monat), 3-Farben-Ampelmodell, echter 0-Gäste Slot-Sperre
 * und ohne E-Mail-Versand.
 */

session_start();

// Konfiguration & Wirt-Passwort
define('ADMIN_PASSWORD', 'Zittau2026!');

require_once __DIR__ . '/db.php';

// Öffnungszeiten-Definition (Analog zu frontend openingHours.ts)
// 0 = Sonntag, 1 = Montag, ..., 6 = Samstag
$OPENING_HOURS = [
    0 => ['isOpen' => true,  'open' => '11:00', 'close' => '21:00', 'lastSlot' => '20:00', 'label' => 'So: 11:00–21:00 Uhr'],
    1 => ['isOpen' => true,  'open' => '17:00', 'close' => '22:00', 'lastSlot' => '21:00', 'label' => 'Mo: 17:00–22:00 Uhr'],
    2 => ['isOpen' => false, 'open' => '',      'close' => '',      'lastSlot' => '',      'label' => 'Di: Ruhetag (Geschlossen)'],
    3 => ['isOpen' => true,  'open' => '17:00', 'close' => '22:00', 'lastSlot' => '21:00', 'label' => 'Mi: 17:00–22:00 Uhr'],
    4 => ['isOpen' => true,  'open' => '17:00', 'close' => '22:00', 'lastSlot' => '21:00', 'label' => 'Do: 17:00–22:00 Uhr'],
    5 => ['isOpen' => true,  'open' => '17:00', 'close' => '22:00', 'lastSlot' => '21:00', 'label' => 'Fr: 17:00–22:00 Uhr'],
    6 => ['isOpen' => true,  'open' => '11:00', 'close' => '22:00', 'lastSlot' => '21:00', 'label' => 'Sa: 11:00–22:00 Uhr'],
];

$message = null;
$messageType = 'info'; // 'success' | 'error' | 'info'

// 1. Logout verarbeiten
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    $_SESSION['tischplan_logged_in'] = false;
    $_SESSION['admin_logged_in'] = false;
    session_destroy();
    header('Location: tischplan.php');
    exit();
}

// 2. Login verarbeiten
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login_action'])) {
    $enteredPassword = $_POST['password'] ?? '';
    if (hash_equals(ADMIN_PASSWORD, $enteredPassword)) {
        $_SESSION['tischplan_logged_in'] = true;
        $_SESSION['admin_logged_in'] = true;
        session_regenerate_id(true);
        header('Location: tischplan.php');
        exit();
    } else {
        $message = 'Falsches Passwort! Zugriff verweigert.';
        $messageType = 'error';
    }
}

// Login-Prüfung (auch Session von admin.php wird akzeptiert)
$isLoggedIn = !empty($_SESSION['tischplan_logged_in']) || !empty($_SESSION['admin_logged_in']);

// Hilfsfunktion: Zeitslots für ein Datum ermitteln
function getSlotsForDate(string $dateStr, array $openingHoursConfig): array {
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateStr)) return [];
    $dayOfWeek = (int)date('w', strtotime($dateStr));
    $config = $openingHoursConfig[$dayOfWeek] ?? null;
    if (!$config || !$config['isOpen']) return [];

    $slots = [];
    list($openH, $openM) = explode(':', $config['open']);
    list($lastH, $lastM) = explode(':', $config['lastSlot']);

    $currentMin = (int)$openH * 60 + (int)$openM;
    $endMin = (int)$lastH * 60 + (int)$lastM;

    while ($currentMin <= $endMin) {
        $h = floor($currentMin / 60);
        $m = $currentMin % 60;
        $slots[] = sprintf('%02d:%02d', $h, $m);
        $currentMin += 30;
    }
    return $slots;
}

// Aktuelles Datum bestimmen (Standard: heute)
$selectedDate = isset($_GET['date']) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $_GET['date']) 
    ? $_GET['date'] 
    : date('Y-m-d');

// Ausgewählter Monat für den Kalender
$selectedMonth = isset($_GET['month']) && preg_match('/^\d{4}-\d{2}$/', $_GET['month'])
    ? $_GET['month']
    : substr($selectedDate, 0, 7);

// Aktionen nur ausführen wenn eingeloggt
if ($isLoggedIn) {
    $pdo = getDb();

    // 3. Manuelle Reservierung / Slot-Belegung eintragen
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_reservation') {
        $rDate   = trim($_POST['date'] ?? $selectedDate);
        $rTime   = trim($_POST['time'] ?? '');
        $rGuests = max(1, intval($_POST['guests'] ?? 1));
        $rName   = trim(strip_tags($_POST['name'] ?? 'Telefon-Buchung'));
        $rPhone  = trim(strip_tags($_POST['phone'] ?? ''));
        $rVault  = trim(strip_tags($_POST['vault'] ?? 'Gewölbe'));
        $rNotes  = trim(strip_tags($_POST['notes'] ?? 'Manuell im Tischplan eingetragen'));

        if (empty($rDate) || empty($rTime) || empty($rName)) {
            $message = 'Bitte Datum, Uhrzeit und Name für die Buchung angeben.';
            $messageType = 'error';
        } else {
            try {
                $newId = 'DRAK-MAN-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));
                $stmt = $pdo->prepare("
                    INSERT INTO reservations (id, name, phone, email, guests, date, time, vault, notes, status)
                    VALUES (:id, :name, :phone, '', :guests, :date, :time, :vault, :notes, 'confirmed')
                ");
                $stmt->execute([
                    ':id'     => $newId,
                    ':name'   => $rName,
                    ':phone'  => $rPhone,
                    ':guests' => $rGuests,
                    ':date'   => $rDate,
                    ':time'   => $rTime,
                    ':vault'  => $rVault,
                    ':notes'  => $rNotes,
                ]);
                $message = "Buchung für {$rName} ({$rGuests} Pers. um {$rTime} Uhr) erfolgreich eingetragen! Die Plätze sind online sofort belegt.";
                $messageType = 'success';
                $selectedDate = $rDate;
                $selectedMonth = substr($rDate, 0, 7);
            } catch (Exception $e) {
                $message = 'Fehler beim Eintragen: ' . $e->getMessage();
                $messageType = 'error';
            }
        }
    }

    // 4. 1-Klick Komplettsperre für einen Zeitslot (0 Gäste, status = 'blocked')
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'block_slot') {
        $rDate = trim($_POST['date'] ?? $selectedDate);
        $rTime = trim($_POST['time'] ?? '');

        if (empty($rDate) || empty($rTime)) {
            $message = 'Datum und Uhrzeit für die Sperre erforderlich.';
            $messageType = 'error';
        } else {
            try {
                $newId = 'DRAK-LOCK-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));
                $stmt = $pdo->prepare("
                    INSERT INTO reservations (id, name, phone, email, guests, date, time, vault, notes, status)
                    VALUES (:id, '🔒 Slot gesperrt (Wirt)', '', '', 0, :date, :time, 'Komplett', 'Slot-Sperre durch Wirt', 'blocked')
                ");
                $stmt->execute([
                    ':id'   => $newId,
                    ':date' => $rDate,
                    ':time' => $rTime,
                ]);
                $message = "Der Zeitslot um {$rTime} Uhr wurde für Online-Buchungen gesperrt (0 Gäste gebucht).";
                $messageType = 'success';
                $selectedDate = $rDate;
                $selectedMonth = substr($rDate, 0, 7);
            } catch (Exception $e) {
                $message = 'Fehler beim Sperren des Slots: ' . $e->getMessage();
                $messageType = 'error';
            }
        }
    }

    // 5. Buchung oder Sperre löschen (gibt die Plätze online sofort wieder frei)
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete_reservation') {
        $delId = trim($_POST['id'] ?? '');
        $rDate = trim($_POST['date'] ?? $selectedDate);

        if (!empty($delId)) {
            try {
                $stmt = $pdo->prepare("DELETE FROM reservations WHERE id = :id");
                $stmt->execute([':id' => $delId]);
                $message = "Die Buchung / Sperre wurde entfernt. Die Plätze stehen online sofort wieder zur Verfügung!";
                $messageType = 'success';
                $selectedDate = $rDate;
                $selectedMonth = substr($rDate, 0, 7);
            } catch (Exception $e) {
                $message = 'Fehler beim Löschen: ' . $e->getMessage();
                $messageType = 'error';
            }
        }
    }

    // Monats-Zusammenfassung für den Kalender (3-Farben-Ampel)
    $monthSummary = getMonthOccupancySummary($pdo, $selectedMonth, $OPENING_HOURS);

    // Daten für den gewählten Tag laden
    $occupancy = getOccupancyDetailsForDate($pdo, $selectedDate);
    $reservationsList = getReservationsListForDate($pdo, $selectedDate);
    $daySlots = getSlotsForDate($selectedDate, $OPENING_HOURS);

    // Buchungen nach Zeitslots gruppieren
    $reservationsBySlot = [];
    foreach ($reservationsList as $res) {
        $t = trim($res['time']);
        if (!isset($reservationsBySlot[$t])) {
            $reservationsBySlot[$t] = [];
        }
        $reservationsBySlot[$t][] = $res;
    }

    // Reale Gesamtstatistik des Tages berechnen (nur echte Gäste, keine gesperrten Slots)
    $totalGuestsDay = 0;
    $totalBookingsDay = 0;
    $totalLocksDay = 0;

    foreach ($reservationsList as $res) {
        if ($res['status'] === 'blocked' || str_starts_with($res['id'], 'DRAK-LOCK')) {
            $totalLocksDay++;
        } else {
            $totalGuestsDay += (int)$res['guests'];
            $totalBookingsDay++;
        }
    }
}

// Datum-Hilfswerte für Vor/Zurück Navigation
$prevDate = date('Y-m-d', strtotime($selectedDate . ' -1 day'));
$nextDate = date('Y-m-d', strtotime($selectedDate . ' +1 day'));
$todayDate = date('Y-m-d');
$tomorrowDate = date('Y-m-d', strtotime('+1 day'));
$dayAfterTomorrowDate = date('Y-m-d', strtotime('+2 days'));

// Monats-Navigation
$prevMonth = date('Y-m', strtotime($selectedMonth . '-01 -1 month'));
$nextMonth = date('Y-m', strtotime($selectedMonth . '-01 +1 month'));

$monthTimestamp = strtotime($selectedMonth . '-01');
$germanMonths = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
$monthNameDe = $germanMonths[(int)date('n', $monthTimestamp) - 1] . ' ' . date('Y', $monthTimestamp);

// Kalender-Aufbau für den Monat
$daysInMonth = (int)date('t', $monthTimestamp);
$firstDayWeekday = (int)date('N', $monthTimestamp); // 1 = Montag, ..., 7 = Sonntag

$dayOfWeekSelected = (int)date('w', strtotime($selectedDate));
$dayConfig = $OPENING_HOURS[$dayOfWeekSelected] ?? null;

// Deutsche Wochentagsnamen
$weekdaysDe = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
$dayNameDe = $weekdaysDe[$dayOfWeekSelected];
$formattedDateDe = date('d.m.Y', strtotime($selectedDate));
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Tischplan & Slot-Manager | Drachen Taverne Zittau</title>

    <!-- iPad & iOS Optimierungen (Apple Web App) -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Tischplan Drak">
    <meta name="format-detection" content="telephone=no">
    <link rel="apple-touch-icon" href="apple-touch-icon.png">
    <link rel="icon" type="image/png" href="favicon-32x32.png">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Faustina:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">

    <style>
        :root {
            --bg-dark: #0a0908;
            --card-bg: #161412;
            --card-border: rgba(212, 175, 55, 0.3);
            --gold-bright: #f59e0b;
            --gold-primary: #d4af37;
            --gold-dim: #78350f;
            --gold-subtle: rgba(212, 175, 55, 0.12);
            --text-cream: #f5f5f4;
            --text-muted: #a8a29e;
            --danger: #ef4444;
            --danger-bg: rgba(239, 68, 68, 0.18);
            --success: #10b981;
            --success-bg: rgba(16, 185, 129, 0.18);
            --warning: #eab308;
            --warning-bg: rgba(234, 179, 8, 0.18);
            --gray-subtle: #292524;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            background-color: var(--bg-dark);
            color: var(--text-cream);
            font-family: 'Faustina', Georgia, serif;
            min-height: 100vh;
            padding: env(safe-area-inset-top, 12px) env(safe-area-inset-right, 14px) env(safe-area-inset-bottom, 16px) env(safe-area-inset-left, 14px);
            font-size: 16px;
            line-height: 1.4;
        }

        .app-wrapper {
            max-width: 1100px;
            margin: 0 auto;
        }

        /* Top Bar */
        .top-nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: #12100e;
            border: 1px solid var(--card-border);
            border-radius: 6px;
            margin-bottom: 14px;
        }
        .brand {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .brand h1 {
            font-family: 'Cinzel', serif;
            font-size: 1.25rem;
            color: var(--gold-bright);
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .brand .badge {
            background: var(--gold-subtle);
            border: 1px solid var(--gold-primary);
            color: var(--gold-bright);
            font-size: 0.72rem;
            padding: 2px 8px;
            border-radius: 4px;
            font-family: 'Cinzel', serif;
            font-weight: 700;
        }
        .top-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* Buttons & Touch Targets */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            font-family: 'Cinzel', serif;
            font-weight: 700;
            font-size: 0.88rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 10px 16px;
            border-radius: 4px;
            border: 1px solid var(--card-border);
            background: #201c18;
            color: var(--text-cream);
            cursor: pointer;
            text-decoration: none;
            min-height: 44px;
            touch-action: manipulation;
            transition: background 0.15s, border-color 0.15s, transform 0.1s;
        }
        .btn:active {
            transform: scale(0.98);
        }
        .btn-gold {
            background: var(--gold-dim);
            border-color: var(--gold-bright);
            color: #fff;
        }
        .btn-gold:hover, .btn-gold:active {
            background: var(--gold-bright);
            color: #000;
        }
        .btn-success {
            background: #065f46;
            border-color: var(--success);
            color: #fff;
        }
        .btn-danger {
            background: rgba(239, 68, 68, 0.2);
            border-color: var(--danger);
            color: #fca5a5;
        }
        .btn-danger:active {
            background: var(--danger);
            color: #fff;
        }
        .btn-sm {
            padding: 6px 12px;
            font-size: 0.8rem;
            min-height: 38px;
        }

        /* Alerts */
        .alert {
            padding: 12px 16px;
            border-radius: 4px;
            margin-bottom: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.95rem;
        }
        .alert-success {
            background: var(--success-bg);
            border: 1px solid var(--success);
            color: #6ee7b7;
        }
        .alert-error {
            background: var(--danger-bg);
            border: 1px solid var(--danger);
            color: #fca5a5;
        }

        /* ================= MONATSKALENDER & 3-FARBEN-MODELL ================= */
        .calendar-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 6px;
            padding: 16px;
            margin-bottom: 16px;
        }
        .calendar-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 14px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }
        .calendar-title {
            font-family: 'Cinzel', serif;
            font-size: 1.2rem;
            color: var(--gold-bright);
            font-weight: 700;
        }
        .month-nav {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 6px;
        }
        .cal-col-header {
            text-align: center;
            font-family: 'Cinzel', serif;
            font-size: 0.78rem;
            font-weight: 700;
            color: var(--gold-primary);
            padding-bottom: 6px;
        }

        .cal-day-cell {
            background: #100e0c;
            border: 1px solid rgba(212, 175, 55, 0.15);
            border-radius: 5px;
            min-height: 64px;
            padding: 6px 4px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-decoration: none;
            color: var(--text-cream);
            position: relative;
            transition: transform 0.1s, border-color 0.15s;
        }
        .cal-day-cell:active {
            transform: scale(0.96);
        }
        .cal-day-cell.empty {
            background: transparent;
            border-color: transparent;
            pointer-events: none;
        }

        /* 3-Farben-Modell Klassen */
        .cal-day-cell.status-green {
            border-left: 4px solid var(--success);
            background: rgba(16, 185, 129, 0.06);
        }
        .cal-day-cell.status-yellow {
            border-left: 4px solid var(--warning);
            background: rgba(234, 179, 8, 0.08);
        }
        .cal-day-cell.status-red {
            border-left: 4px solid var(--danger);
            background: rgba(239, 68, 68, 0.1);
        }
        .cal-day-cell.status-gray {
            border-left: 4px solid #57534e;
            background: rgba(87, 83, 78, 0.08);
            opacity: 0.65;
        }

        /* Ausgewählter Tag im Kalender */
        .cal-day-cell.is-selected {
            border: 2px solid var(--gold-bright);
            box-shadow: 0 0 12px rgba(245, 158, 11, 0.35);
            background: rgba(212, 175, 55, 0.15);
        }

        .cal-day-num {
            font-family: 'Cinzel', serif;
            font-weight: 700;
            font-size: 0.95rem;
            line-height: 1;
        }
        .cal-day-badge {
            font-size: 0.72rem;
            padding: 1px 4px;
            border-radius: 3px;
            text-align: center;
            margin-top: 4px;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
        }
        .badge-green { background: var(--success-bg); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.4); }
        .badge-yellow { background: var(--warning-bg); color: #fde047; border: 1px solid rgba(234, 179, 8, 0.4); }
        .badge-red { background: var(--danger-bg); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.4); }
        .badge-gray { background: rgba(87, 83, 78, 0.2); color: #a8a29e; border: 1px solid rgba(87, 83, 78, 0.4); }

        /* Legende */
        .calendar-legend {
            display: flex;
            flex-wrap: wrap;
            gap: 14px;
            align-items: center;
            justify-content: center;
            margin-top: 12px;
            padding-top: 10px;
            border-top: 1px solid rgba(212, 175, 55, 0.15);
            font-size: 0.8rem;
            color: var(--text-muted);
        }
        .legend-item {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .legend-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }

        /* ================= TAGES-STEUERUNG ================= */
        .date-control-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 6px;
            padding: 14px 16px;
            margin-bottom: 16px;
        }
        .date-quick-nav {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(212, 175, 55, 0.15);
        }
        .quick-days {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .quick-days .btn {
            min-height: 42px;
            padding: 8px 14px;
        }
        .quick-days .btn.active {
            background: var(--gold-bright);
            color: #000;
            border-color: var(--gold-bright);
            box-shadow: 0 0 10px rgba(245, 158, 11, 0.3);
        }
        .date-picker-form {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .date-input {
            background: #0d0c0a;
            border: 1px solid var(--card-border);
            color: var(--text-cream);
            padding: 8px 12px;
            font-size: 1rem;
            border-radius: 4px;
            outline: none;
            min-height: 42px;
            font-family: inherit;
        }
        .date-input:focus {
            border-color: var(--gold-bright);
        }

        .day-header-info {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }
        .day-title-group h2 {
            font-family: 'Cinzel', serif;
            font-size: 1.4rem;
            color: var(--gold-bright);
        }
        .day-subtitle {
            color: var(--text-muted);
            font-size: 0.95rem;
            margin-top: 2px;
        }
        .day-stats-pill {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid var(--card-border);
            padding: 8px 14px;
            border-radius: 6px;
            display: flex;
            gap: 16px;
            font-family: 'Cinzel', serif;
            font-size: 0.88rem;
        }
        .day-stats-pill strong {
            color: var(--gold-bright);
        }

        /* ================= SLOTS GRID ================= */
        .slots-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 14px;
        }
        @media (min-width: 900px) {
            .slots-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        /* Slot Card */
        .slot-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 6px;
            padding: 14px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            position: relative;
        }
        .slot-card.status-full {
            border-color: rgba(239, 68, 68, 0.5);
            background: #191211;
        }
        .slot-card.status-blocked {
            border-color: rgba(239, 68, 68, 0.7);
            background: #201111;
        }
        .slot-card.status-partial {
            border-color: rgba(234, 179, 8, 0.5);
            background: #171511;
        }
        .slot-card.status-free {
            border-color: rgba(16, 185, 129, 0.35);
        }

        .slot-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .slot-time {
            font-family: 'Cinzel', serif;
            font-size: 1.35rem;
            font-weight: 900;
            color: var(--text-cream);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .slot-time .clock-icon {
            color: var(--gold-bright);
        }

        .slot-status-pill {
            font-family: 'Cinzel', serif;
            font-size: 0.78rem;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .pill-free {
            background: var(--success-bg);
            border: 1px solid var(--success);
            color: #6ee7b7;
        }
        .pill-partial {
            background: var(--warning-bg);
            border: 1px solid var(--warning);
            color: #fde047;
        }
        .pill-full {
            background: var(--danger-bg);
            border: 1px solid var(--danger);
            color: #fca5a5;
        }

        /* Capacity Progress Bar */
        .capacity-bar-wrap {
            width: 100%;
            height: 8px;
            background: #25221d;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
        }
        .capacity-bar-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.3s;
        }
        .fill-free { background: var(--success); }
        .fill-partial { background: var(--warning); }
        .fill-full { background: var(--danger); }

        /* Bookings List inside Slot */
        .slot-bookings-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            background: rgba(0, 0, 0, 0.35);
            border-radius: 4px;
            padding: 8px;
            min-height: 52px;
        }
        .no-bookings-txt {
            color: var(--text-muted);
            font-style: italic;
            font-size: 0.9rem;
            text-align: center;
            margin: auto 0;
            padding: 6px;
        }

        .booking-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            background: #1c1916;
            border: 1px solid rgba(212, 175, 55, 0.2);
            padding: 8px 10px;
            border-radius: 4px;
        }
        .booking-row.row-lock {
            border-color: rgba(239, 68, 68, 0.4);
            background: rgba(239, 68, 68, 0.1);
        }

        .booking-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
            flex: 1;
            min-width: 0;
        }
        .booking-main-line {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }
        .booking-guests-badge {
            background: var(--gold-dim);
            color: #fff;
            font-family: 'Cinzel', serif;
            font-weight: 700;
            font-size: 0.8rem;
            padding: 2px 7px;
            border-radius: 3px;
        }
        .badge-lock {
            background: var(--danger);
            color: #fff;
        }
        .booking-name {
            font-weight: 600;
            color: var(--text-cream);
            font-size: 0.95rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .booking-type-tag {
            font-size: 0.72rem;
            padding: 1px 6px;
            border-radius: 3px;
            font-family: 'Cinzel', serif;
        }
        .tag-phone { background: rgba(59, 130, 246, 0.2); border: 1px solid #3b82f6; color: #93c5fd; }
        .tag-online { background: rgba(16, 185, 129, 0.2); border: 1px solid var(--success); color: #6ee7b7; }
        .tag-lock { background: rgba(239, 68, 68, 0.25); border: 1px solid var(--danger); color: #fca5a5; font-weight: 700; }

        .booking-sub-line {
            display: flex;
            gap: 10px;
            font-size: 0.82rem;
            color: var(--text-muted);
            align-items: center;
        }
        .booking-sub-line a {
            color: var(--gold-bright);
            text-decoration: none;
        }

        /* Slot Action Buttons */
        .slot-actions {
            display: flex;
            gap: 8px;
            margin-top: auto;
        }
        .slot-actions .btn {
            flex: 1;
            min-height: 42px;
            font-size: 0.82rem;
        }

        /* Modal Popup (for new booking) */
        .modal-backdrop {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(4px);
            z-index: 999;
            align-items: center;
            justify-content: center;
            padding: 16px;
        }
        .modal-backdrop.active {
            display: flex;
        }
        .modal-card {
            background: #1a1714;
            border: 2px solid var(--gold-primary);
            border-radius: 6px;
            width: 100%;
            max-width: 520px;
            padding: 22px;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.9);
            position: relative;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            border-bottom: 1px solid var(--card-border);
            padding-bottom: 10px;
        }
        .modal-header h3 {
            font-family: 'Cinzel', serif;
            color: var(--gold-bright);
            font-size: 1.25rem;
        }
        .btn-close-modal {
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 1.6rem;
            cursor: pointer;
            padding: 4px 8px;
            line-height: 1;
        }

        .form-group {
            margin-bottom: 14px;
        }
        .form-group label {
            display: block;
            font-family: 'Cinzel', serif;
            font-size: 0.82rem;
            color: var(--gold-primary);
            margin-bottom: 6px;
            letter-spacing: 0.5px;
        }
        .form-control {
            width: 100%;
            background: #0d0c0a;
            border: 1px solid var(--card-border);
            color: var(--text-cream);
            padding: 10px 12px;
            font-size: 1rem;
            border-radius: 4px;
            font-family: inherit;
            outline: none;
        }
        .form-control:focus {
            border-color: var(--gold-bright);
        }

        /* Quick Guest Count Selector Buttons */
        .guest-presets {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 8px;
        }
        .guest-btn {
            background: #231f1a;
            border: 1px solid var(--card-border);
            color: var(--text-cream);
            font-family: 'Cinzel', serif;
            font-weight: 700;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 0.9rem;
            cursor: pointer;
            min-width: 42px;
            min-height: 42px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .guest-btn.active {
            background: var(--gold-bright);
            color: #000;
            border-color: var(--gold-bright);
        }

        /* Quick Name Presets */
        .name-presets {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 6px;
        }
        .name-preset-btn {
            background: rgba(212, 175, 55, 0.1);
            border: 1px solid rgba(212, 175, 55, 0.25);
            color: var(--gold-primary);
            font-size: 0.78rem;
            padding: 4px 8px;
            border-radius: 3px;
            cursor: pointer;
        }

        /* Login Screen */
        .login-screen {
            max-width: 380px;
            margin: 60px auto;
            background: var(--card-bg);
            border: 2px solid var(--gold-primary);
            padding: 28px;
            border-radius: 6px;
            text-align: center;
            box-shadow: 0 0 25px rgba(212, 175, 55, 0.15);
        }
        .login-screen h2 {
            font-family: 'Cinzel', serif;
            color: var(--gold-bright);
            font-size: 1.4rem;
            margin-bottom: 8px;
        }
        .login-screen p {
            color: var(--text-muted);
            margin-bottom: 20px;
            font-size: 0.95rem;
        }
    </style>
</head>
<body>

<div class="app-wrapper">

    <?php if (!$isLoggedIn): ?>
        <!-- LOGIN BILDSCHIRM FÜR WIRT -->
        <div class="login-screen">
            <h2>Drachen Taverne</h2>
            <p>Tischplan & Slot-Manager (Wirt-Zugang)</p>

            <?php if ($message): ?>
                <div class="alert alert-error"><?= htmlspecialchars($message) ?></div>
            <?php endif; ?>

            <form method="POST" action="tischplan.php">
                <input type="hidden" name="login_action" value="1">
                <div class="form-group" style="text-align: left;">
                    <label for="password">Wirt-Passwort</label>
                    <input type="password" id="password" name="password" required autofocus class="form-control" placeholder="Passwort eingeben..." style="min-height: 48px; font-size: 1.1rem;">
                </div>
                <button type="submit" class="btn btn-gold" style="width: 100%; min-height: 50px; font-size: 1rem; margin-top: 10px;">
                    Anmelden
                </button>
            </form>
        </div>
    <?php else: ?>

        <!-- TOP BAR -->
        <div class="top-nav">
            <div class="brand">
                <h1>Drachen Taverne</h1>
                <span class="badge">Tischplan</span>
            </div>
            <div class="top-actions">
                <button type="button" class="btn btn-sm" onclick="toggleCalendar()" id="toggleCalBtn">
                    📅 Kalender
                </button>
                <button type="button" class="btn btn-sm" onclick="window.location.reload();" title="Ansicht aktualisieren">
                    🔄
                </button>
                <a href="admin.php" class="btn btn-sm" title="Zur Speisekarten-Verwaltung">
                    🍲 Speisekarte
                </a>
                <a href="tischplan.php?action=logout" class="btn btn-danger btn-sm" title="Abmelden">
                    Abmelden
                </a>
            </div>
        </div>

        <?php if ($message): ?>
            <div class="alert alert-<?= htmlspecialchars($messageType) ?>">
                <span><?= htmlspecialchars($message) ?></span>
                <button type="button" onclick="this.parentElement.remove()" style="background:none; border:none; color:inherit; font-size:1.2rem; cursor:pointer;">✕</button>
            </div>
        <?php endif; ?>

        <!-- MONATSKALENDER (TAG/MONAT MIT 3-FARBEN-MODELL) -->
        <div class="calendar-card" id="calendarSection">
            <div class="calendar-header">
                <div class="calendar-title">
                    📅 <?= htmlspecialchars($monthNameDe) ?>
                </div>
                <div class="month-nav">
                    <a href="tischplan.php?month=<?= $prevMonth ?>&date=<?= $selectedDate ?>" class="btn btn-sm" title="Vorheriger Monat">◀</a>
                    <a href="tischplan.php?month=<?= substr($todayDate, 0, 7) ?>&date=<?= $todayDate ?>" class="btn btn-sm">Heute</a>
                    <a href="tischplan.php?month=<?= $nextMonth ?>&date=<?= $selectedDate ?>" class="btn btn-sm" title="Nächster Monat">▶</a>
                </div>
            </div>

            <!-- Kalender-Raster -->
            <div class="calendar-grid">
                <!-- Spaltenköpfe Mo-So -->
                <div class="cal-col-header">Mo</div>
                <div class="cal-col-header">Di</div>
                <div class="cal-col-header">Mi</div>
                <div class="cal-col-header">Do</div>
                <div class="cal-col-header">Fr</div>
                <div class="cal-col-header">Sa</div>
                <div class="cal-col-header">So</div>

                <!-- Leere Zellen vor dem 1. Tag des Monats -->
                <?php for ($i = 1; $i < $firstDayWeekday; $i++): ?>
                    <div class="cal-day-cell empty"></div>
                <?php endfor; ?>

                <!-- Tage des Monats -->
                <?php for ($day = 1; $day <= $daysInMonth; $day++): ?>
                    <?php
                    $curDateStr = $selectedMonth . '-' . sprintf('%02d', $day);
                    $dayData = $monthSummary[$curDateStr] ?? [
                        'total_guests' => 0,
                        'booking_count' => 0,
                        'blocked_count' => 0,
                        'status' => 'green'
                    ];

                    $statusColor = $dayData['status'];
                    $isSelected = ($curDateStr === $selectedDate);
                    $guestsCount = (int)$dayData['total_guests'];
                    $hasBlocks = $dayData['blocked_count'] > 0;

                    // Badge-Text je nach Status
                    if ($statusColor === 'gray') {
                        $badgeText = 'Ruhetag';
                        $badgeClass = 'badge-gray';
                    } elseif ($statusColor === 'red') {
                        $badgeText = $hasBlocks ? '🔒 Gesperrt' : "Voll ({$guestsCount}G)";
                        $badgeClass = 'badge-red';
                    } elseif ($statusColor === 'yellow') {
                        $badgeText = "Teil ({$guestsCount}G)";
                        $badgeClass = 'badge-yellow';
                    } else {
                        $badgeText = $guestsCount > 0 ? "{$guestsCount} Gäste" : 'Frei';
                        $badgeClass = 'badge-green';
                    }
                    ?>
                    <a href="tischplan.php?date=<?= $curDateStr ?>&month=<?= $selectedMonth ?>" 
                       class="cal-day-cell status-<?= $statusColor ?> <?= $isSelected ? 'is-selected' : '' ?>">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span class="cal-day-num"><?= $day ?></span>
                            <?php if ($curDateStr === $todayDate): ?>
                                <span style="font-size: 0.65rem; color: var(--gold-bright); font-family: 'Cinzel'; font-weight: 700;">HEUTE</span>
                            <?php endif; ?>
                        </div>
                        <div class="cal-day-badge <?= $badgeClass ?>">
                            <?= htmlspecialchars($badgeText) ?>
                        </div>
                    </a>
                <?php endfor; ?>
            </div>

            <!-- Legende für das 3-Farben-Modell -->
            <div class="calendar-legend">
                <div class="legend-item">
                    <span class="legend-dot" style="background: var(--success);"></span>
                    <span>🟢 Frei (Viel Platz)</span>
                </div>
                <div class="legend-item">
                    <span class="legend-dot" style="background: var(--warning);"></span>
                    <span>🟡 Teilbelegt</span>
                </div>
                <div class="legend-item">
                    <span class="legend-dot" style="background: var(--danger);"></span>
                    <span>🔴 Voll / Gesperrt</span>
                </div>
                <div class="legend-item">
                    <span class="legend-dot" style="background: #57534e;"></span>
                    <span>⚪ Ruhetag (Di)</span>
                </div>
            </div>
        </div>

        <!-- DATUMS-NAVIGATION FÜR TAGES-SLOTS -->
        <div class="date-control-card">
            <div class="date-quick-nav">
                <div class="quick-days">
                    <a href="tischplan.php?date=<?= $todayDate ?>&month=<?= substr($todayDate, 0, 7) ?>" class="btn <?= $selectedDate === $todayDate ? 'active' : '' ?>">
                        Heute
                    </a>
                    <a href="tischplan.php?date=<?= $tomorrowDate ?>&month=<?= substr($tomorrowDate, 0, 7) ?>" class="btn <?= $selectedDate === $tomorrowDate ? 'active' : '' ?>">
                        Morgen
                    </a>
                    <a href="tischplan.php?date=<?= $dayAfterTomorrowDate ?>&month=<?= substr($dayAfterTomorrowDate, 0, 7) ?>" class="btn <?= $selectedDate === $dayAfterTomorrowDate ? 'active' : '' ?>">
                        Übermorgen
                    </a>
                </div>

                <div class="date-picker-form">
                    <a href="tischplan.php?date=<?= $prevDate ?>&month=<?= substr($prevDate, 0, 7) ?>" class="btn btn-sm" title="Vorheriger Tag">◀</a>
                    <input type="date" class="date-input" value="<?= htmlspecialchars($selectedDate) ?>" onchange="window.location.href='tischplan.php?date=' + this.value + '&month=' + this.value.substring(0, 7)">
                    <a href="tischplan.php?date=<?= $nextDate ?>&month=<?= substr($nextDate, 0, 7) ?>" class="btn btn-sm" title="Nächster Tag">▶</a>
                </div>
            </div>

            <div class="day-header-info">
                <div class="day-title-group">
                    <h2><?= $dayNameDe ?>, <?= $formattedDateDe ?></h2>
                    <div class="day-subtitle">
                        <?php if ($dayConfig && $dayConfig['isOpen']): ?>
                            Öffnungszeiten: <strong><?= htmlspecialchars($dayConfig['label']) ?></strong>
                        <?php else: ?>
                            <span style="color: var(--danger); font-weight: 700;">⚠️ Ruhetag (Taverne regulär geschlossen)</span>
                        <?php endif; ?>
                    </div>
                </div>
                <div class="day-stats-pill">
                    <span>Gebuchte Gäste: <strong><?= $totalGuestsDay ?></strong></span>
                    <span>Reservierungen: <strong><?= $totalBookingsDay ?></strong></span>
                    <?php if ($totalLocksDay > 0): ?>
                        <span style="color: #fca5a5;">Gesperrte Slots: <strong><?= $totalLocksDay ?></strong></span>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- ZEITSLOT ÜBERSICHT -->
        <?php if (empty($daySlots)): ?>
            <div style="background: var(--card-bg); border: 1px solid var(--card-border); padding: 30px; text-align: center; border-radius: 6px;">
                <p style="font-size: 1.1rem; color: var(--gold-bright); margin-bottom: 12px;">
                    Für diesen Tag sind laut regulärem Öffnungsplan keine Standard-Zeitslots eingerichtet.
                </p>
                <p style="color: var(--text-muted); margin-bottom: 20px;">
                    Möchtest du trotzdem eine Sonderbuchung oder Sperre eintragen?
                </p>
                <button type="button" class="btn btn-gold" onclick="openBookingModal('<?= htmlspecialchars($selectedDate) ?>', '18:00')">
                    ➕ Sonderbuchung eintragen
                </button>
            </div>
        <?php else: ?>
            <div class="slots-grid">
                <?php foreach ($daySlots as $slotTime): ?>
                    <?php
                    $slotInfo = $occupancy[$slotTime] ?? [
                        'total_guests' => 0, 
                        'booking_count' => 0, 
                        'has_large_group' => false,
                        'is_blocked' => false
                    ];
                    $booked = (int)$slotInfo['total_guests'];
                    $count = (int)$slotInfo['booking_count'];
                    $hasLarge = (bool)$slotInfo['has_large_group'];
                    $isBlocked = !empty($slotInfo['is_blocked']);

                    // Slot ist voll/gesperrt, wenn durch Wirt gesperrt, Großgruppe oder 10 Gäste erreicht
                    $isFull = $isBlocked || $hasLarge || ($count > 0 && $booked >= STANDARD_SLOT_CAPACITY);
                    $remaining = $isFull ? 0 : max(0, STANDARD_SLOT_CAPACITY - $booked);

                    $bookings = $reservationsBySlot[$slotTime] ?? [];

                    // Status-Klasse bestimmen (3-Farben-Modell)
                    if ($isBlocked) {
                        $cardClass = 'status-blocked';
                        $pillClass = 'pill-full';
                        $pillText = '🔒 Gesperrt durch Wirt';
                        $fillClass = 'fill-full';
                        $fillPercent = 100;
                    } elseif ($isFull) {
                        $cardClass = 'status-full';
                        $pillClass = 'pill-full';
                        $pillText = $hasLarge ? 'Großgruppe (Voll)' : 'Ausgebucht (0 frei)';
                        $fillClass = 'fill-full';
                        $fillPercent = 100;
                    } elseif ($booked > 0) {
                        $cardClass = 'status-partial';
                        $pillClass = 'pill-partial';
                        $pillText = "{$booked}/10 belegt ({$remaining} frei)";
                        $fillClass = 'fill-partial';
                        $fillPercent = min(100, ($booked / STANDARD_SLOT_CAPACITY) * 100);
                    } else {
                        $cardClass = 'status-free';
                        $pillClass = 'pill-free';
                        $pillText = 'Frei (10 Plätze)';
                        $fillClass = 'fill-free';
                        $fillPercent = 0;
                    }
                    ?>
                    <div class="slot-card <?= $cardClass ?>">
                        <!-- Header -->
                        <div class="slot-header">
                            <div class="slot-time">
                                <span class="clock-icon">⏰</span>
                                <span><?= htmlspecialchars($slotTime) ?> Uhr</span>
                            </div>
                            <span class="slot-status-pill <?= $pillClass ?>">
                                <?= htmlspecialchars($pillText) ?>
                            </span>
                        </div>

                        <!-- Kapazitätsbalken -->
                        <div class="capacity-bar-wrap">
                            <div class="capacity-bar-fill <?= $fillClass ?>" style="width: <?= $fillPercent ?>%;"></div>
                        </div>

                        <!-- Buchungsliste in diesem Slot -->
                        <div class="slot-bookings-list">
                            <?php if (empty($bookings)): ?>
                                <div class="no-bookings-txt">Noch keine Buchungen in diesem Slot</div>
                            <?php else: ?>
                                <?php foreach ($bookings as $res): ?>
                                    <?php
                                    $isLock = ($res['status'] === 'blocked') || str_starts_with($res['id'], 'DRAK-LOCK');
                                    $isPhone = str_contains($res['notes'], 'Telefon') || str_starts_with($res['id'], 'DRAK-MAN');
                                    ?>
                                    <div class="booking-row <?= $isLock ? 'row-lock' : '' ?>">
                                        <div class="booking-info">
                                            <div class="booking-main-line">
                                                <?php if ($isLock): ?>
                                                    <span class="booking-guests-badge badge-lock">🔒 Sperre</span>
                                                    <span class="booking-name" style="color: #fca5a5;">Slot gesperrt durch Wirt</span>
                                                    <span class="booking-type-tag tag-lock">Keine Online-Buchung</span>
                                                <?php else: ?>
                                                    <span class="booking-guests-badge"><?= (int)$res['guests'] ?> Pers.</span>
                                                    <span class="booking-name" title="<?= htmlspecialchars($res['name']) ?>">
                                                        <?= htmlspecialchars($res['name']) ?>
                                                    </span>
                                                    <?php if ($isPhone): ?>
                                                        <span class="booking-type-tag tag-phone">📞 Manuell</span>
                                                    <?php else: ?>
                                                        <span class="booking-type-tag tag-online">🌐 Online</span>
                                                    <?php endif; ?>
                                                <?php endif; ?>
                                            </div>

                                            <div class="booking-sub-line">
                                                <?php if (!empty($res['phone'])): ?>
                                                    <span>📞 <a href="tel:<?= htmlspecialchars($res['phone']) ?>"><?= htmlspecialchars($res['phone']) ?></a></span>
                                                <?php endif; ?>
                                                <?php if (!empty($res['vault']) && $res['vault'] !== 'Gewölbe' && $res['vault'] !== 'Komplett'): ?>
                                                    <span>📍 <?= htmlspecialchars($res['vault']) ?></span>
                                                <?php endif; ?>
                                                <?php if (!empty($res['notes']) && $res['notes'] !== 'Keine Sonderwünsche' && !$isLock): ?>
                                                    <span>📝 <?= htmlspecialchars($res['notes']) ?></span>
                                                <?php endif; ?>
                                            </div>
                                        </div>

                                        <!-- Lösch-Button -->
                                        <form method="POST" action="tischplan.php" onsubmit="return confirm('<?= $isLock ? "Möchtest du diese Slot-Sperre aufheben? Der Slot wird online sofort wieder freigegeben." : "Möchtest du diese Buchung für " . htmlspecialchars($res['name']) . " wirklich löschen? Die Plätze werden online sofort wieder frei." ?>');">
                                            <input type="hidden" name="action" value="delete_reservation">
                                            <input type="hidden" name="id" value="<?= htmlspecialchars($res['id']) ?>">
                                            <input type="hidden" name="date" value="<?= htmlspecialchars($selectedDate) ?>">
                                            <button type="submit" class="btn btn-danger btn-sm" title="<?= $isLock ? 'Sperre aufheben' : 'Buchung löschen' ?>">
                                                🗑️
                                            </button>
                                        </form>
                                    </div>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>

                        <!-- Aktionen je Slot -->
                        <div class="slot-actions">
                            <button type="button" class="btn btn-gold" onclick="openBookingModal('<?= htmlspecialchars($selectedDate) ?>', '<?= htmlspecialchars($slotTime) ?>')">
                                ➕ Belegen
                            </button>

                            <?php if (!$isBlocked): ?>
                                <form method="POST" action="tischplan.php" style="flex: 1; display: flex;" onsubmit="return confirm('Möchtest du den Zeitslot um <?= htmlspecialchars($slotTime) ?> Uhr komplett sperren? (Es werden 0 Gäste eingetragen, der Slot wird online sofort geschlossen).');">
                                    <input type="hidden" name="action" value="block_slot">
                                    <input type="hidden" name="date" value="<?= htmlspecialchars($selectedDate) ?>">
                                    <input type="hidden" name="time" value="<?= htmlspecialchars($slotTime) ?>">
                                    <button type="submit" class="btn btn-danger" style="width: 100%;">
                                        🔒 Sperren
                                    </button>
                                </form>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

    <?php endif; ?>

</div>

<!-- BUCHUNGS-MODAL (FÜR TABLET TOUCH OPTIMIERT) -->
<div class="modal-backdrop" id="bookingModal">
    <div class="modal-card">
        <div class="modal-header">
            <h3>Tisch belegen / Reservieren</h3>
            <button type="button" class="btn-close-modal" onclick="closeBookingModal()">✕</button>
        </div>

        <form method="POST" action="tischplan.php" id="modalBookingForm">
            <input type="hidden" name="action" value="add_reservation">

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
                <div class="form-group" style="margin-bottom: 0;">
                    <label for="modalDate">Datum</label>
                    <input type="date" id="modalDate" name="date" required class="form-control">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label for="modalTime">Uhrzeit / Slot</label>
                    <input type="text" id="modalTime" name="time" required class="form-control" placeholder="z.B. 18:00">
                </div>
            </div>

            <!-- Personenanzahl mit Schnellauswahl-Buttons -->
            <div class="form-group">
                <label>Anzahl Personen (Gäste) *</label>
                <div class="guest-presets">
                    <?php foreach ([1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20] as $gCount): ?>
                        <button type="button" class="guest-btn" onclick="selectGuests(<?= $gCount ?>)">
                            <?= $gCount ?>
                        </button>
                    <?php endforeach; ?>
                </div>
                <input type="number" id="modalGuests" name="guests" min="1" max="50" value="2" required class="form-control" style="font-size: 1.1rem; font-weight: 700; color: var(--gold-bright);">
            </div>

            <!-- Name des Gastes -->
            <div class="form-group">
                <label for="modalName">Name / Zunft *</label>
                <input type="text" id="modalName" name="name" required class="form-control" placeholder="z.B. Müller (Telefon)">
                <div class="name-presets">
                    <button type="button" class="name-preset-btn" onclick="setNamePreset('Telefon-Buchung')">+ Telefon</button>
                    <button type="button" class="name-preset-btn" onclick="setNamePreset('Vor Ort / Spontan')">+ Vor Ort</button>
                    <button type="button" class="name-preset-btn" onclick="setNamePreset('Stammtisch')">+ Stammtisch</button>
                    <button type="button" class="name-preset-btn" onclick="setNamePreset('Tisch reserviert')">+ Reserviert</button>
                </div>
            </div>

            <!-- Telefonnummer (optional) -->
            <div class="form-group">
                <label for="modalPhone">Telefonnummer (optional)</label>
                <input type="tel" id="modalPhone" name="phone" class="form-control" placeholder="z.B. 0171 1234567">
            </div>

            <!-- Gewölbebereich -->
            <div class="form-group">
                <label for="modalVault">Bereich</label>
                <select id="modalVault" name="vault" class="form-control">
                    <option value="Gewölbe">Gewölbe (Standard)</option>
                    <option value="Hauptsaal">Hauptsaal (Große Kathedrale)</option>
                    <option value="Biergarten">Biergarten</option>
                    <option value="Nische / Ruhig">Ruhige Nische</option>
                </select>
            </div>

            <!-- Notizen -->
            <div class="form-group">
                <label for="modalNotes">Notizen / Wünsche</label>
                <input type="text" id="modalNotes" name="notes" class="form-control" placeholder="z.B. Kinderstuhl, Geburtstag, am Fenster">
            </div>

            <div style="margin-top: 18px;">
                <button type="submit" class="btn btn-gold" style="width: 100%; min-height: 52px; font-size: 1.05rem;">
                    ✅ Tisch eintragen & Plätze belegen
                </button>
                <p style="text-align: center; color: var(--text-muted); font-size: 0.8rem; margin-top: 8px;">
                    ℹ️ Es wird keine E-Mail versendet. Die Plätze sind online sofort abgezogen.
                </p>
            </div>
        </form>
    </div>
</div>

<script>
    // Kalender ein-/ausblenden (Zustand im localStorage merken)
    function toggleCalendar() {
        const cal = document.getElementById('calendarSection');
        const btn = document.getElementById('toggleCalBtn');
        if (cal.style.display === 'none') {
            cal.style.display = 'block';
            btn.classList.add('btn-gold');
            localStorage.setItem('drak_cal_visible', '1');
        } else {
            cal.style.display = 'none';
            btn.classList.remove('btn-gold');
            localStorage.setItem('drak_cal_visible', '0');
        }
    }

    // Gespeicherten Zustand beim Laden prüfen
    if (localStorage.getItem('drak_cal_visible') === '0') {
        const cal = document.getElementById('calendarSection');
        if (cal) cal.style.display = 'none';
    } else {
        const btn = document.getElementById('toggleCalBtn');
        if (btn) btn.classList.add('btn-gold');
    }

    // Modal Steuerung
    function openBookingModal(date, time) {
        document.getElementById('modalDate').value = date;
        document.getElementById('modalTime').value = time;
        document.getElementById('modalGuests').value = 2;
        document.getElementById('modalName').value = '';
        document.getElementById('modalPhone').value = '';
        document.getElementById('modalNotes').value = '';
        highlightGuestBtn(2);

        document.getElementById('bookingModal').classList.add('active');
        setTimeout(() => {
            document.getElementById('modalName').focus();
        }, 150);
    }

    function closeBookingModal() {
        document.getElementById('bookingModal').classList.remove('active');
    }

    // Gästebutton Schnellauswahl
    function selectGuests(count) {
        document.getElementById('modalGuests').value = count;
        highlightGuestBtn(count);
    }

    function highlightGuestBtn(count) {
        document.querySelectorAll('.guest-btn').forEach(btn => {
            if (parseInt(btn.textContent.trim(), 10) === count) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    document.getElementById('modalGuests').addEventListener('input', function() {
        highlightGuestBtn(parseInt(this.value, 10));
    });

    function setNamePreset(text) {
        const input = document.getElementById('modalName');
        if (input.value) {
            input.value = input.value + ' (' + text + ')';
        } else {
            input.value = text;
        }
        input.focus();
    }

    // Modal schließen mit Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeBookingModal();
        }
    });

    // Modal schließen bei Klick auf Hintergrund
    document.getElementById('bookingModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeBookingModal();
        }
    });

    // Automatischer dezenter Refresh alle 60 Sekunden (damit neue Online-Buchungen erscheinen)
    let idleTimer = setTimeout(() => {
        if (!document.getElementById('bookingModal').classList.contains('active')) {
            window.location.reload();
        }
    }, 60000);
</script>

</body>
</html>
