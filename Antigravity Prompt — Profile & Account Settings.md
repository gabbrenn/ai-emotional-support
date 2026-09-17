# MindCare AI — Profile & Account Settings

Authentication, AI Chat, Mood Tracking, and Wellbeing Resources are already implemented, tested, and working.

The `/profile` route is currently a placeholder.

Your task is to implement a **professional Profile & Account Settings page** and the minimal backend functionality required to support it.

## 1. IMPORTANT RULES

Inspect the existing project before changing anything.

Reuse the existing:

- Authentication system
- JWT implementation
- Password hashing implementation
- Database/Drizzle architecture
- API client
- UI components
- Tailwind design system
- Error handling patterns

Do NOT rewrite authentication.

Do NOT replace the existing password hashing implementation.

Do NOT introduce a new authentication library.

Do NOT add unnecessary dependencies.

Do NOT modify AI Chat, Mood Tracking, or Resources functionality except where necessary to ensure the application continues working.

The UI must remain:

- Professional
- Calm
- Trustworthy
- Simple
- Responsive

Avoid:

- Neon colors
- Glow effects
- Glassmorphism
- Futuristic AI styling
- Excessive animations
- Excessive rounded cards

---

# 2. PROFILE PAGE

Replace the existing `/profile` placeholder with a real page.

Page heading:

**Profile & Account**

Supporting text:

**Manage your account information and security settings.**

The page should contain clear sections.

---

# 3. PERSONAL INFORMATION

Create a section:

**Personal Information**

Display:

- Name
- Email address

The name should be editable.

The email should be displayed as the authenticated user's email.

Do NOT implement email changing unless the existing architecture already supports it safely.

Add:

**Save Changes**

When the user updates their name:

- Validate it.
- Trim whitespace.
- Reject an empty name.
- Use a reasonable maximum length, such as 100 characters.
- Save it to the database.
- Update the frontend auth/user state so the new name is reflected immediately.
- Do not require logout/login to see the change.

Show a clear success message:

**Your profile has been updated.**

---

# 4. CHANGE PASSWORD

Create a separate section:

**Change Password**

Fields:

- Current password
- New password
- Confirm new password

Validation:

- Current password is required.
- New password is required.
- New password should follow the existing project's password requirements.
- Confirm password must match.
- Do not reveal whether the current password is correct beyond an appropriate generic error.

Example validation:

**New passwords do not match.**

For an incorrect current password:

**The current password is incorrect.**

Do not expose password hashes.

Do not log passwords.

Do not return passwords in API responses.

After a successful password change:

**Your password has been changed successfully.**

Consider whether existing JWT sessions should remain valid based on the current authentication architecture. Do not introduce complex token/session management unless necessary.

---

# 5. BACKEND ENDPOINTS

Inspect the existing auth architecture and follow its conventions.

Implement the minimum required endpoints.

### PATCH `/api/auth/me`

Update the authenticated user's profile information.

Request:

```json
{
  "name": "Updated Name"
}
```

Requirements:

- JWT required.
- User ID comes from the authenticated JWT.
- Never allow the client to specify another user ID.
- Validate the name.
- Update only allowed profile fields.
- Return safe user information.

Example response:

```json
{
  "user": {
    "id": "...",
    "name": "Updated Name",
    "email": "user@example.com"
  }
}
```

Never return:

- password hash
- password
- JWT secret
- internal authentication data

---

### PATCH `/api/auth/password`

Change the authenticated user's password.

Request:

```json
{
  "currentPassword": "current password",
  "newPassword": "new password"
}
```

Requirements:

- JWT required.
- Verify the current password using the EXISTING Node `scrypt` password verification implementation.
- Validate the new password.
- Generate a new secure password hash using the existing implementation.
- Update the database.
- Never return password/hash information.
- Never log passwords.

Use appropriate HTTP status codes and friendly error responses.

---

# 6. FRONTEND API CLIENT

Extend the existing API client.

Use the existing API architecture.

Add functions similar to:

```ts
authApi.updateProfile(...)
authApi.changePassword(...)
```

Do not create a second API client.

After updating the profile, update the existing authenticated user state/context.

---

# 7. ACCOUNT INFORMATION

Add a simple read-only section if appropriate:

**Account**

Show:

- Email
- Account status if the existing model supports it

Do not add unnecessary account metadata.

---

# 8. LOGOUT

The Profile page should contain a clear:

**Log out**

button.

It must use the existing logout implementation.

Do not create a second logout mechanism.

After logout:

- Clear the existing authentication token/state.
- Redirect using the existing auth routing behavior.

---

# 9. PRIVACY / SAFETY INFORMATION

Add a small informational section:

**Your privacy**

Use wording consistent with the application.

For example:

> MindCare AI is designed to provide a private space for reflection and emotional support. Avoid sharing passwords, financial information, or other highly sensitive personal information in chat.

