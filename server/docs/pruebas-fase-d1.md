# Pruebas manuales Fase D.1 (Conceptos y asignaciones)

## Convenciones usadas
- Base URL: `http://localhost:3000/api`
- Headers usados por el cliente actual: `x-usuario-id`, `x-empresa-id`
- No se ejecutó nada contra base de datos en esta entrega.
- Todas las respuestas usan `{ ok, data, message }`.
- Las rutas nuevas no fuerzan autenticación/RBAC; el filtrado por empresa usa `x-empresa-id`. Si falta, responde `400` con mensaje claro.

```powershell
$base='http://localhost:3000/api'
$h=@{
  'x-usuario-id'='00000000-0000-0000-0000-000000000001'
  'x-empresa-id'='00000000-0000-0000-0000-000000000002'
  'Content-Type'='application/json'
}
```

## Conceptos

### Listar conceptos
```powershell
Invoke-RestMethod -Method Get -Uri "$base/conceptos/conceptos" -Headers $h
```
```bash
curl.exe -X GET "http://localhost:3000/api/conceptos/conceptos" ^
  -H "x-usuario-id: 00000000-0000-0000-0000-000000000001" ^
  -H "x-empresa-id: 00000000-0000-0000-0000-000000000002"
```
Respuesta esperada:
```json
{
  "ok": true,
  "data": [
    {
      "id": "<UUID_CONCEPTO>",
      "empresa_id": "<UUID_EMPRESA>",
      "codigo": "BONO_PROD",
      "nombre": "Bono de productividad",
      "tipo_concepto": "ASIGNACION",
      "categoria": "BONO",
      "naturaleza": "CREDITO",
      "unidad": "MONTO",
      "es_fijo": false,
      "es_imponible": true,
      "activo": true,
      "created_at": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

### Crear concepto
```powershell
$body=@{
  codigo='BONO_PROD'
  nombre='Bono de productividad'
  tipo_concepto='ASIGNACION'
  categoria='BONO'
  es_fijo=$false
  es_imponible=$true
  activo=$true
} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "$base/conceptos/conceptos" -Headers $h -Body $body
```
```bash
curl.exe -X POST "http://localhost:3000/api/conceptos/conceptos" ^
  -H "Content-Type: application/json" ^
  -H "x-usuario-id: 00000000-0000-0000-0000-000000000001" ^
  -H "x-empresa-id: 00000000-0000-0000-0000-000000000002" ^
  -d "{\"codigo\":\"BONO_PROD\",\"nombre\":\"Bono de productividad\",\"tipo_concepto\":\"ASIGNACION\",\"categoria\":\"BONO\",\"es_fijo\":false,\"es_imponible\":true,\"activo\":true}"
```
Respuesta esperada 201:
```json
{
  "ok": true,
  "message": "Concepto creado.",
  "data": { "id": "<UUID_CONCEPTO>", "codigo": "BONO_PROD", "naturaleza": "CREDITO" }
}
```
Si se omite `naturaleza`, se deriva de `tipo_concepto`: `ASIGNACION → CREDITO`; `DEDUCCION`/`APORTE_PATRONAL → DEBITO`.

### Obtener concepto
```powershell
Invoke-RestMethod -Method Get -Uri "$base/conceptos/conceptos/<UUID_CONCEPTO>" -Headers $h
```
```bash
curl.exe -X GET "http://localhost:3000/api/conceptos/conceptos/<UUID_CONCEPTO>" ^
  -H "x-empresa-id: 00000000-0000-0000-0000-000000000002"
```

### Actualizar concepto
```powershell
$body=@{ nombre='Bono de productividad mensual'; es_imponible=$true } | ConvertTo-Json
Invoke-RestMethod -Method Patch -Uri "$base/conceptos/conceptos/<UUID_CONCEPTO>" -Headers $h -Body $body
```
```bash
curl.exe -X PATCH "http://localhost:3000/api/conceptos/conceptos/<UUID_CONCEPTO>" ^
  -H "Content-Type: application/json" ^
  -H "x-empresa-id: 00000000-0000-0000-0000-000000000002" ^
  -d "{\"nombre\":\"Bono de productividad mensual\",\"es_imponible\":true}"
