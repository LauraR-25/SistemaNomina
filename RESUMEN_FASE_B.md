## Patrón encontrado (server/src)

- **Rutas** (`*.routes.js`): `Router()` + handlers del controlador, `export default router`; montadas en `routes/index.js` con `router.use(...)`.
- **Controladores** (`*.controller.js`): parsean/validan input, llaman servicio, responden `{ ok, data/message }`; errores a `next(err)`. Validación fallida: `400 { ok:false, message, errores }`.
- **Servicios** (`*.service.js`): consultas `pool.query(...)`, retornan rows/data; lógica de negocio/DB.
- **Validadores** (`*.validator.js`): devuelven `{ valido, errores, datos }`, normalizan snake/camel.
- **Errores**: `middlewares/error.middleware.js` centraliza; ahora mapea PG `23505 -> 409`, `23503 -> 400` con `mensajePublico`.
- **Auth/RBAC**: rutas existentes de catálogos/RRHH **no aplican** `verificarAutenticacion`/`requerirPerfil`; tampoco se envía `x-empresa-id` en server (cliente sí lo manda en `services/api.js`). **Mantuve la misma convención** (sin forzar auth/RBAC solo en nuevas rutas) y filtré por empresa usando `x-empresa-id` o `req.usuario?.empresa_id`.

## Archivos creados/modificados

- **Modificados server:** `server/src/middlewares/error.middleware.js`, `server/src/validators/catalogos-tenant.validator.js`, `server/src/services/catalogos-tenant.service.js`, `server/src/controllers/catalogos-tenant.controller.js`, `server/src/routes/catalogos-tenant.routes.js`
- **Modificados client:** `client/src/services/api.js` (agregué `patch`), `client/src/hooks/catalogos-tenant/useCatalogos.js` (sin cambio funcional requerido; se usa), `client/src/hooks/catalogos-tenant/useCuentasBancarias.js` (nuevo), `client/src/pages/catalogos-tenant/empresasPage.model.js`, `client/src/pages/catalogos-tenant/EmpresasPage.jsx`, `client/src/pages/catalogos-tenant/cuentasBancariasPage.model.js`, `client/src/pages/catalogos-tenant/CuentasBancariasPage.jsx`, `client/src/components/catalogos-tenant/CuentaBancariaForm/CuentaBancariaForm.jsx`, `client/src/components/catalogos-tenant/CuentaBancariaForm/cuentaBancariaForm.model.js`
- **Creados:** `client/src/hooks/catalogos-tenant/useCuentasBancarias.js`, `server/docs/pruebas-fase-b.md`
- **Sin tocar:** login/auth middleware/RBAC/rutas existentes, `pnpm-lock.yaml`, ErrorBoundary. Bancos quedó solo lectura. `.model.js` existentes conservan nombre/firma exportada.

## Endpoints nuevos

| Método | Ruta | Cuerpo ejemplo | Respuesta ejemplo |
|---|---|---|---|
| GET | `/api/catalogos/empresas/:id` | - | `{ "ok": true, "data": { "id":"<uuid>","pais_id":1,"rif":"J-123","razon_social":"Empresa","nombre_comercial":null,"moneda_codigo":"VES","activo":true } }` |
| PATCH | `/api/catalogos/empresas/:id` | `{ "razon_social":"Empresa Actualizada","nombre_comercial":"Comercial","moneda_codigo":"USD" }` | `{ "ok": true, "message":"Empresa actualizada.", "data": { ...empresa } }` |
| GET | `/api/catalogos/cuentas-bancarias` | - | `{ "ok": true, "data": [{ "id":"<uuid>","persona_id":"<uuid>","banco_id":1,"tipo_cuenta":"CORRIENTE","nro_cuenta":"0102...","es_principal":true,"activa":true,"banco_nombre":"Banco","banco_codigo":"0102","empresa_id":"<uuid>","titular":"Nombre Apellido" }] }` |
| GET | `/api/catalogos/cuentas-bancarias/:id` | - | `{ "ok": true, "data": { ...cuenta } }` |
| POST | `/api/catalogos/cuentas-bancarias` | `{ "persona_id":"<uuid>","banco_id":1,"tipo_cuenta":"CORRIENTE","nro_cuenta":"01020123456789012345","es_principal":true,"activa":true }` | `201 { "ok": true, "message":"Cuenta bancaria creada.", "data": { ...cuenta } }` |
| PATCH | `/api/catalogos/cuentas-bancarias/:id` | `{ "tipo_cuenta":"AHORRO","nro_cuenta":"01020987654321098765","activa":false }` | `{ "ok": true, "message":"Cuenta bancaria actualizada.", "data": { ...cuenta } }` |
| DELETE | `/api/catalogos/cuentas-bancarias/:id` | - | `{ "ok": true, "message":"Cuenta bancaria eliminada.", "data": { "id":"<uuid>" } }` |

## Verificación

- **Render smoke (SSR temporal, borrado):** `TablaCuentasBancarias` renderizó OK con datos snake_case/nulls; `TablaEmpresas` renderizó con datos de ejemplo (incluye `razon_social`, RIF formateado). Scripts temporales eliminados.
- **Lint client:** `pnpm lint` pasó con warnings preexistentes/no nuevos bloqueantes (context exports y 2 warnings previos en archivos tocados quedaron limpios; quedan warnings preexistentes en otros contextos).
- **Build client:** `pnpm build` OK.
- **Server syntax:** `node --check` OK en `error.middleware.js`, `catalogos-tenant.validator.js`, `catalogos-tenant.service.js`, `catalogos-tenant.controller.js`, `catalogos-tenant.routes.js`.
- **DB:** no se ejecutó nada contra base de datos.

## Decisiones y dudas

- **Auth/RBAC:** no aplicado en rutas nuevas porque las rutas existentes de catálogos no lo usan; lo reporto como se pidió. Si quieren opción CATALOGOS, hay que definir dónde se obtiene el usuario/perfiles en este esquema sin auth middleware activo.
- **Filtro empresa:** GET empresas devuelve solo la empresa de `x-empresa-id` (sesión). GET/CRUD cuentas filtra por `persona.empresa_id = x-empresa-id`; persona de otra empresa da `403`.
- **Empresas PUT/PATCH:** permití PATCH. Si hay dependencias (`persona/usuario/contrato`), se bloquea cambio de `pais_id` o `rif` con `409` y mensaje claro; otros campos editables.
- **Cuentas bancarias:** esquema no tiene `titular`; el campo UI se conserva pero no se persiste en DB. Eliminación: intento `DELETE`; si FK `23503`, respondo `409` claro (“en uso por otros registros”).
- **Validación:** obligatorios/formatos/enums en servidor; PG `23505->409`, `23503->400` con mensajes claros.
- **Pruebas manuales:** `server/docs/pruebas-fase-b.md` incluye curl con headers `x-usuario-id` y `x-empresa-id`.
