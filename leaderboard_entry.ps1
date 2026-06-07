$secret    = "d504b6c8b58cc6519f30143bbf0497c08a72a2ceb5f1054aedd295feba525aa2"
$name      = "PlayerOne"
$score     = 67
$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()

$payload   = "$name`:$score`:$timestamp"

$hmac      = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key  = [System.Text.Encoding]::UTF8.GetBytes($secret)
$signature = ($hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($payload)) | ForEach-Object { $_.ToString("x2") }) -join ""

Invoke-RestMethod -Uri "https://localhost/api/leaderboard" `
  -Method POST `
  -ContentType "application/json" `
  -SkipCertificateCheck `
  -Body (ConvertTo-Json @{
    name      = $name
    score     = $score
    timestamp = $timestamp
    signature = $signature
  })