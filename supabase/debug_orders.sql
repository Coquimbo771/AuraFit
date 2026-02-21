-- Verificar configuración de tablas orders y order_items
-- Ejecuta estos queries en Supabase SQL Editor para debug

-- 1. Verificar que las tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('orders', 'order_items');

-- 2. Ver estructura de la tabla orders
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'orders'
ORDER BY ordinal_position;

-- 3. Ver estructura de la tabla order_items
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'order_items'
ORDER BY ordinal_position;

-- 4. Listar todas las políticas RLS en orders
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'orders';

-- 5. Listar todas las políticas RLS en order_items
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'order_items';

-- 6. Verificar que RLS está habilitado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename IN ('orders', 'order_items');

-- 7. Ver últimas órdenes (si existen)
SELECT id, user_id, total_amount, currency, status, created_at
FROM orders
ORDER BY created_at DESC
LIMIT 5;

-- 8. Contar órdenes por usuario
SELECT user_id, COUNT(*) as order_count, SUM(total_amount) as total_spent
FROM orders
GROUP BY user_id
ORDER BY order_count DESC;

-- 9. Test de inserción manual (reemplaza 'USER_UUID' con tu user_id real)
-- INSERT INTO orders (user_id, total_amount, currency, status)
-- VALUES ('USER_UUID', 100.00, 'USD', 'pending');

-- 10. Ver usuarios y sus roles
SELECT id, email, role, created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;
