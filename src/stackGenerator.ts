import { Stack, Card, CardObject } from './types';

interface TemplateMatch {
  score: number;
  template: string;
  params?: Record<string, string>;
}

const templates = {
  counter: (params: Record<string, string>): Stack => ({
    id: `stack-${Date.now()}`,
    name: params.name || 'Counter',
    description: params.description || 'A simple counter',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    currentCardId: 'card-1',
    cards: [
      {
        id: 'card-1',
        name: 'Counter',
        background: '#f0f4f8',
        objects: [
          {
            id: 'title',
            type: 'text',
            content: params.name || 'Counter',
            x: 20,
            y: 20,
            width: 360,
            height: 40,
            fontSize: 24,
            bold: true,
          },
          {
            id: 'counter-field',
            type: 'field',
            label: params.label || 'Count',
            value: '0',
            x: 150,
            y: 100,
            width: 100,
            height: 50,
            fieldType: 'number',
            editable: false,
          },
          {
            id: 'increment-btn',
            type: 'button',
            label: `+${params.increment || '1'}`,
            x: 100,
            y: 180,
            width: 80,
            height: 40,
            actions: [
              {
                type: 'incrementField',
                targetFieldId: 'counter-field',
                value: params.increment || '1',
              },
            ],
          },
          {
            id: 'decrement-btn',
            type: 'button',
            label: `-${params.increment || '1'}`,
            x: 220,
            y: 180,
            width: 80,
            height: 40,
            actions: [
              {
                type: 'incrementField',
                targetFieldId: 'counter-field',
                value: `-${params.increment || '1'}`,
              },
            ],
          },
          {
            id: 'reset-btn',
            type: 'button',
            label: 'Reset',
            x: 150,
            y: 240,
            width: 100,
            height: 40,
            actions: [
              {
                type: 'setField',
                targetFieldId: 'counter-field',
                value: '0',
              },
            ],
          },
        ],
      },
    ],
  }),

  tracker: (params: Record<string, string>): Stack => ({
    id: `stack-${Date.now()}`,
    name: params.name || 'Daily Tracker',
    description: params.description || 'Track daily progress',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    currentCardId: 'card-1',
    cards: [
      {
        id: 'card-1',
        name: 'Tracker',
        background: '#e3f2fd',
        objects: [
          {
            id: 'title',
            type: 'text',
            content: params.name || 'Daily Tracker',
            x: 20,
            y: 20,
            width: 360,
            height: 40,
            fontSize: 24,
            bold: true,
          },
          {
            id: 'description',
            type: 'text',
            content: params.unit ? `Goal: ${params.goal || '8'} ${params.unit} per day` : 'Track your progress',
            x: 20,
            y: 70,
            width: 360,
            height: 30,
            fontSize: 14,
            bold: false,
          },
          {
            id: 'tracker-field',
            type: 'field',
            label: params.unit ? `${params.unit} today` : 'Progress',
            value: '0',
            x: 150,
            y: 120,
            width: 100,
            height: 50,
            fieldType: 'number',
            editable: false,
          },
          {
            id: 'add-btn',
            type: 'button',
            label: `+1 ${params.unit || ''}`.trim(),
            x: 150,
            y: 190,
            width: 100,
            height: 40,
            actions: [
              {
                type: 'incrementField',
                targetFieldId: 'tracker-field',
                value: '1',
              },
            ],
          },
          {
            id: 'reset-btn',
            type: 'button',
            label: 'Reset Day',
            x: 150,
            y: 240,
            width: 100,
            height: 40,
            actions: [
              {
                type: 'setField',
                targetFieldId: 'tracker-field',
                value: '0',
              },
            ],
          },
        ],
      },
    ],
  }),

  checklist: (params: Record<string, string>): Stack => {
    const itemCount = parseInt(params.itemCount || '5');
    const objects: CardObject[] = [
      {
        id: 'title',
        type: 'text',
        content: params.name || 'Checklist',
        x: 20,
        y: 20,
        width: 360,
        height: 40,
        fontSize: 24,
        bold: true,
      },
    ];

    for (let i = 0; i < itemCount; i++) {
      const y = 80 + i * 50;
      objects.push(
        {
          id: `checkbox-${i}`,
          type: 'field',
          label: '',
          value: '☐',
          x: 30,
          y,
          width: 30,
          height: 30,
          fieldType: 'text',
          editable: false,
        },
        {
          id: `task-${i}`,
          type: 'field',
          label: '',
          value: `Task ${i + 1}`,
          x: 70,
          y: y + 5,
          width: 200,
          height: 30,
          fieldType: 'text',
          editable: true,
        },
        {
          id: `toggle-${i}`,
          type: 'button',
          label: '✓',
          x: 280,
          y,
          width: 40,
          height: 30,
          actions: [
            {
              type: 'toggleField',
              targetFieldId: `checkbox-${i}`,
              value: '☐|☑',
            },
          ],
        }
      );
    }

    return {
      id: `stack-${Date.now()}`,
      name: params.name || 'Checklist',
      description: params.description || 'A simple checklist',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      currentCardId: 'card-1',
      cards: [
        {
          id: 'card-1',
          name: 'Checklist',
          background: '#fff8e1',
          objects,
        },
      ],
    };
  },

  habit: (params: Record<string, string>): Stack => {
    const habitCount = parseInt(params.habitCount || '5');
    const objects: CardObject[] = [
      {
        id: 'title',
        type: 'text',
        content: params.name || 'Habit Tracker',
        x: 20,
        y: 20,
        width: 360,
        height: 40,
        fontSize: 24,
        bold: true,
      },
    ];

    for (let i = 0; i < habitCount; i++) {
      const y = 80 + i * 50;
      objects.push(
        {
          id: `habit-${i}`,
          type: 'field',
          label: '',
          value: `Habit ${i + 1}`,
          x: 30,
          y: y + 5,
          width: 200,
          height: 30,
          fieldType: 'text',
          editable: true,
        },
        {
          id: `status-${i}`,
          type: 'field',
          label: '',
          value: '○',
          x: 240,
          y,
          width: 40,
          height: 30,
          fieldType: 'text',
          editable: false,
        },
        {
          id: `toggle-${i}`,
          type: 'button',
          label: 'Done',
          x: 290,
          y,
          width: 60,
          height: 30,
          actions: [
            {
              type: 'toggleField',
              targetFieldId: `status-${i}`,
              value: '○|●',
            },
          ],
        }
      );
    }

    return {
      id: `stack-${Date.now()}`,
      name: params.name || 'Habit Tracker',
      description: params.description || 'Track daily habits',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      currentCardId: 'card-1',
      cards: [
        {
          id: 'card-1',
          name: 'Today',
          background: '#e8f5e9',
          objects,
        },
      ],
    };
  },

  flashcards: (params: Record<string, string>): Stack => {
    const cardCount = parseInt(params.cardCount || '3');
    const cards: Card[] = [];

    for (let i = 0; i < cardCount; i++) {
      cards.push(
        {
          id: `question-${i}`,
          name: `Question ${i + 1}`,
          background: '#e8f5e9',
          objects: [
            {
              id: 'question',
              type: 'field',
              label: 'Question:',
              value: `Question ${i + 1}`,
              x: 50,
              y: 100,
              width: 300,
              height: 80,
              fieldType: 'text',
              editable: true,
            },
            {
              id: 'show-answer',
              type: 'button',
              label: 'Show Answer →',
              x: 150,
              y: 220,
              width: 100,
              height: 40,
              actions: [
                {
                  type: 'goToCard',
                  targetCardId: `answer-${i}`,
                },
              ],
            },
          ],
        },
        {
          id: `answer-${i}`,
          name: `Answer ${i + 1}`,
          background: '#fff3e0',
          objects: [
            {
              id: 'answer',
              type: 'field',
              label: 'Answer:',
              value: `Answer ${i + 1}`,
              x: 50,
              y: 100,
              width: 300,
              height: 80,
              fieldType: 'text',
              editable: true,
            },
            {
              id: 'back',
              type: 'button',
              label: '← Back',
              x: 80,
              y: 220,
              width: 100,
              height: 40,
              actions: [
                {
                  type: 'goToCard',
                  targetCardId: `question-${i}`,
                },
              ],
            },
            {
              id: 'next',
              type: 'button',
              label: i < cardCount - 1 ? 'Next →' : 'First',
              x: 220,
              y: 220,
              width: 100,
              height: 40,
              actions: [
                {
                  type: 'goToCard',
                  targetCardId: i < cardCount - 1 ? `question-${i + 1}` : 'question-0',
                },
              ],
            },
          ],
        }
      );
    }

    return {
      id: `stack-${Date.now()}`,
      name: params.name || 'Flashcards',
      description: params.description || 'Study flashcards',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      currentCardId: 'question-0',
      cards,
    };
  },

  notes: (params: Record<string, string>): Stack => ({
    id: `stack-${Date.now()}`,
    name: params.name || 'Notes',
    description: params.description || 'Quick notes',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    currentCardId: 'card-1',
    cards: [
      {
        id: 'card-1',
        name: 'Notes',
        background: '#fff9c4',
        objects: [
          {
            id: 'title',
            type: 'text',
            content: params.name || 'Notes',
            x: 20,
            y: 20,
            width: 360,
            height: 40,
            fontSize: 24,
            bold: true,
          },
          {
            id: 'notes-field',
            type: 'field',
            label: '',
            value: params.placeholder || 'Type your notes here...',
            x: 20,
            y: 80,
            width: 360,
            height: 200,
            fieldType: 'text',
            editable: true,
          },
        ],
      },
    ],
  }),
};

