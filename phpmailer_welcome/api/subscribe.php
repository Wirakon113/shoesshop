<?php
// api/subscribe.php
// Subscription API endpoint - ส่ง subscription email ให้สมาชิก
// รับ: { email, name } แล้วส่ง Welcome Email ด้วย PHPMailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
    exit;
}

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody, true);
if (!is_array($data)) {
    $data = $_POST;
}

$email = trim($data['email'] ?? '');
$name  = trim($data['name'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'กรุณากรอกอีเมลให้ถูกต้อง']);
    exit;
}

if ($name === '') {
    $name = 'สมาชิก SHOES SHOP';
}

$safeName  = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');

$logoPath = __DIR__ . '/../../public/logo.png';
$logoExists = file_exists($logoPath);

if (!$logoExists) {
    $logoPath = __DIR__ . '/../../public/logo.svg';
    $logoExists = file_exists($logoPath);
    $logoType = 'image/svg+xml';
    $logoExt  = 'svg';
} else {
    $logoType = 'image/png';
    $logoExt  = 'png';
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USERNAME;
    $mail->Password   = SMTP_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = SMTP_PORT;
    $mail->CharSet    = 'UTF-8';
    $mail->SMTPDebug  = 0;

    $mail->setFrom(SMTP_USERNAME, SMTP_FROM_NAME);
    $mail->addAddress($email, $safeName);
    $mail->addReplyTo(SMTP_USERNAME, SMTP_FROM_NAME);

    if ($logoExists) {
        $mail->addEmbeddedImage(
            $logoPath,
            'shoes_logo',
            'logo.' . $logoExt,
            'base64',
            $logoType
        );
    }

    if ($logoExists) {
        $logoHTML = '<img src="cid:shoes_logo" alt="SHOES SHOP" style="display:block;max-width:180px;width:100%;height:auto;border:0;">';
    } else {
        $logoHTML = '<div style="font-size:24px;font-weight:bold;color:#ffffff;letter-spacing:1px;">SHOES SHOP</div>';
    }

    $mail->isHTML(true);
    $mail->Subject = 'ยินดีต้อนรับสมาชิก SHOES SHOP! รับส่วนลด 10% 🎁';

    $mail->Body = <<<HTML
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SHOES SHOP Subscription</title>
</head>
<body style="margin:0;padding:0;background:#f1f6fa;font-family:Arial,'Tahoma',sans-serif;color:#173b60;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f6fa;">
<tr>
<td align="center" style="padding:20px 10px;">

<table width="760" cellpadding="0" cellspacing="0" border="0" style="max-width:760px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;">

<!-- HEADER -->
<tr>
<td style="padding:22px 32px;background:#ffffff;border-bottom:1px solid #e5edf4;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="left" valign="middle">{$logoHTML}</td>
<td align="right" valign="middle" style="font-size:12px;letter-spacing:3px;color:#173b60;white-space:nowrap;">STEP INTO YOUR STYLE.</td>
</tr>
</table>
</td>
</tr>

<!-- PROMOTION BANNER -->
<tr>
<td style="background:#e8f5fd;padding:35px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="48%" valign="middle" style="padding:10px 20px;">
<div style="font-size:17px;font-weight:bold;color:#ffffff;background:#0b3d91;display:inline-block;padding:8px 20px;transform:skew(-8deg);">พิเศษสำหรับสมาชิกใหม่</div>
<div style="font-size:28px;font-weight:bold;color:#0b3d91;margin-top:18px;">รับส่วนลด</div>
<div style="font-size:82px;line-height:0.9;font-weight:bold;color:#063b70;">10%</div>
<div style="font-size:17px;font-weight:bold;color:#173b60;margin-top:15px;">เมื่อช้อปสินค้าครั้งแรก</div>
<div style="margin-top:12px;font-size:15px;color:#173b60;">ใช้โค้ด <span style="display:inline-block;background:#0b3d91;color:#ffffff;padding:8px 16px;border-radius:6px;font-weight:bold;font-size:17px;">WELCOME10</span></div>
</td>
<td width="52%" align="center" valign="middle" style="padding:10px;">
<div style="font-size:90px;line-height:1;">👟</div>
<div style="font-size:25px;font-style:italic;font-weight:bold;color:#0b3d91;margin-top:8px;">Better Shoes</div>
<div style="font-size:25px;font-style:italic;font-weight:bold;color:#0b3d91;">Bigger Dreams</div>
</td>
</tr>
</table>
</td>
</tr>

<!-- WELCOME MEMBER -->
<tr>
<td style="padding:28px 35px 20px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="95" align="center" valign="top">
<div style="width:75px;height:75px;border-radius:50%;background:#dff2ff;text-align:center;line-height:75px;font-size:38px;">🎁</div>
</td>
<td valign="top" style="padding-left:15px;">
<div style="font-size:24px;font-weight:bold;color:#0b3d91;">สวัสดีสมาชิกคนพิเศษ</div>
<div style="font-size:16px;line-height:1.8;color:#294762;margin-top:5px;">
คุณ{$safeName}<br>
ขอบคุณที่สมัครรับข่าวสารจาก SHOES SHOP<br>
เพื่อเป็นการต้อนรับ เรามอบ <strong style="color:#0b3d91;">ส่วนลด 10%</strong> สำหรับการสั่งซื้อครั้งแรก<br>
เพียงใช้โค้ด <strong style="color:#0b3d91;">WELCOME10</strong> ที่หน้าชำระเงิน
</div>
</td>
</tr>
</table>
</td>
</tr>

<!-- COUPON BAR -->
<tr>
<td style="padding:0 25px 20px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#dff2ff;border-radius:15px;">
<tr>
<td style="padding:18px 20px;">
<div style="font-size:16px;color:#173b60;line-height:1.6;">
🏷️ ใช้โค้ด <strong style="font-size:21px;color:#0b3d91;">WELCOME10</strong> &nbsp; ลดทันที <strong style="font-size:21px;color:#0b3d91;">10%</strong><br>
เมื่อช้อปสินค้าครบ 1,000 บาทขึ้นไป
</div>
</td>
<td align="right" style="padding:15px 20px;">
<a href="https://your-website.com" target="_blank" style="display:inline-block;background:#0b3d91;color:#ffffff;text-decoration:none;font-size:18px;font-weight:bold;padding:13px 25px;border-radius:30px;white-space:nowrap;">ช้อปเลย →</a>
</td>
</tr>
</table>
</td>
</tr>

<!-- MESSAGE -->
<tr>
<td align="center" style="padding:5px 30px 25px;">
<div style="font-size:23px;font-style:italic;font-weight:bold;color:#0b3d91;">ขอบคุณที่เลือกเรา</div>
<div style="font-size:14px;color:#5a7a9a;margin-top:5px;">และยินดีต้อนรับเข้าสู่การเดินทางไปด้วยกัน</div>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background:#063b70;padding:22px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td valign="middle">{$logoHTML}</td>
<td align="center" valign="middle" style="font-size:14px;color:#ffffff;line-height:2;">● Facebook &nbsp; ● Instagram &nbsp; ● LINE &nbsp; ● YouTube</td>
<td align="right" valign="middle" style="font-size:12px;letter-spacing:2px;color:#ffffff;white-space:nowrap;">STEP INTO<br>YOUR STYLE.</td>
</tr>
</table>
<div style="margin-top:15px;padding-top:15px;border-top:1px solid rgba(255,255,255,0.2);font-size:11px;text-align:center;color:rgba(255,255,255,0.6);">
© 2026 SHOES SHOP. สงวนลิขสิทธิ์ทุกประการ<br>
อีเมลฉบับนี้ส่งถึง {$safeEmail} เนื่องจากคุณสมัครรับข่าวสารจาก SHOES SHOP
</div>
</td>
</tr>

</table>
</td>
</tr>
</table>

</body>
</html>
HTML;

    $mail->AltBody =
        "ยินดีต้อนรับสมาชิก SHOES SHOP!\n\n" .
        "สวัสดีคุณ{$name}\n\n" .
        "ขอบคุณที่สมัครรับข่าวสารจาก SHOES SHOP\n\n" .
        "สิทธิพิเศษสำหรับสมาชิกใหม่\n" .
        "รับส่วนลด 10%\n" .
        "รหัสส่วนลด: WELCOME10\n\n" .
        "ใช้ได้เมื่อช้อปสินค้าครบ 1,000 บาทขึ้นไป\n\n" .
        "Step into Your Style\n\n" .
        "SHOES SHOP";

    $mail->send();

    echo json_encode([
        'success' => true,
        'message' => 'ส่งอีเมลสมัครรับข่าวสารไปที่ ' . $email . ' เรียบร้อยแล้ว',
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'ส่งอีเมลไม่สำเร็จ: ' . $mail->ErrorInfo]);
}
