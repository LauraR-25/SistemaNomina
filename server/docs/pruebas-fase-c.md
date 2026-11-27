$base='http://localhost:3000/api'; $h=@{'x-empresa-id'='00000000-0000-0000-0000-000000000001'; 'Content-Type'='application/json'}
# 1) Cargos
Invoke-RestMethod -Method Get -Uri "$base/rrhh/cargos" -Headers $h
# Crear cargo
$cargo = Invoke-RestMethod -Method Post -Uri "$base/rrhh/cargos" -Headers $h -Body (@{nombre='Analista QA'; descripcion='Pruebas'; activo=$true} | ConvertTo-Json)
# 2) Persona
$persona = Invoke-RestMethod -Method Post -Uri "$base/rrhh/personas" -Headers $h -Body (@{cedula='V-123'; primer_nombre='Ana'; primer_apellido='PÃ©rez'; estado='ACTIVO'} | ConvertTo-Json)
# 3) Contrato + salario inicial
$contrato = Invoke-RestMethod -Method Post -Uri "$base/rrhh/contratos" -Headers $h -Body (@{persona_id=$persona.data.id; cargo_id=$cargo.data.id; fecha_inicio='2026-01-01'; tipo_pago='SALARIO_FIJO'; frecuencia_pago='MENSUAL'; horas_semanales=40; estado='VIGENTE'; salario_base=1000} | ConvertTo-Json)
# 4) Cambio salarial
Invoke-RestMethod -Method Post -Uri "$base/rrhh/rrhh/contratos/$($contrato.data.id)/salarios" -Headers $h -Body (@{monto=1200; vigente_desde='2026-02-01'; motivo='Ajuste'} | ConvertTo-Json)
# Error: contrato solapado
try { Invoke-RestMethod -Method Post -Uri "$base/rrhh/contratos" -Headers $h -Body (@{persona_id=$persona.data.id; cargo_id=$cargo.data.id; fecha_inicio='2026-01-15'; tipo_pago='SALARIO_FIJO'; frecuencia_pago='MENSUAL'; estado='VIGENTE'; salario_base=900} | ConvertTo-Json) } catch { $_.ErrorDetails.Message }
# Error: cambio salarial fecha anterior
try { Invoke-RestMethod -Method Post -Uri "$base/rrhh/rrhh/contratos/$($contrato.data.id)/salarios" -Headers $h -Body (@{monto=1100; vigente_desde='2025-12-01'; motivo='InvÃ¡lido'} | ConvertTo-Json) } catch { $_.ErrorDetails.Message }
# Error: eliminar cargo en uso
try { Invoke-RestMethod -Method Delete -Uri "$base/rrhh/cargos/$($cargo.data.id)" -Headers $h } catch { $_.ErrorDetails.Message }
# Error: eliminar persona con contratos
try { Invoke-RestMethod -Method Delete -Uri "$base/rrhh/personas/$($persona.data.id)" -Headers $h } catch { $_.ErrorDetails.Message }



