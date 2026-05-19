param(
    [string]$Name      = "PlayerOne",
    [long]  $Score     = 9999,
    [string]$EnvFile   = ".\.env",
    [string]$Url       = $null
)

# --- Load .env ---
if (-not (Test-Path $EnvFile)) {
    Write-Error "Could not find .env file at '$EnvFile'. Use -EnvFile to specify a path."
    exit 1
}

$env_vars = @{}
Get-Content $EnvFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#") -and $line -match "^([^=]+)=(.*)$") {
        $env_vars[$Matches[1].Trim()] = $Matches[2].Trim()
    }
}

$secret = $env_vars["LEADERBOARD_SECRET"]
if (-not $secret) {
    Write-Error "LEADERBOARD_SECRET not found in '$EnvFile'."
    exit 1
}

# Fall back to localhost if no URL provided and not in .env
if (-not $Url) {
    $Url = if ($env_vars["APP_URL"]) { $env_vars["APP_URL"] } else { "https://localhost" }
}

# --- Build signature ---
$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
$payload   = "$Name`:$Score`:$timestamp"

$hmac      = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key  = [Text.Encoding]::UTF8.GetBytes($secret)
$sig       = ($hmac.ComputeHash([Text.Encoding]::UTF8.GetBytes($payload)) | ForEach-Object { $_.ToString("x2") }) -join ""

# --- Skip SSL validation (for self-signed certs) ---
add-type @"
    using System.Net;
    using System.Security.Cryptography.X509Certificates;
    public class TrustAll : ICertificatePolicy {
        public bool CheckValidationResult(ServicePoint sp, X509Certificate cert, WebRequest req, int problem) {
            return true;
        }
    }
"@
[System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAll

# --- Send request ---
$body = @{ name = $Name; score = $Score; timestamp = $timestamp; signature = $sig } | ConvertTo-Json

Write-Host ""
Write-Host "Submitting score..." -ForegroundColor Cyan
Write-Host "  URL:       $Url/api/leaderboard"
Write-Host "  Name:      $Name"
Write-Host "  Score:     $Score"
Write-Host "  Timestamp: $timestamp"
Write-Host "  Signature: $sig"
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$Url/api/leaderboard" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body

    Write-Host "Success!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json)
} catch {
    Write-Host "Failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host $reader.ReadToEnd()
    }
}