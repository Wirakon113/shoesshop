<?php
// ==========================================================
// subscription.php
// สมัครรับข่าวสาร SHOES SHOP + ส่ง Subscription Email
// รองรับทั้ง form POST (redirect) และ AJAX (JSON)
// ==========================================================

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/config.php';

// ==========================================================
// CORS Headers (สำหรับ React dev server)
// ==========================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ==========================================================
// ตรวจสอบว่าเป็น AJAX request หรือไม่
// ==========================================================

$isAjax = (
    isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
    strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest'
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
// รับข้อมูลจากฟอร์ม
// ==========================================================

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody, true);
if (!is_array($data)) {
    $data = $_POST;
}

$email = trim($data['email'] ?? '');
$name  = trim($data['name'] ?? '');


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
        'Location: subscription.php?message=' .
        urlencode('กรุณากรอกอีเมลให้ถูกต้อง เช่น example@gmail.com')
    );

    exit;
}


// ==========================================================
// ถ้าไม่ได้กรอกชื่อ
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

$safeEmail = htmlspecialchars(
    $email,
    ENT_QUOTES,
    'UTF-8'
);


// ==========================================================
// ตรวจสอบ Logo
// ==========================================================

$logoPath = 'C:\\shoesshopcopy\\public\\logo.svg';


// ถ้าไม่พบ logo ให้ลองใช้ตำแหน่ง public ของโปรเจกต์
if (!file_exists($logoPath)) {

    $logoPath = __DIR__ . '/public/logo.svg';
}


if (!file_exists($logoPath)) {

    if ($isAjax) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'ไม่พบไฟล์ logo.svg']);
        exit;
    }

    die(
        'ไม่พบไฟล์ logo.svg กรุณาตรวจสอบ path:<br>' .
        htmlspecialchars($logoPath, ENT_QUOTES, 'UTF-8')
    );
}


// ==========================================================
// สร้าง PHPMailer
// ==========================================================

$mail = new PHPMailer(true);


