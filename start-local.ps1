$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $projectRoot "backend"
$frontendDir = Join-Path $projectRoot "frontend"
$venvPython = Join-Path $backendDir "venv\Scripts\python.exe"

if (-not (Test-Path $backendDir)) {
    throw "Backend directory not found: $backendDir"
}

if (-not (Test-Path $frontendDir)) {
    throw "Frontend directory not found: $frontendDir"
}

$backendCommand = $null

if (Test-Path $venvPython) {
    try {
        & $venvPython --version *> $null
        $backendCommand = "`"$venvPython`" manage.py runserver"
    } catch {
        Write-Warning "Existing backend virtualenv is not usable. Falling back to system Python."
    }
}

if (-not $backendCommand) {
    if (Get-Command python -ErrorAction SilentlyContinue) {
        $backendCommand = "python manage.py runserver"
    } elseif (Get-Command py -ErrorAction SilentlyContinue) {
        $backendCommand = "py manage.py runserver"
    } else {
        throw "No usable Python interpreter found. Recreate backend\\venv or install Python first."
    }
}

Start-Process powershell -WorkingDirectory $backendDir -ArgumentList "-NoExit", "-Command", $backendCommand
Start-Process powershell -WorkingDirectory $frontendDir -ArgumentList "-NoExit", "-Command", "npm run dev"
