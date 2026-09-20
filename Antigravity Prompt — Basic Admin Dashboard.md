
# MindCare AI — Basic Admin Dashboard & Administration

The main MindCare AI application is already implemented:

- Authentication
- AI Emotional Support Chat
- Risk/Safety Detection
- Mood Tracking
- Wellbeing Resources
- Profile & Account Settings
- User Dashboard

Now implement a **basic Admin Dashboard**.

The purpose is to allow an authorized administrator to monitor the application at a high level and manage basic user accounts.

This is NOT a full enterprise administration system.

## 1. VERY IMPORTANT PRIVACY RULE

The admin dashboard MUST NOT allow administrators to read users' private AI conversations.

Do NOT provide:

- User chat message content
- Conversation message history
- AI responses belonging to users
- Private mood notes
- Private emotional-support content

The admin may see aggregate statistics such as:

- Number of registered users
- Number of conversations
- Number of mood check-ins
- Number of users registered recently

But NOT the private content behind those numbers.

Privacy should be treated as a core feature of MindCare AI.

---

# 2. INSPECT THE EXISTING AUTH SYSTEM FIRST

Before coding, inspect:

- User database schema
- Authentication implementation
- JWT payload
- Auth middleware
- AuthProvider
- User model
- Existing API architecture
- Existing AppLayout/sidebar
- Existing database queries

Do NOT replace the existing authentication system.

Use the current password hashing and JWT implementation.

---

# 3. ADMIN ROLE

Add a basic role system to users.

If the existing `users` table does not already have a role field, add:

```text
role
```

with at least:

```text
user
admin
```

Default new registrations must always have:

```text
role = "user"
```

Do NOT allow a normal user to choose their role during registration.

Do NOT allow the frontend to send:

```json
{
  "role": "admin"
}
```

during registration.

The role must be controlled by the backend.

---

# 4. ADMIN AUTHORIZATION

Create reusable admin authorization middleware/preHandler.

There should be two separate concepts:

### Authentication

User is logged in.

### Authorization

User is logged in AND has:

```text
role === "admin"
```

Admin-only endpoints must reject normal users with:

```text
403 Forbidden
```

Do not rely on hiding the Admin page in the frontend as security.

The backend MUST enforce admin authorization.

---

# 5. ADMIN ROUTE

Create:

```text
/admin
```

This page should only be accessible to administrators.

If a normal user manually enters:

```text
/admin
```

they must NOT be able to access the admin dashboard.

Redirect them appropriately, such as:

```text
/dashboard
```

or show an access-denied page.

Do not expose admin data to normal users.

---

# 6. ADMIN SIDEBAR

Only show the Admin navigation item to users whose authenticated user has:

```text
role === "admin"
```

Example:

```text
Dashboard
Chat
Mood
Resources
Profile

----------------

Administration
Admin Dashboard

----------------

Logout
```

Normal users should never see:

```text
Admin Dashboard
```

in their navigation.

---

# 7. ADMIN DASHBOARD DESIGN

The admin dashboard should NOT look like an inventory-management system.

This is especially important.

MindCare AI is an emotional-support application, so the admin interface should visually belong to the same product.

Use:

- Calm professional colors
- White/light neutral surfaces
- Muted blue/teal
- Clean typography
- Simple statistics
- Minimal charts
- Calm spacing
- Same sidebar as the main application

Avoid:

- Inventory tables everywhere
- Product-style cards
- Stock/inventory terminology
- Bright business-dashboard colors
- Neon
- Futuristic AI graphics
- Excessive gradients
- Giant analytics dashboards

The admin area should feel like:

**Application Administration**

not:

**Inventory Management System**

---

# 8. ADMIN HEADER

Create:

**Administration**

Subtitle:

**Monitor MindCare AI activity and manage user accounts.**

Keep the wording professional.

---

# 9. STATISTICS

Create simple statistic cards.

At minimum:

### Total Users

Example:

```text
Total Users
124
```

### Total Conversations

Example:

```text
Conversations
487
```

### Mood Check-ins

Example:

```text
Mood Check-ins
356
```

### New Users

For example:

```text
New Users
12
This week
```