try {

    // ======================================================
    // SMTP
    // ======================================================

    $mail->isSMTP();

    $mail->Host = $smtpHost;

    $mail->SMTPAuth = true;

    $mail->Username = $smtpUsername;

    $mail->Password = $smtpPassword;

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

    $mail->Port = $smtpPort;

    $mail->CharSet = 'UTF-8';

    // ปิด Debug
    $mail->SMTPDebug = 0;


    // ======================================================
    // ผู้ส่ง / ผู้รับ
    // ======================================================

    $mail->setFrom(
        $smtpUsername,
        SMTP_FROM_NAME
    );

    $mail->addAddress(
        $email,
        $name
    );


    // ======================================================
    // Reply-To
    // ======================================================

    $mail->addReplyTo(
        $smtpUsername,
        SMTP_FROM_NAME
    );


    // ======================================================
    // ฝัง Logo
    // ======================================================

    $mail->addEmbeddedImage(
        $logoPath,
        'shoes_logo',
        'logo.svg',
        PHPMailer::ENCODING_BASE64,
        'image/png'
    );


    // ======================================================
    // Subject
    // ======================================================

    $mail->isHTML(true);

    $mail->Subject =
        'ยินดีต้อนรับสมาชิก SHOES SHOP! รับส่วนลด 10% 🎁';


    // ======================================================
    // HTML EMAIL
    // ======================================================

    $mail->Body = <<<HTML
<!DOCTYPE html>

<html lang="th">

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>SHOES SHOP Subscription</title>

</head>


<body style="
margin:0;
padding:0;
background:#f1f6fa;
font-family:Arial,'Tahoma',sans-serif;
color:#173b60;
">


<!-- =====================================================
     MAIN WRAPPER
====================================================== -->

<table
width="100%"
cellpadding="0"
cellspacing="0"
border="0"
style="background:#f1f6fa;"
>

<tr>

<td
align="center"
style="padding:20px 10px;"
>


<!-- =====================================================
     EMAIL CONTAINER
====================================================== -->

<table
width="760"
cellpadding="0"
cellspacing="0"
border="0"
style="
max-width:760px;
width:100%;
background:#ffffff;
border-radius:18px;
overflow:hidden;
"
>


<!-- =====================================================
     HEADER
====================================================== -->

<tr>

<td
style="
padding:22px 32px;
background:#ffffff;
border-bottom:1px solid #e5edf4;
"
>

<table
width="100%"
cellpadding="0"
cellspacing="0"
border="0"
>

<tr>

<td
align="left"
valign="middle"
>

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

</td>


<td
align="right"
valign="middle"
style="
font-size:12px;
letter-spacing:3px;
color:#173b60;
white-space:nowrap;
"
>

STEP INTO YOUR STYLE.

</td>

</tr>

</table>

</td>

</tr>


<!-- =====================================================
     PROMOTION BANNER
====================================================== -->

<tr>

<td
style="
background:#e8f5fd;
padding:35px 30px;
"
>

<table
width="100%"
cellpadding="0"
cellspacing="0"
border="0"
>

<tr>


<!-- LEFT -->
<td
width="48%"
valign="middle"
style="padding:10px 20px;"
>

<div
style="
font-size:17px;
font-weight:bold;
color:#ffffff;
background:#0b3d91;
display:inline-block;
padding:8px 20px;
transform:skew(-8deg);
"
>

พิเศษสำหรับสมาชิกใหม่

</div>


<div
style="
font-size:28px;
font-weight:bold;
color:#0b3d91;
margin-top:18px;
"
>

รับส่วนลด

</div>


<div
style="
font-size:82px;
line-height:0.9;
font-weight:bold;
color:#063b70;
"
>

10%

</div>


<div
style="
font-size:17px;
font-weight:bold;
color:#173b60;
margin-top:15px;
"
>

เมื่อช้อปสินค้าครั้งแรก

</div>


<div
style="
margin-top:12px;
font-size:15px;
color:#173b60;
"
>

ใช้โค้ด

<span
style="
display:inline-block;
background:#0b3d91;
color:#ffffff;
padding:8px 16px;
border-radius:6px;
font-weight:bold;
font-size:17px;
"
>

WELCOME10

</span>

</div>

</td>


<!-- RIGHT -->
<td
width="52%"
align="center"
valign="middle"
style="padding:10px;"
>

<div
style="
font-size:90px;
line-height:1;
"
>

👟
</div>

<div
style="
font-size:25px;
font-style:italic;
font-weight:bold;
color:#0b3d91;
margin-top:8px;
"
>

Better Shoes

</div>

<div
style="
font-size:25px;
font-style:italic;
font-weight:bold;
color:#0b3d91;
"
>

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

<td
style="
padding:28px 35px 20px;
"
>

<table
width="100%"
cellpadding="0"
cellspacing="0"
border="0"
>

<tr>

<td
width="95"
align="center"
valign="top"
>

<div
style="
width:75px;
height:75px;
border-radius:50%;
background:#dff2ff;
text-align:center;
line-height:75px;
font-size:38px;
"
>

🎁

</div>

</td>


<td
valign="top"
style="padding-left:15px;"
>

<div
style="
font-size:24px;
font-weight:bold;
color:#0b3d91;
"
>

สวัสดีสมาชิกคนพิเศษ

</div>


<div
style="
font-size:16px;
line-height:1.8;
color:#294762;
margin-top:5px;
"
>

คุณ{$safeName}<br>

ขอบคุณที่สมัครรับข่าวสารจาก SHOES SHOP<br>

เพื่อเป็นการต้อนรับ เรามอบ
<strong style="color:#0b3d91;">
ส่วนลด 10%
</strong>

สำหรับการสั่งซื้อครั้งแรก<br>

เพียงใช้โค้ด

<strong style="color:#0b3d91;">
WELCOME10
</strong>

ที่หน้าชำระเงิน

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

<td
style="
padding:10px 25px 20px;
"
>

<table
width="100%"
cellspacing="8"
border="0"
>

<tr>


<!-- RUNNING -->

<td
width="25%"
align="center"
style="
background:#eaf6ff;
border-radius:12px;
padding:18px 8px;
"
>

<div style="font-size:42px;">
👟
</div>

<div
style="
font-size:15px;
font-weight:bold;
color:#173b60;
margin-top:8px;
"
>

RUNNING

</div>

<div
style="
font-size:12px;
color:#0b3d91;
margin-top:5px;
"
>

ดูสินค้า →

</div>

</td>


<!-- LIFESTYLE -->

<td
width="25%"
align="center"
style="
background:#eaf6ff;
border-radius:12px;
padding:18px 8px;
"
>

<div style="font-size:42px;">
👞
</div>

<div
style="
font-size:15px;
font-weight:bold;
color:#173b60;
margin-top:8px;
"
>

LIFESTYLE

</div>

<div
style="
font-size:12px;
color:#0b3d91;
margin-top:5px;
"
>

ดูสินค้า →

</div>

</td>


<!-- TRAINING -->

<td
width="25%"
align="center"
style="
background:#eaf6ff;
border-radius:12px;
padding:18px 8px;
"
>

<div style="font-size:42px;">
👟
</div>

<div
style="
font-size:15px;
font-weight:bold;
color:#173b60;
margin-top:8px;
"
>

TRAINING

</div>

<div
style="
font-size:12px;
color:#0b3d91;
margin-top:5px;
"
>

ดูสินค้า →

</div>

</td>


<!-- OUTDOOR -->

<td
width="25%"
align="center"
style="
background:#eaf6ff;
border-radius:12px;
padding:18px 8px;
"
>

<div style="font-size:42px;">
🥾
</div>

<div
style="
font-size:15px;
font-weight:bold;
color:#173b60;
margin-top:8px;
"
>

OUTDOOR

</div>

<div
style="
font-size:12px;
color:#0b3d91;
margin-top:5px;
"
>

ดูสินค้า →

</div>

</td>


</tr>

</table>

</td>

</tr>


<!-- =====================================================
     COUPON BAR
====================================================== -->

<tr>

<td
style="
padding:0 25px 20px;
"
>

<table
width="100%"
cellpadding="0"
cellspacing="0"
border="0"
style="
background:#dff2ff;
border-radius:15px;
"
>

<tr>

<td
style="
padding:18px 20px;
"
>

<div
style="
font-size:16px;
color:#173b60;
line-height:1.6;
"
>

🏷️ ใช้โค้ด

<strong
style="
font-size:21px;
color:#0b3d91;
"
>

WELCOME10

</strong>

&nbsp;

ลดทันที

<strong
style="
font-size:21px;
color:#0b3d91;
"
>

10%

</strong>

<br>

เมื่อช้อปสินค้าครบ 1,000 บาทขึ้นไป

</div>

</td>


<td
align="right"
style="
padding:15px 20px;
"
>

<a
href="https://wirakon113.github.io/shoesshop/shop"
target="_blank"
style="
display:inline-block;
background:#0b3d91;
color:#ffffff;
text-decoration:none;
font-size:18px;
font-weight:bold;
padding:13px 25px;
border-radius:30px;
white-space:nowrap;
"
>

ช้อปเลย →

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

<td
align="center"
style="
padding:5px 30px 25px;
"
>

<div
style="
font-size:23px;
font-style:italic;
font-weight:bold;
color:#0b3d91;
"
>

ขอบคุณที่เลือกเรา

</div>


<div
style="
font-size:14px;
color:#5a7a9a;
margin-top:5px;
"
>

และยินดีต้อนรับเข้าสู่การเดินทางไปด้วยกัน

</div>

</td>

</tr>


<!-- =====================================================
     FOOTER
====================================================== -->

<tr>

<td
style="
background:#063b70;
padding:22px 30px;
"
>

<table
width="100%"
cellpadding="0"
cellspacing="0"
border="0"
>

<tr>


<td
valign="middle"
>

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

</td>


<td
align="center"
valign="middle"
style="
font-size:14px;
color:#ffffff;
line-height:2;
"
>

● Facebook &nbsp;
● Instagram &nbsp;
● LINE &nbsp;
● YouTube

</td>


<td
align="right"
valign="middle"
style="
font-size:12px;
letter-spacing:2px;
color:#ffffff;
white-space:nowrap;
"
>

STEP INTO<br>
YOUR STYLE.

</td>


</tr>

</table>


<div
style="
margin-top:15px;
padding-top:15px;
border-top:1px solid rgba(255,255,255,0.2);
font-size:11px;
text-align:center;
color:rgba(255,255,255,0.6);
"
>

© 2026 SHOES SHOP. สงวนลิขสิทธิ์ทุกประการ<br>

อีเมลฉบับนี้ส่งถึง {$safeEmail}
เนื่องจากคุณสมัครรับข่าวสารจาก SHOES SHOP

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
    // PLAIN TEXT
    // ======================================================

    $mail->AltBody =
        "ยินดีต้อนรับสมาชิก SHOES SHOP!\n\n" .

        "สวัสดีคุณ{$name}\n\n" .

        "ขอบคุณที่สมัครรับข่าวสารจาก SHOES SHOP\n\n" .

        "สิทธิพิเศษสำหรับสมาชิกใหม่\n" .

        "รับส่วนลด 10%\n" .

        "รหัสส่วนลด: WELCOME10\n\n" .

        "ใช้ได้เมื่อช้อปสินค้าครบ 1,000 บาทขึ้นไป\n\n" .

        "RUNNING\n" .
        "LIFESTYLE\n" .
        "TRAINING\n" .
        "OUTDOOR\n\n" .

        "Step into Your Style\n\n" .

        "SHOES SHOP";


    // ======================================================
    // SEND EMAIL
    // ======================================================

    $mail->send();


    // ======================================================
    // SUCCESS — ส่ง JSON หรือแสดงหน้า HTML
    // ======================================================

    if ($isAjax) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => true,
            'message' => 'สมัครรับข่าวสารสำเร็จ! อีเมลถูกส่งไปที่ ' . $email . ' แล้ว',
        ]);
        exit;
    }

    // กรณี form POST ธรรมดา — แสดงหน้า HTML สำเร็จ
    ?>

