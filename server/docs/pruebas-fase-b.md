# Pruebas manuales Fase B (Catálogos y empresas)

## Convenciones usadas
- Base URL: `http://localhost:3000/api`
- Headers usados por el cliente actual: `x-usuario-id`, `x-empresa-id`
- No se ejecutó nada contra base de datos en esta entrega.

> Nota: las rutas existentes de `catalogos` no aplican autenticación/RBAC. Para mantener convención, las rutas nuevas tampoco fuerzan middleware; el filtrado por empresa usa `x-empresa-id` (o `req.usuario.empresa_id` si existiera).

## Comportamiento anterior sin header (reportado)
- Antes: `GET /api/catalogos/empresas` listaba empresas activas sin exigir `x-empresa-id`; con el servicio modificado podía devolver datos sin acotar correctamente a sesión.
- Antes: endpoints de cuentas bancarias no existían en esta forma; la regla nueva exige `x-empresa-id` y responde `400` claro si falta, nunca devuelve datos de todas las empresas.

## Empresas

### Listar empresas (filtrado por empresa de sesión)
```bash
curl -X GET "http://localhost:3000/api/catalogos/empresas" \
  -H "x-usuario-id: <UUID_USUARIO>" \
  -H "x-empresa-id: <UUID_EMPRESA>"
```
```powershell
$headers = @{
  "x-usuario-id" = "<UUID_USUARIO>"
  "x-empresa-id" = "<UUID_EMPRESA>"
}
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/catalogos/empresas" -Headers $headers
```
Respuesta esperada:
```json
{
  "ok": true,
  "data": [
    {
      "id": "<UUID_EMPRESA>",
      "pais_id": 1,
      "rif": "J-123456789-0",
      "razon_social": "Mi Empresa C.A.",
      "nombre_comercial": "Mi Empresa",
      "moneda_codigo": "VES",
      "activo": true
    }
  ]
}
```

### Obtener empresa
```bash
curl -X GET "http://localhost:3000/api/catalogos/empresas/<UUID_EMPRESA>" \
  -H "x-usuario-id: <UUID_USUARIO>" \
  -H "x-empresa-id: <UUID_EMPRESA>"
```
```powershell
$headers = @{
  "x-usuario-id" = "<UUID_USUARIO>"
  "x-empresa-id" = "<UUID_EMPRESA>"
}
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/catalogos/empresas/<UUID_EMPRESA>" -Headers $headers
```

### Crear empresa
```bash
curl -X POST "http://localhost:3000/api/catalogos/empresas" \
  -H "Content-Type: application/json" \
  -H "x-usuario-id: <UUID_USUARIO>" \
  -H "x-empresa-id: <UUID_EMPRESA>" \
  -d '{
    "pais_id": 1,
    "rif": "J-123456789-0",
    "razon_social": "Mi Empresa C.A.",
    "nombre_comercial": "Mi Empresa",
    "moneda_codigo": "VES"
  }'
```
```powershell
$headers = @{
  "x-usuario-id" = "<UUID_USUARIO>"
  "x-empresa-id" = "<UUID_EMPRESA>"
  "Content-Type" = "application/json"
}
$body = @{
  pais_id = 1
  rif = "J-123456789-0"
  razon_social = "Mi Empresa C.A."
  nombre_comercial = "Mi Empresa"
  moneda_codigo = "VES"
} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/catalogos/empresas" -Headers $headers -Body $body
```
Respuesta esperada 201:
```json
{
  "ok": true,
  "message": "Empresa creada.",
  "data": {
    "id": "<UUID>",
    "pais_id": 1,
    "rif": "J-123456789-0",
    "razon_social": "Mi Empresa C.A.",
    "nombre_comercial": "Mi Empresa",
    "moneda_codigo": "VES",
    "activo": true
  }
}
```

### Editar empresa
```bash
curl -X PATCH "http://localhost:3000/api/catalogos/empresas/<UUID_EMPRESA>" \
  -H "Content-Type: application/json" \
  -H "x-usuario-id: <UUID_USUARIO>" \
  -H "x-empresa-id: <UUID_EMPRESA>" \
  -d '{
    "razon_social": "Mi Empresa Actualizada C.A.",
    "nombre_comercial": "Mi Empresa Actualizada",
    "moneda_codigo": "USD"
  }'
```
```powershell
$headers = @{
  "x-usuario-id" = "<UUID_USUARIO>"
  "x-empresa-id" = "<UUID_EMPRESA>"
  "Content-Type" = "application/json"
}
$body = @{
  razon_social = "Mi Empresa Actualizada C.A."
  nombre_comercial = "Mi Empresa Actualizada"
  moneda_codigo = "USD"
} | ConvertTo-Json
Invoke-RestMethod -Method Patch -Uri "http://localhost:3000/api/catalogos/empresas/<UUID_EMPRESA>" -Headers $headers -Body $body
```
Respuesta esperada:
```json
{
  "ok": true,
  "message": "Empresa actualizada.",
  "data": { "...": "empresa actualizada" }
}
```

### Caso de validación empresa (409 por dependencia)
Si la empresa tiene personas/usuarios/contratos y se intenta cambiar `rif` o `pais_id`:
```json
{ "ok": false, "message": "No se puede cambiar el RIF de la empresa porque tiene datos dependientes." }
```

## Cuentas bancarias

