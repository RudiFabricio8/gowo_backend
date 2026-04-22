# GoWo — Backend API

Este es el motor de servicios de GoWo. Una API REST diseñada para conectar empresas con egresados, gestionando perfiles dinámicos e integración con la API de GitHub.

# Tech Stack
* **Runtime y Lenguaje:** Node.js 24 + TypeScript 5
* **Framework:** Express 5
* **Base de Datos:** PostgreSQL + Prisma ORM
* **Validación:** Zod (contratos de datos seguros)
* **Seguridad:** JWT (Access/Refresh tokens), bcrypt y Helmet para headers.

## Arquitectura y Flujo

El proyecto está organizado bajo una arquitectura de capas (SOA) para desacoplar la lógica de negocio del transporte de datos:

`Routes → Middlewares → Controllers → Services → Prisma`

* **Services:** Contienen la lógica de negocio pura e integraciones externas.
* **Schemas:** Definiciones de Zod para validación de contratos (body, params, query).
* **Utils:** Helpers para criptografía y manejo de tokens.
* **Config:** Singletons de base de datos y variables globales.

## Configuración Local

**Requisitos:** Node 18+ y acceso a una instancia de PostgreSQL (disponible en el repo gowo_infra vía Docker).

1. **Instalar dependencias:**
   ```bash
   npm install

2. **Variables de entorno:** Configurar archivo .env basado en .env.example.

3. **Persistencia:**
   npx prisma generate
   npx prisma db push

4. **Desarrollo:**
   npm run dev

El servidor estará disponible en http://localhost:3000.

Endpoints Principales
Auth (/api/v1/auth)
POST /register: Registro de egresado o empresa.

POST /login: Retorna access_token y refresh_token.

POST /refresh: Rotación de tokens de sesión.

Perfiles y GitHub (/api/v1/profiles | /api/v1/github)
GET /profiles: Listado con soporte para paginación y filtros.

POST /profiles: Upsert del perfil del usuario autenticado.

GET /github/:username/repos: Proxy hacia la API de GitHub (mantiene el token de servidor privado).

Solicitudes (/api/v1/requests)
Gestión de flujo de contacto entre empresas y egresados (pendiente, aceptada, rechazada).

Seguridad
Sesiones: Implementación de Access Tokens (15 min) y Refresh Tokens (7 días).

Validación: Validación estricta de inputs con Zod para prevenir datos malformados.

Headers: Integración de Helmet para mitigar ataques comunes de seguridad web.

CORS: Restringido por variables de entorno según el entorno de ejecución.

Roadmap
[ ] Cobertura de tests unitarios y de integración.

[ ] Implementación de Redis para caché de peticiones a GitHub.

[ ] Sistema de notificaciones por email.
