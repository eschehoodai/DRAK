<?php
/**
 * Drachen Taverne Zittau - SQLite Datenbank-Verbindung & Initialisierung
 * Automatische Tabellenerstellung und Verwaltung der Tischreservierungen.
 */

// Kapazitätsgrenzen:
// Standard-Limit für gemischte kleinere Gruppen (max. 10 Personen gesamt)
define('STANDARD_SLOT_CAPACITY', 10);
// Maximallimit für eine einzelne Großgruppe in einem noch leeren Slot (bis zu 20 Personen)
define('MAX_EXCLUSIVE_GROUP_CAPACITY', 20);

/**
 * Standard Öffnungszeiten der Drachen Taverne Zittau
 * 0 = Sonntag, 1 = Montag, ..., 6 = Samstag
 */
function getStandardOpeningHours(): array {
    return [
        0 => [
            'isOpen' => true,
            'shifts' => [
                ['open' => '11:00', 'close' => '14:00', 'lastSlot' => '13:30', 'name' => 'Mittag'],
                ['open' => '17:00', 'close' => '21:00', 'kitchenClose' => '20:00', 'lastSlot' => '20:00', 'name' => 'Abend'],
            ],
            'label'  => 'So: 11:00–14:00 & 17:00–21:00 Uhr'
        ],
        1 => [
            'isOpen' => true,
            'shifts' => [
                ['open' => '17:00', 'close' => '22:00', 'kitchenClose' => '21:00', 'lastSlot' => '21:00', 'name' => 'Abend'],
            ],
            'label'  => 'Mo: 17:00–22:00 Uhr'
        ],
        2 => [
            'isOpen' => false,
            'shifts' => [],
            'label'  => 'Di: Ruhetag (Geschlossen)'
        ],
        3 => [
            'isOpen' => true,
            'shifts' => [
                ['open' => '17:00', 'close' => '22:00', 'kitchenClose' => '21:00', 'lastSlot' => '21:00', 'name' => 'Abend'],
            ],
            'label'  => 'Mi: 17:00–22:00 Uhr'
        ],
        4 => [
            'isOpen' => true,
            'shifts' => [
                ['open' => '17:00', 'close' => '22:00', 'kitchenClose' => '21:00', 'lastSlot' => '21:00', 'name' => 'Abend'],
            ],
            'label'  => 'Do: 17:00–22:00 Uhr'
        ],
        5 => [
            'isOpen' => true,
            'shifts' => [
                ['open' => '17:00', 'close' => '22:00', 'kitchenClose' => '21:00', 'lastSlot' => '21:00', 'name' => 'Abend'],
            ],
            'label'  => 'Fr: 17:00–22:00 Uhr'
        ],
        6 => [
            'isOpen' => true,
            'shifts' => [
                ['open' => '11:00', 'close' => '14:00', 'lastSlot' => '13:30', 'name' => 'Mittag'],
                ['open' => '17:00', 'close' => '22:00', 'kitchenClose' => '21:00', 'lastSlot' => '21:00', 'name' => 'Abend'],
            ],
            'label'  => 'Sa: 11:00–14:00 & 17:00–22:00 Uhr'
        ],
    ];
}

/**
 * Gibt eine betriebsbereite PDO-Verbindung zur SQLite-Datenbank zurück.
 * Erstellt die Datei und Tabelle automatisch, falls noch nicht vorhanden.
 *
 * @return PDO
 */
function getDb(): PDO {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $dataDir = __DIR__ . '/data';
    if (!is_dir($dataDir)) {
        @mkdir($dataDir, 0755, true);
    }

    $dbFile = $dataDir . '/reservations.sqlite';
    $pdo = new PDO('sqlite:' . $dbFile, null, null, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT            => 5,
    ]);

    // WAL-Modus für optimale Performance bei gleichzeitigen Zugriffen
    $pdo->exec("PRAGMA journal_mode = WAL;");
    $pdo->exec("PRAGMA busy_timeout = 5000;");

    // Tabelle initialisieren, falls noch nicht vorhanden
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS reservations (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            guests INTEGER NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            vault TEXT,
            notes TEXT,
            status TEXT NOT NULL DEFAULT 'confirmed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_date_time_status ON reservations (date, time, status);
    ");

    return $pdo;
}