### Listar cuentas bancarias (filtrado por empresa de la persona)
```bash
curl -X GET "http://localhost:3000/api/catalogos/cuentas-bancarias" \
  -H "x-usuario-id: <UUID_USUARIO>" \
  -H "x-empresa-id: <UUID_EMPRESA>"
```
```powershell
$headers = @{
  "x-usuario-id" = "<UUID_USUARIO>"
  "x-empresa-id" = "<UUID_EMPRESA>"
}
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/catalogos/cuentas-bancarias" -Headers $headers
```
Respuesta esperada:
```json
{
  "ok": true,
  "data": [
    {
      "id": "<UUID_CUENTA>",
      "persona_id": "<UUID_PERSONA>",
      "banco_id": 1,
      "tipo_cuenta": "CORRIENTE",
      "nro_cuenta": "01020123456789012345",
      "es_principal": true,
      "activa": true,
      "banco_nombre": "Banco de Venezuela",
      "banco_codigo": "0102",
      "empresa_id": "<UUID_EMPRESA>",
      "titular": "Nombre Apellido"
    }
  ]
}
```

### Obtener cuenta bancaria
```bash
curl -X GET "http://localhost:3000/api/catalogos/cuentas-bancarias/<UUID_CUENTA>" \
  -H "x-usuario-id: <UUID_USUARIO>" \
  -H "x-empresa-id: <UUID_EMPRESA>"
```
```powershell
$headers = @{
  "x-usuario-id" = "<UUID_USUARIO>"
  "x-empresa-id" = "<UUID_EMPRESA>"
}
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/catalogos/cuentas-bancarias/<UUID_CUENTA>" -Headers $headers
```

### Crear cuenta bancaria
```bash
curl -X POST "http://localhost:3000/api/catalogos/cuentas-bancarias" \
  -H "Content-Type: application/json" \
  -H "x-usuario-id: <UUID_USUARIO>" \
  -H "x-empresa-id: <UUID_EMPRESA>" \
  -d '{
    "persona_id": "<UUID_PERSONA_DE_LA_EMPRESA>",
    "banco_id": 1,
    "tipo_cuenta": "CORRIENTE",
    "nro_cuenta": "01020123456789012345",
    "es_principal": true,
    "activa": true
  }'
```
```powershell
$headers = @{
  "x-usuario-id" = "<UUID_USUARIO>"
  "x-empresa-id" = "<UUID_EMPRESA>"
  "Content-Type" = "application/json"
}
$body = @{
  persona_id = "<UUID_PERSONA_DE_LA_EMPRESA>"
  banco_id = 1
  tipo_cuenta = "CORRIENTE"
  nro_cuenta = "01020123456789012345"
  es_principal = $true
  activa = $true
} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/catalogos/cuentas-bancarias" -Headers $headers -Body $body
```
Respuesta esperada 201:
```json
{
  "ok": true,
  "message": "Cuenta bancaria creada.",
  "data": { "...": "cuenta creada con banco_nombre/titular" }
}
```

### Editar cuenta bancaria
```bash
curl -X PATCH "http://localhost:3000/api/catalogos/cuentas-bancarias/<UUID_CUENTA>" \
  -H "Content-Type: application/json" \
  -H "x-usuario-id: <UUID_USUARIO>" \
  -H "x-empresa-id: <UUID_EMPRESA>" \
  -d '{
    "tipo_cuenta": "AHORRO",
    "nro_cuenta": "01020987654321098765",
    "es_principal": false,
    "activa": true
  }'
```
```powershell
$headers = @{
  "x-usuario-id" = "<UUID_USUARIO>"
  "x-empresa-id" = "<UUID_EMPRESA>"
  "Content-Type" = "application/json"
}
$body = @{
  tipo_cuenta = "AHORRO"
  nro_cuenta = "01020987654321098765"
  es_principal = $false
  activa = $true
} | ConvertTo-Json
Invoke-RestMethod -Method Patch -Uri "http://localhost:3000/api/catalogos/cuentas-bancarias/<UUID_CUENTA>" -Headers $headers -Body $body
```

### Eliminar cuenta bancaria
```bash
curl -X DELETE "http://localhost:3000/api/catalogos/cuentas-bancarias/<UUID_CUENTA>" \
  -H "x-usuario-id: <UUID_USUARIO>" \
  -H "x-empresa-id: <UUID_EMPRESA>"
```
```powershell
$headers = @{
  "x-usuario-id" = "<UUID_USUARIO>"
  "x-empresa-id" = "<UUID_EMPRESA>"
}
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/api/catalogos/cuentas-bancarias/<UUID_CUENTA>" -Headers $headers
```
Respuesta esperada:
```json
{
  "ok": true,
  "message": "Cuenta bancaria eliminada.",
  "data": { "id": "<UUID_CUENTA>" }
}
```

### Casos de error esperados
- Validación 400: campos obligatorios, UUID inválido, tipo_cuenta no permitido, número > 30.
- FK inexistente 400: `persona_id` o `banco_id` no existe / mensaje claro.
- Persona de otra empresa 403: no se permite tocar cuenta fuera de la empresa de sesión.
- Duplicado/restricción única 409: manejado por error middleware con `mensajePublico` cuando aplique.
- Cuenta en uso 409 al eliminar: "No se puede eliminar la cuenta bancaria porque está en uso por otros registros."
