<?php
// ==========================================================
// confirmbuy.php
// Order Confirmation Email ด้วย PHPMailer
// ดีไซน์ให้เหมือนกับ send_welcome.php / subscription.php
// (โทนสี / โลโก้ / เลย์เอาต์) แต่เป็น "ยืนยันคำสั่งซื้อ"
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
// (CheckoutModal ยิงมาแบบ JSON, email_form.php ยิงมาแบบฟอร์ม)
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
// SMTP Config
// ==========================================================

$smtpHost     = SMTP_HOST;
$smtpUsername = SMTP_USERNAME;
$smtpPassword = SMTP_PASSWORD;
$smtpPort     = SMTP_PORT;

// ==========================================================
// รับข้อมูล — รองรับทั้ง JSON body (CheckoutModal.tsx)
// และ form POST (email_form.php)
// ==========================================================

$rawBody = file_get_contents('php://input');
$data    = json_decode($rawBody, true);

if (!is_array($data)) {
    $data = $_POST;
}

$email           = trim($data['email'] ?? '');
$customerName    = trim($data['customerName'] ?? '');
$orderId         = trim($data['orderId'] ?? '');
$createdAt       = trim($data['createdAt'] ?? '');
$status          = trim($data['status'] ?? 'pending');
$paymentMethod   = trim($data['paymentMethod'] ?? '');
$shippingAddress = trim($data['shippingAddress'] ?? '');
$customerPhone   = trim($data['customerPhone'] ?? '');
$subtotal        = (float) ($data['subtotal'] ?? 0);
$shippingCost    = (float) ($data['shippingCost'] ?? 0);
$total           = (float) ($data['total'] ?? 0);
$notes           = trim($data['notes'] ?? '');

$items = $data['items'] ?? [];

if (!is_array($items)) {
    $items = [];
}

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

if ($customerName === '') {
    $customerName = 'สมาชิก SHOES SHOP';
}

// ==========================================================
// ป้องกัน HTML Injection
// ==========================================================

$safeName = htmlspecialchars(
    $customerName,
    ENT_QUOTES,
    'UTF-8'
);

$safeOrderId = htmlspecialchars(
    $orderId,
    ENT_QUOTES,
    'UTF-8'
);

$safeEmail = htmlspecialchars(
    $email,
    ENT_QUOTES,
    'UTF-8'
);

$safeShippingAddress = htmlspecialchars(
    $shippingAddress,
    ENT_QUOTES,
    'UTF-8'
);

$safePhone = htmlspecialchars(
    $customerPhone,
    ENT_QUOTES,
    'UTF-8'
);

$safeNotes = htmlspecialchars(
    $notes,
    ENT_QUOTES,
    'UTF-8'
);

// ==========================================================
// สถานะคำสั่งซื้อ (Thai label)
// ==========================================================

$statusLabels = [
    'pending'     => 'รอดำเนินการ',
    'processing'  => 'กำลังเตรียมสินค้า',
    'shipped'     => 'จัดส่งแล้ว',
    'delivered'   => 'ส่งถึงแล้ว',
    'cancelled'   => 'ยกเลิกแล้ว',
];

$safeStatus = $statusLabels[$status] ?? 'รอดำเนินการ';

// ==========================================================
// วิธีชำระเงิน (Thai label)
// ==========================================================

$paymentLabels = [
    'promptpay' => 'PromptPay QR',
    'card'      => 'บัตรเครดิต / เดบิต',
    'cod'       => 'เก็บเงินปลายทาง (COD)',
];

$safePayment = $paymentLabels[$paymentMethod] ?? $paymentMethod;

// ==========================================================
// จัดรูปแบบวันที่
// ==========================================================

$humanDate = '';

if ($createdAt !== '') {
    $ts = strtotime($createdAt);
    if ($ts) {
        $humanDate = date('d/m/Y H:i น.', $ts);
    }
}

if ($humanDate === '') {
    $humanDate = date('d/m/Y H:i น.');
}

// ==========================================================
// PATH LOGO — เหมือน send_welcome.php / subscription.php
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
// รายการสินค้า → HTML rows
// ==========================================================

// ==========================================================
// รายการสินค้า → HTML rows (พร้อมรูป thumbnail)
// - รูป http(s) → hotlink <img> ตรง ๆ
// - รูป data:image/*;base64 (สินค้าที่แอดมินอัปโหลด) → เก็บ binary ไว้ก่อน
//   แล้วแนบเป็น embedded image (cid:) หลังสร้าง $mail (Gmail ไม่แสดง data: URI)
// ==========================================================

$itemsRowsHTML = '';
$itemEmbeds = [];

