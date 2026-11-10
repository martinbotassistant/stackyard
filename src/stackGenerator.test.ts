import { describe, it, expect } from 'vitest';
import { generateStack } from './stackGenerator';

describe('generateStack', () => {
  describe('counter template', () => {
    it('should generate a counter from "counter" keyword', () => {
      const stack = generateStack('simple counter');
      expect(stack.name).toContain('Counter');
      expect(stack.cards[0].objects.some(obj => obj.type === 'button')).toBe(true);
      expect(stack.cards[0].objects.some(obj => obj.type === 'field')).toBe(true);
    });

    it('should generate a coffee counter', () => {
      const stack = generateStack('coffee counter');
      expect(stack.name).toBe('Coffee Counter');
      expect(stack.description).toContain('coffee');
    });

    it('should extract custom counter names', () => {
      const stack = generateStack('track visitors counter');
      expect(stack.name).toContain('visitors');
    });
  });

  describe('tracker template', () => {
    it('should generate a water intake tracker', () => {
      const stack = generateStack('water intake tracker');
      expect(stack.name).toBe('Water Intake');
      expect(stack.cards[0].objects.some(obj => 
        obj.type === 'text' && 'content' in obj && obj.content.includes('Goal')
      )).toBe(true);
    });

    it('should parse water goals', () => {
      const stack = generateStack('track 10 glasses of water');
      const goalText = stack.cards[0].objects.find(
        obj => obj.type === 'text' && 'content' in obj && obj.content.includes('Goal')
      );
      expect(goalText).toBeDefined();
      if (goalText && goalText.type === 'text') {
        expect(goalText.content).toContain('10');
      }
    });

    it('should generate exercise tracker', () => {
      const stack = generateStack('exercise tracker');
      expect(stack.name).toBe('Exercise Tracker');
    });

    it('should generate reading tracker', () => {
      const stack = generateStack('reading tracker');
      expect(stack.name).toBe('Reading Tracker');
      expect(stack.description).toContain('pages');
    });
  });

  describe('checklist template', () => {
    it('should generate a checklist', () => {
      const stack = generateStack('todo list');
      expect(stack.name).toContain('Checklist');
      expect(stack.cards[0].objects.filter(obj => obj.type === 'button').length).toBeGreaterThan(0);
    });

    it('should generate a shopping list', () => {
      const stack = generateStack('shopping list');
      expect(stack.name).toBe('Shopping List');
    });

    it('should respect item count', () => {
      const stack = generateStack('checklist with 3 items');
      const checkboxes = stack.cards[0].objects.filter(
        obj => obj.type === 'field' && obj.id.startsWith('checkbox-')
      );
      expect(checkboxes.length).toBe(3);
    });
  });

  describe('habit template', () => {
    it('should generate a habit tracker', () => {
      const stack = generateStack('habit tracker');
      expect(stack.name).toBe('Habit Tracker');
      expect(stack.description).toContain('habit');
    });

    it('should respect habit count', () => {
      const stack = generateStack('track 7 daily habits');
      const habitFields = stack.cards[0].objects.filter(
        obj => obj.type === 'field' && obj.id.startsWith('habit-')
      );
      expect(habitFields.length).toBe(7);
    });

    it('should handle routine keyword', () => {
      const stack = generateStack('daily routine tracker');
      expect(stack.name).toBe('Habit Tracker');
    });
  });

  describe('flashcards template', () => {
    it('should generate flashcards', () => {
      const stack = generateStack('flashcard deck');
      expect(stack.name).toContain('Flashcard');
      expect(stack.cards.length).toBeGreaterThan(1);
    });

    it('should create question and answer pairs', () => {
      const stack = generateStack('study flashcards');
      const questionCards = stack.cards.filter(c => c.id.startsWith('question-'));
      const answerCards = stack.cards.filter(c => c.id.startsWith('answer-'));
      expect(questionCards.length).toBe(answerCards.length);
    });

    it('should respect card count', () => {
      const stack = generateStack('5 flashcards');
      const questionCards = stack.cards.filter(c => c.id.startsWith('question-'));
      expect(questionCards.length).toBe(5);
    });

    it('should handle vocabulary keyword', () => {
      const stack = generateStack('vocab flashcards');
      expect(stack.name).toBe('Vocabulary');
    });
  });

  describe('notes template', () => {
    it('should generate a notes stack', () => {
      const stack = generateStack('simple notes');
      expect(stack.name).toBe('Notes');
      const textField = stack.cards[0].objects.find(
        obj => obj.type === 'field' && obj.id === 'notes-field'
      );
      expect(textField).toBeDefined();
      if (textField && textField.type === 'field') {
        expect(textField.editable).toBe(true);
      }
    });

    it('should handle notepad keyword', () => {
      const stack = generateStack('notepad');
      expect(stack.name).toBe('Notes');
    });
  });

  describe('fallback behavior', () => {
    it('should generate a counter for empty prompt', () => {
      const stack = generateStack('');
      expect(stack.name).toBe('Counter');
      expect(stack.cards.length).toBeGreaterThan(0);
    });

    it('should generate a counter for unrecognized prompts', () => {
      const stack = generateStack('xyz abc totally random');
      expect(stack.cards.length).toBeGreaterThan(0);
      expect(stack.cards[0].objects.length).toBeGreaterThan(0);
    });
  });

  describe('generated stack validity', () => {
    it('should have required Stack properties', () => {
      const stack = generateStack('test stack');
      expect(stack.id).toBeDefined();
      expect(stack.name).toBeDefined();
      expect(stack.description).toBeDefined();
      expect(stack.cards).toBeDefined();
      expect(stack.currentCardId).toBeDefined();
      expect(stack.createdAt).toBeDefined();
      expect(stack.updatedAt).toBeDefined();
    });

    it('should have at least one card', () => {
      const stack = generateStack('any prompt');
      expect(stack.cards.length).toBeGreaterThan(0);
    });

    it('should have valid card structure', () => {
      const stack = generateStack('test');
      const card = stack.cards[0];
      expect(card.id).toBeDefined();
      expect(card.name).toBeDefined();
      expect(card.background).toBeDefined();
      expect(card.objects).toBeDefined();
      expect(Array.isArray(card.objects)).toBe(true);
    });
  });
});
