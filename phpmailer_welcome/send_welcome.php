<?php
// ==========================================================
// send_welcome.php
// Welcome Email ด้วย PHPMailer
// ปรับดีไซน์ให้เหมือนกับ subscription.php (โทนสี / โลโก้ / เลย์เอาต์)
// ==========================================================

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/config.php';

// ==========================================================
// CORS (สำหรับ React dev server ที่เรียกผ่าน fetch)
// ==========================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ==========================================================
// ตรวจสอบว่าเป็น AJAX / JSON request หรือฟอร์ม POST ธรรมดา
// (Register.tsx ยิงมาแบบ JSON, email_form.php ยิงมาแบบฟอร์ม)
// ==========================================================

$isAjax = (
    isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
    strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest'
) || (
    isset($_SERVER['CONTENT_TYPE']) &&
    strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false
) || (
    isset($_SERVER['HTTP_ACCEPT']) &&
    strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false
);

// ==========================================================
// SMTP CONFIG
// ==========================================================

$smtpHost     = SMTP_HOST;
$smtpUsername = SMTP_USERNAME;
$smtpPassword = SMTP_PASSWORD;
$smtpPort     = SMTP_PORT;

// ==========================================================
// รับข้อมูล — รองรับทั้ง JSON body (Register.tsx) และ form POST (email_form.php)
// ==========================================================

$rawBody = file_get_contents('php://input');
$data    = json_decode($rawBody, true);

if (!is_array($data)) {
    $data = $_POST;
}

$email    = trim($data['email'] ?? '');
$name     = trim($data['name'] ?? '');
$interest = trim($data['interest'] ?? 'วิ่งระยะไกล & มาราธอน');

// ==========================================================
// ตรวจสอบ Email
// ==========================================================

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

    if ($isAjax) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'กรุณากรอกอีเมลให้ถูกต้อง เช่น example@gmail.com']);
        exit;
    }

    header(
        'Location: email_form.php?message=' .
        urlencode('กรุณากรอกอีเมลให้ถูกต้อง เช่น example@gmail.com')
    );

    exit;
}

// ==========================================================
// Default Name
// ==========================================================

if ($name === '') {
    $name = 'สมาชิก SHOES SHOP';
}

// ==========================================================
// ป้องกัน HTML Injection
// ==========================================================

$safeName = htmlspecialchars(
    $name,
    ENT_QUOTES,
    'UTF-8'
);

$safeInterest = htmlspecialchars(
    $interest,
    ENT_QUOTES,
    'UTF-8'
);

$safeEmail = htmlspecialchars(
    $email,
    ENT_QUOTES,
    'UTF-8'
);

// ==========================================================
// PATH LOGO
// ใช้ลำดับการค้นหาแบบเดียวกับ subscription.php
// เพื่อให้โลโก้ขึ้นเหมือนกันทั้งสองอีเมล
// ==========================================================

$logoCandidates = [
    'C:\\shoesshopcopy\\public\\logo.svg',
    __DIR__ . '/public/logo.svg',
    __DIR__ . '/../public/logo.svg',
];

$logoPath   = '';
$logoExists = false;

foreach ($logoCandidates as $candidate) {
    if (file_exists($candidate)) {
        $logoPath   = $candidate;
        $logoExists = true;
        break;
    }
}

// ==========================================================
// PHPMailer
// ==========================================================

$mail = new PHPMailer(true);

