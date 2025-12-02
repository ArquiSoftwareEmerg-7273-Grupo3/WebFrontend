-- Script para actualizar la suscripción de un ilustrador a premium
-- Ejecuta este script en tu base de datos MySQL

-- Opción 1: Actualizar el usuario "erick" (ID 2 según la imagen)
UPDATE auth_db.ilustradors 
SET subscription = 1 
WHERE id = 2;

-- Opción 2: Actualizar por nombre artístico
UPDATE auth_db.ilustradors 
SET subscription = 1 
WHERE nombre_artistico = 'erick';

-- Verificar el cambio
SELECT id, nombre_artistico, subscription, user_id 
FROM auth_db.ilustradors 
WHERE nombre_artistico = 'erick';