```
Campos editables cuando el concepto está en uso: `nombre`, `es_fijo`, `es_imponible`, `activo`.

### Desactivar concepto
```powershell
Invoke-RestMethod -Method Patch -Uri "$base/conceptos/conceptos/<UUID_CONCEPTO>/desactivar" -Headers $h
```
```bash
curl.exe -X PATCH "http://localhost:3000/api/conceptos/conceptos/<UUID_CONCEPTO>/desactivar" ^
  -H "x-empresa-id: 00000000-0000-0000-0000-000000000002"
```

### Eliminar concepto
```powershell
Invoke-RestMethod -Method Delete -Uri "$base/conceptos/conceptos/<UUID_CONCEPTO>" -Headers $h
```
```bash
curl.exe -X DELETE "http://localhost:3000/api/conceptos/conceptos/<UUID_CONCEPTO>" ^
  -H "x-empresa-id: 00000000-0000-0000-0000-000000000002"
```
Solo procede si no está en uso. Para conceptos `LEY` o `SALARIO_BASE`, responde `409`; use desactivar.

## Asignaciones de conceptos a contratos

### Listar asignaciones de un contrato
```powershell
Invoke-RestMethod -Method Get -Uri "$base/conceptos/asignaciones?contrato_id=<UUID_CONTRATO>" -Headers $h
```
```bash
curl.exe -X GET "http://localhost:3000/api/conceptos/asignaciones?contrato_id=<UUID_CONTRATO>" ^
  -H "x-empresa-id: 00000000-0000-0000-0000-000000000002"
```
Respuesta esperada:
```json
{
  "ok": true,
  "data": [
    {
      "id": "<UUID_ASIGNACION>",
      "contrato_id": "<UUID_CONTRATO>",
      "concepto_id": "<UUID_CONCEPTO>",
      "tipo_valor": "PORCENTAJE_SALDO",
      "valor": 10,
      "fecha_inicio": "2026-01-01",
      "fecha_fin": null,
      "activo": true,
      "concepto": {
        "id": "<UUID_CONCEPTO>",
        "codigo": "BONO_PROD",
        "nombre": "Bono de productividad",
        "unidad": "MONTO"
      }
    }
  ]
}
```

### Crear asignación
```powershell
$body=@{
  contrato_id='<UUID_CONTRATO>'
  concepto_id='<UUID_CONCEPTO>'
  tipo_valor='PORCENTAJE_SALDO'
  valor=10
  fecha_inicio='2026-01-01'
  activo=$true
} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "$base/conceptos/asignaciones" -Headers $h -Body $body
```
```bash
curl.exe -X POST "http://localhost:3000/api/conceptos/asignaciones" ^
  -H "Content-Type: application/json" ^
  -H "x-empresa-id: 00000000-0000-0000-0000-000000000002" ^
  -d "{\"contrato_id\":\"<UUID_CONTRATO>\",\"concepto_id\":\"<UUID_CONCEPTO>\",\"tipo_valor\":\"PORCENTAJE_SALDO\",\"valor\":10,\"fecha_inicio\":\"2026-01-01\",\"activo\":true}"
```

### Obtener asignación
```powershell
Invoke-RestMethod -Method Get -Uri "$base/conceptos/asignaciones/<UUID_ASIGNACION>" -Headers $h
```
```bash
curl.exe -X GET "http://localhost:3000/api/conceptos/asignaciones/<UUID_ASIGNACION>" ^
  -H "x-empresa-id: 00000000-0000-0000-0000-000000000002"
```

### Editar asignación
```powershell
$body=@{
  tipo_valor='MONTO_FIJO'
  valor=250
  fecha_inicio='2026-02-01'
  fecha_fin='2026-12-31'
  activo=$true
} | ConvertTo-Json
Invoke-RestMethod -Method Patch -Uri "$base/conceptos/asignaciones/<UUID_ASIGNACION>" -Headers $h -Body $body
```
```bash
curl.exe -X PATCH "http://localhost:3000/api/conceptos/asignaciones/<UUID_ASIGNACION>" ^
  -H "Content-Type: application/json" ^
  -H "x-empresa-id: 00000000-0000-0000-0000-000000000002" ^
  -d "{\"tipo_valor\":\"MONTO_FIJO\",\"valor\":250,\"fecha_inicio\":\"2026-02-01\",\"fecha_fin\":\"2026-12-31\",\"activo\":true}"