/**
 * Pfad zur Notfall-Fallback-Queue für den Fall kurzzeitiger DB-Sperren.
 */
function getFallbackQueueFile(): string {
    $dataDir = __DIR__ . '/data';
    if (!is_dir($dataDir)) {
        @mkdir($dataDir, 0755, true);
    }
    return $dataDir . '/fallback_queue.json';
}

/**
 * Speichert eine Reservierung sicher in der Notfall-Fallback-Datei mit Dateisperre.
 */
function saveFallbackReservation(array $res): bool {
    $file = getFallbackQueueFile();
    $fp = @fopen($file, 'c+');
    if (!$fp) {
        return false;
    }
    if (flock($fp, LOCK_EX)) {
        $size = filesize($file);
        $content = $size > 0 ? fread($fp, $size) : '';
        $queue = !empty($content) ? json_decode($content, true) : [];
        if (!is_array($queue)) {
            $queue = [];
        }
        $queue[] = $res;
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($queue, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        fflush($fp);
        flock($fp, LOCK_UN);
        fclose($fp);
        return true;
    }
    fclose($fp);
    return false;
}

/**
 * Holt alle Einträge aus der Notfall-Fallback-Queue.
 */
function getFallbackReservations(): array {
    $file = getFallbackQueueFile();
    if (!file_exists($file)) {
        return [];
    }
    $content = @file_get_contents($file);
    if (!$content) {
        return [];
    }
    $queue = json_decode($content, true);
    return is_array($queue) ? $queue : [];
}

/**
 * Entfernt eine Reservierung aus der Notfall-Fallback-Queue (z. B. bei Stornierung / Löschung).
 */
function removeFallbackReservation(string $id): void {
    $file = getFallbackQueueFile();
    if (!file_exists($file)) {
        return;
    }
    $fp = @fopen($file, 'c+');
    if (!$fp) {
        return;
    }
    if (flock($fp, LOCK_EX)) {
        $size = filesize($file);
        $content = $size > 0 ? fread($fp, $size) : '';
        $queue = !empty($content) ? json_decode($content, true) : [];
        if (!empty($queue) && is_array($queue)) {
            $filtered = array_values(array_filter($queue, function($item) use ($id) {
                return ($item['id'] ?? '') !== $id;
            }));
            ftruncate($fp, 0);
            rewind($fp);
            fwrite($fp, json_encode($filtered, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            fflush($fp);
        }
        flock($fp, LOCK_UN);
    }
    fclose($fp);
}

/**
 * Überträgt gespeicherte Notfall-Buchungen automatisch in die SQLite-Datenbank (Auto-Drain).
 */
function drainFallbackQueue(PDO $pdo): void {
    $file = getFallbackQueueFile();
    if (!file_exists($file)) {
        return;
    }
    $fp = @fopen($file, 'c+');
    if (!$fp) {
        return;
    }
    if (flock($fp, LOCK_EX)) {
        $size = filesize($file);
        $content = $size > 0 ? fread($fp, $size) : '';
        $queue = !empty($content) ? json_decode($content, true) : [];
        if (!empty($queue) && is_array($queue)) {
            $remaining = [];
            $insert = $pdo->prepare("
                INSERT OR IGNORE INTO reservations (id, name, phone, email, guests, date, time, vault, notes, status, created_at)
                VALUES (:id, :name, :phone, :email, :guests, :date, :time, :vault, :notes, :status, :created_at)
            ");
            foreach ($queue as $res) {
                try {
                    $insert->execute([
                        ':id'         => $res['id'],
                        ':name'       => $res['name'] ?? '',
                        ':phone'      => $res['phone'] ?? '',
                        ':email'      => $res['email'] ?? '',
                        ':guests'     => (int)($res['guests'] ?? 1),
                        ':date'       => $res['date'] ?? '',
                        ':time'       => $res['time'] ?? '',
                        ':vault'      => $res['vault'] ?? 'Die Grosse Kathedrale',
                        ':notes'      => $res['notes'] ?? '',
                        ':status'     => $res['status'] ?? 'confirmed',
                        ':created_at' => $res['created_at'] ?? date('Y-m-d H:i:s'),
                    ]);
                } catch (Exception $e) {
                    $remaining[] = $res;
                }
            }
            ftruncate($fp, 0);
            rewind($fp);
            if (!empty($remaining)) {
                fwrite($fp, json_encode($remaining, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            } else {
                fwrite($fp, json_encode([], JSON_PRETTY_PRINT));
            }
            fflush($fp);
        }
        flock($fp, LOCK_UN);
    }
    fclose($fp);
}

/**
 * Berechnet alle Zeitslots für eine gegebene Tageskonfiguration der Öffnungszeiten.
 *
 * @param array $config
 * @return array<string>
 */
function getSlotsForDayConfig(array $config): array {
    if (empty($config) || empty($config['isOpen'])) return [];
    $slots = [];
    if (!empty($config['shifts']) && is_array($config['shifts'])) {
        foreach ($config['shifts'] as $shift) {
            if (!empty($shift['open']) && !empty($shift['lastSlot'])) {
                list($openH, $openM) = explode(':', $shift['open']);
                list($lastH, $lastM) = explode(':', $shift['lastSlot']);
                $currentMin = (int)$openH * 60 + (int)$openM;
                $endMin = (int)$lastH * 60 + (int)$lastM;
                while ($currentMin <= $endMin) {
                    $h = floor($currentMin / 60);
                    $m = $currentMin % 60;
                    $slots[] = sprintf('%02d:%02d', $h, $m);
                    $currentMin += 30;
                }
            }
        }
    } elseif (!empty($config['open']) && !empty($config['lastSlot'])) {
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
    }
    return $slots;
}

/**
 * Prüft, ob ein Tag durch eine explizite Ganztagssperre (time = 'ALL' AND status = 'blocked') gesperrt ist.
 *
 * @param PDO $pdo
 * @param string $date
 * @return array|null Gibt Datensatz der Sperre zurück oder null.
 */
function isDayBlocked(PDO $pdo, string $date): ?array {
    drainFallbackQueue($pdo);
    $stmt = $pdo->prepare("
        SELECT id, name, notes, created_at
        FROM reservations
        WHERE date = :date AND time = 'ALL' AND status = 'blocked'
        LIMIT 1
    ");
    $stmt->execute([':date' => $date]);
    $row = $stmt->fetch();
    return $row ?: null;
}

/**
 * Gibt detaillierte Belegungsdaten je Zeitslot für ein bestimmtes Datum zurück.
 * Erfasst Gesamtzahl der realen Gäste, Buchungsanzahl, Großgruppen und Wirt-Sperren.
 * Berücksichtigt automatisch auch Ganztagssperren (time = 'ALL').
 *
 * @param PDO $pdo
 * @param string $date (Format: YYYY-MM-DD)
 * @return array<string, array{total_guests: int, booking_count: int, has_large_group: bool, is_blocked: bool}>
 */
function getOccupancyDetailsForDate(PDO $pdo, string $date): array {
    drainFallbackQueue($pdo);

    $dayLock = isDayBlocked($pdo, $date);

    $stmt = $pdo->prepare("
        SELECT time, guests, status
        FROM reservations
        WHERE date = :date AND status IN ('confirmed', 'inquiry', 'blocked')
    ");
    $stmt->execute([':date' => $date]);
    
    $occupancy = [];
    while ($row = $stmt->fetch()) {
        $timeSlot = trim($row['time']);
        if ($timeSlot === 'ALL') {
            continue; // Ganztagssperre wird separat über $dayLock verwaltet
        }
        $guests = (int)$row['guests'];
        $status = trim($row['status']);

        if (!isset($occupancy[$timeSlot])) {
            $occupancy[$timeSlot] = [
                'total_guests'    => 0,
                'booking_count'   => 0,
                'has_large_group' => false,
                'is_blocked'      => false,
            ];
        }

        if ($status === 'blocked') {
            $occupancy[$timeSlot]['is_blocked'] = true;
        } else {
            $occupancy[$timeSlot]['total_guests'] += $guests;
            $occupancy[$timeSlot]['booking_count']++;
            if ($guests > STANDARD_SLOT_CAPACITY) {
                $occupancy[$timeSlot]['has_large_group'] = true;
            }
        }
    }

    // Falls noch Elemente in fallback_queue für $date verbleiben:
    $fallbacks = getFallbackReservations();
    foreach ($fallbacks as $fb) {
        if (($fb['date'] ?? '') !== $date) continue;
        $t = trim($fb['time'] ?? '');
        if ($t === 'ALL') continue;
        $g = (int)($fb['guests'] ?? 1);
        $s = $fb['status'] ?? 'confirmed';
        if (!isset($occupancy[$t])) {
            $occupancy[$t] = ['total_guests' => 0, 'booking_count' => 0, 'has_large_group' => false, 'is_blocked' => false];
        }
        if ($s === 'blocked') {
            $occupancy[$t]['is_blocked'] = true;
        } else {
            $occupancy[$t]['total_guests'] += $g;
            $occupancy[$t]['booking_count']++;
            if ($g > STANDARD_SLOT_CAPACITY) {
                $occupancy[$t]['has_large_group'] = true;
            }
        }
    }

    // Wenn der gesamte Tag gesperrt ist, alle erfassten Slots als is_blocked markieren
    if ($dayLock) {
        foreach ($occupancy as $slotTime => &$info) {
            $info['is_blocked'] = true;
        }
        unset($info);
    }

    return $occupancy;
}

/**
 * Gibt alle aktiven Reservierungen und Sperren für ein bestimmtes Datum geordnet nach Uhrzeit zurück.
 *
 * @param PDO $pdo
 * @param string $date (Format: YYYY-MM-DD)
 * @return array<array{id: string, name: string, phone: string, email: string, guests: int, date: string, time: string, vault: string, notes: string, status: string, created_at: string}>
 */
function getReservationsListForDate(PDO $pdo, string $date): array {
    drainFallbackQueue($pdo);

    $stmt = $pdo->prepare("
        SELECT id, name, phone, email, guests, date, time, vault, notes, status, created_at
        FROM reservations
        WHERE date = :date AND status IN ('confirmed', 'inquiry', 'blocked')
        ORDER BY time ASC, created_at ASC
    ");
    $stmt->execute([':date' => $date]);
    $list = $stmt->fetchAll();

    // Eventuelle noch in der Notfall-Queue verbleibende Buchungen einmischen
    $existingIds = array_column($list, 'id');
    $fallbacks = getFallbackReservations();
    foreach ($fallbacks as $fb) {
        if (($fb['date'] ?? '') === $date && !in_array($fb['id'] ?? '', $existingIds)) {
            $list[] = [
                'id'         => $fb['id'],
                'name'       => $fb['name'] ?? '',
                'phone'      => $fb['phone'] ?? '',
                'email'      => $fb['email'] ?? '',
                'guests'     => (int)($fb['guests'] ?? 1),
                'date'       => $fb['date'] ?? $date,
                'time'       => $fb['time'] ?? '',
                'vault'      => $fb['vault'] ?? 'Die Grosse Kathedrale',
                'notes'      => $fb['notes'] ?? '',
                'status'     => $fb['status'] ?? 'confirmed',
                'created_at' => $fb['created_at'] ?? date('Y-m-d H:i:s')
            ];
        }
    }

    usort($list, function($a, $b) {
        $c = strcmp($a['time'], $b['time']);
        return $c !== 0 ? $c : strcmp($a['created_at'], $b['created_at']);
    });

    return $list;
}

/**
 * Gibt eine monatsweite Zusammenfassung der Belegung für das 3-Farben-Ampel-Modell zurück.
 * Ampelsystem:
 * - 'gray': Ruhetag (Dienstag)
 * - 'green': Frei / Viel Platz (< 30% Auslastung)
 * - 'yellow': Teilbelegt (30% - 75% Auslastung)
 * - 'red': Ausgebucht / Stark belegt (> 75% Auslastung oder mehrere Slots voll/gesperrt)
 *
 * @param PDO $pdo
 * @param string $yearMonth Format YYYY-MM (z. B. "2026-09")
 * @param array $openingHoursConfig
 * @return array<string, array{total_guests: int, booking_count: int, blocked_count: int, full_count: int, total_slots: int, status: string, is_day_blocked: bool}>
 */
function getMonthOccupancySummary(PDO $pdo, string $yearMonth, array $openingHoursConfig): array {
    $startDate = $yearMonth . '-01';
    $daysInMonth = (int)date('t', strtotime($startDate));
    $endDate = $yearMonth . '-' . sprintf('%02d', $daysInMonth);

    $stmt = $pdo->prepare("
        SELECT date, time, guests, status
        FROM reservations
        WHERE date >= :start AND date <= :end AND status IN ('confirmed', 'inquiry', 'blocked')
    ");
    $stmt->execute([':start' => $startDate, ':end' => $endDate]);
    $allRows = $stmt->fetchAll();

    // Nach Datum und Slot gruppieren
    $daySlotMap = [];
    $dayLocksMap = [];
    foreach ($allRows as $r) {
        $d = $r['date'];
        $t = trim($r['time']);
        if ($t === 'ALL' && $r['status'] === 'blocked') {
            $dayLocksMap[$d] = true;
            continue;
        }
        if (!isset($daySlotMap[$d])) $daySlotMap[$d] = [];
        if (!isset($daySlotMap[$d][$t])) {
            $daySlotMap[$d][$t] = ['guests' => 0, 'count' => 0, 'has_large' => false, 'is_blocked' => false];
        }
        if ($r['status'] === 'blocked') {
            $daySlotMap[$d][$t]['is_blocked'] = true;
        } else {
            $g = (int)$r['guests'];
            $daySlotMap[$d][$t]['guests'] += $g;
            $daySlotMap[$d][$t]['count']++;
            if ($g > STANDARD_SLOT_CAPACITY) {
                $daySlotMap[$d][$t]['has_large'] = true;
            }
        }
    }

    $summary = [];
    for ($day = 1; $day <= $daysInMonth; $day++) {
        $curDate = $yearMonth . '-' . sprintf('%02d', $day);
        $dayOfWeek = (int)date('w', strtotime($curDate));
        $config = $openingHoursConfig[$dayOfWeek] ?? null;

        // Ruhetag (z. B. Dienstag)
        if (!$config || !$config['isOpen']) {
            $summary[$curDate] = [
                'total_guests'   => 0,
                'booking_count'  => 0,
                'blocked_count'  => 0,
                'full_count'     => 0,
                'total_slots'    => 0,
                'status'         => 'gray',
                'is_day_blocked' => false
            ];
            continue;
        }

        // Maximale Slots des Tages ermitteln (unter Berücksichtigung von geteilten Schichten)
        $daySlots = getSlotsForDayConfig($config);
        $totalSlots = max(1, count($daySlots));
        $maxCapacity = $totalSlots * STANDARD_SLOT_CAPACITY; // Standard 10 pro Slot

        $daySlotsData = $daySlotMap[$curDate] ?? [];
        $totalGuests = 0;
        $bookingCount = 0;
        $blockedCount = 0;
        $fullCount = 0;

        foreach ($daySlotsData as $slotTime => $info) {
            $totalGuests += $info['guests'];
            $bookingCount += $info['count'];
            if ($info['is_blocked']) {
                $blockedCount++;
                $fullCount++;
            } elseif ($info['has_large'] || ($info['count'] > 0 && $info['guests'] >= STANDARD_SLOT_CAPACITY)) {
                $fullCount++;
            }
        }

        $isDayLockActive = !empty($dayLocksMap[$curDate]);

        // 3-Farben-Ampel bestimmen
        $occupancyRatio = $maxCapacity > 0 ? ($totalGuests / $maxCapacity) : 0;

        if ($isDayLockActive) {
            $color = 'red';
            $blockedCount = $totalSlots;
            $fullCount = $totalSlots;
        } elseif ($fullCount >= ($totalSlots * 0.7) || $occupancyRatio >= 0.75) {
            $color = 'red';
        } elseif ($occupancyRatio >= 0.3 || $fullCount >= 2 || $totalGuests >= 15) {
            $color = 'yellow';
        } else {
            $color = 'green';
        }

        $summary[$curDate] = [
            'total_guests'   => $totalGuests,
            'booking_count'  => $bookingCount,
            'blocked_count'  => $blockedCount,
            'full_count'     => $fullCount,
            'total_slots'    => $totalSlots,
            'status'         => $color,
            'is_day_blocked' => $isDayLockActive
        ];
    }

    return $summary;
}

/**
 * Ermittelt alle Tage eines Monats, die VOLLSTÄNDIG gesperrt sind.
 * Ein Tag gilt als vollständig gesperrt, wenn:
 * 1) time = 'ALL' AND status = 'blocked' vorliegt (Ganztagssperre durch Wirt)
 * 2) ODER alle regulären Zeitslots des Tages einzeln gesperrt sind.
 * Tage mit nur teilweiser Belegung oder einzelnen freien Slots werden NICHT zurückgegeben ("Aber wirklich nur dann").
 *
 * @param PDO $pdo
 * @param string $yearMonth Format YYYY-MM
 * @param array $openingHoursConfig
 * @return array<string> Liste von Datums-Strings (z. B. ['2026-11-14', '2026-11-20'])
 */
function getBlockedDaysForMonth(PDO $pdo, string $yearMonth, ?array $openingHoursConfig = null): array {
    if ($openingHoursConfig === null) {
        $openingHoursConfig = getStandardOpeningHours();
    }
    $startDate = $yearMonth . '-01';
    $daysInMonth = (int)date('t', strtotime($startDate));
    $endDate = $yearMonth . '-' . sprintf('%02d', $daysInMonth);

    $stmt = $pdo->prepare("
        SELECT date, time, status
        FROM reservations
        WHERE date >= :start AND date <= :end AND status = 'blocked'
    ");
    $stmt->execute([':start' => $startDate, ':end' => $endDate]);
    $blockedRows = $stmt->fetchAll();

    $dayBlocks = [];
    foreach ($blockedRows as $r) {
        $d = $r['date'];
        $t = trim($r['time']);
        if (!isset($dayBlocks[$d])) {
            $dayBlocks[$d] = ['has_day_lock' => false, 'slots' => []];
        }
        if ($t === 'ALL') {
            $dayBlocks[$d]['has_day_lock'] = true;
        } else {
            $dayBlocks[$d]['slots'][$t] = true;
        }
    }

    $completelyBlockedDates = [];

    for ($day = 1; $day <= $daysInMonth; $day++) {
        $curDate = $yearMonth . '-' . sprintf('%02d', $day);
        $dayOfWeek = (int)date('w', strtotime($curDate));
        $config = $openingHoursConfig[$dayOfWeek] ?? null;

        // Wenn regulär Ruhetag (z. B. Di), ist er ohnehin im Frontend als Ruhetag markiert
        if (!$config || !$config['isOpen']) {
            continue;
        }

        $info = $dayBlocks[$curDate] ?? null;
        if (!$info) {
            continue;
        }

        // 1. Explizite Ganztagssperre durch Wirt
        if (!empty($info['has_day_lock'])) {
            $completelyBlockedDates[] = $curDate;
            continue;
        }

        // 2. Prüfung, ob ALLE regulären Zeitslots des Tages gesperrt sind
        $daySlots = getSlotsForDayConfig($config);
        if (!empty($daySlots)) {
            $allSlotsBlocked = true;
            foreach ($daySlots as $slot) {
                if (empty($info['slots'][$slot])) {
                    $allSlotsBlocked = false;
                    break;
                }
            }
            if ($allSlotsBlocked) {
                $completelyBlockedDates[] = $curDate;
            }
        }
    }

    return $completelyBlockedDates;
}


