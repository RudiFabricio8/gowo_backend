# GoWo — Backend API

Capa de servicio del proyecto GoWo. API REST construida con **Node.js**, **Express 5**, **TypeScript**, **Prisma ORM** y **Zod**.

## Stack

- Node.js + Express 5
- TypeScript
- Prisma ORM (PostgreSQL)
- Zod (validación de esquemas)
- JWT (access 15m + refresh 7d)
- bcrypt (hash de contraseñas)
- helmet (headers de seguridad HTTP)

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores:

```env
DATABASE_URL="postgresql://user:pass@localhost:5433/gowo_db?schema=public"
JWT_SECRET="secret_muy_largo_y_seguro"
JWT_REFRESH_SECRET="refresh_secret_muy_largo_y_seguro"
PORT=3000
CORS_ORIGIN="http://localhost:3001"
GITHUB_TOKEN=""
```

## Instalación y ejecución

```bash
npm install
npm run dev
```

## Endpoints

### Auth — `/api/v1/auth`
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/register` | Registro de usuario |
| POST | `/login` | Login, retorna access + refresh token |
| POST | `/refresh` | Renueva el access token |

### Perfiles — `/api/v1/profiles`
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | No | Listar perfiles (paginado) |
| GET | `/:id` | No | Obtener perfil por ID |
| POST | `/` | Sí | Crear o actualizar perfil propio |

### Solicitudes — `/api/v1/requests`
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/` | Sí (empresa) | Enviar solicitud a un perfil |
| GET | `/` | Sí | Ver mis solicitudes (enviadas o recibidas) |
| PATCH | `/:id` | Sí (egresado) | Aceptar o rechazar una solicitud |

### GitHub — `/api/v1/github`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/:username/repos` | Repositorios públicos del usuario en GitHub |

## Arquitectura

```
src/
├── controllers/   # Manejo de request/response HTTP
├── services/      # Lógica de negocio
├── routes/        # Definición de rutas
├── middlewares/   # requireAuth, validateResource
├── schemas/       # Validaciones Zod
├── utils/         # jwt.ts, hash.ts
└── config/        # prisma.ts
```
