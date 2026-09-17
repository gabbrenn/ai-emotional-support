export type ResourceCategory = 'Stress' | 'Emotions' | 'Daily Habits' | 'Coping';

export interface Resource {
  id: string;
  category: ResourceCategory;
  icon: string;
  title: string;
  description: string;
  tips: string[];
}

export const RESOURCES: Resource[] = [
  {
    id: 'managing-stress',
    category: 'Stress',
    icon: '\u{1F32C}\uFE0F',
    title: 'Managing Everyday Stress',
    description:
      'Stress is a normal part of life. Small, consistent habits can help you manage it before it builds up.',
    tips: [
      'Take short breaks throughout the day \u2014 even a few minutes helps.',
      'Try slow, deep breathing: inhale for 4 counts, hold for 4, exhale for 6.',
      'Break an overwhelming task into the next one small step.',
      'Maintain a regular sleep and wake time, even at weekends.',
      'Talk with someone you trust about what is on your mind.',
    ],
  },
  {
    id: 'breathing-exercises',
    category: 'Stress',
    icon: '\u{1FAB1}',
    title: 'Simple Breathing Techniques',
    description:
      "Slow, controlled breathing activates the body's natural calming response and can reduce feelings of stress or anxiety within minutes.",
    tips: [
      'Box breathing: breathe in 4 counts, hold 4, out 4, hold 4 \u2014 repeat 4 times.',
      '4-7-8 breathing: in for 4, hold for 7, out for 8.',
      'Place one hand on your chest and one on your belly \u2014 aim to breathe into your belly.',
      'Practice for just 2\u20135 minutes to notice a difference.',
      'Use it before a stressful event or when you feel tension building.',
    ],
  },
  {
    id: 'understanding-emotions',
    category: 'Emotions',
    icon: '\u{1F49B}',
    title: 'Understanding Your Emotions',
    description:
      'Emotions can shift from moment to moment. Noticing and naming what you feel can help you understand yourself better and respond rather than react.',
    tips: [
      'Pause and ask yourself: "What am I feeling right now?"',
      'Name the emotion \u2014 even broadly (sad, anxious, frustrated, relieved).',
      'Notice what may have triggered the feeling.',
      'Write down your thoughts \u2014 this can help create a little distance.',
      'Give yourself time before responding in difficult situations.',
    ],
  },
  {
    id: 'journalling',
    category: 'Emotions',
    icon: '\u{1F4D3}',
    title: 'Writing About How You Feel',
    description:
      'Writing can be a low-pressure way to process emotions and notice patterns in how you think and feel.',
    tips: [
      "You don't need a special journal \u2014 any notebook or notes app works.",
      'Try writing for 5\u201310 minutes without editing yourself.',
      'Start with: "Right now I feel\u2026" and keep going.',
      'Look back occasionally \u2014 patterns become easier to spot over time.',
      "It's private \u2014 there's no right or wrong way to do it.",
    ],
  },
  {
    id: 'healthy-daily-habits',
    category: 'Daily Habits',
    icon: '\u{1F33F}',
    title: 'Building a Healthy Daily Routine',
    description:
      'Small, consistent daily habits support both mental and physical wellbeing. These are not medical treatments but general ideas that many people find helpful.',
    tips: [
      'Aim for a consistent sleep schedule \u2014 going to bed and waking at similar times.',
      'Eat regular meals when you can \u2014 skipping meals can affect mood and energy.',
      'Include some physical movement each day, even a short walk.',
      'Take regular breaks from screens, especially before bed.',
      'Make time for social connection \u2014 a quick message or call can help.',
      'Spend some time outdoors, even briefly.',
    ],
  },
  {
    id: 'sleep-hygiene',
    category: 'Daily Habits',
    icon: '\u{1F319}',
    title: 'Supporting Better Sleep',
    description:
      "Sleep affects mood, concentration, and resilience. These ideas may help if you're finding it difficult to wind down or get a good night's rest.",
    tips: [
      'Try to go to bed and wake up at the same time each day.',
      'Avoid screens for 30\u201360 minutes before bed if possible.',
      'Keep your bedroom cool, dark, and quiet where you can.',
      'Avoid caffeine in the afternoon and evening.',
      "A short wind-down routine \u2014 reading, stretching, or calm breathing \u2014 can signal to your body it's time to sleep.",
    ],
  },
  {
    id: 'coping-when-difficult',
    category: 'Coping',
    icon: '\u{1F91D}',
    title: 'Coping When Things Feel Difficult',
    description:
      'There are times when everything feels heavy. These suggestions are not a cure, but they can help you get through a hard moment.',
    tips: [
      'Focus on just one small, manageable thing you can do right now.',
      "Reach out to someone you trust \u2014 you don't have to explain everything.",
      "Step away from the situation briefly if it's safe to do so.",
      'Use slow breathing to help your body settle.',
      'Remind yourself that difficult feelings do pass.',
      "If you're struggling to cope, consider speaking with a professional \u2014 it is a sign of strength, not weakness.",
    ],
  },
  {
    id: 'grounding-techniques',
    category: 'Coping',
    icon: '\u{1F331}',
    title: 'Grounding Techniques',
    description:
      'Grounding techniques can help you feel more connected to the present moment when you feel overwhelmed, anxious, or detached.',
    tips: [
      '5-4-3-2-1: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.',
      'Hold something cold or textured and focus your attention on the physical sensation.',
      'Place your feet flat on the floor and notice the contact.',
      'Describe your surroundings in detail to yourself, as if explaining them to someone.',
      'Splash cool water on your face or hands.',
    ],
  },
];

export const ALL_CATEGORIES: ResourceCategory[] = [
  'Stress',
  'Emotions',
  'Daily Habits',
  'Coping',
];