These are aggregate numbers only.

Do not show private conversation content.

Do not show mood notes.

---

# 10. USER REGISTRATION SUMMARY

Add a simple section:

**User Registration**

Show basic registration information such as:

- New users today
- New users this week
- New users this month

Only calculate information that can be reliably derived from the existing database.

Do not invent data.

If the database does not have the necessary timestamps, make the smallest appropriate change.

---

# 11. USER LIST

Add:

**Users**

Show a simple table/list containing ONLY basic account information:

| Name | Email | Role | Joined |
|------|-------|------|--------|

The admin may see:

- User name
- Email
- Role
- Registration date

The admin must NOT see:

- Chat messages
- Conversation content
- Mood notes
- Private emotional-support information
- Password information
- Password hashes

---

# 12. USER SEARCH

Add a simple search field if easy to implement.

Example:

**Search users...**

Allow searching by:

- Name
- Email

Do not build a complex search system.

---

# 13. USER ACCOUNT MANAGEMENT

Implement only basic safe account management.

An administrator may be able to:

### View basic user information

Name, email, role, joined date.

### Change user role

If implemented, allow:

```text
user
admin
```

However:

- Do not allow an admin to accidentally remove their own last admin access.
- Backend must enforce authorization.
- Never allow a normal user to change their own role.

If role management adds unnecessary complexity, implement the user list first and leave role management out.

---

# 14. OPTIONAL ACCOUNT STATUS

If the existing user schema can support it cleanly, you may add:

```text
isActive
```

Then administrators can:

- Activate user
- Deactivate user

A deactivated user should not be able to log in.

However, ONLY implement this if it can be done cleanly.

Do not complicate the authentication system unnecessarily.

Do NOT implement permanent deletion of users in this task.

---

# 15. ADMIN API

Create admin-only endpoints following the existing backend architecture.

For example:

### GET

```text
/api/admin/stats
```

Returns aggregate statistics:

```json
{
  "totalUsers": 124,
  "totalConversations": 487,
  "totalMoodCheckins": 356,
  "newUsersThisWeek": 12
}
```

### GET

```text
/api/admin/users
```

Returns basic user information:

```json
{
  "users": [
    {
      "id": "...",
      "name": "John",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "..."
    }
  ]
}
```

IMPORTANT:

The API response MUST NOT contain:

```text
password
passwordHash
chat messages
conversation messages
mood notes
```

If the existing database uses different field names, follow the existing schema.

---

# 16. ADMIN API SECURITY

Every `/api/admin/*` endpoint must:

1. Verify JWT.
2. Get authenticated user ID from JWT.
3. Retrieve the user from the database if necessary.
4. Verify the user's role is `admin`.
5. Reject normal users with HTTP 403.

Do NOT trust:

```text
role
```

sent from the frontend.

Do NOT trust a user ID supplied by the frontend to determine whether someone is an admin.

---

# 17. DO NOT EXPOSE PRIVATE CHAT DATA

This requirement is extremely important.

Even if an admin endpoint retrieves users or statistics, NEVER accidentally include conversation relationships containing messages.

For example, do NOT do something like:

```text
user -> conversations -> messages
```

when returning users.

Only select the specific fields required by the admin interface.

The admin dashboard should know:

```text
There are 487 conversations.
```

It should NOT know:

```text
What users discussed in those conversations.
```

---

# 18. ADMIN DASHBOARD SECTIONS

Use approximately this structure:

```text
Administration

Monitor MindCare AI activity and manage user accounts.


┌──────────────┐ ┌──────────────┐
│ Total Users  │ │ Conversations│
│     124      │ │     487      │
└──────────────┘ └──────────────┘

┌──────────────┐ ┌──────────────┐
│ Mood Checks  │ │ New Users    │
│     356      │ │     12       │
└──────────────┘ └──────────────┘


User Registration

New users this week: 12


Users

[ Search users... ]

Name       Email             Role      Joined
------------------------------------------------
John       john@example.com  User      Sep 18
Mary       mary@example.com  User      Sep 17
Admin      admin@example.com Admin     Sep 10
```

Keep it simple.

---