try {

    // ======================================================
    // SMTP
    // ======================================================

    $mail->isSMTP();
    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUsername;
    $mail->Password   = $smtpPassword;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = $smtpPort;

    $mail->CharSet    = 'UTF-8';
    $mail->Encoding   = 'base64';
    $mail->SMTPDebug  = 0;

    // ======================================================
    // FROM
    // ======================================================

    $mail->setFrom(
        $smtpUsername,
        SMTP_FROM_NAME
    );

    // ======================================================
    // TO
    // ======================================================

    $mail->addAddress(
        $email,
        $name
    );

    // ======================================================
    // REPLY TO
    // ======================================================

    $mail->addReplyTo(
        $smtpUsername,
        SMTP_FROM_NAME
    );

    // ======================================================
    // EMBED LOGO
    // ======================================================

    if ($logoExists) {

        $mail->addEmbeddedImage(
            $logoPath,
            'shoes_logo',
            'logo.svg',
            PHPMailer::ENCODING_BASE64,
            'image/png'
        );
    }

    // ======================================================
    // SUBJECT
    // ======================================================

    $mail->isHTML(true);

    $mail->Subject =
        'ยินดีต้อนรับสู่ SHOES SHOP! รองเท้าคู่ที่ใช่รอคุณอยู่ พร้อมรับส่วนลด 10% 👟';

    // ======================================================
    // LOGO (HEADER) — เหมือนกับ subscription.php
    // ======================================================

    if ($logoExists) {

        $logoHTML = '
            <img
                src="cid:shoes_logo"
                alt="SHOES SHOP"
                width="300"
                style="
                    display:block;
                    width:300px;
                    max-width:100%;
                    height:auto;
                    border:0;
                "
            >
        ';

    } else {

        $logoHTML = '
            <div style="
                font-family:Arial,Tahoma,sans-serif;
                font-size:22px;
                line-height:28px;
                font-weight:800;
                color:#0b3d91;
                letter-spacing:1px;
            ">
                SHOES SHOP
            </div>
        ';
    }

    // ======================================================
    // EMAIL BODY — ดีไซน์เหมือน subscription.php
    // ======================================================

    $mail->Body = <<<HTML

<!DOCTYPE html>
<html lang="th">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Welcome to SHOES SHOP</title>
<!--[if mso]>
<style type="text/css">
table { border-collapse: collapse; }
</style>
<![endif]-->
<style>
:root { color-scheme: light; supported-color-schemes: light; }
</style>
</head>

<body bgcolor="#f1f6fa" style="
margin:0;
padding:0;
background:#f1f6fa;
font-family:Arial,'Tahoma',sans-serif;
color:#173b60;
">

<!-- PREHEADER -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    เราได้คัดเลือกรองเท้าที่เหมาะกับสไตล์ของคุณไว้เรียบร้อยแล้ว พร้อมรับส่วนลด 10%
</div>

<!-- =====================================================
     MAIN WRAPPER
====================================================== -->

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f1f6fa" style="background:#f1f6fa;">
<tr>
<td align="center" bgcolor="#f1f6fa" style="padding:20px 10px;">

<!-- =====================================================
     EMAIL CONTAINER
====================================================== -->

<table width="760" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="
max-width:760px;
width:100%;
background:#ffffff;
border-radius:18px;
overflow:hidden;
">

<!-- =====================================================
     HEADER
====================================================== -->

<tr>
<td bgcolor="#ffffff" style="
padding:22px 32px;
background:#ffffff;
border-bottom:1px solid #e5edf4;
">

<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>

<td align="left" valign="middle">
    $logoHTML
</td>

<td align="right" valign="middle" style="
font-size:12px;
letter-spacing:3px;
color:#173b60;
white-space:nowrap;
">
STEP INTO YOUR STYLE.
</td>

</tr>
</table>

</td>
</tr>

<!-- =====================================================
     HERO / WELCOME BANNER
====================================================== -->

<tr>
<td bgcolor="#0b3d91" style="background:#0b3d91;padding:50px 30px;text-align:center;">

<div style="font-size:15px;letter-spacing:6px;font-weight:bold;color:#9fc1ea;">
สมัครสมาชิกสำเร็จ
</div>

<div style="font-size:52px;line-height:1.15;font-weight:800;color:#ffffff;margin:14px 0 10px;letter-spacing:1px;">
🎉 WELCOME! 🎉
</div>

<div style="width:70px;height:4px;background:#ffffff;margin:0 auto 18px;border-radius:2px;"></div>

<div style="font-size:19px;font-weight:bold;color:#ffffff;">
ยินดีต้อนรับคุณ {$safeName} สู่ครอบครัว SHOES SHOP
</div>

<div style="font-size:14px;color:#cfe1f7;margin-top:8px;">
บัญชีของคุณพร้อมใช้งานแล้ว ขอบคุณที่ไว้วางใจเรา
</div>

</td>
</tr>

<!-- =====================================================
     PROMOTION BANNER
====================================================== -->

<tr>
<td bgcolor="#e8f5fd" style="background:#e8f5fd;padding:35px 30px;">

<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>

<!-- LEFT -->
<td width="48%" valign="middle" style="padding:10px 20px;">

<div style="
font-size:17px;
font-weight:bold;
color:#ffffff;
background:#0b3d91;
display:inline-block;
padding:8px 20px;
transform:skew(-8deg);
">
พิเศษสำหรับสมาชิกใหม่
</div>

<div style="font-size:28px;font-weight:bold;color:#0b3d91;margin-top:18px;">
รับส่วนลด
</div>

<div style="font-size:82px;line-height:0.9;font-weight:bold;color:#063b70;">
10%
</div>

<div style="font-size:17px;font-weight:bold;color:#173b60;margin-top:15px;">
เมื่อช้อปสินค้าครั้งแรก
</div>

<div style="margin-top:12px;font-size:15px;color:#173b60;">
ใช้โค้ด
<span style="
display:inline-block;
background:#0b3d91;
color:#ffffff;
padding:8px 16px;
border-radius:6px;
font-weight:bold;
font-size:17px;
">
WELCOME10
</span>
</div>

</td>

<!-- RIGHT -->
<td width="52%" align="center" valign="middle" style="padding:10px;">

<div style="font-size:90px;line-height:1;">
👟
</div>

<div style="font-size:25px;font-style:italic;font-weight:bold;color:#0b3d91;margin-top:8px;">
Better Shoes
</div>

<div style="font-size:25px;font-style:italic;font-weight:bold;color:#0b3d91;">
Bigger Dreams
</div>

</td>

</tr>
</table>

</td>
</tr>

<!-- =====================================================
     WELCOME MEMBER
====================================================== -->

<tr>
<td style="padding:28px 35px 20px;">

<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>

<td width="95" align="center" valign="top">
<div style="
width:75px;
height:75px;
border-radius:50%;
background:#dff2ff;
text-align:center;
line-height:75px;
font-size:38px;
">
🎁
</div>
</td>

<td valign="top" style="padding-left:15px;">

<div style="font-size:24px;font-weight:bold;color:#0b3d91;">
ของขวัญต้อนรับสมาชิกใหม่
</div>

<div style="font-size:16px;line-height:1.8;color:#294762;margin-top:5px;">
ขอบคุณที่สมัครสมาชิกกับ SHOES SHOP<br>
ตอนนี้คุณเป็นส่วนหนึ่งของครอบครัวเราแล้ว<br>
เพื่อเป็นการต้อนรับ เรามอบ
<strong style="color:#0b3d91;">ส่วนลด 10%</strong>
สำหรับการสั่งซื้อครั้งแรก<br>
เพียงใช้โค้ด
<strong style="color:#0b3d91;">WELCOME10</strong>
ที่หน้าชำระเงิน<br>
ความสนใจของคุณ: <strong style="color:#0b3d91;">{$safeInterest}</strong>
</div>

</td>

</tr>
</table>

</td>
</tr>

<!-- =====================================================
     SHOE CATEGORIES
====================================================== -->

<tr>
<td style="padding:10px 25px 20px;">

<table width="100%" cellspacing="8" border="0">
<tr>

<!-- RUNNING -->
<td width="25%" align="center" bgcolor="#eaf6ff" style="background:#eaf6ff;border-radius:12px;padding:18px 8px;">
<div style="font-size:42px;">👟</div>
<div style="font-size:15px;font-weight:bold;color:#173b60;margin-top:8px;">RUNNING</div>
<div style="font-size:12px;color:#0b3d91;margin-top:5px;">ดูสินค้า →</div>
</td>

<!-- LIFESTYLE -->
<td width="25%" align="center" bgcolor="#eaf6ff" style="background:#eaf6ff;border-radius:12px;padding:18px 8px;">
<div style="font-size:42px;">👞</div>
<div style="font-size:15px;font-weight:bold;color:#173b60;margin-top:8px;">LIFESTYLE</div>
<div style="font-size:12px;color:#0b3d91;margin-top:5px;">ดูสินค้า →</div>
</td>

<!-- TRAINING -->
<td width="25%" align="center" bgcolor="#eaf6ff" style="background:#eaf6ff;border-radius:12px;padding:18px 8px;">
<div style="font-size:42px;">👟</div>
<div style="font-size:15px;font-weight:bold;color:#173b60;margin-top:8px;">TRAINING</div>
<div style="font-size:12px;color:#0b3d91;margin-top:5px;">ดูสินค้า →</div>
</td>

<!-- OUTDOOR -->
<td width="25%" align="center" bgcolor="#eaf6ff" style="background:#eaf6ff;border-radius:12px;padding:18px 8px;">
<div style="font-size:42px;">🥾</div>
<div style="font-size:15px;font-weight:bold;color:#173b60;margin-top:8px;">OUTDOOR</div>
<div style="font-size:12px;color:#0b3d91;margin-top:5px;">ดูสินค้า →</div>
</td>

</tr>
</table>

</td>
</tr>

<!-- =====================================================
     COUPON BAR
====================================================== -->

<tr>
<td style="padding:0 25px 20px;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#dff2ff" style="background:#dff2ff;border-radius:15px;">
<tr>

<td bgcolor="#dff2ff" style="padding:18px 20px;">
<div style="font-size:16px;color:#173b60;line-height:1.6;">
🏷️ ใช้โค้ด
<strong style="font-size:21px;color:#0b3d91;">WELCOME10</strong>
&nbsp;ลดทันที
<strong style="font-size:21px;color:#0b3d91;">10%</strong>
<br>
สำหรับการสั่งซื้อครั้งแรกของคุณ
</div>
</td>

<td align="right" style="padding:15px 20px;">
<a href="https://wirakon113.github.io/shoesshop/" target="_blank" style="
display:inline-block;
background:#0b3d91;
color:#ffffff;
text-decoration:none;
font-size:18px; 
font-weight:bold;
padding:13px 25px;
border-radius:30px;
white-space:nowrap;
">
เริ่มช้อปเลย →
</a>
</td>

</tr>
</table>

</td>
</tr>

<!-- =====================================================
     MESSAGE
====================================================== -->

<tr>
<td align="center" style="padding:5px 30px 25px;">

<div style="font-size:23px;font-style:italic;font-weight:bold;color:#0b3d91;">
ยินดีต้อนรับเข้าสู่ครอบครัว SHOES SHOP
</div>

<div style="font-size:14px;color:#5a7a9a;margin-top:5px;">
เราดีใจที่ได้เป็นส่วนหนึ่งของทุกก้าวเดินของคุณ
</div>

</td>
</tr>

<!-- =====================================================
     FOOTER
====================================================== -->

<tr>
<td bgcolor="#063b70" style="background:#063b70;padding:22px 30px;">

<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>

<td valign="middle">

HTML;

    if ($logoExists) {

        $mail->Body .= '
<img
    src="cid:shoes_logo"
    alt="SHOES SHOP"
    width="180"
    style="
        display:block;
        width:180px;
        max-width:100%;
        height:auto;
        border:0;
    "
>
        ';

    } else {

        $mail->Body .= '
<div style="
    font-family:Arial,Tahoma,sans-serif;
    font-size:16px;
    font-weight:800;
    color:#ffffff;
    letter-spacing:1px;
">
    SHOES SHOP
</div>
        ';
    }

    $mail->Body .= <<<HTML

</td>

<td align="center" valign="middle" style="font-size:14px;color:#ffffff;line-height:2;">
● Facebook &nbsp;
● Instagram &nbsp;
● LINE &nbsp;
● YouTube
</td>

<td align="right" valign="middle" style="font-size:12px;letter-spacing:2px;color:#ffffff;white-space:nowrap;">
STEP INTO<br>
YOUR STYLE.
</td>

</tr>
</table>

<div style="
margin-top:15px;
padding-top:15px;
border-top:1px solid rgba(255,255,255,0.2);
font-size:11px;
text-align:center;
color:rgba(255,255,255,0.6);
">
© 2026 SHOES SHOP. สงวนลิขสิทธิ์ทุกประการ<br>
อีเมลฉบับนี้ส่งถึง {$safeEmail}
เนื่องจากคุณได้สมัครสมาชิกกับ SHOES SHOP
</div>

</td>
</tr>

</table>

<!-- END EMAIL -->

</td>
</tr>
</table>

</body>
</html>
HTML;

    // ======================================================
    // ALT BODY
    // ======================================================

    $mail->AltBody =
        "ยินดีต้อนรับสู่ SHOES SHOP!\n\n" .
        "สวัสดีคุณ {$name}\n\n" .
        "ขอบคุณที่สมัครสมาชิกกับ SHOES SHOP\n" .
        "ตอนนี้คุณเป็นส่วนหนึ่งของครอบครัวเราแล้ว\n\n" .
        "สิทธิพิเศษสำหรับสมาชิกใหม่\n" .
        "รับส่วนลด 10%\n" .
        "รหัสส่วนลด: WELCOME10\n\n" .
        "ความสนใจของคุณ: {$interest}\n\n" .
        "RUNNING\nLIFESTYLE\nTRAINING\nOUTDOOR\n\n" .
        "Step into Your Style\n\n" .
        "SHOES SHOP";

    // ======================================================
    // SEND
    // ======================================================

    $mail->send();

    if ($isAjax) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => true,
            'message' => 'ส่งอีเมลยินดีต้อนรับไปที่ ' . $email . ' เรียบร้อยแล้ว',
        ]);
        exit;
    }

    ?>