const patterns = [
  {
    keywords: ['coffee', 'caffeine'],
    template: 'counter',
    extract: () => ({
      name: 'Coffee Counter',
      description: 'Track daily coffee intake',
      label: 'Cups today',
      increment: '1',
    }),
  },
  {
    keywords: ['water', 'hydration', 'drink', 'glass', 'cup', 'oz', 'ml', 'liter'],
    template: 'tracker',
    extract: (prompt: string) => ({
      name: 'Water Intake',
      description: 'Track daily water consumption',
      unit: prompt.match(/glass/i) ? 'glasses' : 'cups',
      goal: prompt.match(/(\d+)\s*(glass|cup|oz)/i)?.[1] || '8',
    }),
  },
  {
    keywords: ['checklist', 'todo', 'to-do', 'task list', 'shopping list'],
    template: 'checklist',
    extract: (prompt: string) => {
      const itemMatch = prompt.match(/(\d+)\s*(?:item|task|thing)/i);
      return {
        name: prompt.match(/shopping/i) ? 'Shopping List' : 'Checklist',
        description: prompt.match(/shopping/i) ? 'Shopping checklist' : 'Task checklist',
        itemCount: itemMatch?.[1] || '5',
      };
    },
  },
  {
    keywords: ['habit', 'daily habit', 'routine', 'streak'],
    template: 'habit',
    extract: (prompt: string) => {
      const habitMatch = prompt.match(/(\d+)\s*(?:daily)?\s*habit/i);
      return {
        name: 'Habit Tracker',
        description: 'Track daily habits',
        habitCount: habitMatch?.[1] || '5',
      };
    },
  },
  {
    keywords: ['flashcard', 'flash card', 'study', 'quiz', 'memorize', 'vocab'],
    template: 'flashcards',
    extract: (prompt: string) => {
      const cardMatch = prompt.match(/(\d+)\s*(?:flashcard|card|question|term)/i);
      return {
        name: prompt.match(/vocab/i) ? 'Vocabulary' : 'Flashcards',
        description: 'Study flashcards',
        cardCount: cardMatch?.[1] || '3',
      };
    },
  },
  {
    keywords: ['note', 'notes', 'notepad', 'memo', 'write', 'jot'],
    template: 'notes',
    extract: () => ({
      name: 'Notes',
      description: 'Quick notes',
      placeholder: 'Write your notes here...',
    }),
  },
  {
    keywords: ['exercise', 'workout', 'fitness', 'gym', 'reps', 'sets'],
    template: 'tracker',
    extract: (prompt: string) => ({
      name: 'Exercise Tracker',
      description: 'Track workout progress',
      unit: prompt.match(/rep/i) ? 'reps' : 'minutes',
      goal: '30',
    }),
  },
  {
    keywords: ['reading', 'book', 'page', 'chapter'],
    template: 'tracker',
    extract: () => ({
      name: 'Reading Tracker',
      description: 'Track pages read',
      unit: 'pages',
      goal: '50',
    }),
  },
  {
    keywords: ['tea'],
    template: 'counter',
    extract: () => ({
      name: 'Tea Counter',
      description: 'Track daily tea intake',
      label: 'Cups today',
      increment: '1',
    }),
  },
  {
    keywords: ['counter', 'tally', 'increment', 'track number'],
    template: 'counter',
    extract: (prompt: string) => {
      const match = prompt.match(/(?:track|tally)\s+(.+?)(?:\s+counter)?$/i);
      return {
        name: match?.[1]?.trim() || 'Counter',
        description: `Track ${match?.[1]?.trim().toLowerCase() || 'count'}`,
        label: match?.[1]?.trim() || 'Count',
        increment: '1',
      };
    },
  },
];