foreach ($items as $item) {

    $itemName     = htmlspecialchars(trim($item['name'] ?? ''), ENT_QUOTES, 'UTF-8');
    $itemSize     = (int) ($item['size'] ?? 0);
    $itemQty      = (int) ($item['quantity'] ?? 1);
    $itemPrice    = (float) ($item['price'] ?? 0);
    $itemLine     = $itemPrice * $itemQty;
    $itemImageRaw = trim($item['image'] ?? '');

    $itemImageCell =
        '<span style="font-family:Arial,Tahoma,sans-serif;font-size:13px;color:#9db1c7;">—</span>';

    if (preg_match('#^https?://#i', $itemImageRaw)) {
        $safeImg = htmlspecialchars($itemImageRaw, ENT_QUOTES, 'UTF-8');
        $itemImageCell =
            '<img src="' . $safeImg . '" alt="" width="72" style="display:block;width:72px;max-width:72px;height:auto;border:0;border-radius:8px;">';
    } elseif (
        preg_match('#^data:(image/(jpeg|png|gif|webp));base64,(.+)$#s', $itemImageRaw, $imgMatch)
    ) {
        $imgBin = base64_decode($imgMatch[3], true);
        // กันอีเมลใหญ่เกิน (Gmail ตัดที่ ~102KB): แนบเฉพาะรูปเล็กและไม่เกิน 10 รูป
        if ($imgBin !== false && strlen($imgBin) > 0 && strlen($imgBin) <= 1048576 && count($itemEmbeds) < 10) {
            $imgCid = 'itemimg_' . count($itemEmbeds);
            $imgExt = $imgMatch[2] === 'jpeg' ? 'jpg' : $imgMatch[2];
            $itemEmbeds[] = [
                'cid'  => $imgCid,
                'bin'  => $imgBin,
                'mime' => $imgMatch[1],
                'ext'  => $imgExt,
            ];
            $itemImageCell =
                '<img src="cid:' . $imgCid . '" alt="" width="72" style="display:block;width:72px;max-width:72px;height:auto;border:0;border-radius:8px;">';
        }
    }

    $itemsRowsHTML .= '
    <tr>
        <td style="
            padding:12px 10px;
            border-bottom:1px solid #eef3f8;
            white-space:nowrap;
        ">' . $itemImageCell . '</td>
        <td style="
            font-family:Arial,Tahoma,sans-serif;
            font-size:15px;
            font-weight:bold;
            color:#173b60;
            padding:12px 10px;
            border-bottom:1px solid #eef3f8;
        ">' . $itemName . '</td>
        <td align="center" style="
            font-family:Arial,Tahoma,sans-serif;
            font-size:14px;
            color:#55718e;
            padding:12px 10px;
            border-bottom:1px solid #eef3f8;
            white-space:nowrap;
        ">ไซซ์ ' . $itemSize . '</td>
        <td align="center" style="
            font-family:Arial,Tahoma,sans-serif;
            font-size:14px;
            color:#55718e;
            padding:12px 10px;
            border-bottom:1px solid #eef3f8;
            white-space:nowrap;
        ">x ' . $itemQty . '</td>
        <td align="right" style="
            font-family:Arial,Tahoma,sans-serif;
            font-size:14px;
            font-weight:bold;
            color:#173b60;
            padding:12px 10px;
            border-bottom:1px solid #eef3f8;
            white-space:nowrap;
        ">฿' . number_format($itemLine) . '</td>
    </tr>
    ';
}

if ($itemsRowsHTML === '') {
    $itemsRowsHTML = '
    <tr>
        <td colspan="5" style="
            font-family:Arial,Tahoma,sans-serif;
            font-size:14px;
            color:#55718e;
            padding:14px 10px;
            text-align:center;
        ">ไม่มีรายการสินค้า</td>
    </tr>
    ';
}

// ==========================================================
// วิธีชำระเงิน
// ==========================================================

$paymentDetail = '';

