# Auto-sync script: automatically detects changes, commits, and pushes to GitHub
param (
    [int]$IntervalSeconds = 60
)

Write-Host "Starting Git Auto-Sync (monitoring every $IntervalSeconds seconds)..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop." -ForegroundColor Yellow

while ($true) {
    $status = git status --porcelain
    if ($status) {
        $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        Write-Host "[$timestamp] Changes detected! Staging and committing..." -ForegroundColor Green
        git add -A
        git commit -m "auto-save: $timestamp"
        Write-Host "[$timestamp] Pushing to GitHub..." -ForegroundColor Cyan
        git push origin main
        Write-Host "[$timestamp] Pushed successfully!" -ForegroundColor Green
    }
    Start-Sleep -Seconds $IntervalSeconds
}
