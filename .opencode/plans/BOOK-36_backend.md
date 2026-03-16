# Backend Implementation Plan: BOOK-36 Configure Supabase Project

## Overview

This ticket involves configuring the Supabase project for the Buscalibre Price Tracker application. While primarily an infrastructure/DevOps task, it sets up the foundation for all backend authentication and user management functionality. The implementation follows Supabase best practices for PostgreSQL database configuration with Row Level Security (RLS).

**Key Principles:**
- **Infrastructure as Code**: Database schema and security policies defined via SQL migrations
- **Security First**: RLS policies enforce data access control at the database level
- **Automation**: Triggers automate user profile creation on authentication events

## Architecture Context

### Components Involved

1. **Supabase Cloud** - PostgreSQL database with built-in Auth
2. **Environment Configuration** - Backend needs Supabase credentials
3. **Documentation** - Update data model to reflect new tables

### Existing Infrastructure

- **Supabase Project**: `ziaiegmbnpwuolmtmocz` (Buscalibre Tracker)
- **Status**: ACTIVE_HEALTHY
- **Region**: us-east-2
- **Auth Tables**: Already exist (`auth.users`)
- **Database**: PostgreSQL 17

### Files to Update

1. `backend/.env.local` - Add actual Supabase credentials
2. `ai-specs/specs/data-model.md` - Document the User entity
3. `ai-specs/specs/development_guide.md` - Update setup instructions

## Implementation Steps

### Step 0: Create Feature Branch

**Action**: Create and switch to a new feature branch following the development workflow

**Branch Naming**: `feature/BOOK-36-backend`

**Implementation Steps**:
1. Ensure you're on the latest `main` branch
   ```bash
   git checkout main
   ```
2. Pull latest changes
   ```bash
   git pull origin main
   ```
3. Create new feature branch
   ```bash
   git checkout -b feature/BOOK-36-backend
   ```
4. Verify branch creation
   ```bash
   git branch
   ```

**Notes**: 
- This must be the FIRST step before any changes
- Follow branch naming convention: `feature/[ticket-id]-backend`

---

### Step 1: Create public.users Table

**Action**: Create the public.users table in Supabase with proper schema

**Implementation Steps**:

1. **Navigate to Supabase SQL Editor** in the dashboard for project `ziaiegmbnpwuolmtmocz`

2. **Execute the following SQL**:
```sql
-- Create table public.users
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);
```

3. **Verify table creation** - Confirm the table appears in the Supabase dashboard under "Table Editor"

**Dependencies**: 
- Requires existing `auth.users` table (already exists)

**Implementation Notes**:
- The `id` column references `auth.users(id)` for referential integrity
- `ON DELETE CASCADE` ensures user profile is deleted when auth record is deleted
- `created_at` and `updated_at` use PostgreSQL's `TIMESTAMP WITH TIME ZONE` type

---

### Step 2: Enable Row Level Security (RLS)

**Action**: Enable RLS and create policies for secure access

**Implementation Steps**:

1. **Execute SQL to enable RLS**:
```sql
-- Enable RLS on public.users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

2. **Create RLS policies**:
```sql
-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Allow insert (managed by trigger, but needed for completeness)
CREATE POLICY "Allow insert for authenticated users"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);
```

3. **Verify RLS status** in Supabase dashboard - Table should show "RLS Enabled" with 3 policies

**Implementation Notes**:
- `auth.uid()` returns the UUID of the authenticated user from the JWT
- Policies use `USING` clause for SELECT/UPDATE and `WITH CHECK` for INSERT
- Only the owner can view or modify their own record

---

### Step 3: Create Trigger for Auto-Insert

**Action**: Create trigger to automatically insert user profile when new user registers via Supabase Auth

**Implementation Steps**:

1. **Execute SQL to create trigger function**:
```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

2. **Execute SQL to create trigger**:
```sql
-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

3. **Verify trigger** in Supabase Dashboard under "Triggers"

**Implementation Notes**:
- `SECURITY DEFINER` allows the function to insert into the table even though users won't have direct insert permission
- `COALESCE(NEW.raw_user_meta_data->>'name', '')` extracts the name from metadata or defaults to empty string
- Trigger fires AFTER INSERT on `auth.users`, so the auth record is created first

---

### Step 4: Configure Environment Variables

**Action**: Update backend environment file with actual Supabase credentials

**Implementation Steps**:

1. **Get Supabase credentials**:
   - Access project settings in Supabase dashboard
   - Navigate to "API" settings
   - Copy `Project URL` and `anon public` key

2. **Update `backend/.env.local`**:
```env
# Supabase Configuration
SUPABASE_URL=https://ziaiegmbnpwuolmtmocz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App
PORT=3001
NODE_ENV=development

