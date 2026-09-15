$files = @("admin.js", "app.js")
foreach ($f in $files) {
    $path = $f
    if (-not (Test-Path $path)) { Write-Host "Skipping $f - not found"; continue }
    $content = Get-Content $path -Raw -Encoding UTF8

    $content = $content -replace 'background:\s*white\s*;', 'background:var(--white);'
    $content = $content -replace 'background:\s*white\s*"', 'background:var(--white)"'
    $content = $content -replace 'border:1px solid #eee', 'border:1px solid rgba(128,128,128,0.15)'
    $content = $content -replace 'border: 1px solid #eee', 'border:1px solid rgba(128,128,128,0.15)'
    $content = $content -replace 'border:1px solid #ddd', 'border:1px solid rgba(128,128,128,0.2)'
    $content = $content -replace 'border: 1px solid #ddd', 'border:1px solid rgba(128,128,128,0.2)'
    $content = $content -replace 'border-bottom:1px solid #eee', 'border-bottom:1px solid rgba(128,128,128,0.15)'
    $content = $content -replace 'border-bottom: 1px solid #eee', 'border-bottom:1px solid rgba(128,128,128,0.15)'
    $content = $content -replace 'color:#555;', 'color:var(--text-gray);'
    $content = $content -replace 'color: #555;', 'color:var(--text-gray);'
    $content = $content -replace 'color:#666;', 'color:var(--text-gray);'
    $content = $content -replace 'color: #666;', 'color:var(--text-gray);'
    $content = $content -replace 'color:#777;', 'color:var(--text-gray);'
    $content = $content -replace 'color: #777;', 'color:var(--text-gray);'
    $content = $content -replace 'color:#888;', 'color:var(--text-gray);'
    $content = $content -replace 'color: #888;', 'color:var(--text-gray);'
    $content = $content -replace 'color:#aaa;', 'color:var(--text-gray);'
    $content = $content -replace 'color: #aaa;', 'color:var(--text-gray);'
    $content = $content -replace 'background:#fafafa;', 'background:var(--bg-light);'
    $content = $content -replace 'background: #fafafa;', 'background:var(--bg-light);'
    $content = $content -replace 'background:#f5f5f5;', 'background:var(--bg-light);'
    $content = $content -replace 'background: #f5f5f5;', 'background:var(--bg-light);'
    $content = $content -replace 'background:#F9FAFB;', 'background:var(--bg-light);'
    $content = $content -replace 'background:#F4F7F9;', 'background:var(--bg-light);'
    $content = $content -replace 'background: #F4F7F9;', 'background:var(--bg-light);'
    $content = $content -replace 'border-left:2px solid #ddd', 'border-left:2px solid rgba(128,128,128,0.2)'
    $content = $content -replace 'border-top:1px solid #eee', 'border-top:1px solid rgba(128,128,128,0.15)'

    [System.IO.File]::WriteAllText((Resolve-Path $path).Path, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Done - $f updated"
}
