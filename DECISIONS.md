# Decisiones Técnicas

## Librerías elegidas

**PostgreSQL sobre un ORM**
Elegí PostgreSQL en lugar de Prisma o TypeORM para demostrar manejo consciente de seguridad, con un ORM es fácil escribir queries sin entender si son seguras o no

**Express-Validator**
Se integra naturalmente como middleware de Express, con express-validator el pipeline queda más limpio: [validationRules, validate, controller].

**bcryptjs sobre bcrypt**
Más fácil de instalar en cualquier entorno sin necesidad de compiladores.

**Docker Compose para la DB**
Con un solo docker-compose up -d cualquier evaluador puede correr el proyecto.

---

## Arquitectura

La separación en 4 capas sigue el principio de responsabilidad única:

- **Routes** → Path, método HTTP y middlewares
- **Controllers** → Reciben request, llaman al service, retornan response
- **Services** → lógica de negocio
- **Repositories** → Unico punto de acceso a la DB

---

## Desafíos

**TypeScript con AuthRequest**
Para extender Request de Express con el campo user del JWT, fue necesario
crear una interfaz AuthRequest extends Request, ya que esto obliga a usar req as any
en las rutas.

**Debounce en la búsqueda**
Implementé debounce manual con setTimeout y clearTimeout en lugar de una
librería externa  para no agregar dependencias innecesarias.
---

## ¿Qué mejoraría con más tiempo?

1. **Refresh tokens** con rotación en lugar de un JWT de larga duración
2. **Rate limiting** en endpoints de auth contra brute force
3. **Tests de integración** con una DB de test real usando supertest
4. **Actualización de email** con verificación por correo

---

## ¿Cómo escalaría esta solución?

Stateless por diseño: JWT permite correr múltiples instancias detrás de un
load balancer sin sesiones compartidas.

Búsqueda: Con millones de usuarios se reemplazaría ILIKE por búsqueda
full-text de PostgreSQL o un servicio dedicado como Elasticsearch.

Cache: Redis para cachear perfiles y reducir queries repetitivas a la DB.

Separación de servicios:La capa de autenticación podría extraerse a un
microservicio dedicado si el sistema crece a múltiples APIs.