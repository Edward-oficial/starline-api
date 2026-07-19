# Starline API

API de descargas con login, registro, dashboard y panel de admin. Mongo va directo en `src/config/db.js`, no hay que configurar nada al desplegar.

## Estructura

```
starline-api/
├── index.js                     # servidor + sesiones
├── public/
│   ├── index.html                # bienvenida
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html            # API key, cuota, probador de endpoints
│   ├── profile.html              # foto de perfil
│   ├── admin.html                # panel admin
│   ├── css/style.css
│   ├── js/common.js
├── src/
│   ├── config/db.js               # conexión a Mongo (URI hardcodeada aquí)
│   ├── models/User.js
│   ├── middleware/auth.js         # x-api-key + cuota semanal (endpoints /api/*)
│   ├── middleware/session.js      # requireLogin / requireAdmin (páginas)
│   ├── routes/
│   │   ├── index.js               # monta /api/youtube bajo auth de api key
│   │   ├── authRoutes.js          # /auth/register /auth/login /auth/logout /auth/me
│   │   ├── profileRoutes.js       # /profile/picture
│   │   ├── admin.js               # /admin/users (listar, dar solicitudes, bloquear, eliminar)
│   │   ├── youtube.js
│   ├── controllers/youtubeController.js
│   ├── utils/apiKey.js, seedAdmin.js
```

## Cuenta admin por defecto

Se crea sola al arrancar el servidor (si no existe):

- Correo: `cololacalempira5@gmail.com`
- Contraseña: `Edward`
- Solicitudes ilimitadas.

## Cómo funciona la cuota

Cada usuario nuevo empieza con **300 solicitudes por semana**. Se descuentan al llamar cualquier endpoint bajo `/api/*` con su `x-api-key`. Pasado el límite, la API responde 429 hasta que se cumplan 7 días desde el último reinicio (o hasta que el admin le agregue más desde el panel).

## Setup local

```bash
npm install
npm run dev
```

No hace falta `.env`, todo está en el código.

## Deploy en Render

1. Sube el proyecto a GitHub.
2. Render → **New > Web Service** → conecta el repo (usa `render.yaml`).
3. Build: `npm install` — Start: `npm start`.
4. Listo. `/` es la bienvenida, `/dashboard.html` el panel de usuario, `/admin.html` el panel admin.

## Endpoint incluido

`GET /api/youtube/search?q=texto` — requiere header `x-api-key`. Se puede probar directo desde el dashboard, con botones para copiar el JSON de respuesta y el link listo para usar.

## Agregar más endpoints

Crea el controller en `src/controllers/`, la ruta en `src/routes/`, y móntala en `src/routes/index.js` bajo `apiKeyAuth`, igual que `youtube.js`. Se descuenta automático de la cuota semanal de quien la use.