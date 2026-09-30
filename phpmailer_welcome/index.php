<?php
// index.php
// หน้าแรกของโมดูล phpmailer_welcome — รวมทางเข้า + เช็คสถานะ SMTP
// เปิดผ่าน: http://localhost:8000/ (เมื่อรัน PHP ในโฟลเดอร์นี้)

require __DIR__ . '/config.php';

$smtpReady = SMTP_USERNAME !== '' && SMTP_PASSWORD !== '';
$maskUser = SMTP_USERNAME === ''
    ? '(ยังไม่ได้ตั้งค่า)'
    : (strlen(SMTP_USERNAME) > 3
        ? substr(SMTP_USERNAME, 0, 3) . str_repeat('*', max(0, strlen(SMTP_USERNAME) - 3))
        : '***');

$endpoints = [
    [
        'method' => 'GET',
        'file' => 'email_form.php',
        'title' => 'ฟอร์มส่ง Welcome Email',
        'desc' => 'หน้าฟอร์มกรอกอีเมลด้วยมือ → ส่งผ่าน send_welcome.php',
    ],
    [
        'method' => 'POST',
        'file' => 'send_welcome.php',
        'title' => 'Welcome Email API',
        'desc' => 'รับ JSON { email, name } — หน้า Register เรียกใช้ (fire-and-forget)',
    ],
    [
        'method' => 'POST',
        'file' => 'confirmbuy.php',
        'title' => 'Order Confirmation API',
        'desc' => 'รับ JSON ออเดอร์เต็มรูป { email, customerName, orderId, items, … } — CheckoutModal เรียกใช้',
    ],
    [
        'method' => 'POST',
        'file' => 'subscription.php',
        'title' => 'Subscription API',
        'desc' => 'รับ JSON { email } — ปุ่มกระดิ่ง SubscriptionModal เรียกใช้',
    ],
    [
        'method' => 'POST',
        'file' => 'api/subscribe.php',
        'title' => 'Subscribe API (alt)',
        'desc' => 'endpoint สำรองสำหรับสมัครรับข่าวสาร',
    ],
    [
        'method' => 'POST',
        'file' => 'subsend.php',
        'title' => 'Subscription Send',
        'desc' => 'ส่งอีเมลสมัครรับข่าวสาร (ฟอร์ม POST)',
    ],
];
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SHOES SHOP - Mailer Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&family=Sarabun:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100vh;
            padding: 32px 16px 48px;
            background: #eef6fc;
            font-family: "Sarabun", sans-serif;
            color: #12365c;
        }
        .wrap { width: min(96%, 760px); margin: 0 auto; }
        .hero {
            background: linear-gradient(135deg, #0b3d91, #063b70);
            color: #fff;
            border-radius: 22px;
            padding: 32px;
            box-shadow: 0 15px 45px rgba(11, 61, 145, .25);
            margin-bottom: 20px;
        }
        .hero h1 { margin: 0; font-family: "Kanit", sans-serif; font-size: 26px; }
        .hero p { margin: 8px 0 0; color: #cfe1f7; font-size: 14px; }
        .status {
            display: flex; align-items: center; gap: 10px;
            margin-top: 18px; padding: 12px 16px; border-radius: 12px;
            font-size: 14px; font-weight: 600;
        }
        .status.ok { background: rgba(46, 213, 115, .15); border: 1px solid rgba(46, 213, 115, .5); }
        .status.warn { background: rgba(255, 179, 0, .15); border: 1px solid rgba(255, 179, 0, .5); }
        .status .dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .status.ok .dot { background: #2ed573; }
        .status.warn .dot { background: #ffb300; }
        .status small { display: block; font-weight: 400; color: #cfe1f7; font-size: 12px; }
        .card {
            background: #fff; border-radius: 18px; padding: 20px 22px;
            margin-bottom: 12px; box-shadow: 0 8px 24px rgba(0, 50, 100, .08);
            display: flex; gap: 14px; align-items: flex-start;
        }
        .badge {
            flex-shrink: 0; font-size: 11px; font-weight: 700;
            padding: 4px 10px; border-radius: 20px; letter-spacing: 1px;
            background: #e8f4fd; color: #0b3d91; margin-top: 2px;
        }
        .card h2 { margin: 0 0 4px; font-family: "Kanit", sans-serif; font-size: 17px; }
        .card h2 a { color: #0b3d91; text-decoration: none; }
        .card h2 a:hover { text-decoration: underline; }
        .card p { margin: 0; color: #607990; font-size: 13.5px; line-height: 1.6; }
        .card code {
            font-size: 12px; background: #f2f7fc; padding: 2px 8px;
            border-radius: 6px; color: #0b3d91;
        }
        h3.section {
            font-family: "Kanit", sans-serif; color: #0b3d91;
            margin: 26px 4px 12px; font-size: 18px;
        }
        .hint {
            background: #fff8e6; border: 1px solid #ffe1a1; border-radius: 14px;
            padding: 14px 18px; font-size: 13.5px; color: #7a5c00; line-height: 1.7;
        }
        .hint code { background: #fff; padding: 1px 7px; border-radius: 6px; font-size: 12.5px; }
    </style>
</head>
<body>
<div class="wrap">

    <div class="hero">
        <h1>📧 SHOES SHOP — Mailer Dashboard</h1>
        <p>รวม endpoint อีเมลทั้งหมด (PHPMailer + SMTP) — ใช้คู่กับหน้าเว็บ React</p>
        <div class="status <?= $smtpReady ? 'ok' : 'warn' ?>">
            <span class="dot"></span>
            <div>
                <?php if ($smtpReady): ?>
                    SMTP พร้อมใช้งาน (<?= htmlspecialchars(SMTP_HOST, ENT_QUOTES, 'UTF-8') ?>:<?= (int) SMTP_PORT ?>)
                    <small>user: <?= htmlspecialchars($maskUser, ENT_QUOTES, 'UTF-8' ) ?> · ชื่อผู้ส่ง: <?= htmlspecialchars(SMTP_FROM_NAME, ENT_QUOTES, 'UTF-8') ?></small>
                <?php else: ?>
                    ยังไม่ได้ตั้งค่า SMTP — ก็อปปี้ <code>.env.example</code> เป็น <code>.env</code> แล้วใส่ค่าจริง
                    <small>ดูวิธีใน README.txt — ถ้าไม่ตั้ง อีเมลจะส่งไม่สำเร็จ (แต่เว็บยังสั่งซื้อได้ปกติ)</small>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <h3 class="section">📨 หน้าฟอร์ม (เปิดในเบราว์เซอร์ได้เลย)</h3>
    <div class="card">
        <span class="badge">GET</span>
        <div>
            <h2><a href="email_form.php">email_form.php</a></h2>
            <p>ฟอร์มกรอกอีเมลด้วยมือ → ส่ง Welcome Email ผ่าน <code>send_welcome.php</code></p>
        </div>
    </div>

    <h3 class="section">🔌 API endpoints (เรียกจากเว็บ React ผ่าน fetch)</h3>
    <?php foreach (array_slice($endpoints, 1) as $ep): ?>
    <div class="card">
        <span class="badge"><?= htmlspecialchars($ep['method'], ENT_QUOTES, 'UTF-8') ?></span>
        <div>
            <h2><code><?= htmlspecialchars($ep['file'], ENT_QUOTES, 'UTF-8') ?></code> — <?= htmlspecialchars($ep['title'], ENT_QUOTES, 'UTF-8') ?></h2>
            <p><?= htmlspecialchars($ep['desc'], ENT_QUOTES, 'UTF-8') ?></p>
        </div>
    </div>
    <?php endforeach; ?>

    <h3 class="section">💡 วิธีรันคู่กับเว็บ</h3>
    <div class="hint">
        1. รัน PHP ในโฟลเดอร์นี้: <code>php -S localhost:8000</code><br>
        2. รัน <code>npm run server</code> (API :4000) และ <code>npm run dev</code> (เว็บ :3000)<br>
        3. Vite proxy <code>/phpmailer_welcome → :8000</code> ให้อัตโนมัติ (ดู <code>vite.config.ts</code>)<br>
        4. กลับมาหน้านี้ (<code>http://localhost:8000/</code>) เพื่อเช็คว่า SMTP พร้อมก่อนทดสอบส่งเมลจริง
    </div>

</div>
</body>
</html>