<!DOCTYPE html>

<html lang="th">

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>สมัครรับข่าวสารสำเร็จ</title>


<style>

* {
    box-sizing:border-box;
}

body {

    margin:0;

    min-height:100vh;

    display:flex;

    align-items:center;

    justify-content:center;

    padding:20px;

    background:
        linear-gradient(
            135deg,
            #e8f4fd,
            #f5f9ff
        );

    font-family:
        Arial,
        "Tahoma",
        sans-serif;
}


.card {

    width:min(92%,480px);

    background:#ffffff;

    border-radius:24px;

    overflow:hidden;

    text-align:center;

    box-shadow:
        0 15px 45px
        rgba(11,61,145,0.15);
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


.content {

    padding:40px 25px;
}


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

<img
src="cid:shoes_logo"
alt="SHOES SHOP"
>


</div>


<div class="content">


<div class="icon">
✅
</div>


<h1>
สมัครรับข่าวสารสำเร็จ!
</h1>


<p>

ขอบคุณคุณ

<strong>
<?= htmlspecialchars($name, ENT_QUOTES, 'UTF-8') ?>
</strong>

ที่สมัครรับข่าวสารจาก SHOES SHOP

</p>


<p>

อีเมลสำหรับรับข่าวสาร

</p>


<div class="email">

<?= htmlspecialchars($email, ENT_QUOTES, 'UTF-8') ?>

</div>


<p>

คุณจะได้รับข่าวสาร โปรโมชั่น
และสินค้าใหม่จาก SHOES SHOP

</p>


<a
href="email_form.php"
class="btn"
>

กลับไป

</a>


</div>


<div class="footer">

© 2026 SHOES SHOP · Step into Your Style

</div>


</div>


</body>

</html>

<?php


} catch (Exception $e) {


    // ======================================================
    // ERROR — ส่ง JSON หรือแสดงหน้า HTML
    // ======================================================

    if ($isAjax) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'ส่งอีเมลไม่สำเร็จ: ' . $mail->ErrorInfo,
        ]);
        exit;
    }

    // กรณี form POST ธรรมดา — แสดงหน้า HTML ข้อผิดพลาด
    ?>

