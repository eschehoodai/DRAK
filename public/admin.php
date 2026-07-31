<?php
/**
 * Drachen Schänke Zittau - Admin-Verwaltung für Speisekarte & Wochenangebote
 * Passwortgeschützte Verwaltungsoberfläche zum Bearbeiten von angebote.json und speisekarte.json
 */

session_start();

// Konfiguration
define('ADMIN_PASSWORD', 'Zittau2026!');
define('JSON_FILE_PATH', __DIR__ . '/angebote.json');
define('SPEISEKARTE_JSON_PATH', __DIR__ . '/speisekarte.json');
define('SPEISEKARTE_DEFAULT_JSON_PATH', __DIR__ . '/speisekarte.default.json');

$message = null;
$messageType = 'info'; // 'success' | 'error' | 'info'
$activeTab = $_GET['tab'] ?? $_POST['active_tab'] ?? 'wochenangebote';

// 1. Logout verarbeiten
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    $_SESSION['admin_logged_in'] = false;
    session_destroy();
    header('Location: admin.php');
    exit();
}

// 2. Login verarbeiten
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login_action'])) {
    $enteredPassword = $_POST['password'] ?? '';
    if (hash_equals(ADMIN_PASSWORD, $enteredPassword)) {
        $_SESSION['admin_logged_in'] = true;
        session_regenerate_id(true);
        header('Location: admin.php');
        exit();
    } else {
        $message = 'Falsches Passwort! Zugriff verweigert.';
        $messageType = 'error';
    }
}

// Prüfen ob eingeloggt
$isLoggedIn = !empty($_SESSION['admin_logged_in']);