function matchTemplate(prompt: string): TemplateMatch {
  const normalizedPrompt = prompt.toLowerCase();
  let bestMatch: TemplateMatch = { score: 0, template: 'counter' };

  for (const pattern of patterns) {
    const matchedKeywords = pattern.keywords.filter(kw => {
      const keyword = kw.toLowerCase();
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedKeyword}`, 'i');
      return regex.test(normalizedPrompt);
    });
    const score = matchedKeywords.length;

    if (score > bestMatch.score) {
      bestMatch = {
        score,
        template: pattern.template,
        params: pattern.extract(prompt),
      };
    }
  }

  return bestMatch;
}

export function generateStack(prompt: string): Stack {
  if (!prompt.trim()) {
    return templates.counter({
      name: 'Counter',
      description: 'A simple counter',
    });
  }

  const match = matchTemplate(prompt);
  const templateFn = templates[match.template as keyof typeof templates];

  if (!templateFn) {
    return templates.counter({
      name: 'Counter',
      description: prompt,
    });
  }

  return templateFn(match.params || {});
}

export async function generateStackWithLLM(
  prompt: string,
  apiKey: string
): Promise<Stack> {
  if (!apiKey) {
    throw new Error('API key required for LLM generation');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a HyperCard stack generator. Generate a JSON stack object based on user descriptions. Output only valid JSON matching the Stack type.',
          },
          {
            role: 'user',
            content: `Generate a stack for: ${prompt}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const stackJson = JSON.parse(data.choices[0].message.content);

    return {
      ...stackJson,
      id: `stack-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  } catch (error) {
    console.error('LLM generation failed:', error);
    return generateStack(prompt);
  }
}
