function Generate-SecureIndexNowKey {
    param(
        [ValidateRange(8, 128)]
        [int]$Length = 64
    )
    
    $rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::new()
    $bytes = New-Object byte[] ($Length / 2)
    $rng.GetBytes($bytes)
    $key = -join ($bytes | ForEach-Object { "{0:X2}" -f $_ })
    return $key.Substring(0, $Length)
}

$publicDir = ".\public"
$keyConfigFile = ".\indexnow-key.config"  # Store key reference locally (DO NOT commit)

# Ensure public directory exists
if (-not (Test-Path $publicDir)) {
    New-Item -ItemType Directory -Path $publicDir -Force | Out-Null
    Write-Host "Created public directory"
}

# Check if key already exists
if (Test-Path $keyConfigFile) {
    $indexNowKey = Get-Content $keyConfigFile -Raw
    Write-Host "Using existing IndexNow Key: $indexNowKey"
} else {
    # Generate new key only on first run
    $Key = Generate-SecureIndexNowKey -Length 64
    $id = [Guid]::NewGuid().ToString().Substring(0, 6).ToUpper()
    $indexNowKey = "$Key$id"
    
    # Save key to config file (for local reference only)
    $indexNowKey | Out-File -FilePath $keyConfigFile -Encoding UTF8 -NoNewline
    Write-Host "Generated new IndexNow Key: $indexNowKey"
}

# Create or recreate the key file in public directory
$keyFileName = "$indexNowKey.txt"
$keyFilePath = Join-Path $publicDir $keyFileName

$indexNowKey | Out-File -FilePath $keyFilePath -Encoding UTF8 -NoNewline
Write-Host "Key file ready at: $keyFilePath"

# Display the file content for verification
Write-Host "`nFile content verification:"
Get-Content $keyFilePath

