# Implement User Authentication

The project foundation is already complete and verified.

Now implement the **complete user authentication feature** for the AI Emotional Support Assistant.

## Goal

Users must be able to:

1. Register
2. Login
3. Stay authenticated
4. Access protected pages
5. Logout

Keep the implementation simple and production-like, but do not over-engineer it.

---

## Backend

Use the existing:

- Fastify
- TypeScript
- Drizzle ORM
- SQLite
- @fastify/jwt

Use the existing `users` table.

### Registration endpoint

Create:

```text
POST /api/auth/register
```

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Requirements:

- Validate input with Zod.
- Name must not be empty.
- Email must be valid.
- Password must have a reasonable minimum length.
- Normalize email to lowercase.
- Check whether email already exists.
- Hash the password securely.
- NEVER store plaintext passwords.
- Create the user.
- Return a JWT and safe user information.
- NEVER return `password_hash`.

Example response:

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "..."
}
```

---

## Login endpoint

Create:

```text
POST /api/auth/login
```

Request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Requirements:

- Validate input.
- Find user by normalized email.
- Verify password against the stored hash.
- Return JWT and safe user information.
- Return an appropriate 401 response for invalid credentials.
- Do not reveal whether the email or password was incorrect.

Example:

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "..."
}
```

---

## Current-user endpoint

Create:

```text
GET /api/auth/me
```

It must require a valid JWT.

Return:

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Create reusable authentication middleware/decorator for protected routes.

---

## Logout

Because we are using JWT, keep logout simple.

The frontend should remove the stored authentication token and clear the current user state.

Do not build a complicated token blacklist system for this 3-day project.

---

# Frontend

Create:

```text
/login
/register
```

Use the existing React + Vite + Tailwind setup.

The pages should look polished and modern.

## Login page

Include:

- Application logo/name
- Email
- Password
- Show/hide password
- Login button
- Loading state
- Validation errors
- API error message
- Link to registration

Example branding:

```text
MindCare AI

Your space to talk, reflect, and feel supported.

Email
[________________]

Password
[________________] 👁

[        Sign In        ]

Don't have an account?
Create one
```

## Register page

Include:

- Name
- Email
- Password
- Confirm password
- Show/hide password
- Register button
- Validation
- Loading state
- Link to login

---

# Authentication state

Create a simple authentication mechanism.

For this MVP:

- Store JWT in localStorage.
- Store current user in React state/context.
- Automatically attach the token to authenticated API requests.
- On application startup, if a token exists, call `/api/auth/me`.
- If the token is invalid/expired, clear authentication and redirect to `/login`.

Create something similar to:

```text
src/
├── context/
│   └── AuthContext.tsx
├── services/
│   └── api.ts
├── pages/
│   ├── Login.tsx
│   └── Register.tsx
└── components/
    └── ProtectedRoute.tsx
```

Adapt this to the existing project structure instead of creating duplicate structures.

---

# Protected routes

Create a protected application area.

For now:

```text
/dashboard
/chat
/mood
/resources
/profile
```

Unauthenticated users attempting to access these pages should be redirected to:

```text
/login
```

Authenticated users should be able to access them.

---

# Dashboard placeholder

Create the initial dashboard now because authentication needs somewhere to redirect.

Make it visually polished but keep functionality minimal.

Show:

```text
Good morning, [Name] 👋

How are you feeling today?

😊 Happy
🙂 Good
😐 Neutral
😔 Sad
😣 Stressed
😡 Angry

[ Talk to AI Assistant ]

Recent activity
No mood records yet.
```

Do not implement mood saving yet.

That will be the next feature.

---

# Navigation

Create an authenticated application layout with:

```text
MindCare AI

💬 AI Chat
📊 My Mood
🌱 Resources
⚙ Profile

Logout
```

Desktop sidebar is preferred.

Make it responsive for smaller screens.

---

# API error handling

Create consistent handling for:

- 400 validation errors
- 401 unauthorized
- 409 duplicate email
- 500 server errors
- Network errors

Show friendly messages to the user.

Do not expose stack traces or internal errors to the frontend.

---

# Security

Important:

- Never return `password_hash`.
- Never log passwords.
- Never put secrets in frontend code.
- Use the existing JWT secret from environment variables.
- Do not hardcode secrets.
- Validate all authentication input on the backend.

---

# Verification

After implementation, actually test:

### Registration

```text
✓ Valid registration
✓ Duplicate email
✓ Invalid email
✓ Short password
✓ Missing fields
✓ Password is hashed
```

### Login

```text
✓ Correct credentials
✓ Wrong password
✓ Unknown email
✓ JWT generated
```

### Authentication

```text
✓ /api/auth/me with valid token
✓ /api/auth/me without token
✓ /api/auth/me with invalid token
✓ Protected frontend routes
✓ Logout
```

### Build

Run:

```bash
pnpm build
```

and fix all errors.

Do not move on until the authentication flow works end-to-end.

At the end, report:

1. Files created/modified
2. API endpoints
3. How authentication works
4. Tests performed
5. Any problems encountered
6. What should be implemented next