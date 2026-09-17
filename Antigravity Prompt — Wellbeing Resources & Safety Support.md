# MindCare AI — Wellbeing Resources & Safety Support

Authentication, AI Chat, and Mood Tracking are already implemented and working.

Your next task is to implement the **Wellbeing Resources & Safety Support** feature end-to-end.

## 1. IMPORTANT RULES

Before changing anything, inspect the existing project and reuse its current architecture and design system.

Do NOT break or rewrite:

- Authentication
- JWT handling
- AI Chat
- Risk detection
- Mood Tracking
- Existing database structure
- Existing navigation/layout

Keep this feature focused and simple.

Do NOT introduce unnecessary dependencies.

The UI must remain:

- Professional
- Calm
- Trustworthy
- Accessible
- Responsive
- Consistent with the existing MindCare AI design

Avoid:

- Neon colors
- Glowing effects
- Glassmorphism
- Futuristic AI styling
- Excessive gradients
- Excessive animations
- Excessive rounded cards

---

# 2. RESOURCES PAGE

Implement the existing `/resources` route as a complete page.

Page heading:

**Wellbeing Resources**

Supporting text:

**Simple information and practical ideas to support your wellbeing.**

Organize resources into clear categories.

Use these categories:

### Managing Stress

Provide short, practical guidance such as:

- Taking short breaks
- Slow breathing
- Organizing overwhelming tasks
- Maintaining a regular sleep routine
- Talking with someone you trust

### Understanding Your Emotions

Explain that emotions can change and that noticing and naming emotions can help people reflect on what they are experiencing.

Include practical suggestions:

- Identify what you're feeling
- Notice possible triggers
- Write down thoughts
- Give yourself time before reacting
- Talk to someone you trust

### Healthy Daily Habits

Include general wellbeing guidance around:

- Sleep
- Regular meals
- Physical activity
- Taking breaks from screens
- Social connection
- Time outdoors

Do not present these as medical treatments.

### Coping When Things Feel Difficult

Provide supportive, practical suggestions:

- Focus on one manageable task
- Reach out to someone you trust
- Take a short break
- Use slow breathing
- Move to a safer or calmer environment
- Seek professional support when needed

Keep the wording supportive without pretending that these techniques solve serious mental-health conditions.

---

# 3. RESOURCE CARD DESIGN

Each resource should be presented using a clean card or section.

Each card should contain:

- Small category/icon
- Title
- Short description
- Practical tips
- Optional "Learn more" interaction if useful

Do not create dozens of cards.

Aim for approximately 6–10 useful resources total.

Keep the content concise enough that the page does not feel like a textbook.

---

# 4. SAFETY SUPPORT SECTION

The Resources page must contain a clearly visible section titled:

**Need urgent support?**

Explain:

**MindCare AI is not a replacement for a mental-health professional or emergency service. If you or someone else may be in immediate danger, contact your local emergency service or go to the nearest emergency department.**

Also encourage the user to:

- Contact someone they trust
- Reach out to a qualified mental-health professional
- Seek immediate emergency help when there is immediate danger

Do not make the safety section overly frightening.

It should be calm, clear, and easy to find.

---

# 5. CRISIS RESOURCE CONTENT

The application is intended to be usable internationally, so do NOT hard-code an incorrect country-specific crisis number as though it applies to everyone.

Instead, provide:

**Emergency support**

> If you are in immediate danger, contact your local emergency service or go to the nearest emergency department.

And:

**Trusted support**

> Consider contacting a trusted friend, family member, teacher, counselor, healthcare professional, or another person who can stay with you.

If the existing AI safety response contains specific crisis information, inspect it and keep the Resources page consistent with it, but do not duplicate or contradict the existing safety system.

---

# 6. PROFESSIONAL HELP SECTION

Add a section:

**When to seek professional support**

Explain in simple language that professional support can be useful when difficult emotions, stress, anxiety, low mood, or other problems:

- Persist for a long time
- Interfere with school, work, relationships, sleep, or daily activities
- Feel difficult to manage alone
- Cause significant distress

Encourage users to consider speaking with an appropriate qualified professional.

Do not diagnose the user.

Do not tell the user that they definitely have a condition.

---

# 7. DISCLAIMER

Add a subtle but visible disclaimer near the bottom:

**MindCare AI provides general wellbeing information and emotional support. It does not provide medical diagnoses, prescribe medication, or replace qualified professional care.**

This should also be consistent with the AI Chat system prompt.

---

# 8. SEARCH / FILTER

If the existing page structure makes it easy, add a simple category filter.

Possible filters:

- All
- Stress
- Emotions
- Daily habits
- Coping
- Professional support

