<?php
// email_form.php
// หน้าให้กรอกอีเมลเพื่อส่ง Welcome Email

$message = $_GET['message'] ?? '';
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SHOES SHOP - Send Welcome Email</title>
    <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&family=Sarabun:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #eef6fc;
            font-family: "Sarabun", sans-serif;
            color: #12365c;
        }
        .box {
            width: min(92%, 480px);
            background: #fff;
            padding: 40px;
            border-radius: 22px;
            box-shadow: 0 15px 45px rgba(0, 50, 100, .12);
        }
        .logo {
            width: 70px;
            height: 70px;
            margin: 0 auto 15px;
            display: grid;
            place-items: center;
            border: 3px solid #064a8b;
            border-radius: 50%;
            font-size: 34px;
            background: #f5fbff;
        }
        h1 {
            margin: 0;
            text-align: center;
            font-family: "Kanit", sans-serif;
            color: #064a8b;
        }
        .subtitle {
            text-align: center;
            color: #607990;
            margin: 8px 0 28px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
        }
        input {
            width: 100%;
            padding: 14px 16px;
            border: 1px solid #ccd9e4;
            border-radius: 12px;
            font-size: 16px;
            outline: none;
        }
        input:focus { border-color: #064a8b; }
        button {
            width: 100%;
            margin-top: 18px;
            padding: 14px;
            border: 0;
            border-radius: 30px;
            background: #064a8b;
            color: white;
            font-family: "Kanit", sans-serif;
            font-size: 19px;
            cursor: pointer;
        }
        button:hover { background: #0864b8; }
        .message {
            margin-bottom: 18px;
            padding: 12px;
            border-radius: 10px;
            background: #eaf6ff;
            color: #064a8b;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="box">
        <div class="logo">👟</div>
        <h1>SHOES SHOP</h1>
        <p class="subtitle">ส่ง Welcome Email ให้สมาชิก</p>

        <?php if ($message): ?>
            <div class="message"><?= htmlspecialchars($message) ?></div>
        <?php endif; ?>

        <form action="send_welcome.php" method="POST">
            <label for="email">อีเมลสมาชิก</label>
            <input
                type="email"
                id="email"
                name="email"
                placeholder="example@gmail.com"
                required
            >

            <label for="name" style="margin-top:16px;">ชื่อสมาชิก</label>
            <input
                type="text"
                id="name"
                name="name"
                placeholder="วีรกร สาพรเจริญ"
                value="วีรกร สาพรเจริญ"
                required
            >

            <button type="submit">📧 ส่ง Welcome Email</button>
        </form>
    </div>
</body>
</html>