# 19. ADMIN EMPTY / LOADING STATES

Handle:

### Loading

Show a subtle loading state.

### No users

Show:

**No users found.**

### Search returns nothing

Show:

**No users match your search.**

### API error

Show:

**We couldn't load administration data. Please try again.**

Never show raw database errors.

---

# 20. ADMIN DASHBOARD RESPONSIVENESS

Desktop:

- Sidebar fixed
- Main admin content scrolls
- Statistics in a grid
- User table/list

Mobile:

- Sidebar becomes the existing mobile navigation
- Statistic cards stack appropriately
- User list becomes responsive
- Avoid horizontal page overflow

Do NOT create a separate layout system for admin.

Reuse the existing AppLayout/sidebar.

---

# 21. ADMIN ACCOUNT CREATION

Do NOT create a public "Register as Admin" option.

There must never be a registration form where someone selects:

```text
Role: Admin
```

For development/testing, create an admin account using a secure development mechanism consistent with the existing project, such as:

- a seed script
- a one-time development setup script
- a controlled database update

Do NOT hard-code an admin password into frontend code.

Do NOT commit real credentials.

Use environment variables for development credentials if necessary.

---

# 22. FRONTEND AUTH STATE

Inspect the existing AuthProvider.

Make sure the authenticated user object contains the role.

For example:

```ts
type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};
```

Use this only for UI visibility.

Remember:

**Frontend role checks are for UX. Backend role checks are the actual security boundary.**

---

# 23. EXISTING USER EXPERIENCE MUST NOT CHANGE

Normal users should continue to have:

```text
Dashboard
Chat
Mood
Resources
Profile
Logout
```

They should not see admin functionality.

Their existing pages must continue working.

---

# 24. TESTING

Create/extend tests for:

### Normal user

- Cannot access `/api/admin/stats`
- Cannot access `/api/admin/users`
- Receives HTTP 403

### Admin

- Can access `/api/admin/stats`
- Can access `/api/admin/users`
- Receives only safe user information

### Privacy

Verify admin responses do NOT contain:

- password hash
- passwords
- chat messages
- AI responses
- mood notes

### Authentication

- Unauthenticated request → 401
- Authenticated normal user → 403
- Authenticated admin → 200

### Frontend

- Normal user does not see Admin navigation.
- Admin sees Admin navigation.
- Normal user cannot access `/admin`.
- Admin can access `/admin`.

---

# 25. DATABASE SAFETY

If modifying the database:

- Create a proper Drizzle migration.
- Preserve existing users.
- Existing users should default to `user` unless explicitly promoted to admin.
- Do not delete existing data.
- Run the migration successfully.

---

# 26. BUILD VERIFICATION

Run:

```bash
pnpm build
```

Must result in:

```text
0 TypeScript errors
Backend build successful
Frontend build successful
Exit code 0
```

Fix all errors before reporting completion.

---

# 27. FINAL BROWSER TEST

Test both account types.

### Normal user

Login → Dashboard → verify no Admin link → manually try `/admin` → access denied/redirect.

### Admin

Login → Dashboard → Admin link visible → open Admin Dashboard → statistics load → users load → search users → verify no private chat/mood content is visible.

Also verify:

- Chat still works.
- Mood still works.
- Resources still works.
- Profile still works.
- Logout still works.
- Sidebar remains fixed while scrolling.

---

# 28. DO NOT EXPAND SCOPE

Do NOT build:

- Admin access to private chats
- Admin access to mood notes
- Therapist management
- Payments
- Advanced analytics
- AI monitoring
- Message moderation dashboard
- Complex reporting
- Email campaigns
- Notifications
- Inventory management
- E-learning features
- Product management
- Orders
- Stock management

MindCare AI is an **AI emotional-support application**, not an inventory or e-learning system.

The admin's job is simply:

**Monitor high-level application usage and manage basic user accounts while respecting user privacy.**

When finished, provide a concise report containing:

1. Database changes
2. Admin role implementation
3. Admin API endpoints
4. Admin dashboard features
5. Privacy protections
6. Tests performed
7. Browser verification
8. `pnpm build` result
9. Any remaining issues
10. Recommended next step