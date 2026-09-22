$targetZip = "cobra-escape-backup-latest.zip"
if (Test-Path $targetZip) {
    Remove-Item -Force $targetZip
}

$items = Get-ChildItem -Path . | Where-Object { 
    $_.Name -ne "node_modules" -and 
    $_.Name -ne ".git" -and 
    $_.Name -ne ".gradle" -and 
    $_.Name -ne "dist" -and 
    $_.Name -ne "cobra-escape-backup-latest.zip" -and
    $_.Name -ne "cobra-escape-source.zip"
}

Write-Host "Archiving $($items.Count) root files and folders..."
Compress-Archive -Path $items.FullName -DestinationPath $targetZip -CompressionLevel Optimal
$size = (Get-Item $targetZip).Length / 1MB
Write-Host "Backup ZIP created successfully: $targetZip ($([math]::Round($size, 2)) MB)"