```

### Terminar asignación
```powershell
$body=@{ fecha_fin='2026-06-30' } | ConvertTo-Json
Invoke-RestMethod -Method Patch -Uri "$base/conceptos/asignaciones/<UUID_ASIGNACION>/terminar" -Headers $h -Body $body
```
```bash
curl.exe -X PATCH "http://localhost:3000/api/conceptos/asignaciones/<UUID_ASIGNACION>/terminar" ^
  -H "Content-Type: application/json" ^
  -H "x-empresa-id: 00000000-0000-0000-0000-000000000002" ^
  -d "{\"fecha_fin\":\"2026-06-30\"}"
```
Si se omite `fecha_fin`, se usa la fecha actual; la asignación queda `activo=false`.

### Eliminar asignación
```powershell
Invoke-RestMethod -Method Delete -Uri "$base/conceptos/asignaciones/<UUID_ASIGNACION>" -Headers $h
```
```bash
curl.exe -X DELETE "http://localhost:3000/api/conceptos/asignaciones/<UUID_ASIGNACION>" ^
  -H "x-empresa-id: 00000000-0000-0000-0000-000000000002"
```
Si ya tiene detalles de prenómina o recibo, responde `409`; use terminar con `fecha_fin` o `activo=false`.

## Casos de error esperados

### Sin `x-empresa-id` → 400
```powershell
try {
  Invoke-RestMethod -Method Get -Uri "$base/conceptos/conceptos" -Headers @{ 'Content-Type'='application/json' }
} catch { $_.ErrorDetails.Message }
```
Respuesta esperada:
```json
{ "ok": false, "message": "Debes indicar la empresa de la sesión (x-empresa-id)." }
```

### Cambiar `tipo_concepto` de un concepto en uso → 409
```powershell
$body=@{ tipo_concepto='DEDUCCION' } | ConvertTo-Json
try {
  Invoke-RestMethod -Method Patch -Uri "$base/conceptos/conceptos/<UUID_CONCEPTO_EN_USO>" -Headers $h -Body $body
} catch { $_.ErrorDetails.Message }
```
Respuesta esperada:
```json
{
  "ok": false,
  "message": "El concepto está en uso (concepto_persona, novedad, prestamo, tipo_aporte_ley, detalle_prenomina, detalle_recibo). No se puede cambiar tipo_concepto; solo puedes modificar nombre, es_fijo, es_imponible o activo. Si ya no lo necesitas, desactívalo."
}
```

### Asignación con fechas solapadas → 409
```powershell
$body=@{
  contrato_id='<UUID_CONTRATO>'
  concepto_id='<UUID_CONCEPTO>'
  tipo_valor='MONTO_FIJO'
  valor=100
  fecha_inicio='2026-01-15'
  activo=$true
} | ConvertTo-Json
try {
  Invoke-RestMethod -Method Post -Uri "$base/conceptos/asignaciones" -Headers $h -Body $body
} catch { $_.ErrorDetails.Message }
```
Respuesta esperada:
```json
{
  "ok": false,
  "message": "Ya existe una asignación activa del mismo concepto para este contrato con fechas solapadas."
}
```

### Porcentaje mayor a 100 → 400
```powershell
$body=@{
  contrato_id='<UUID_CONTRATO>'
  concepto_id='<UUID_CONCEPTO>'
  tipo_valor='PORCENTAJE_SALDO'
  valor=120
  fecha_inicio='2026-03-01'
  activo=$true
} | ConvertTo-Json
try {
  Invoke-RestMethod -Method Post -Uri "$base/conceptos/asignaciones" -Headers $h -Body $body
} catch { $_.ErrorDetails.Message }
```
Respuesta esperada:
```json
{ "ok": false, "message": "El porcentaje no puede ser mayor a 100." }
```

### Eliminar concepto de ley → 409
```powershell
try {
  Invoke-RestMethod -Method Delete -Uri "$base/conceptos/conceptos/<UUID_CONCEPTO_LEY>" -Headers $h
} catch { $_.ErrorDetails.Message }
```
Respuesta esperada:
```json
{
  "ok": false,
  "message": "Los conceptos de categoría LEY o SALARIO_BASE son de sistema y no se pueden eliminar; solo se pueden desactivar."
}
```