Also make clear:

> MindCare AI is not a replacement for qualified professional care or emergency services.

Do not make unsupported claims such as "your data is completely private" or "your data can never be accessed."

---

# 10. UI STRUCTURE

Use a clean layout such as:

```text
Profile & Account
Manage your account information and security settings.

┌─────────────────────────────────────┐
│ Personal Information                │
│                                     │
│ Name       [____________________]   │
│ Email      user@example.com         │
│                                     │
│              [Save Changes]         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Change Password                     │
│                                     │
│ Current password                    │
│ [____________________________]      │
│                                     │
│ New password                        │
│ [____________________________]      │
│                                     │
│ Confirm new password                │
│ [____________________________]      │
│                                     │
│           [Change Password]         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Your privacy                        │
│ Privacy/safety information           │
└─────────────────────────────────────┘

[Log out]
```

Do not make every section look like a huge floating card.

Keep spacing and hierarchy professional.

---

# 11. PASSWORD VISIBILITY

Password fields may include a simple show/hide control.

If implemented:

- Make it keyboard accessible.
- Use clear accessible labels.
- Do not expose passwords unnecessarily.

This is optional if the existing design system already has a suitable input component.

---

# 12. LOADING / ERROR STATES

During profile update:

- Disable the submit button.
- Show a subtle loading state.

During password change:

- Disable the submit button.
- Show a subtle loading state.

Handle server/network errors with friendly messages.

Never expose:

- stack traces
- SQL errors
- password hashes
- internal server details
- API secrets

---

# 13. AUTH STATE

Inspect the existing AuthProvider/context.

After changing the name:

- Update the current authenticated user in the existing auth state.
- Ensure the sidebar/header/dashboard reflects the new name immediately.

Do not create another user context.

---

# 14. VALIDATION

Use the project's existing validation approach.

Profile:

- Name required
- Trim whitespace
- Maximum 100 characters

Password:

- Current password required
- New password required
- Confirm password required
- New password must meet existing password requirements
- New password and confirmation must match

Do not weaken the existing registration password rules.

---

# 15. SECURITY

Pay particular attention to:

### Authorization

Every profile/password endpoint must use the authenticated user's identity from JWT.

### Password handling

Use the existing secure `scrypt` implementation.

Never:

- store plaintext passwords
- return password hashes
- log passwords
- accept arbitrary user IDs for password changes

### Database

Use parameterized/Drizzle queries through the existing database layer.

### Errors

Use generic safe responses where appropriate.

---

# 16. TESTING

Add or extend backend tests.

Test:

### Profile

- Unauthenticated update → 401
- Authenticated user can update their own name
- Empty name → 400
- Name over maximum length → 400
- Updated name persists in database
- Response does not contain password hash

### Password

- Unauthenticated password change → 401
- Correct current password + valid new password → succeeds
- Incorrect current password → rejected
- Missing current password → rejected
- Invalid new password → rejected
- Mismatched confirmation handled appropriately by frontend/API validation
- New password actually works for login afterward
- Old password no longer works after successful change

### Authorization

Confirm the API cannot update another user's profile through a supplied user ID.

---

# 17. MANUAL BROWSER VERIFICATION

Verify:

1. Login.
2. Open `/profile`.
3. Confirm the user's current name and email appear.
4. Change the name.
5. Save.
6. Confirm success message.
7. Navigate to Dashboard.
8. Confirm the updated name appears wherever the current user name is displayed.
9. Return to Profile.
10. Confirm the name persists.
11. Change password.
12. Confirm success.
13. Logout.
14. Login using the new password.
15. Confirm login succeeds.
16. Confirm the old password no longer works.
17. Test mobile layout.
18. Verify logout works.

Also verify:

- Chat still works.
- Mood still works.
- Resources still works.
- Dashboard still works.

---

# 18. BUILD

Run:

```bash
pnpm build
```

Requirements:

- 0 TypeScript errors
- Backend build succeeds
- Frontend build succeeds
- Exit code 0

Fix any errors before reporting completion.

---

# 19. DO NOT EXPAND SCOPE

Do NOT implement:

- Email verification
- Password reset emails
- Two-factor authentication
- OAuth/social login
- Profile pictures
- Therapist accounts
- Admin controls
- Subscription/billing
- Notification preferences
- Complex privacy controls
- Data export
- Account deletion unless already trivial and explicitly supported by the existing architecture

The goal is:

**A complete, secure, professional Profile & Account page.**

When finished, provide a concise implementation report containing:

1. Files created/modified
2. Backend endpoints
3. Database changes, if any
4. Frontend functionality
5. Security considerations
6. Tests performed and results
7. Browser verification results
8. `pnpm build` result
9. Any remaining issues
10. Recommended next task