<!DOCTYPE html>
<html lang="th">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ส่งอีเมลสำเร็จ</title>

<style>

* { box-sizing:border-box; }

body {
    margin:0;
    min-height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    background:linear-gradient(135deg,#e8f4fd,#f5f9ff);
    font-family:Arial,"Tahoma",sans-serif;
}

.card {
    width:min(92%,480px);
    background:#ffffff;
    border-radius:24px;
    overflow:hidden;
    text-align:center;
    box-shadow:0 15px 45px rgba(11,61,145,0.15);
}

.header {
    background:#0b3d91;
    padding:20px;
}

.header img {
    width:200px;
    max-width:80%;
    height:auto;
}

.content { padding:40px 25px; }

.icon {
    width:85px;
    height:85px;
    margin:0 auto 20px;
    border-radius:50%;
    background:#e3f5e8;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:45px;
}

h1 {
    color:#0b3d91;
    font-size:26px;
    margin:0 0 12px;
}

p {
    color:#55718e;
    line-height:1.8;
}

.email {
    margin:20px 0;
    padding:15px;
    border-radius:12px;
    background:#f5f8fc;
    color:#0b3d91;
    font-weight:bold;
    word-break:break-all;
}

.btn {
    display:inline-block;
    margin-top:20px;
    padding:13px 32px;
    border-radius:30px;
    background:#0b3d91;
    color:#ffffff;
    text-decoration:none;
    font-weight:bold;
}

.footer {
    background:#063b70;
    color:rgba(255,255,255,0.7);
    padding:15px;
    font-size:11px;
}

</style>

</head>

<body>

<div class="card">

<div class="header">
<?php if ($logoExists) { ?>
<img src="../public/logo.svg" alt="SHOES SHOP">
<?php } else { ?>
<div style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:1px;">SHOES SHOP</div>
<?php } ?>
</div>

<div class="content">

    <div class="icon">✅</div>

    <h1>ส่งอีเมลสำเร็จ!</h1>

    <p>Welcome Email ถูกส่งไปยัง</p>

    <div class="email"><?= $safeEmail ?></div>

    <a href="email_form.php" class="btn">ส่งอีเมลอีกครั้ง</a>

</div>

<div class="footer">
© 2026 SHOES SHOP · Step into Your Style
</div>

</div>

</body>
</html>

<?php

} catch (Exception $e) {

    if ($isAjax) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'ส่งอีเมลไม่สำเร็จ: ' . $mail->ErrorInfo,
        ]);
        exit;
    }