<!DOCTYPE html>

<html lang="th">

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>สมัครรับข่าวสารไม่สำเร็จ</title>


<style>

body {

    margin:0;

    min-height:100vh;

    display:flex;

    align-items:center;

    justify-content:center;

    padding:20px;

    background:#fff5f5;

    font-family:
        Arial,
        "Tahoma",
        sans-serif;
}


.card {

    width:min(92%,560px);

    background:#ffffff;

    padding:40px;

    border-radius:24px;

    text-align:center;

    box-shadow:
        0 15px 45px
        rgba(198,40,40,0.12);
}


.icon {

    font-size:60px;

    margin-bottom:15px;
}


h1 {

    color:#c62828;

}


p {

    color:#55718e;

    line-height:1.7;
}


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


<div class="icon">
❌
</div>


<h1>
สมัครรับข่าวสารไม่สำเร็จ
</h1>


<p>

กรุณาตรวจสอบการตั้งค่า SMTP
หรือ Gmail App Password

</p>


<div class="error">

<?= htmlspecialchars(
    $mail->ErrorInfo,
    ENT_QUOTES,
    'UTF-8'
) ?>

</div>


<a
href="email_form.php"
class="btn"
>

กลับไปลองใหม่

</a>


</div>


</body>

</html>

<?php

}

?>