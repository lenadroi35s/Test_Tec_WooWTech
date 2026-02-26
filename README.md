## BACKEND

 - Creacion de Usuario admin 
    # 🔐 Generación del password hasheado
     El password fue hasheado utilizando **bcryptjs**.
     El hash fue generado ejecutando el siguiente comando desde la raíz del backend:

     ------------------------------------------------------------------------
     | node -e "require('bcryptjs').hash('Admin1234!', 12).then(console.log)" |
     ------------------------------------------------------------------------
 
     🖇️ Copiar el hash generado por consola 🖇️ 
    ## Insertar el usuario admin a la base de datos
 
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
 
    # Crendeciales de prueba 
 
     Email: admin@test.com
     Password: Admin1234!
     Rol: admin
 
 
 