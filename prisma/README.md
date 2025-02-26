# Database Management

This directory contains all database-related configurations and scripts for the application.

## Structure

```
prisma/
├── schema.prisma     # Prisma schema file
├── migrations/       # Database migrations
├── policies/         # RLS policies
│   └── rls.sql      # Row Level Security policies
└── seed.ts          # Database seeding script
```

## Row Level Security (RLS)

All tables are protected by Row Level Security policies. These policies ensure that users can only access data within their organization. The policies are defined in `policies/rls.sql`.

### Key Policy Patterns:

- Organization-based access control
- User-specific data access
- Role-based permissions

## Database Seeding

The seed script (`seed.ts`) handles:
1. Initial data seeding
2. Application of RLS policies

## Development Workflow

### After Schema Changes

When making schema changes:

1. Create a new migration:
   ```bash
   npx prisma migrate dev --name <migration_name>
   ```

2. The seed script will automatically run after migration
   - This ensures RLS policies are reapplied
   - Test data is maintained

### Manual Seeding

To manually run the seed script:
```bash
npx prisma db seed
```

### Backup RLS Policies

Before any major database operations:
1. Backup your RLS policies:
   ```bash
   pg_dump -h <host> -U <user> -d <database> --section=pre-data --section=post-data > backup_policies.sql
   ```

2. After operations, verify RLS is properly applied:
   ```bash
   npx prisma db seed
   ```

## Troubleshooting

If RLS policies are lost:
1. Run the seed script to reapply policies:
   ```bash
   npx prisma db seed
   ```

2. Verify policies are applied:
   ```sql
   SELECT tablename, policies FROM pg_policies;
   ```

## Important Notes

- Never disable RLS without proper consideration
- Always backup policies before major database operations
- Test policy changes in development before applying to production
- Keep the `rls.sql` file updated with any policy changes 