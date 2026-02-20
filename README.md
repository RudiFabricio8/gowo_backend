
***
## 2) `gowo-backend/README.md`

```md
# GoWo - Backend / API

Este repositorio contiene la **capa de Servicio (Backend/API)** del proyecto GoWo, construida con **Node.js**, **TypeScript** y **Zod**, siguiendo una arquitectura **SOA**.

## Tecnologías principales

- Node.js
- Express (o framework HTTP equivalente)
- TypeScript
- Zod (validación de esquemas)
- REST API con JSON

## Arquitectura

- API versión: **v1** (`/api/v1/...`).
- Puerto de desarrollo por defecto: **3001**.
- Se comunica con:
  - Frontend GoWo (a través de HTTP/HTTPS + JSON).
  - Base de datos GoWo (PostgreSQL) mediante variables de entorno (ej. `DATABASE_URL`).

Este backend **no** renderiza vistas, solo expone endpoints.

## Endpoints principales (propuestos)

- `POST /api/v1/auth/login`
- `GET /api/v1/workflows`
- `POST /api/v1/workflows`
- `PUT /api/v1/workflows/:id`
- `DELETE /api/v1/workflows/:id`

## Validación con Zod

- Todos los cuerpos de petición (`req.body`) y parámetros se validarán con **Zod**.
- El contrato de la API se documentará en el proyecto y se alineará con el frontend.

## Scripts iniciales (propuestos)

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo (ts-node / nodemon)
npm run dev

# Compilar a JS
npm run build

# Ejecutar build compilado
npm start