This is optional.

Do NOT build a complex search engine.

If implementing a filter would add unnecessary complexity, use category sections instead.

---

# 9. FRONTEND ARCHITECTURE

Reuse existing components where possible.

If useful, create components such as:

```text
ResourceCard.tsx
ResourceCategory.tsx
SafetySupport.tsx
```

But don't create components just for the sake of creating them.

Keep the page maintainable.

---

# 10. RESOURCE DATA

Do not create a database table just for static wellbeing resources unless the existing architecture clearly requires it.

For this project, static resource content can live in a frontend data/config file.

For example:

```text
apps/web/src/data/resources.ts
```

Use typed resource objects.

Example structure:

```ts
{
  id: "managing-stress",
  category: "Stress",
  title: "Managing Everyday Stress",
  description: "...",
  tips: [
    "...",
    "...",
    "..."
  ]
}
```

Keep resource content local and deterministic.

No AI call is needed to generate resources.

---

# 11. DASHBOARD INTEGRATION

Inspect the existing Dashboard.

Add a small **Wellbeing Resources** section or quick action.

For example:

**Explore wellbeing resources**

Get practical ideas for managing stress, understanding emotions, and supporting everyday wellbeing.

Button:

**View Resources**

Link to:

`/resources`

Do not redesign the entire dashboard yet.

---

# 12. CHAT INTEGRATION

Do not modify the AI Chat architecture unnecessarily.

However, if there is already a natural place for a link from the chat interface, add:

**Explore wellbeing resources**

which navigates to `/resources`.

Do not make the AI call the Resources API.

Do not add another AI request.

---

# 13. SAFETY CONSISTENCY

Inspect:

```text
apps/api/src/services/risk.service.ts
```

and the existing high-risk response.

Make sure the Resources page does not contradict the existing high-risk safety behavior.

The existing safety system should remain responsible for detecting high-risk messages.

The Resources page is educational/supportive content, not a replacement for the safety detector.

Do NOT redesign the risk classifier in this task.

---

# 14. ACCESSIBILITY

Ensure:

- Proper heading hierarchy
- Keyboard-accessible buttons/links
- Visible focus states
- Good text contrast
- Responsive layout
- Icons are not the only way information is communicated
- Links have meaningful labels
- Cards do not depend solely on color

---

# 15. RESPONSIVE DESIGN

Desktop:

- Comfortable content width
- Clear category organization
- Two-column cards where appropriate

Mobile:

- Single-column layout
- Comfortable touch targets
- Safety section remains easy to find
- No horizontal overflow

---

# 16. TESTING

Test:

### Navigation

- `/resources` loads for authenticated users.
- Navigation link works.
- Dashboard resource link works.

### Content

Verify:

- All resource categories render.
- Safety support section renders.
- Professional support section renders.
- Disclaimer renders.

### Authentication

If `/resources` is protected by the existing application routing, verify unauthenticated users are handled consistently with the other protected pages.

Do not create a separate authentication system.

### Responsive

Check desktop and mobile layouts.

### Existing functionality

Verify:

- Login still works.
- Chat still works.
- Mood page still works.
- Dashboard still works.

---

# 17. BUILD VERIFICATION

Run:

```bash
pnpm build
```

There must be:

- 0 TypeScript errors
- Successful backend build
- Successful frontend Vite build

Fix any errors before reporting completion.

---

# 18. FINAL VERIFICATION

Manually verify:

1. Login.
2. Open `/resources`.
3. Confirm the page loads correctly.
4. Read through every resource.
5. Confirm categories are organized clearly.
6. Confirm the urgent-support section is visible.
7. Confirm the professional-support section is visible.
8. Confirm the disclaimer is present.
9. Test all navigation links.
10. Check mobile layout.
11. Return to Dashboard.
12. Confirm Resources quick action works.
13. Open Chat and verify existing chat functionality still works.
14. Open Mood and verify existing mood functionality still works.
15. Run `pnpm build`.

---

# 19. DO NOT EXPAND SCOPE

Do NOT implement:

- Therapist marketplace
- Therapist accounts
- Appointment booking
- Video calls
- Voice calls
- Medical diagnosis
- AI-generated medical advice
- Medication recommendations
- Web scraping
- Complex resource CMS
- Admin panel
- Notifications
- Email campaigns
- Social/community features

The goal is simply:

**A professional, trustworthy Resources & Safety section integrated into MindCare AI.**

When finished, provide a concise implementation report containing:

1. Files created/modified
2. Resources/categories implemented
3. Safety-support implementation
4. Dashboard integration
5. Tests performed
6. `pnpm build` result
7. Any remaining issues
8. Recommended next task