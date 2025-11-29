# Script para solucionar errores del WebFrontend Angular
# Ejecutar con: .\fix-errors.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Solucionando Errores de WebFrontend  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json" -ForegroundColor Red
    Write-Host "   Asegúrate de ejecutar este script desde el directorio WebFrontend" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Directorio correcto detectado" -ForegroundColor Green
Write-Host ""

# Paso 1: Verificar Node.js y npm
Write-Host "📋 Paso 1: Verificando versiones..." -ForegroundColor Cyan
$nodeVersion = node --version
$npmVersion = npm --version

Write-Host "   Node.js: $nodeVersion" -ForegroundColor White
Write-Host "   npm: $npmVersion" -ForegroundColor White
Write-Host ""

# Paso 2: Limpiar instalación anterior (opcional)
Write-Host "📋 Paso 2: ¿Deseas limpiar node_modules? (Recomendado si hay errores persistentes)" -ForegroundColor Cyan
$clean = Read-Host "   Limpiar? (s/n)"

if ($clean -eq "s" -or $clean -eq "S") {
    Write-Host "   🗑️  Eliminando node_modules..." -ForegroundColor Yellow
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force node_modules
        Write-Host "   ✓ node_modules eliminado" -ForegroundColor Green
    }
    
    Write-Host "   🗑️  Eliminando package-lock.json..." -ForegroundColor Yellow
    if (Test-Path "package-lock.json") {
        Remove-Item -Force package-lock.json
        Write-Host "   ✓ package-lock.json eliminado" -ForegroundColor Green
    }
    
    Write-Host "   🗑️  Eliminando caché de Angular..." -ForegroundColor Yellow
    if (Test-Path ".angular") {
        Remove-Item -Recurse -Force .angular
        Write-Host "   ✓ Caché de Angular eliminado" -ForegroundColor Green
    }
    
    Write-Host "   🗑️  Limpiando caché de npm..." -ForegroundColor Yellow
    npm cache clean --force
    Write-Host "   ✓ Caché de npm limpiado" -ForegroundColor Green
} else {
    Write-Host "   ⏭️  Saltando limpieza" -ForegroundColor Yellow
}
Write-Host ""

# Paso 3: Instalar dependencias
Write-Host "📋 Paso 3: Instalando dependencias..." -ForegroundColor Cyan
Write-Host "   ⏳ Esto puede tomar varios minutos..." -ForegroundColor Yellow
Write-Host ""

npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "   ✓ Dependencias instaladas correctamente" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "   ❌ Error al instalar dependencias" -ForegroundColor Red
    Write-Host "   Revisa los mensajes de error arriba" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Paso 4: Verificar dependencias críticas
Write-Host "📋 Paso 4: Verificando dependencias críticas..." -ForegroundColor Cyan

$dependencies = @(
    "@angular/animations",
    "@stomp/stompjs",
    "sockjs-client"
)

$allInstalled = $true

foreach ($dep in $dependencies) {
    $result = npm list $dep 2>&1
    if ($result -match $dep) {
        Write-Host "   ✓ $dep instalado" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $dep NO instalado" -ForegroundColor Red
        $allInstalled = $false
    }
}
Write-Host ""

if (-not $allInstalled) {
    Write-Host "⚠️  Algunas dependencias no se instalaron correctamente" -ForegroundColor Yellow
    Write-Host "   Intenta ejecutar: npm install --force" -ForegroundColor Yellow
    Write-Host ""
}

# Paso 5: Resumen
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Resumen                              " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($allInstalled) {
    Write-Host "✅ Todos los errores críticos deberían estar solucionados" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos pasos:" -ForegroundColor Cyan
    Write-Host "  1. Ejecuta: npm start" -ForegroundColor White
    Write-Host "  2. La aplicación debería compilar sin errores críticos" -ForegroundColor White
    Write-Host "  3. Pueden aparecer warnings (⚠️) pero no afectan la funcionalidad" -ForegroundColor White
    Write-Host ""
    Write-Host "Para más información, consulta: FIX_ERRORS.md" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  Algunos problemas persisten" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Intenta:" -ForegroundColor Cyan
    Write-Host "  1. npm install --force" -ForegroundColor White
    Write-Host "  2. Reinicia tu terminal" -ForegroundColor White
    Write-Host "  3. Ejecuta este script nuevamente con limpieza completa" -ForegroundColor White
    Write-Host ""
    Write-Host "Para más información, consulta: FIX_ERRORS.md" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
