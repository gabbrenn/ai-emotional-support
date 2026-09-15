# Task: Implement the AI Emotional Support Chat

The project foundation and authentication are complete and verified.

The frontend visual redesign is also complete.

Now implement the **AI Chat feature** end-to-end.

This is the main feature of the application.

## Goal

An authenticated user should be able to:

1. Open `/chat`
2. Create a new conversation
3. Send a message
4. Receive a supportive AI response
5. See the conversation in the chat interface
6. Have both user and assistant messages saved to SQLite
7. Return later and see previous conversations
8. Continue an existing conversation

Use the existing architecture:

```text
React + Vite
      ↓
Fastify + TypeScript
      ↓
Drizzle
      ↓
SQLite
```

Use **OpenRouter** as the AI provider.

---

# 1. OpenRouter configuration

Use the backend environment variable:

```text id="3h0l1w"
OPENROUTER_API_KEY=
```

Do NOT expose this key to React/Vite.

Do NOT create:

```text
VITE_OPENROUTER_API_KEY
```

The frontend must never have access to the OpenRouter key.

The architecture must be:

```text id="p8e1d6"
React
  │
  │ POST /api/chat/...
  ▼
Fastify Backend
  │
  │ OpenRouter API
  ▼
OpenRouter
  │
  ▼
AI model
  │
  ▼
Fastify
  │
  ▼
React
```

---

# 2. AI model

Use OpenRouter's free model routing where practical.

Prefer the OpenRouter free router:

```text id="2j3y3m"
openrouter/free
```

If the API requires a specific currently available free model instead, make the model configurable through:

```text id="bq7r4a"
OPENROUTER_MODEL=
```

Use a sensible free model as the development default.

Do not hardcode the API key.

---

# 3. AI system instructions

Create a backend service responsible for the AI behavior.

For example:

```text id="qg9h4k"
apps/api/src/services/ai.service.ts
```

The assistant should behave as a **supportive wellbeing assistant**, NOT a therapist or doctor.

System instructions should establish that the assistant:

- Responds empathetically.
- Listens to the user's concerns.
- Provides general wellbeing guidance.
- Encourages healthy coping strategies.
- Asks gentle follow-up questions when appropriate.
- Avoids diagnosing mental health conditions.
- Does not prescribe medication.
- Does not claim to replace professional therapy.
- Encourages professional support when appropriate.
- Never encourages self-harm or harmful behavior.
- Does not make the user dependent on the AI.
- Uses clear, natural language.
- Avoids excessive disclaimers in every response.

The assistant should sound like a calm, supportive human conversation rather than a robotic chatbot.

---

# 4. API endpoints

Create authenticated endpoints.

## Create conversation

```text id="k4d9js"
POST /api/conversations
```

Creates a new conversation for the authenticated user.

Response:

