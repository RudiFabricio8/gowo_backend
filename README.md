# GoWo — Backend API

> Capa de servicio del proyecto GoWo. API REST construida con Node.js, Express 5, TypeScript, Prisma ORM y Zod. Implementa autenticación JWT, lógica de negocio real e integración con la API externa de GitHub.

---

## Índice

- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Instalación local](#instalación-local)
- [Variables de entorno](#variables-de-entorno)
- [Endpoints](#endpoints)
- [Pruebas de API](#pruebas-de-api)
- [Seguridad](#seguridad)
- [Decisiones técnicas](#decisiones-técnicas)

---

## Stack tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| Node.js | 24.x | Runtime |
| Express | 5.x | Framework HTTP |
| TypeScript | 5.x | Tipado estático |
| Prisma ORM | 6.x | Acceso a base de datos |
| Zod | 4.x | Validación de esquemas |
| bcrypt | 6.x | Hash de contraseñas |
| jsonwebtoken | 9.x | Autenticación JWT |
| helmet | 8.x | Headers de seguridad HTTP |

---

## Arquitectura

El backend sigue una arquitectura **SOA en capas**:

```
src/
├── routes/        → Define los endpoints y aplica middlewares
├── controllers/   → Maneja request/response HTTP, delega a servicios
├── services/      → Lógica de negocio pura (sin HTTP)
├── schemas/       → Validaciones Zod (contratos de entrada)
├── middlewares/   → requireAuth, validateResource
├── utils/         → jwt.ts (sign/verify), hash.ts (bcrypt)
└── config/        → prisma.ts (cliente singleton)
```

Flujo de una petición:
```
Request → Route → Middleware (auth + validate) → Controller → Service → Prisma → PostgreSQL
```

---

## Instalación local

**Prerequisitos:** Node.js 18+, Docker (para la base de datos)

```bash
# 1. Levantar la base de datos (desde el repo gowo_infra)
cd ../gowo_infra && docker compose up -d

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Generar el cliente Prisma y sincronizar el schema
npx prisma generate
npx prisma db push

# 5. Levantar en modo desarrollo
npm run dev
```

El servidor corre en `http://localhost:3000`.

### Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Desarrollo con hot-reload (nodemon) |
| `npm run build` | Compila TypeScript → `dist/` y genera Prisma Client |
| `npm start` | Producción: ejecuta `dist/index.js` |

---

## Variables de entorno

Copia `.env.example` a `.env` y configura:

```env
DATABASE_URL="postgresql://gowo_admin:password@localhost:5433/gowo_db?schema=public"
JWT_SECRET="string_largo_y_aleatorio_minimo_32_chars"
JWT_REFRESH_SECRET="otro_string_largo_y_aleatorio_diferente"
PORT=3000
CORS_ORIGIN="http://localhost:3002"
GITHUB_TOKEN=""
```

> `JWT_SECRET` y `JWT_REFRESH_SECRET` son obligatorios. El servidor lanza una excepción al iniciar si no están definidos.

---

## Endpoints

### Auth — `/api/v1/auth`

| Método | Ruta | Auth | Body | Descripción |
|---|---|---|---|---|
| POST | `/register` | No | `{ email, password, role }` | Registra usuario. Role: `egresado` \| `empresa` |
| POST | `/login` | No | `{ email, password }` | Login. Retorna `token` + `refreshToken` |
| POST | `/refresh` | No | `{ refresh_token }` | Renueva el access token |

### Perfiles — `/api/v1/profiles`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | No | Listar perfiles paginados (`?page=1&limit=10`) |
| GET | `/:id` | No | Obtener perfil por ID |
| POST | `/` | Sí (JWT) | Crear o actualizar perfil propio (upsert) |

Body del POST perfiles:
```json
{
  "nombre": "Juan Pérez",
  "experiencia_meses": 24,
  "github_username": "juanperez",
  "skills": ["React", "Node.js", "PostgreSQL"]
}
```

### Solicitudes — `/api/v1/requests`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/` | Sí (empresa) | Enviar solicitud de contacto a un egresado |
| GET | `/` | Sí | Ver mis solicitudes (enviadas si empresa, recibidas si egresado) |
| PATCH | `/:id` | Sí (egresado) | Aceptar o rechazar una solicitud recibida |

Body del POST requests:
```json
{
  "profileId": "uuid-del-perfil",
  "descripcion": "Nos interesa tu perfil para un proyecto de desarrollo web."
}
```

Body del PATCH requests:
```json
{ "estado": "aceptada" }
```
Estados posibles: `aceptada` | `rechazada`

### GitHub (API externa) — `/api/v1/github`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/:username/repos` | No | Repositorios públicos recientes del usuario en GitHub |

---

## Pruebas de API

### 1. Health check
```bash
curl http://localhost:3000/health
# {"status":"ok","db":"connected"}
```

### 2. Registrar un egresado
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"egresado@test.com","password":"123456","role":"egresado"}'
```

### 3. Login y obtener token
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"egresado@test.com","password":"123456"}'
# Guarda el "token" de la respuesta como TOKEN
```

### 4. Crear perfil (requiere token)
```bash
curl -X POST http://localhost:3000/api/v1/profiles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"nombre":"Juan Pérez","experiencia_meses":12,"github_username":"octocat","skills":["React","Node.js"]}'
```

### 5. Listar perfiles (público)
```bash
curl http://localhost:3000/api/v1/profiles?page=1&limit=5
```

### 6. Ver repos de GitHub de un egresado
```bash
curl http://localhost:3000/api/v1/github/octocat/repos
```

### 7. Registrar empresa y enviar solicitud
```bash
# Registrar empresa
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"empresa@test.com","password":"123456","role":"empresa"}'

# Login empresa
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"empresa@test.com","password":"123456"}'

# Enviar solicitud (reemplaza TOKEN_EMPRESA y PROFILE_ID)
curl -X POST http://localhost:3000/api/v1/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_EMPRESA" \
  -d '{"profileId":"PROFILE_ID","descripcion":"Nos interesa tu perfil para un proyecto."}'
```

---

## Seguridad

| Mecanismo | Implementación |
|---|---|
| Autenticación | JWT Bearer Token (access 15 min + refresh 7 días) |
| Contraseñas | Hash con bcrypt (salt rounds: 10) |
| Headers HTTP | `helmet` activo (CSP, X-Frame-Options, HSTS, etc.) |
| CORS | Restringido al origen configurado en `CORS_ORIGIN` |
| Validación de inputs | Zod en todos los endpoints (body, params, query) |
| Secrets | Variables de entorno obligatorias, sin fallbacks inseguros |

---

## Decisiones técnicas

- **Prisma sobre SQL puro:** Permite tipado fuerte end-to-end y migraciones controladas sin sacrificar flexibilidad.
- **Zod sobre express-validator:** Integración nativa con TypeScript, inferencia de tipos automática desde los schemas.
- **Access + Refresh token:** El access token de corta duración (15 min) minimiza el impacto de tokens robados; el refresh token permite sesiones largas sin re-login.
- **Upsert en perfiles:** Simplifica el flujo del egresado (un solo endpoint para crear y editar).
- **Proxy de GitHub API en backend:** El token de GitHub nunca se expone al cliente; el backend actúa como intermediario seguro.