if ($paymentMethod === 'promptpay') {
    $paymentDetail = '
        <div style="font-size:14px;color:#55718e;margin-top:6px;">
            🔗 สแกน QR เพื่อชำระเงิน (รหัสอ้างอิง: <strong style="color:#0b3d91;">' . $safeOrderId . '</strong>)
        </div>
    ';
} elseif ($paymentMethod === 'cod') {
    $paymentDetail = '
        <div style="font-size:14px;color:#55718e;margin-top:6px;">
            💵 จ่ายเงินสดเมื่อได้รับสินค้า
        </div>
    ';
} else {
    $paymentDetail = '
        <div style="font-size:14px;color:#55718e;margin-top:6px;">
            💳 ตัดบัตรเรียบร้อย ยอดเต็มจำนวน
        </div>
    ';
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

    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    $mail->SMTPDebug = 0;

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
        $safeName
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
    // EMBED รูปสินค้าแบบ base64 (cid:itemimg_N)
    // ======================================================

    foreach ($itemEmbeds as $embed) {
        $mail->addStringEmbeddedImage(
            $embed['bin'],
            $embed['cid'],
            'item.' . $embed['ext'],
            PHPMailer::ENCODING_BASE64,
            $embed['mime']
        );
    }

    // ======================================================
    // SUBJECT
    // ======================================================

    $mail->isHTML(true);

    $mail->Subject =
        'ยืนยันคำสั่งซื้อ ' . $safeOrderId . ' — ขอบคุณที่ช้อปกับ SHOES SHOP 👟';

    // ======================================================
    // LOGO (HEADER) — เหมือน subscription.php / send_welcome.php
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
    // EMAIL BODY
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
<title>Order Confirmation - SHOES SHOP</title>
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
    คำสั่งซื้อของคุณได้รับการยืนยันแล้ว เรากำลังแพ็กสินค้าให้คุณอยู่
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
    {$logoHTML}
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
     HERO / ORDER CONFIRMED BANNER
====================================================== -->

<tr>
<td bgcolor="#0b3d91" style="background:#0b3d91;padding:50px 30px;text-align:center;">

<div style="font-size:15px;letter-spacing:6px;font-weight:bold;color:#9fc1ea;">
ยืนยันคำสั่งซื้อสำเร็จ
</div>

<div style="font-size:52px;line-height:1.15;font-weight:800;color:#ffffff;margin:14px 0 10px;letter-spacing:1px;">
 ORDER CONFIRMED!
</div>

<div style="width:70px;height:4px;background:#ffffff;margin:0 auto 18px;border-radius:2px;"></div>

<div style="font-size:19px;font-weight:bold;color:#ffffff;">
ขอบคุณคุณ {$safeName}
</div>

<div style="font-size:14px;color:#cfe1f7;margin-top:8px;">
คำสั่งซื้อของคุณได้รับการยืนยันเรียบร้อยแล้ว
</div>

</td>
</tr>

<!-- =====================================================
     ORDER ID BANNER
====================================================== -->

<tr>
<td style="padding:28px 30px 8px;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#e8f5fd" style="background:#e8f5fd;border-radius:14px;">
<tr>

<td style="padding:18px 24px;">

<div style="font-size:12px;letter-spacing:2px;color:#5a7a9a;font-weight:bold;">
รหัสคำสั่งซื้อ (Order ID)
</div>

<div style="font-size:28px;font-weight:800;color:#0b3d91;margin-top:4px;letter-spacing:1px;">
{$safeOrderId}
</div>

</td>

<td align="right" style="padding:18px 24px;white-space:nowrap;">

<div style="font-size:12px;letter-spacing:2px;color:#5a7a9a;font-weight:bold;">
วันที่สั่งซื้อ
</div>

<div style="font-size:17px;font-weight:bold;color:#173b60;margin-top:4px;">
{$humanDate}
</div>

</td>

</tr>
</table>

</td>
</tr>

<!-- =====================================================
     STATUS
====================================================== -->

<tr>
<td style="padding:16px 30px;">

<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>

<td align="center" bgcolor="#dff2ff" style="
background:#dff2ff;
border-radius:30px;
padding:18px 10px;
width:100%;
">
<div style="font-size:12px;letter-spacing:2px;color:#5a7a9a;font-weight:bold;">
สถานะคำสั่งซื้อ (Order Status)
</div>
<div style="font-size:20px;font-weight:bold;color:#0b3d91;margin-top:4px;">
{$safeStatus}
</div>
</td>

</tr>
</table>

</td>
</tr>

<!-- =====================================================
     SHIPPING INFO
====================================================== -->

<tr>
<td style="padding:8px 30px 4px;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fbfd" style="background:#f8fbfd;border-radius:14px;border:1px solid #e5edf4;">
<tr>

<td style="padding:18px 24px;vertical-align:top;">

<div style="font-size:13px;font-weight:bold;color:#173b60;">
📦 ที่อยู่จัดส่ง (Shipping Address)
</div>

<div style="font-size:14px;color:#294762;line-height:1.7;margin-top:6px;">
{$safeShippingAddress}
</div>

</td>

<td align="right" style="padding:18px 24px;vertical-align:top;white-space:nowrap;">

<div style="font-size:13px;font-weight:bold;color:#173b60;">
📞 เบอร์ติดต่อ
</div>

<div style="font-size:14px;color:#294762;line-height:1.7;margin-top:6px;">
{$safePhone}
</div>

</td>

</tr>
</table>

</td>
</tr>

<!-- =====================================================
     ORDER ITEMS
====================================================== -->

<tr>
<td style="padding:20px 30px 8px;">

<div style="font-size:18px;font-weight:bold;color:#173b60;margin-bottom:10px;">
🛒 รายการสินค้า (Order Items)
</div>

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background:#ffffff;border:1px solid #e5edf4;border-radius:12px;overflow:hidden;">

<!-- TABLE HEAD -->
<tr bgcolor="#0b3d91" style="background:#0b3d91;">
<td style="
font-family:Arial,Tahoma,sans-serif;
font-size:11px;
letter-spacing:1px;
font-weight:bold;
color:#ffffff;
padding:10px 12px;
">รูป</td>
<td style="
font-family:Arial,Tahoma,sans-serif;
font-size:11px;
letter-spacing:1px;
font-weight:bold;
color:#ffffff;
padding:10px 12px;
">สินค้า</td>
<td align="center" style="
font-family:Arial,Tahoma,sans-serif;
font-size:11px;
letter-spacing:1px;
font-weight:bold;
color:#ffffff;
padding:10px 12px;
">ไซซ์</td>
<td align="center" style="
font-family:Arial,Tahoma,sans-serif;
font-size:11px;
letter-spacing:1px;
font-weight:bold;
color:#ffffff;
padding:10px 12px;
">จำนวน</td>
<td align="right" style="
font-family:Arial,Tahoma,sans-serif;
font-size:11px;
letter-spacing:1px;
font-weight:bold;
color:#ffffff;
padding:10px 12px;
">ราคา</td>
</tr>

{$itemsRowsHTML}

</table>

</td>
</tr>

<!-- =====================================================
     PRICE SUMMARY
====================================================== -->

<tr>
<td style="padding:14px 30px 10px;">

<table width="280" align="right" cellpadding="0" cellspacing="0" border="0" style="width:280px;">

<tr>
<td style="
font-family:Arial,Tahoma,sans-serif;
font-size:14px;
color:#55718e;
padding:5px 0;
">ยอดรวมสินค้า (Subtotal)</td>
<td align="right" style="
font-family:Arial,Tahoma,sans-serif;
font-size:14px;
color:#173b60;
font-weight:bold;
padding:5px 0;
">฿{$subtotal}</td>
</tr>

<tr>
<td style="
font-family:Arial,Tahoma,sans-serif;
font-size:14px;
color:#55718e;
padding:5px 0;
">ค่าจัดส่ง (Shipping)</td>
<td align="right" style="
font-family:Arial,Tahoma,sans-serif;
font-size:14px;
color:#173b60;
font-weight:bold;
padding:5px 0;
">฿{$shippingCost}</td>
</tr>

<tr>
<td colspan="2" style="border-top:1px solid #e5edf4;padding:0;font-size:1px;line-height:1px;">&nbsp;</td>
</tr>

<tr>
<td style="
font-family:Arial,Tahoma,sans-serif;
font-size:16px;
color:#173b60;
font-weight:bold;
padding:9px 0;
">ยอดชำระสุทธิ (Total)</td>
<td align="right" style="
font-family:Arial,Tahoma,sans-serif;
font-size:19px;
color:#0b3d91;
font-weight:800;
padding:9px 0;
white-space:nowrap;
">฿{$total}</td>
</tr>

</table>

</td>
</tr>

<!-- =====================================================
     PAYMENT METHOD
====================================================== -->

<tr>
<td style="padding:10px 30px 20px;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#eaf6ff" style="background:#eaf6ff;border-radius:12px;">
<tr>

<td style="padding:16px 22px;">
<div style="font-size:15px;font-weight:bold;color:#173b60;">
💳 วิธีชำระเงิน ({$safePayment})
</div>
{$paymentDetail}
</td>

</tr>
</table>

</td>
</tr>

<!-- =====================================================
     NOTES / DELIVERY NOTE
====================================================== -->

CONFIRM_NOTES

<!-- =====================================================
     CTA BUTTON
====================================================== -->

<tr>
<td align="center" style="padding:5px 30px 30px;">

<a href="https://wirakon113.github.io/shoesshop/" target="_blank" style="
display:inline-block;
background:#0b3d91;
color:#ffffff;
text-decoration:none;
font-size:18px;
font-weight:bold;
padding:15px 34px;
border-radius:30px;
white-space:nowrap;
">
ดูสถานะคำสั่งซื้อ →
</a>

<div style="font-size:13px;color:#5a7a9a;margin-top:14px;">
หากมีคำถามติดต่อเราได้ที่ support@shoesshop.com หรือ LINE: @shoesshop
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
เนื่องจากคุณได้ทำการสั่งซื้อสินค้ากับ SHOES SHOP
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

    // ======================================================
    // ALT BODY
    // ======================================================

    $mail->AltBody =
        "ยืนยันคำสั่งซื้อ SHOES SHOP\n\n" .
        "สวัสดีคุณ {$safeName}\n\n" .
        "คำสั่งซื้อของคุณได้รับการยืนยันแล้ว\n\n" .
        "รหัสคำสั่งซื้อ: {$safeOrderId}\n" .
        "วันที่: {$humanDate}\n" .
        "สถานะ: {$safeStatus}\n\n" .
        "รายการสินค้า:\n";

    foreach ($items as $item) {

        $altImageRaw = trim($item['image'] ?? '');
        $altImageLine = '';
        if (preg_match('#^https?://#i', $altImageRaw)) {
            $altImageLine = "\n  รูป: " . $altImageRaw;
        }

        $mail->AltBody .=
            "- " .
            htmlspecialchars(trim($item['name'] ?? ''), ENT_QUOTES, 'UTF-8') .
            " (ไซซ์ " . (int) ($item['size'] ?? 0) .
            ") x " . (int) ($item['quantity'] ?? 1) .
            " = ฿" . number_format((float) ($item['price'] ?? 0) * (int) ($item['quantity'] ?? 1)) .
            $altImageLine .
            "\n";
    }

    $mail->AltBody .=
        "\nยอดรวมสินค้า: ฿" . number_format($subtotal) .
        "\nค่าจัดส่ง: ฿" . number_format($shippingCost) .
        "\nยอดชำระสุทธิ: ฿" . number_format($total) .
        "\n\nวิธีชำระเงิน: {$safePayment}" .
        "\nที่อยู่จัดส่ง: {$safeShippingAddress}" .
        "\nเบอร์ติดต่อ: {$safePhone}" .
        (($safeNotes !== '') ? "\nหมายเหตุ: {$safeNotes}" : '') .
        "\n\nStep into Your Style\n\n" .
        "SHOES SHOP";

    // ======================================================
    // SEND
    // ======================================================

    $mail->send();

    if ($isAjax) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => true,
            'message' => 'ส่งอีเมลยืนยันคำสั่งซื้อไปที่ ' . $email . ' เรียบร้อยแล้ว',
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
    padding:40px;
    border-radius:24px;
    text-align:center;
    box-shadow:0 15px 45px rgba(11,61,145,0.15);
}

