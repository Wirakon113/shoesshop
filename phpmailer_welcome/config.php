<?php
// config.php
// SMTP Configuration for PHPMailer — อ่านจาก environment / .env
// ห้ามเขียนรหัสผ่านตรง ๆ ในไฟล์นี้
//
// ลำดับความสำคัญของค่า: environment จริง > phpmailer_welcome/.env
// วิธีใช้งาน: copy `.env.example` เป็น `.env` แล้วใส่ค่าจริง
// (`.env` ถูก gitignore แล้ว จะไม่ถูก commit)

function monoStepLoadEnv(string $dir): void
{
    $path = rtrim($dir, "/\\") . DIRECTORY_SEPARATOR . '.env';
    if (!is_readable($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        // ข้าม comment / บรรทัดว่าง
        if ($line === '' || $line[0] === '#' || $line[0] === ';') {
            continue;
        }
        // ข้ามบรรทัดที่ไม่มี =
        if (strpos($line, '=') === false) {
            continue;
        }
        // รองรับ `export KEY=value`
        if (stripos($line, 'export ') === 0) {
            $line = trim(substr($line, 7));
        }

        [$name, $value] = explode('=', $line, 2);
        $name  = trim($name);
        $value = trim($value);

        // ตัด quote " ... " หรือ ' ... '
        if (strlen($value) >= 2) {
            $first = $value[0];
            $last  = substr($value, -1);
            if (($first === '"' && $last === '"') || ($first === "'" && $last === "'")) {
                $value = substr($value, 1, -1);
                if ($first === '"') {
                    $value = str_replace(['\\n', '\\r', '\\t'], ["\n", "\r", "\t"], $value);
                }
            }
        }
        // ตัด inline comment แบบ `value # comment` (เฉพาะค่าที่ไม่ได้ quote)
        if (preg_match('/\s+#.*$/', $value)) {
            $value = trim(preg_replace('/\s+#.*$/', '', $value));
        }

        if ($name === '') {
            continue;
        }
        // env จริงต้องชนะ .env — ถ้ามีอยู่แล้วห้ามทับ
        if (array_key_exists($name, $_ENV) || array_key_exists($name, $_SERVER) || getenv($name) !== false) {
            continue;
        }

        $_ENV[$name]    = $value;
        $_SERVER[$name] = $value;
        putenv($name . '=' . $value);
    }
}

function monoStepEnv(string $name, string $default = ''): string
{
    $value = getenv($name);
    if ($value !== false) {
        return $value;
    }
    if (isset($_ENV[$name])) {
        return (string) $_ENV[$name];
    }
    if (isset($_SERVER[$name])) {
        return (string) $_SERVER[$name];
    }
    return $default;
}

// โหลด .env ที่อยู่โฟลเดอร์เดียวกับไฟล์นี้ (phpmailer_welcome/.env)
monoStepLoadEnv(__DIR__);

if (!defined('SMTP_HOST')) {
    define('SMTP_HOST', monoStepEnv('SMTP_HOST', 'smtp.gmail.com'));
}
if (!defined('SMTP_USERNAME')) {
    define('SMTP_USERNAME', monoStepEnv('SMTP_USERNAME', ''));
}
if (!defined('SMTP_PASSWORD')) {
    define('SMTP_PASSWORD', monoStepEnv('SMTP_PASSWORD', ''));
}
if (!defined('SMTP_PORT')) {
    define('SMTP_PORT', (int) monoStepEnv('SMTP_PORT', '587'));
}
if (!defined('SMTP_FROM_NAME')) {
    define('SMTP_FROM_NAME', monoStepEnv('SMTP_FROM_NAME', 'SHOES SHOP'));
}