// 3. Speichern der Wochenangebote verarbeiten
if ($isLoggedIn && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_offers'])) {
    $activeTab = 'wochenangebote';
    $rawItems = $_POST['items'] ?? [];
    $cleanItems = [];

    if (is_array($rawItems)) {
        foreach ($rawItems as $item) {
            $name = isset($item['name']) ? trim(strip_tags($item['name'])) : '';
            $preis = isset($item['preis']) ? trim(strip_tags($item['preis'])) : '';
            $beschreibung = isset($item['beschreibung']) ? trim(strip_tags($item['beschreibung'])) : '';

            if ($name !== '') {
                $cleanItems[] = [
                    'name' => $name,
                    'preis' => $preis,
                    'beschreibung' => $beschreibung
                ];
            }
        }
    }

    $jsonOutput = json_encode($cleanItems, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    if ($jsonOutput !== false && @file_put_contents(JSON_FILE_PATH, $jsonOutput) !== false) {
        $message = 'Die Wochenangebote wurden erfolgreich in angebote.json gespeichert!';
        $messageType = 'success';
    } else {
        $message = 'Fehler beim Schreiben der angebote.json! Bitte Schreibrechte auf dem Server prüfen.';
        $messageType = 'error';
    }
}

// 4. Speichern der gesamten Speisekarte verarbeiten
if ($isLoggedIn && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_speisekarte'])) {
    $activeTab = 'speisekarte';
    $rawCategoryData = $_POST['categories'] ?? [];
    $cleanSpeisekarte = [];

    if (is_array($rawCategoryData)) {
        foreach ($rawCategoryData as $catKey => $rawItems) {
            $cleanCategoryItems = [];
            if (is_array($rawItems)) {
                foreach ($rawItems as $item) {
                    $name = isset($item['name']) ? trim(strip_tags($item['name'])) : '';
                    if ($name === '') continue;

                    $id = isset($item['id']) && trim($item['id']) !== '' ? trim(strip_tags($item['id'])) : 'item_' . uniqid();
                    $price = isset($item['price']) ? trim(strip_tags($item['price'])) : '';
                    $description = isset($item['description']) ? trim(strip_tags($item['description'])) : '';
                    $type = isset($item['type']) ? trim(strip_tags($item['type'])) : '';
                    $isSpecial = !empty($item['isSpecial']);

                    $cleanItem = [
                        'id' => $id,
                        'name' => $name,
                    ];

                    if ($price !== '') {
                        $cleanItem['price'] = $price;
                    }
                    if ($description !== '') {
                        $cleanItem['description'] = $description;
                    }
                    if ($type !== '') {
                        $cleanItem['type'] = $type;
                    }
                    if ($isSpecial) {
                        $cleanItem['isSpecial'] = true;
                    }

                    // Varianten verarbeiten (z.B. Größen 0,2L / 0,4L oder Fleischsorten)
                    if (isset($item['variants']) && is_array($item['variants'])) {
                        $cleanVariants = [];
                        foreach ($item['variants'] as $v) {
                            $vLabel = isset($v['label']) ? trim(strip_tags($v['label'])) : '';
                            $vPrice = isset($v['price']) ? trim(strip_tags($v['price'])) : '';
                            if ($vLabel !== '' || $vPrice !== '') {
                                $cleanVariants[] = [
                                    'label' => $vLabel,
                                    'price' => $vPrice,
                                ];
                            }
                        }
                        if (!empty($cleanVariants)) {
                            $cleanItem['variants'] = $cleanVariants;
                        }
                    }

                    $cleanCategoryItems[] = $cleanItem;
                }
            }
            $cleanSpeisekarte[$catKey] = $cleanCategoryItems;
        }
    }

    $jsonOutput = json_encode($cleanSpeisekarte, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    if ($jsonOutput !== false && @file_put_contents(SPEISEKARTE_JSON_PATH, $jsonOutput) !== false) {
        $message = 'Die gesamte Speisekarte wurde erfolgreich in speisekarte.json gespeichert!';
        $messageType = 'success';
    } else {
        $message = 'Fehler beim Schreiben der speisekarte.json! Bitte Schreibrechte auf dem Server prüfen.';
        $messageType = 'error';
    }
}

// Aktuelle Angebote laden
$angebote = [];
if ($isLoggedIn && file_exists(JSON_FILE_PATH)) {
    $jsonContent = @file_get_contents(JSON_FILE_PATH);
    if ($jsonContent) {
        $decoded = json_decode($jsonContent, true);
        if (is_array($decoded)) {
            $angebote = $decoded;
        }
    }
}

// Aktuelle Speisekarte laden (falls speisekarte.json noch nicht existiert, verwende speisekarte.default.json als Vorbelegung)
$speisekarteData = [];
if ($isLoggedIn) {
    $targetPath = file_exists(SPEISEKARTE_JSON_PATH) ? SPEISEKARTE_JSON_PATH : SPEISEKARTE_DEFAULT_JSON_PATH;
    if (file_exists($targetPath)) {
        $jsonContent = @file_get_contents($targetPath);
        if ($jsonContent) {
            $decoded = json_decode($jsonContent, true);
            if (is_array($decoded)) {
                $speisekarteData = $decoded;
            }
        }
    }
}

// Rubriken-Definition für Speisekarte & Getränke
$categoriesDef = [
    'vorspeisenWarm' => ['title' => 'Vorspeisen (Warm)', 'defaultType' => 'vorspeise'],
    'vorspeisenKalt' => ['title' => 'Vorspeisen (Kalt)', 'defaultType' => 'vorspeise'],
    'hauptErwachsene' => ['title' => 'Hauptspeisen (Für Erwachsene)', 'defaultType' => 'hauptgang'],
    'hauptKinder' => ['title' => 'Hauptspeisen (Für Kinder)', 'defaultType' => 'hauptgang'],
    'nachspeisen' => ['title' => 'Nachspeisen', 'defaultType' => 'nachspeise'],
    'saefte' => ['title' => 'Agrest & Verjus (Fruchtsäfte)', 'defaultType' => 'getraenk'],
    'wasser' => ['title' => 'Wasser (Quellwasser)', 'defaultType' => 'getraenk'],
    'zuckerwasserFass' => ['title' => 'Ungebrautes (Zuckerwasser vom Fass)', 'defaultType' => 'getraenk'],
    'zuckerwasserFlasche' => ['title' => 'Ungebrautes (Zuckerwasser aus der Vlesche)', 'defaultType' => 'getraenk'],
    'bitterzuckerwasser' => ['title' => 'Ungebrautes (Bitterzuckerwasser)', 'defaultType' => 'getraenk'],
    'heissGetraenke' => ['title' => 'Absud & Kraut (Heiße Tränke)', 'defaultType' => 'getraenk'],
    'likoere' => ['title' => 'Geistiges (Liköre & Alchemistenküche)', 'defaultType' => 'getraenk'],
    'weine' => ['title' => 'Vinum (Weine)', 'defaultType' => 'getraenk'],
    'met' => ['title' => 'Trunk der Asen (Met)', 'defaultType' => 'getraenk'],
    'biere' => ['title' => 'Gebräu (Biere)', 'defaultType' => 'getraenk'],
    'spezialitaeten' => ['title' => 'Spezialitäten (Hochprozentiges)', 'defaultType' => 'getraenk'],
    'cocktails' => ['title' => 'Hexens Gebräu (Cocktails)', 'defaultType' => 'getraenk'],
];
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wirt-Verwaltung | Drachen Schänke Zittau</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Faustina:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-dark: #0c0a09;
            --card-bg: #1c1917;
            --gold-bright: #f59e0b;
            --gold-primary: #d4af37;
            --gold-dim: #92400e;
            --text-cream: #f5f5f4;
            --text-muted: #a8a29e;
            --border-gold: rgba(212, 175, 55, 0.4);
            --danger: #ef4444;
            --success: #10b981;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg-dark);
            color: var(--text-cream);
            font-family: 'Faustina', serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-top: 20px;
            margin-bottom: 24px;
        }

        .header h1 {
            font-family: 'Cinzel', serif;
            font-weight: 900;
            color: var(--gold-bright);
            text-transform: uppercase;
            letter-spacing: 2px;
            font-size: 1.8rem;
            margin-bottom: 8px;
        }

        .header p {
            color: var(--text-muted);
            font-size: 1rem;
            font-style: italic;
        }

        .container {
            width: 100%;
            max-width: 950px;
            background-color: var(--card-bg);
            border: 2px solid var(--border-gold);
            padding: 30px;
            border-radius: 4px;
            box-shadow: 0 0 25px rgba(212, 175, 55, 0.1);
            position: relative;
        }

        .alert {
            padding: 14px 18px;
            border-radius: 4px;
            margin-bottom: 24px;
            font-size: 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .alert-error {
            background-color: rgba(239, 68, 68, 0.15);
            border: 1px solid var(--danger);
            color: #fca5a5;
        }
        .alert-success {
            background-color: rgba(16, 185, 129, 0.15);
            border: 1px solid var(--success);
            color: #6ee7b7;
        }

        /* Login Form */
        .login-box {
            max-width: 400px;
            margin: 40px auto;
            text-align: center;
        }
        .form-group {
            margin-bottom: 16px;
            text-align: left;
        }
        label {
            display: block;
            font-family: 'Cinzel', serif;
            font-size: 0.85rem;
            color: var(--gold-primary);
            margin-bottom: 6px;
            letter-spacing: 1px;
        }
        input[type="text"],
        input[type="password"],
        select,
        textarea {
            width: 100%;
            background-color: #09090b;
            border: 1px solid var(--border-gold);
            color: var(--text-cream);
            padding: 10px 14px;
            font-family: inherit;
            font-size: 0.95rem;
            border-radius: 3px;
            outline: none;
            transition: border-color 0.2s;
        }
        input[type="text"]:focus,
        input[type="password"]:focus,
        select:focus,
        textarea:focus {
            border-color: var(--gold-bright);
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 8px;
        }
        .checkbox-group input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: var(--gold-bright);
            cursor: pointer;
        }
        .checkbox-group label {
            margin-bottom: 0;
            cursor: pointer;
        }

        .btn {
            display: inline-block;
            background-color: var(--gold-dim);
            color: #fff;
            border: 1px solid var(--gold-bright);
            font-family: 'Cinzel', serif;
            font-weight: 700;
            text-transform: uppercase;
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 3px;
            letter-spacing: 1px;
            transition: all 0.2s;
            text-decoration: none;
            font-size: 0.9rem;
        }
        .btn:hover {
            background-color: var(--gold-bright);
            color: #000;
            box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
        }
        .btn-success {
            background-color: #065f46;
            border-color: var(--success);
            font-size: 1.1rem;
            padding: 16px 32px;
            width: 100%;
            margin-top: 20px;
        }
        .btn-success:hover {
            background-color: var(--success);
            color: #000;
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
        }
        .btn-danger {
            background-color: rgba(239, 68, 68, 0.2);
            border-color: var(--danger);
            color: #fca5a5;
            padding: 6px 12px;
            font-size: 0.85rem;
        }
        .btn-danger:hover {
            background-color: var(--danger);
            color: #fff;
        }
        .btn-add {
            background-color: rgba(212, 175, 55, 0.15);
            border: 1px dashed var(--gold-primary);
            color: var(--gold-bright);
            width: 100%;
            margin-bottom: 16px;
            padding: 10px;
        }
        .btn-add:hover {
            background-color: rgba(212, 175, 55, 0.3);
            color: #fff;
        }
        .btn-small {
            padding: 4px 10px;
            font-size: 0.8rem;
        }

        /* Nav Tabs */
        .tabs {
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
            border-bottom: 2px solid var(--border-gold);
            padding-bottom: 12px;
        }
        .tab-btn {
            background-color: transparent;
            border: 1px solid var(--border-gold);
            color: var(--text-muted);
            font-family: 'Cinzel', serif;
            font-weight: 700;
            padding: 12px 20px;
            cursor: pointer;
            border-radius: 4px 4px 0 0;
            transition: all 0.2s;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .tab-btn.active, .tab-btn:hover {
            background-color: var(--gold-dim);
            color: #fff;
            border-color: var(--gold-bright);
            box-shadow: 0 0 10px rgba(245, 158, 11, 0.2);
        }

        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            border-bottom: 1px solid var(--border-gold);
            padding-bottom: 16px;
        }
        .offer-card {
            background-color: #12100e;
            border: 1px solid rgba(212, 175, 55, 0.25);
            padding: 18px;
            margin-bottom: 16px;
            border-radius: 4px;
            position: relative;
        }
        .offer-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        .offer-card-title {
            font-family: 'Cinzel', serif;
            font-size: 1rem;
            color: var(--gold-bright);
        }
        .grid-2 {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 16px;
            margin-bottom: 12px;
        }
        .grid-variants {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(212, 175, 55, 0.15);
            padding: 12px;
            border-radius: 4px;
            margin-top: 12px;
            margin-bottom: 12px;
        }
        .variant-row {
            display: flex;
            gap: 10px;
            margin-bottom: 8px;
            align-items: center;
        }
        .variant-row input {
            font-size: 0.85rem;
            padding: 6px 10px;
        }

        .rubrik-section {
            border: 1px solid var(--border-gold);
            background: rgba(20, 18, 16, 0.7);
            padding: 20px;
            margin-bottom: 28px;
            border-radius: 4px;
        }
        .rubrik-header {
            font-family: 'Cinzel', serif;
            font-size: 1.2rem;
            color: var(--gold-bright);
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(212, 175, 55, 0.3);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .quick-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 24px;
            background: rgba(0,0,0,0.4);
            padding: 12px;
            border-radius: 4px;
            border: 1px solid rgba(212, 175, 55, 0.2);
        }
        .quick-nav a {
            color: var(--gold-primary);
            text-decoration: none;
            font-size: 0.82rem;
            padding: 4px 8px;
            background: rgba(212, 175, 55, 0.1);
            border-radius: 3px;
            transition: all 0.2s;
        }
        .quick-nav a:hover {
            background: var(--gold-dim);
            color: #fff;
        }

        @media (max-width: 600px) {
            .grid-2 {
                grid-template-columns: 1fr;
            }
            .tabs {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>Drachen Schänke Zittau</h1>
        <p>Verwaltung der Wochenangebote & Speisekarte</p>
    </div>

    <div class="container">
        <?php if ($message): ?>
            <div class="alert alert-<?= htmlspecialchars($messageType) ?>">
                <span><?= htmlspecialchars($message) ?></span>
            </div>
        <?php endif; ?>

        <?php if (!$isLoggedIn): ?>
            <!-- Login Formular -->
            <div class="login-box">
                <form method="POST" action="admin.php">
                    <input type="hidden" name="login_action" value="1">
                    <div class="form-group">
                        <label for="password">Passwort eingeben</label>
                        <input type="password" id="password" name="password" required autofocus placeholder="Passwort...">
                    </div>
                    <button type="submit" class="btn" style="width: 100%;">Anmelden</button>
                </form>
            </div>
        <?php else: ?>
            <!-- Bearbeitungs-Oberfläche -->
            <div class="top-bar">
                <span style="color: var(--gold-primary); font-family: 'Cinzel', serif;">Eingeloggt als Wirt</span>
                <a href="admin.php?action=logout" class="btn btn-danger">Abmelden</a>
            </div>

            <!-- Tab Navigation -->
            <div class="tabs">
                <button type="button" class="tab-btn <?= $activeTab === 'wochenangebote' ? 'active' : '' ?>" onclick="switchTab('wochenangebote')">
                    📜 Wochenangebote
                </button>
                <button type="button" class="tab-btn <?= $activeTab === 'speisekarte' ? 'active' : '' ?>" onclick="switchTab('speisekarte')">
                    🍲 Gesamte Speisekarte & Tränke
                </button>
            </div>

            <!-- TAB 1: WOCHENANGEBOTE -->
            <div id="tab-wochenangebote" style="display: <?= $activeTab === 'wochenangebote' ? 'block' : 'none' ?>;">
                <form method="POST" action="admin.php" id="offers-form">
                    <input type="hidden" name="save_offers" value="1">
                    <input type="hidden" name="active_tab" value="wochenangebote">

                    <div id="offers-container">
                        <?php if (empty($angebote)): ?>
                            <p id="no-offers-msg" style="color: var(--text-muted); text-align: center; margin-bottom: 20px;">
                                Aktuell sind keine Wochenangebote eingetragen. Klicke auf "Neues Angebot hinzufügen".
                            </p>
                        <?php endif; ?>

                        <?php foreach ($angebote as $idx => $item): ?>
                            <div class="offer-card" data-idx="<?= $idx ?>">
                                <div class="offer-card-header">
                                    <span class="offer-card-title">Angebot #<span class="card-num"><?= $idx + 1 ?></span></span>
                                    <button type="button" class="btn btn-danger btn-remove" onclick="removeOffer(this)">Löschen</button>
                                </div>
                                <div class="grid-2">
                                    <div class="form-group">
                                        <label>Gericht / Name *</label>
                                        <input type="text" name="items[<?= $idx ?>][name]" value="<?= htmlspecialchars($item['name'] ?? '') ?>" required placeholder="z.B. Kassler Schnitzel">
                                    </div>
                                    <div class="form-group">
                                        <label>Preis</label>
                                        <input type="text" name="items[<?= $idx ?>][preis]" value="<?= htmlspecialchars($item['preis'] ?? '') ?>" placeholder="z.B. 17 Silber & 90 Kupfer">
                                    </div>
                                </div>
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label>Beschreibung</label>
                                    <textarea name="items[<?= $idx ?>][beschreibung]" rows="2" placeholder="z.B. Mit Grillgemüse und Kartoffelecken"><?= htmlspecialchars($item['beschreibung'] ?? '') ?></textarea>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>

                    <button type="button" class="btn btn-add" onclick="addOffer()">+ Neues Wochenangebot hinzufügen</button>

                    <button type="submit" class="btn btn-success">
                        Wochenangebote speichern (angebote.json überschreiben)
                    </button>
                </form>
            </div>

            <!-- TAB 2: SPEISEKARTE & GETRÄNKE -->
            <div id="tab-speisekarte" style="display: <?= $activeTab === 'speisekarte' ? 'block' : 'none' ?>;">
                <!-- Schnellnavigation -->
                <div class="quick-nav">
                    <span style="width:100%; color: var(--gold-bright); font-size:0.8rem; font-family:'Cinzel';">Direktsprung zu Rubrik:</span>
                    <?php foreach ($categoriesDef as $catKey => $catInfo): ?>
                        <a href="#rubrik-<?= $catKey ?>"><?= htmlspecialchars($catInfo['title']) ?></a>
                    <?php endforeach; ?>
                </div>

                <form method="POST" action="admin.php" id="speisekarte-form">
                    <input type="hidden" name="save_speisekarte" value="1">
                    <input type="hidden" name="active_tab" value="speisekarte">

                    <?php foreach ($categoriesDef as $catKey => $catInfo): ?>
                        <?php 
                        $itemsInCat = $speisekarteData[$catKey] ?? []; 
                        ?>
                        <div class="rubrik-section" id="rubrik-<?= $catKey ?>" data-cat="<?= $catKey ?>" data-defaulttype="<?= $catInfo['defaultType'] ?>">
                            <div class="rubrik-header">
                                <span><?= htmlspecialchars($catInfo['title']) ?></span>
                                <span style="font-size: 0.85rem; color: var(--text-muted);">(<span class="item-count"><?= count($itemsInCat) ?></span> Gerichte/Tränke)</span>
                            </div>

                            <div class="cat-items-container">
                                <?php foreach ($itemsInCat as $itemIdx => $item): ?>
                                    <div class="offer-card speise-item" data-idx="<?= $itemIdx ?>">
                                        <div class="offer-card-header">
                                            <span class="offer-card-title">Eintrag #<span class="item-num"><?= $itemIdx + 1 ?></span></span>
                                            <button type="button" class="btn btn-danger btn-remove" onclick="removeSpeiseItem(this)">Löschen</button>
                                        </div>

                                        <input type="hidden" name="categories[<?= $catKey ?>][<?= $itemIdx ?>][id]" value="<?= htmlspecialchars($item['id'] ?? '') ?>">
                                        <input type="hidden" name="categories[<?= $catKey ?>][<?= $itemIdx ?>][type]" value="<?= htmlspecialchars($item['type'] ?? $catInfo['defaultType']) ?>">

                                        <div class="grid-2">
                                            <div class="form-group">
                                                <label>Name des Gerichts / Tranks *</label>
                                                <input type="text" name="categories[<?= $catKey ?>][<?= $itemIdx ?>][name]" value="<?= htmlspecialchars($item['name'] ?? '') ?>" required placeholder="z.B. Knoblauchsuppe">
                                            </div>
                                            <div class="form-group">
                                                <label>Einzelpreis (Standard)</label>
                                                <input type="text" name="categories[<?= $catKey ?>][<?= $itemIdx ?>][price]" value="<?= htmlspecialchars($item['price'] ?? '') ?>" placeholder="z.B. 6 Silber & 90 Kupfer (Freilassen wenn Varianten)">
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label>Beschreibung / Zutaten</label>
                                            <textarea name="categories[<?= $catKey ?>][<?= $itemIdx ?>][description]" rows="2" placeholder="z.B. Kräftige Brühe nach Wikinger Art..."><?= htmlspecialchars($item['description'] ?? '') ?></textarea>
                                        </div>

                                        <div class="checkbox-group" style="margin-bottom: 12px;">
                                            <input type="checkbox" id="special_<?= $catKey ?>_<?= $itemIdx ?>" name="categories[<?= $catKey ?>][<?= $itemIdx ?>][isSpecial]" value="1" <?= !empty($item['isSpecial']) ? 'checked' : '' ?>>
                                            <label for="special_<?= $catKey ?>_<?= $itemIdx ?>">Als „HAUS-SPEZIALITÄT“ hervorheben</label>
                                        </div>

                                        <!-- Preis-Varianten (z.B. 0,2L / 0,4L oder Rind / Wildschwein) -->
                                        <div class="grid-variants">
                                            <label style="margin-bottom: 8px;">Preisvarianten / Größen (Optional, z.B. 0,2L / 0,4L oder Portionsgrößen):</label>
                                            <div class="variants-container">
                                                <?php 
                                                $variants = $item['variants'] ?? [];
                                                foreach ($variants as $vIdx => $v): 
                                                ?>
                                                    <div class="variant-row">
                                                        <input type="text" name="categories[<?= $catKey ?>][<?= $itemIdx ?>][variants][<?= $vIdx ?>][label]" value="<?= htmlspecialchars($v['label'] ?? '') ?>" placeholder="Bezeichnung (z.B. 0,2L)">
                                                        <input type="text" name="categories[<?= $catKey ?>][<?= $itemIdx ?>][variants][<?= $vIdx ?>][price]" value="<?= htmlspecialchars($v['price'] ?? '') ?>" placeholder="Preis (z.B. 3 Silber & 20 Kupfer)">
                                                        <button type="button" class="btn btn-danger btn-small" onclick="removeVariant(this)">✕</button>
                                                    </div>
                                                <?php endforeach; ?>
                                            </div>
                                            <button type="button" class="btn btn-add btn-small" style="margin-top: 6px; margin-bottom: 0;" onclick="addVariant(this, '<?= $catKey ?>')">+ Variante hinzufügen</button>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>

                            <button type="button" class="btn btn-add" onclick="addSpeiseItem('<?= $catKey ?>')">+ Neues Gericht/Trank in <?= htmlspecialchars($catInfo['title']) ?> hinzufügen</button>
                        </div>
                    <?php endforeach; ?>

                    <button type="submit" class="btn btn-success">
                        Gesamte Speisekarte speichern (speisekarte.json überschreiben)
                    </button>
                </form>
            </div>

            <script>
                function switchTab(tabName) {
                    document.getElementById('tab-wochenangebote').style.display = tabName === 'wochenangebote' ? 'block' : 'none';
                    document.getElementById('tab-speisekarte').style.display = tabName === 'speisekarte' ? 'block' : 'none';

                    const btns = document.querySelectorAll('.tab-btn');
                    btns[0].classList.toggle('active', tabName === 'wochenangebote');
                    btns[1].classList.toggle('active', tabName === 'speisekarte');
                }

                /* --- WOCHENANGEBOTE SCRIPT --- */
                function updateOfferNumbers() {
                    const cards = document.querySelectorAll('#offers-container .offer-card');
                    cards.forEach((card, index) => {
                        card.setAttribute('data-idx', index);
                        const numSpan = card.querySelector('.card-num');
                        if (numSpan) numSpan.textContent = index + 1;

                        const nameInput = card.querySelector('input[name*="[name]"]');
                        if (nameInput) nameInput.name = `items[${index}][name]`;

                        const preisInput = card.querySelector('input[name*="[preis]"]');
                        if (preisInput) preisInput.name = `items[${index}][preis]`;

                        const descTextarea = card.querySelector('textarea[name*="[beschreibung]"]');
                        if (descTextarea) descTextarea.name = `items[${index}][beschreibung]`;
                    });
                }

                function removeOffer(button) {
                    if (confirm('Möchtest du dieses Angebot wirklich entfernen?')) {
                        const card = button.closest('.offer-card');
                        card.remove();
                        updateOfferNumbers();
                    }
                }

                function addOffer() {
                    const container = document.getElementById('offers-container');
                    const noOffersMsg = document.getElementById('no-offers-msg');
                    if (noOffersMsg) noOffersMsg.style.display = 'none';

                    const newIndex = container.querySelectorAll('.offer-card').length;

                    const cardHtml = `
                        <div class="offer-card" data-idx="${newIndex}">
                            <div class="offer-card-header">
                                <span class="offer-card-title">Angebot #<span class="card-num">${newIndex + 1}</span></span>
                                <button type="button" class="btn btn-danger btn-remove" onclick="removeOffer(this)">Löschen</button>
                            </div>
                            <div class="grid-2">
                                <div class="form-group">
                                    <label>Gericht / Name *</label>
                                    <input type="text" name="items[${newIndex}][name]" required placeholder="z.B. Biergulasch">
                                </div>
                                <div class="form-group">
                                    <label>Preis</label>
                                    <input type="text" name="items[${newIndex}][preis]" placeholder="z.B. 16 Silber & 90 Kupfer">
                                </div>
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Beschreibung</label>
                                <textarea name="items[${newIndex}][beschreibung]" rows="2" placeholder="z.B. Mit Semmelknödel"></textarea>
                            </div>
                        </div>
                    `;

                    container.insertAdjacentHTML('beforeend', cardHtml);
                    updateOfferNumbers();
                }

                /* --- SPEISEKARTE SCRIPT --- */
                function reindexCategory(catKey) {
                    const section = document.getElementById(`rubrik-${catKey}`);
                    if (!section) return;

                    const cards = section.querySelectorAll('.speise-item');
                    const countSpan = section.querySelector('.item-count');
                    if (countSpan) countSpan.textContent = cards.length;

                    cards.forEach((card, itemIdx) => {
                        card.setAttribute('data-idx', itemIdx);
                        const numSpan = card.querySelector('.item-num');
                        if (numSpan) numSpan.textContent = itemIdx + 1;

                        const idInput = card.querySelector('input[name*="[id]"]');
                        if (idInput) idInput.name = `categories[${catKey}][${itemIdx}][id]`;

                        const typeInput = card.querySelector('input[name*="[type]"]');
                        if (typeInput) typeInput.name = `categories[${catKey}][${itemIdx}][type]`;

                        const nameInput = card.querySelector('input[name*="[name]"]');
                        if (nameInput) nameInput.name = `categories[${catKey}][${itemIdx}][name]`;

                        const priceInput = card.querySelector('input[name*="[price]"]');
                        if (priceInput) priceInput.name = `categories[${catKey}][${itemIdx}][price]`;

                        const descInput = card.querySelector('textarea[name*="[description]"]');
                        if (descInput) descInput.name = `categories[${catKey}][${itemIdx}][description]`;

                        const specialInput = card.querySelector('input[name*="[isSpecial]"]');
                        if (specialInput) {
                            specialInput.name = `categories[${catKey}][${itemIdx}][isSpecial]`;
                            specialInput.id = `special_${catKey}_${itemIdx}`;
                            const specialLabel = card.querySelector('label[for^="special_"]');
                            if (specialLabel) specialLabel.setAttribute('for', `special_${catKey}_${itemIdx}`);
                        }

                        const variantRows = card.querySelectorAll('.variant-row');
                        variantRows.forEach((vRow, vIdx) => {
                            const vLabel = vRow.querySelector('input[name*="[label]"]');
                            if (vLabel) vLabel.name = `categories[${catKey}][${itemIdx}][variants][${vIdx}][label]`;

                            const vPrice = vRow.querySelector('input[name*="[price]"]');
                            if (vPrice) vPrice.name = `categories[${catKey}][${itemIdx}][variants][${vIdx}][price]`;
                        });
                    });
                }

                function removeSpeiseItem(button) {
                    if (confirm('Möchtest du diesen Eintrag wirklich aus der Speisekarte entfernen?')) {
                        const card = button.closest('.speise-item');
                        const section = card.closest('.rubrik-section');
                        const catKey = section.getAttribute('data-cat');
                        card.remove();
                        reindexCategory(catKey);
                    }
                }

                function addSpeiseItem(catKey) {
                    const section = document.getElementById(`rubrik-${catKey}`);
                    const container = section.querySelector('.cat-items-container');
                    const defaultType = section.getAttribute('data-defaulttype') || 'hauptgang';
                    const newIndex = container.querySelectorAll('.speise-item').length;
                    const newId = catKey.substring(0, 3) + '_' + Date.now();

                    const cardHtml = `
                        <div class="offer-card speise-item" data-idx="${newIndex}">
                            <div class="offer-card-header">
                                <span class="offer-card-title">Eintrag #<span class="item-num">${newIndex + 1}</span></span>
                                <button type="button" class="btn btn-danger btn-remove" onclick="removeSpeiseItem(this)">Löschen</button>
                            </div>

                            <input type="hidden" name="categories[${catKey}][${newIndex}][id]" value="${newId}">
                            <input type="hidden" name="categories[${catKey}][${newIndex}][type]" value="${defaultType}">

                            <div class="grid-2">
                                <div class="form-group">
                                    <label>Name des Gerichts / Tranks *</label>
                                    <input type="text" name="categories[${catKey}][${newIndex}][name]" required placeholder="Neuer Eintrag Name...">
                                </div>
                                <div class="form-group">
                                    <label>Einzelpreis (Standard)</label>
                                    <input type="text" name="categories[${catKey}][${newIndex}][price]" placeholder="z.B. 12 Silber & 50 Kupfer">
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Beschreibung / Zutaten</label>
                                <textarea name="categories[${catKey}][${newIndex}][description]" rows="2" placeholder="Beschreibung..."></textarea>
                            </div>

                            <div class="checkbox-group" style="margin-bottom: 12px;">
                                <input type="checkbox" id="special_${catKey}_${newIndex}" name="categories[${catKey}][${newIndex}][isSpecial]" value="1">
                                <label for="special_${catKey}_${newIndex}">Als „HAUS-SPEZIALITÄT“ hervorheben</label>
                            </div>

                            <div class="grid-variants">
                                <label style="margin-bottom: 8px;">Preisvarianten / Größen (Optional):</label>
                                <div class="variants-container"></div>
                                <button type="button" class="btn btn-add btn-small" style="margin-top: 6px; margin-bottom: 0;" onclick="addVariant(this, '${catKey}')">+ Variante hinzufügen</button>
                            </div>
                        </div>
                    `;

                    container.insertAdjacentHTML('beforeend', cardHtml);
                    reindexCategory(catKey);
                }

                function addVariant(button, catKey) {
                    const card = button.closest('.speise-item');
                    const itemIdx = card.getAttribute('data-idx');
                    const vContainer = card.querySelector('.variants-container');
                    const vIndex = vContainer.querySelectorAll('.variant-row').length;

                    const vHtml = `
                        <div class="variant-row">
                            <input type="text" name="categories[${catKey}][${itemIdx}][variants][${vIndex}][label]" placeholder="Bezeichnung (z.B. 0,2L)">
                            <input type="text" name="categories[${catKey}][${itemIdx}][variants][${vIndex}][price]" placeholder="Preis (z.B. 3 Silber & 20 Kupfer)">
                            <button type="button" class="btn btn-danger btn-small" onclick="removeVariant(this)">✕</button>
                        </div>
                    `;
                    vContainer.insertAdjacentHTML('beforeend', vHtml);
                    reindexCategory(catKey);
                }

                function removeVariant(button) {
                    const vRow = button.closest('.variant-row');
                    const card = button.closest('.speise-item');
                    const section = card.closest('.rubrik-section');
                    const catKey = section.getAttribute('data-cat');
                    vRow.remove();
                    reindexCategory(catKey);
                }
            </script>
        <?php endif; ?>
    </div>

</body>
</html>
