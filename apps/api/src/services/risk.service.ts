export type RiskLevel = 'low' | 'moderate' | 'high';

// High-risk: direct expressions of suicidal ideation, self-harm planning, or immediate danger
const HIGH_RISK_PATTERNS = [
  /\b(i want to|i('m going to|m gonna))\s+(kill|end|hurt|harm)\s+(my)?self\b/i,
  /\bkill\s+myself\b/i,
  /\bsuicide\b.*\b(plan|try|going|want|decided|thinking)\b/i,
  /\b(thinking|thought|planning|going)\s+about\s+(killing|ending|hurting)\s+(myself|my life)\b/i,
  /\bwant to die\b/i,
  /\bend my life\b/i,
  /\bno reason to live\b/i,
  /\btake my (own )?life\b/i,
  /\b(cutting|burning|hurting)\s+myself\b/i,
  /\bself.?harm\b/i,
  /\boverdose\b/i,
];

// Moderate-risk: severe hopelessness, feeling worthless, prolonged despair
const MODERATE_RISK_PATTERNS = [
  /\b(feel(ing)?|felt|am|be)\s+(hopeless|worthless|useless)\b/i,
  /\bhopeless(ness)?\b/i,
  /\b(completely|totally|absolutely)\s+(hopeless|worthless|useless)\b/i,
  /\bnobody\s+(cares|would miss me|would notice)\b/i,
  /\bi('m| am)\s+(a burden|better off dead)\b/i,
  /\b(can't|cannot)\s+(go on|take it anymore|cope)\b/i,
  /\bfeel(ing)?\s+(trapped|stuck|empty|numb)\b/i,
  /\blife is (not|not worth|meaningless)\b/i,
  /\bdon't (want to be|see a point in)\b/i,
];

export function classifyRisk(message: string): RiskLevel {
  const normalized = message.toLowerCase();

  for (const pattern of HIGH_RISK_PATTERNS) {
    if (pattern.test(normalized)) {
      return 'high';
    }
  }

  for (const pattern of MODERATE_RISK_PATTERNS) {
    if (pattern.test(normalized)) {
      return 'moderate';
    }
  }

  return 'low';
}

export const CRISIS_RESPONSE = `I'm really glad you reached out, and I want you to know that what you're going through matters deeply.

What you've shared tells me you're in a very difficult place right now, and I'm not equipped to give you the level of support you deserve in this moment.

Please reach out right now to someone who can truly help:
• **Emergency services**: Call 112 (EU) or 911 (US) if you're in immediate danger
• **Crisis line**: In many countries you can call or text a local crisis helpline — they are free, confidential, and available 24/7
• **Trusted person**: Is there a friend, family member, teacher, or counsellor you can contact right now?

You don't have to face this alone. Please reach out — your life has value.`;