?>

<!DOCTYPE html>
<html lang="th">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ส่งอีเมลไม่สำเร็จ</title>

<style>

body {
    margin:0;
    min-height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    background:#fff5f5;
    font-family:Arial,"Tahoma",sans-serif;
}

.card {
    width:min(92%,560px);
    background:#ffffff;
    padding:40px;
    border-radius:24px;
    text-align:center;
    box-shadow:0 15px 45px rgba(198,40,40,0.12);
}

.icon { font-size:60px;margin-bottom:15px; }

h1 { color:#c62828; }

p { color:#55718e;line-height:1.7; }

.error {
    margin-top:20px;
    padding:15px;
    background:#fff8f8;
    border:1px solid #ffcdd2;
    border-radius:12px;
    text-align:left;
    color:#c62828;
    font-family:monospace;
    font-size:13px;
    word-break:break-word;
}

.btn {
    display:inline-block;
    margin-top:20px;
    padding:13px 30px;
    border-radius:30px;
    background:#0b3d91;
    color:#ffffff;
    text-decoration:none;
    font-weight:bold;
}

</style>

</head>

<body>

<div class="card">

    <div class="icon">❌</div>

    <h1>ส่งอีเมลไม่สำเร็จ</h1>

    <p>ไม่สามารถส่ง Welcome Email ได้</p>

    <div class="error">
        <?= htmlspecialchars($mail->ErrorInfo, ENT_QUOTES, 'UTF-8') ?>
    </div>

    <a href="email_form.php" class="btn">กลับไปลองใหม่</a>

</div>

</body>
</html>

<?php

}

?>