```json id="0jq8p4"
{
  "conversation": {
    "id": 1,
    "title": "New conversation",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## List conversations

```text id="4y0c6z"
GET /api/conversations
```

Return only conversations belonging to the authenticated user.

Sort newest first.

Example:

```json id="3m1tw0"
{
  "conversations": [
    {
      "id": 3,
      "title": "Exam stress",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

## Get conversation

```text id="7r6k1m"
GET /api/conversations/:id
```

Return:

```text id="ux5t9h"
conversation
messages[]
```

Verify that the conversation belongs to the authenticated user.

Never allow one user to access another user's conversation.

---

## Send message

Create:

```text id="4z9b9q"
POST /api/conversations/:id/messages
```

Request:

```json id="s1p2jq"
{
  "content": "I've been feeling stressed about my exams."
}
```

Requirements:

1. Authenticate user.
2. Verify conversation ownership.
3. Validate message with Zod.
4. Reject empty messages.
5. Apply a reasonable maximum message length.
6. Save the user message.
7. Retrieve relevant conversation history.
8. Send the conversation to OpenRouter.
9. Receive AI response.
10. Save the AI response.
11. Return both the user message and assistant message.

Example response:

```json id="4nq8tw"
{
  "userMessage": {
    "id": 10,
    "sender": "user",
    "content": "I've been feeling stressed about my exams.",
    "riskLevel": "low",
    "createdAt": "..."
  },
  "assistantMessage": {
    "id": 11,
    "sender": "assistant",
    "content": "That sounds really stressful...",
    "riskLevel": "low",
    "createdAt": "..."
  }
}
```

---

# 5. Conversation history

When sending a new message to OpenRouter, include previous messages from the SAME conversation as context.

Convert database messages into the appropriate AI message format.

Example:

```text id="l7d7h2"
system
user
assistant
user
assistant
user
```

Do not send unrelated users' conversations.

Limit conversation history to a reasonable number of recent messages so the application remains fast and inexpensive.

For example, use the most recent 20 messages.

---

# 6. Conversation title

When the first user message is sent, automatically generate a simple conversation title from the message.

Do NOT make a second AI request just to generate the title.

Use a simple local strategy such as:

```text id="5yn2be"
"I am stressed because of my exams"
        ↓
"Exam stress"
```

A simple truncated/sanitized title is enough.

---

# 7. Error handling

Handle:

- Missing API key
- OpenRouter unavailable
- Request timeout
- Rate limit
- Invalid response
- Empty AI response
- Network failure
- Database failure

The frontend should receive a friendly error.

Never expose:

- API keys
- internal stack traces
- raw provider errors containing sensitive information

Example user-facing error:

> I'm having trouble responding right now. Please try again in a moment.

---

# 8. Frontend chat page

Implement:

```text id="f0eq7v"
/chat
```

Use the existing professional design system.

DO NOT reintroduce:

- Neon effects
- Glowing cards
- Excessive blur
- Glassmorphism
- Futuristic AI styling
- Huge gradients

The chat should look like a trustworthy wellbeing application.

---

# 9. Chat layout

Desktop:

```text id="m9kq5u"
┌────────────────┬──────────────────────────────────┐
│ Conversations  │                                  │
│                │  AI Emotional Support             │
│ + New Chat     │                                  │
│                │  AI: Hi, I'm here to listen.     │
│ Exam stress    │                                  │
│ Feeling tired  │               User: I'm stressed │
│                │                                  │
│                │  AI: That sounds difficult...    │
│                │                                  │
│                │                                  │
│                ├──────────────────────────────────┤
│                │ Type a message...          Send  │
└────────────────┴──────────────────────────────────┘
```

On mobile, the conversation list should collapse into a suitable mobile navigation/control.

---

# 10. Chat behavior

Implement:

### New conversation

Button:

```text
+ New conversation
```

Creates a conversation and opens it.

### Existing conversation

Clicking a conversation loads its messages.

### Send

User enters:

```text
I'm feeling overwhelmed.
```

Then:

```text
User message appears immediately
        ↓
Loading/typing state
        ↓
AI response
```

Disable the send button while the request is processing.

Allow Enter to send.

Use Shift+Enter for a newline.

---

# 11. Loading state

While waiting for the AI:

Show a subtle typing indicator such as:

```text
AI is thinking...
● ● ●
```

Do not use excessive animation.

---

# 12. Empty state

When there are no conversations, show:

```text
How can I support you today?

You can talk about stress, school,
relationships, motivation, or simply
how you're feeling.

[ Start a conversation ]
```

Keep the wording supportive but do not imply therapy.

---

# 13. Safety foundation

The database already contains:

```text
risk_level
```

Do NOT build a complicated clinical risk classifier yet.

For this task, create a small service boundary such as:

```text id="mbc9zj"
risk.service.ts
```

with:

```text
classifyRisk(message): low | moderate | high
```

For now, implement a conservative basic rule-based detector for clearly high-risk/self-harm language.

Examples of high-risk indicators may include direct statements about:

- wanting to die
- wanting to kill oneself
- planning suicide
- immediate self-harm
- actively hurting oneself

Do not attempt to diagnose mental illness.

For moderate risk, identify clear expressions of severe hopelessness/distress where appropriate.

Everything else can be:

```text
low
```

Keep this implementation modular because we will improve the safety behavior in the next task.

---

# 14. High-risk behavior

If the message is classified as `high`:

Do NOT simply send the message to the normal AI flow and hope the model handles it.

Instead, return a safe, supportive response that:

- Acknowledges the user's distress.
- Encourages immediate contact with a trusted person.
- Encourages contacting local emergency/crisis/professional support.
- Encourages moving away from immediate means of harm if relevant.
- Makes clear that the AI cannot provide emergency care.

Keep the response concise and compassionate.

We will improve the crisis-resource experience in a later task.

---

# 15. Database

Use the existing:

```text
conversations
messages
```

tables.

Do not create unnecessary new tables.

Make sure:

```text
conversation.user_id → users.id
message.conversation_id → conversations.id
```

are respected.

---

# 16. API client

Extend the existing frontend API service.

Create functions such as:

```text id="w0w7g0"
getConversations()
createConversation()
getConversation(id)
sendMessage(id, content)
```

Do not make raw `fetch()` calls throughout React components.

---

# 17. React state

Keep the implementation simple.

You may use:

- React state
- Context where appropriate
- Existing project utilities

Do NOT introduce Redux unless absolutely necessary.

---

# 18. Authentication

Every conversation endpoint must require the existing JWT authentication.

The frontend must send:

```text
Authorization: Bearer <token>
```

Do not create a second authentication mechanism.

---

# 19. Verification

Actually test the entire flow.

### Backend

```text
✓ Create conversation
✓ List conversations
✓ Get conversation
✓ Send message
✓ User message saved
✓ AI response saved
✓ Conversation history works
✓ Conversation ownership enforced
✓ Unauthorized requests rejected
✓ Empty message rejected
✓ Excessively long message rejected
✓ OpenRouter error handled
```

### Safety

Test examples such as:

```text
Normal:
"I'm tired after studying."

Moderate:
"I've been feeling hopeless lately."

High:
"I want to kill myself."
```

Verify that risk levels are stored appropriately and high-risk messages receive the safety response.

### Frontend

```text
✓ /chat loads
✓ Conversations load
✓ New conversation works
✓ Messages display correctly
✓ Send works
✓ Loading state works
✓ Errors display correctly
✓ Existing conversation can be reopened
✓ Logout still works
✓ Protected route still works
```

### Build

Run:

```bash id="z0t3gt"
pnpm build
```

Fix all TypeScript/build errors.

---

# 20. Important scope restriction

Do NOT implement:

- Voice chat
- Image analysis
- Speech recognition
- File uploads
- Therapist accounts
- Video calls
- WebSockets
- Redis
- Streaming if it significantly complicates the implementation
- Advanced machine-learning sentiment models
- Complex clinical risk scoring

A normal request/response AI chat is completely sufficient for this 3-day project.

The priority is:

**Reliable + simple + working.**

At the end, report:

1. Files created/modified
2. API endpoints
3. OpenRouter configuration
4. AI model used
5. Safety detection implementation
6. Tests performed
7. Build result
8. Any remaining issues
9. The next recommended task