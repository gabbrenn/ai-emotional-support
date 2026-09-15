# Task: Redesign the Frontend for a Professional, Trustworthy Wellbeing Application

The authentication functionality is complete and verified.

Before implementing the AI chat, redesign the existing frontend visual style.

## Important Context

The current frontend looks too much like an AI-generated interface because of:

- Neon colors
- Excessive glow effects
- Blur/glassmorphism
- Strong gradients
- Excessive rounded cards
- Decorative effects
- "AI futuristic" visual language

This is NOT the desired direction.

The application is an **AI Emotional Support Assistant**, so users must perceive it as:

- Safe
- Calm
- Professional
- Trustworthy
- Human-centered
- Accessible
- Modern but restrained

Think of a professional wellbeing/health application, NOT a futuristic AI dashboard.

---

# Design Direction

Use a clean, minimal visual system.

### Colors

Use a restrained palette.

Prefer:

```text
Background: warm white / very light neutral
Surface: white
Primary: muted teal / calm blue-green
Secondary: slate
Text: dark slate
Muted text: gray
Border: light gray
Success: subtle green
Warning: muted amber
Danger: restrained red
```

Avoid extremely saturated colors.

Do NOT use:

- Neon green
- Neon blue
- Neon purple
- Cyberpunk colors
- Bright glowing gradients

---

# Effects

Remove or greatly reduce:

- backdrop blur
- glassmorphism
- glowing borders
- neon shadows
- animated gradients
- excessive shadows
- floating decorative shapes

Cards should primarily use:

```text
white background
subtle border
very light shadow
```

Use shadows sparingly.

The UI should still look good if all decorative effects are disabled.

---

# Typography

Use a clean professional sans-serif font.

Prioritize readability.

Use a clear hierarchy:

```text
Page title
Section heading
Body text
Secondary/help text
```

Do not use futuristic or decorative fonts.

---

# Border Radius

Reduce excessive rounding.

Use moderate corner radius.

Not every element needs to look like a pill.

Buttons can have moderate radius.

Cards should have moderate radius.

Inputs should have moderate radius.

---

# Layout

Keep the existing authenticated application structure:

```text
Sidebar
    ↓
Main content
```

Desktop:

```text
┌──────────────┬─────────────────────────────────────┐
│              │                                     │
│ MindCare AI  │             Main Content            │
│              │                                     │
│ Dashboard   │                                     │
│ AI Chat     │                                     │
│ My Mood     │                                     │
│ Resources   │                                     │
│ Profile     │                                     │
│              │                                     │
│              │                                     │
│ Logout      │                                     │
└──────────────┴─────────────────────────────────────┘
```

The sidebar should be simple and professional.

Do not make it look like an AI control panel.

---

# Branding

Use:

**MindCare AI**

Tagline:

**A private space to talk, reflect, and find support.**

Do not overuse the word "AI" throughout the interface.

The product should feel like a wellbeing application first.

---

# Dashboard

Redesign `/dashboard`.

Use a simple layout.

Example:

```text
Good afternoon, John

How are you feeling today?

[ 😊 ] [ 🙂 ] [ 😐 ] [ 😔 ] [ 😣 ] [ 😡 ]

Your wellbeing
────────────────────────────────

Recent mood
No mood recorded today

[ Check in your mood ]

Talk to someone
────────────────────────────────

I'm here to listen whenever you need
a safe space to reflect.

[ Start a conversation ]
```

Do not implement new mood functionality yet.

This is only visual/UI work.

---

# Login / Register

Redesign the authentication pages to look trustworthy.

Avoid:

- Neon backgrounds
- Large glowing blobs
- Glass cards
- AI-themed animations

Use a simple centered authentication layout.

Example:

```text
MindCare AI

A private space to talk, reflect, and find support.

Email
[________________________]

Password
[________________________]

[ Sign in ]

Don't have an account?
Create one
```

Add a small, subtle disclaimer:

> MindCare AI provides general emotional support and is not a replacement for professional care.

---

# Navigation

Use clear labels:

```text
Dashboard
AI Chat
My Mood
Resources
Profile
```

Use simple icons.

Icons should support navigation, not become decorative elements.

---

# Accessibility

Make the redesign accessible:

- Strong text contrast
- Visible focus states
- Keyboard-friendly controls
- Clear error messages
- Proper labels
- Don't rely solely on color to communicate meaning
- Buttons must clearly look clickable
- Inputs must clearly look editable

---

# Responsive Design

Ensure the interface works on:

- Desktop
- Laptop
- Tablet
- Mobile

On mobile, convert the sidebar into a compact navigation/header or mobile menu.

---

# Important Constraint

Do NOT change backend functionality.

Do NOT change:

- Authentication API
- Database
- JWT implementation
- API routes

Only modify the frontend visual system and components necessary for the redesign.

Do not add unnecessary dependencies.

---

# Verification

After the redesign:

```text
✓ Login works
✓ Registration works
✓ Logout works
✓ Protected routes still work
✓ Dashboard loads
✓ No TypeScript errors
✓ pnpm build succeeds
✓ Desktop layout works
✓ Mobile layout works
```

Most importantly:

The final interface should look like a **real professional wellbeing product**, not an AI-generated futuristic UI.

Do not add new features in this task.

At the end, report the files changed and confirm the build result.