.icon { font-size:60px;margin-bottom:15px; }

h1 { color:#0b3d91;margin:0 0 12px; }

p { color:#55718e;line-height:1.7; }

.email {
    margin:18px 0;
    padding:15px;
    background:#f5f8fc;
    border-radius:12px;
    color:#0b3d91;
    font-weight:bold;
    word-break:break-all;
}

.btn {
    display:inline-block;
    margin-top:15px;
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

    <div class="icon">✅</div>

    <h1>ส่งอีเมลสำเร็จ!</h1>

    <p>อีเมลยืนยันคำสั่งซื้อ #<?= htmlspecialchars($safeOrderId, ENT_QUOTES, 'UTF-8') ?> ถูกส่งไปยัง</p>

    <div class="email"><?= htmlspecialchars($safeEmail, ENT_QUOTES, 'UTF-8') ?></div>

    <a href="email_form.php" class="btn">ส่งอีเมลอีกครั้ง</a>

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

* { box-sizing:border-box; }

body {
    margin:0;
    min-height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    background:linear-gradient(135deg,#fff5f5,#fdf1f1);
    font-family:Arial,"Tahoma",sans-serif;
}

.card {
    width:min(92%,480px);
    background:#ffffff;
    padding:40px;
    border-radius:24px;
    text-align:center;
    box-shadow:0 15px 45px rgba(198,40,40,0.15);
}

.icon { font-size:60px;margin-bottom:15px; }

h1 { color:#c62828;margin:0 0 12px; }

p { color:#55718e;line-height:1.7; }

.error {
    margin:18px 0;
    padding:15px;
    background:#fff8f8;
    border:1px solid #ffcdd2;
    border-radius:12px;
    color:#c62828;
    font-family:monospace;
    font-size:13px;
    word-break:break-word;
}

.btn {
    display:inline-block;
    margin-top:15px;
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

    <h1>ส่งอีเมลไม่สำเร็จ!</h1>

    <p>ไม่สามารถส่งอีเมลยืนยันคำสั่งซื้อได้</p>

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
