# SHOES SHOP - PHPMailer Welcome Email

มี 2 ไฟล์ตามที่ขอ

1. email_form.php
   - หน้าให้กรอก Email และชื่อ
   - กด "ส่ง Welcome Email"

2. send_welcome.php
   - รับ Email + ชื่อจากฟอร์ม
   - ใช้ PHPMailer ส่ง HTML Welcome Email
   - หน้าที่ส่งไปในอีเมลออกแบบให้ใกล้เคียงภาพ SHOES SHOP ที่ให้มา

## ติดตั้ง PHPMailer

เปิด CMD ในโฟลเดอร์โปรเจกต์ แล้วใช้:

composer require phpmailer/phpmailer

หลังจากนั้นจะมีโฟลเดอร์ vendor/

## ตั้งค่า Gmail

เปิด send_welcome.php แล้วแก้:

$smtpUsername = 'your-email@gmail.com';
$smtpPassword = 'YOUR_APP_PASSWORD';

ถ้าใช้ Gmail แนะนำให้ใช้ Google App Password ไม่ใช่รหัสผ่าน Gmail ปกติ

SMTP:
Host = smtp.gmail.com
Port = 587
Encryption = STARTTLS

## โครงสร้าง

phpmailer_welcome/
├── email_form.php
├── send_welcome.php
└── vendor/
    └── ... (สร้างจาก Composer)

## เปิดใช้งาน

วางโฟลเดอร์ไว้ใน htdocs ของ XAMPP แล้วเปิด:

http://localhost/phpmailer_welcome/email_form.php
