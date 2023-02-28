CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO "Cart" ("id", "createdAt", "updatedAt", "total", "companyId")
SELECT uuid_generate_v4(), now(), now(), 0, id
FROM "Company"
ON CONFLICT DO NOTHING;
