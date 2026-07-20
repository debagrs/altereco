$path = "observatorio.js"
$content = Get-Content $path -Raw -Encoding UTF8

$content = $content -replace 'background:white;', 'background:var(--white);'
$content = $content -replace 'background: white;', 'background:var(--white);'
$content = $content -replace 'border:1px solid #eee', 'border:1px solid rgba(128,128,128,0.15)'
$content = $content -replace 'border: 1px solid #eee', 'border:1px solid rgba(128,128,128,0.15)'
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
$content = $content -replace 'background:#F9F9FB;', 'background:var(--bg-light);'
$content = $content -replace 'background:#FAFAFA;', 'background:var(--bg-light);'
$content = $content -replace 'background:#f0f0f0;', 'background:var(--bg-gray);'
$content = $content -replace 'background: #f0f0f0;', 'background:var(--bg-gray);'
$content = $content -replace 'background:#fafafa;', 'background:var(--bg-light);'
$content = $content -replace 'border-bottom:1px solid #eee;', 'border-bottom:1px solid rgba(128,128,128,0.15);'

[System.IO.File]::WriteAllText((Resolve-Path $path).Path, $content, [System.Text.Encoding]::UTF8)
Write-Host "Done - observatorio.js updated"
