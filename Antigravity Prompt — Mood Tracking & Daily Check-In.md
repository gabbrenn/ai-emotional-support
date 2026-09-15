# MindCare AI — Mood Tracking & Daily Check-In

The Authentication and AI Chat features are already implemented, tested, and working. Do NOT rewrite or break them.

Your next task is to implement the **Mood Tracking & Daily Check-In feature** end-to-end.

## 1. IMPORTANT RULES

- Inspect the existing project before making changes.
- Reuse the existing architecture, database, authentication middleware, API client, UI components, and design system.
- Do NOT change the authentication flow.
- Do NOT change the existing AI Chat functionality except where dashboard integration is necessary.
- Do NOT introduce Redux or another state-management library.
- Do NOT add unnecessary dependencies.
- Keep the UI professional, calm, trustworthy, and suitable for a wellbeing application.
- NO neon colors.
- NO glowing effects.
- NO glassmorphism.
- NO excessive blur.
- NO futuristic AI styling.
- NO excessive rounded cards.
- Do not overengineer the feature.
- Make the feature responsive on desktop and mobile.
- All mood data must belong to the authenticated user.

Before coding, inspect:
- Existing Drizzle schema
- Existing `moods` table
- Authentication/JWT implementation
- Existing API route/controller/service patterns
- Existing frontend layout and components
- Existing dashboard
- Existing `/mood` route
- Existing Tailwind/design system

Then implement the feature consistently with the existing codebase.

---

# 2. MOOD DATA MODEL

First inspect the existing `moods` table.

If it already contains suitable fields, reuse them rather than creating duplicate tables.

The mood record should support at minimum:

- `id`
- `userId`
- mood value/score
- optional note
- created timestamp

Use the existing naming conventions in the project.

If the current schema is missing a required field, make the smallest necessary schema change and create the appropriate Drizzle migration.

Do NOT create a second mood table.

---

# 3. BACKEND API

Implement these authenticated endpoints:

### POST `/api/moods`

Create a mood check-in.

Request:

```json
{
  "mood": 4,
  "note": "I had a productive day."
}
```

Requirements:

- Require JWT authentication.
- Validate the mood value.
- Mood should be an integer from 1 to 5.
- Note is optional.
- Prevent excessively large notes. Use a reasonable maximum such as 500 characters.
- Trim whitespace.
- Save the mood under the authenticated user's ID.
- Return the created mood record.
- Never allow the client to specify another user's ID.

Example response:

```json
{
  "id": 1,
  "mood": 4,
  "note": "I had a productive day.",
  "createdAt": "..."
}
```

---

### GET `/api/moods`

Return the authenticated user's mood history.

Requirements:

- Require JWT authentication.
- Return only moods belonging to the authenticated user.
- Sort newest first.
- Support a reasonable limit such as the latest 30 records.
- Never expose another user's moods.

Example:

```json
{
  "moods": [
    {
      "id": 1,
      "mood": 4,
      "note": "I had a productive day.",
      "createdAt": "..."
    }
  ]
}
```

If the project architecture supports it cleanly, allow an optional `limit` query parameter, but do not overcomplicate the API.

---

# 4. DAILY CHECK-IN BEHAVIOR

The main `/mood` page should make the daily check-in extremely simple.

At the top:

**How are you feeling today?**

Then show five clear mood choices:

1 — Very difficult  
2 — Difficult  
3 — Okay  
4 — Good  
5 — Very good

Use appropriate simple icons/emoji if they fit the existing professional design, but don't make the interface childish.

For example:

- 1: Very difficult
- 2: Difficult
- 3: Okay
- 4: Good
- 5: Very good

The user selects one.

Then show:

**Want to add a note? (Optional)**

Textarea with a maximum of 500 characters.

Button:

**Save Check-In**

After successful submission:

- Show a clear success message.
- Update the history immediately.
- Clear/reset the form appropriately.
- Do not require a page refresh.

---

# 5. ONE CHECK-IN PER DAY

The application should support a simple daily check-in experience.

Before creating a new mood:

- Check whether the user already submitted a mood today.
- If they have already checked in today, clearly show their existing check-in.
- Do not silently create multiple daily records from repeated button clicks.

If editing an existing day's mood is simple to implement safely, you may allow the user to update today's check-in.

Otherwise, display:

**You've already checked in today. Come back tomorrow for your next check-in.**

Do not create duplicate records caused by accidental repeated submissions.

Use the user's local date appropriately in the frontend while keeping timestamps stored consistently in the database.

---

# 6. MOOD HISTORY

Below the check-in section, create a **Mood History** section.

Display recent entries with:

- Date
- Mood
- Optional note

Example:

```text
Today
Good
"I had a productive day."

Yesterday
Okay
"Feeling a little tired."

Monday
Very good
"Had a great day."
```

Keep the presentation clean.

If there are no mood records:

**No check-ins yet. Your mood history will appear here after your first check-in.**

---

# 7. WEEKLY MOOD TREND

Add a simple **Last 7 Days** mood trend visualization.

Show the user's mood score for each day.

Requirements:

- X-axis = day/date
- Y-axis = mood score 1–5
- Clearly show the trend.
- Missing days should remain missing rather than inventing mood values.
- Do not interpret the graph as a medical measurement.
- Add a small explanatory label such as:

**Your mood check-ins over the last 7 days**

Do NOT make claims such as:
- "Your mental health is improving."
- "You are depressed."
- "You are recovering."
- "Your condition is worsening."

The chart is only a reflection of recorded check-ins.

If a chart library is already installed, reuse it.

If no chart library exists, use a lightweight implementation rather than adding a large dependency unnecessarily.

A simple SVG/CSS chart is acceptable.

---

# 8. DASHBOARD INTEGRATION

Inspect the existing Dashboard page.

Add a compact mood summary without redesigning the entire dashboard.

For example:

### Today's Mood

**Good**

or:

### Today's Check-In

**Not completed**

Include a button:

**Check in**

which navigates to `/mood`.

Also include a small weekly summary if it fits naturally.

For example:

**7-day mood check-ins**

5 entries

Do not clutter the dashboard.

---

# 9. FRONTEND API CLIENT

Extend the existing frontend API service.

Add functions similar to:

```ts
moodApi.createMood(...)
moodApi.getMoods(...)
```

Follow the existing API client's authentication/token handling.

Do not create a second API client.

---

# 10. ERROR HANDLING

Handle these cases professionally:

### Not authenticated

Use the existing authentication behavior.

### Invalid mood

Show:

**Please select a mood before saving.**

### Note too long

Show:

**Your note must be 500 characters or less.**

### Network/server error

Show a friendly message:

**We couldn't save your check-in right now. Please try again.**

Do not expose stack traces, database errors, or internal implementation details.

---

# 11. UI / DESIGN

The Mood page should fit the existing MindCare AI visual identity.

Brand:

**MindCare AI**

Tagline:

**A private space to talk, reflect, and find support.**

Use:

- warm/light neutral background
- white surfaces
- muted teal or calm blue-green primary color
- slate/dark gray text
- subtle borders
- restrained shadows
- moderate corner radius
- professional typography
- generous but not excessive spacing

Avoid:

- neon
- purple AI gradients
- glowing borders
- animated backgrounds
- glass panels
- excessive shadows
- excessive rounded containers
- futuristic dashboard styling

The application should look like a trustworthy wellbeing product, not an AI demo.

---

# 12. ACCESSIBILITY

Make the mood selector accessible.

Requirements:

- Keyboard accessible
- Clear selected state
- Visible focus state
- Appropriate labels
- Sufficient contrast
- Buttons must have clear text
- Do not rely only on color to communicate selected mood

On mobile, the mood options should remain easy to tap.

---

# 13. SAFETY / MEDICAL BOUNDARIES

Mood tracking is NOT diagnosis.

Do not generate automated medical conclusions based on mood scores.

Do not display messages such as:

- "You have depression."
- "You are clinically anxious."
- "Your mental health score is dangerous."

If the user has an existing high-risk safety flow in the chat feature, do not duplicate or modify that system unnecessarily.

The mood feature is simply:

**A personal wellbeing reflection and tracking tool.**

---

# 14. TESTING

Create or extend automated backend tests for:

### Authentication

- Unauthenticated POST `/api/moods` → 401
- Unauthenticated GET `/api/moods` → 401

### Creation

- Valid mood 1 → succeeds
- Valid mood 3 → succeeds
- Valid mood 5 → succeeds
- Invalid mood 0 → rejected
- Invalid mood 6 → rejected
- Non-integer mood → rejected
- Empty/whitespace note handled correctly
- Note over 500 characters → rejected

### Ownership

Create moods for two users.

Verify:

- User 1 sees only User 1's moods.
- User 2 sees only User 2's moods.

### Daily behavior

Verify repeated same-day submission follows the chosen one-check-in-per-day behavior.

### Database

Verify mood records persist correctly.

---

# 15. BUILD VERIFICATION

After implementation:

Run:

```bash
pnpm build
```

There must be:

- 0 TypeScript errors
- Successful frontend Vite build
- Successful backend build

If there are errors, fix them before reporting completion.

---

# 16. FINAL VERIFICATION

Before saying the task is complete, verify manually:

1. Login.
2. Open `/mood`.
3. Select a mood.
4. Add an optional note.
5. Save.
6. Confirm success.
7. Refresh the page.
8. Confirm the mood still exists.
9. Confirm it appears in history.
10. Confirm the 7-day graph reflects it.
11. Confirm the dashboard shows today's mood.
12. Try submitting another check-in the same day.
13. Log in as another user and verify the first user's mood is not visible.
14. Test mobile/responsive layout.
15. Run `pnpm build`.

---

# 17. IMPORTANT: DO NOT EXPAND SCOPE

Do NOT implement:

- Therapist accounts
- Video calls
- Voice calls
- Wearables
- Facial emotion recognition
- AI mood diagnosis
- Advanced machine-learning mood prediction
- Admin dashboard
- Social features
- Mood sharing
- Push notifications
- Email notifications
- Complex analytics
- Medication recommendations
- Medical diagnosis

Keep the implementation focused on:

**Daily Mood Check-In + Mood History + 7-Day Trend + Dashboard Summary**

When finished, provide a concise implementation report containing:

1. Files created/modified
2. API endpoints
3. Database changes/migrations
4. Frontend features
5. Tests performed and their results
6. `pnpm build` result
7. Any remaining issues
8. Recommended next task