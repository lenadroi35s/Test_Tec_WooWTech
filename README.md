# WooW Technology — Prueba Técnica

API REST de gestión de usuarios con autenticación JWT y frontend en React.

## Prerrequisitos

- Node.js >= 18
- npm >= 9
- Docker y Docker Compose

## Instalación

### Clona el repositorio

    git clone
    -
    cd woow-tech

### Levanta la base de datos

cd backend

- docker-compose up -d

---

Esto levanta PostgreSQL y ejecuta automáticamente database/schema.sql,
creando la tabla users por defecto.

---

### Configura el backend

.env.example .env

# El .env.example ya tiene los valores correctos para Docker

npm install

- npm run dev

# Creacion de Usuario admin

    - 🔐 Generación del password hasheado
     El password fue hasheado utilizando **bcryptjs**.
     El hash fue generado ejecutando el siguiente comando desde la raíz del backend:

     ------------------------------------------------------------------------
     | node -e "require('bcryptjs').hash('Admin1234!', 12).then(console.log)" |
     ------------------------------------------------------------------------

     🖇️ Copiar el hash generado por consola 🖇️
    - Insertar el usuario admin a la base de datos

     ⚠️⚠️Tiene que estar primero levantado el contenedor ⚠️⚠️

     - Ingresar al contenedor
     -------------------------------------------------------------
     | docker exec -it woow_postgres psql -U postgres -d woow_db |
     -------------------------------------------------------------

     - Insertar al usuario

     -------------------------------------------------------------
      INSERT INTO users (name, email, password, role)
      VALUES (
        'Admin',
        'admin@test.com',
        'HASH_GENERADO_AQUI',
        'admin'
      )
      ON CONFLICT (email) DO NOTHING;
     -------------------------------------------------------------

### Configura el frontend

cd ../frontend
npm install
npm start

## Credenciales de prueba admin

| Rol   | Email          | Contraseña |
| ----- | -------------- | ---------- |
| Admin | admin@woow.com | Admin1234! |

---

### Autenticación

| Método | Endpoint           | Descripción          | Auth |
| ------ | ------------------ | -------------------- | ---- |
| POST   | /api/auth/register | Registrar usuario    | No   |
| POST   | /api/auth/login    | Login → devuelve JWT | No   |

### Usuarios

| Método | Endpoint      | Descripción                         | Auth  |
| ------ | ------------- | ----------------------------------- | ----- |
| GET    | /api/users/me | Perfil del usuario autenticado      | JWT   |
| PUT    | /api/users/me | Actualizar nombre                   | JWT   |
| GET    | /api/users    | Listar usuarios (paginado+búsqueda) | Admin |

#### Ejemplos

 # Registro
 curl POST http://localhost:3001/api/auth/register
   -Body :'{"name":"Juan Pérez","email":"juan@test.com","password":"12345678"}'
 
 # Login
 curl POST http://localhost:3001/api/auth/login \
   -Body :'{"email":"juan@test.com","password":"12345678"}'

 # Perfil
 curl http://localhost:3001/api/users/me \
   "Authorization: Bearer TOKEN"
 
 # Listar usuarios con búsqueda y paginación (admin)
 curl "http://localhost:3001/api/users?search=juan&page=1&limit=10" \
   "Authorization: Bearer ADMIN_TOKEN"

## Tests
cd backend
-
npm test