# Resend (Email Service)
RESEND_API_KEY=your_resend_api_key
```

3. **Create `.env.example`** for team reference:
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
PORT=3001
NODE_ENV=development

# Resend (Email Service)
RESEND_API_KEY=your_resend_api_key
```

**Dependencies**: 
- Supabase project must be active

**Implementation Notes**:
- NEVER commit actual keys to version control
- Use `.env.local` for local development
- Share `.env.example` (without values) with team

---

### Step 5: Verify Auth and Trigger Work

**Action**: Test that the Supabase Auth and trigger work correctly

**Implementation Steps**:

1. **Test user registration**:
   - Use Supabase dashboard "Authentication" section
   - Create a new user manually
   - Verify a row is created in `public.users` table

2. **Verify data in table**:
   - Query `SELECT * FROM public.users;`
   - Confirm the new user appears with correct email and name

3. **Test RLS policies**:
   - Use the "Query with RLS" feature in Supabase
   - Verify users can only see their own record

**Implementation Notes**:
- Test with both email/password and any other auth providers you plan to enable

---

### Step 6: Update Documentation

**Action**: Review and update technical documentation according to changes made

**Implementation Steps**:

1. **Review Changes**: Analyze all changes made during implementation
   - New `public.users` table structure
   - RLS policies added
   - Trigger configuration

2. **Update `ai-specs/specs/data-model.md`**:
   - Add User entity documentation
   - Include table structure with columns and types
   - Document RLS policies

3. **Update `ai-specs/specs/development_guide.md`**:
   - Verify Supabase setup instructions are accurate
   - Add note about obtaining keys from Supabase dashboard

4. **Verify Documentation**:
   - Confirm all changes are accurately reflected
   - Check that documentation follows established structure
   - Ensure English language as per standards

**References**: 
- Follow process described in `ai-specs/specs/documentation-standards.mdc`
- All documentation must be written in English

---

## Implementation Order

1. Step 0: Create Feature Branch
2. Step 1: Create public.users Table
3. Step 2: Enable Row Level Security (RLS)
4. Step 3: Create Trigger for Auto-Insert
5. Step 4: Configure Environment Variables
6. Step 5: Verify Auth and Trigger Work
7. Step 6: Update Documentation

## Testing Checklist

- [ ] Table `public.users` created with correct schema
- [ ] RLS enabled on `public.users` table
- [ ] Three RLS policies created (SELECT, UPDATE, INSERT)
- [ ] Trigger function `handle_new_user()` created
- [ ] Trigger `on_auth_user_created` attached to `auth.users`
- [ ] New user registration creates profile in `public.users`
- [ ] Users can only view/update their own profile
- [ ] Backend `.env.local` contains valid Supabase credentials
- [ ] Documentation updated with User entity

## Error Response Format

**Not applicable** - This is an infrastructure ticket, not an API endpoint.

## Partial Update Support

**Not applicable** - Infrastructure configuration is applied as a whole.

## Dependencies

- **Supabase Cloud**: Database and Authentication
- **PostgreSQL 17**: Database engine (managed by Supabase)
- **No additional npm packages required** - Uses built-in Supabase Auth

## Notes

1. **Security**: Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code - it has admin privileges
2. **Keys Location**: Supabase Dashboard → Settings → API
3. **Testing**: Always test RLS policies after enabling them
4. **Trigger Verification**: Trigger should fire automatically - no code changes needed in backend
5. **Naming Convention**: All identifiers follow PostgreSQL conventions (lowercase, underscores)

## Next Steps After Implementation

- **BOOK-1**: Implement user registration endpoint (if not using Supabase Auth directly)
- **BOOK-2**: Implement login/authentication flow
- **Integration**: Connect frontend Supabase client to backend

## Implementation Verification

- [ ] **Code Quality**: N/A - Infrastructure configuration
- [ ] **Functionality**: Auth trigger works, RLS enforced
- [ ] **Testing**: Manual testing via Supabase dashboard
- [ ] **Integration**: Environment variables correctly configured
- [ ] **Documentation**: Data model and setup docs updated
