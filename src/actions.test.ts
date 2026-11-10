import { describe, it, expect, vi } from 'vitest';
import { executeAction } from './actions';
import { Card, Action } from './types';

describe('executeAction', () => {
  const mockCard: Card = {
    id: 'test-card',
    name: 'Test Card',
    background: '#ffffff',
    objects: [
      {
        id: 'field-1',
        type: 'field',
        label: 'Counter',
        value: '0',
        x: 0,
        y: 0,
        width: 100,
        height: 40,
        fieldType: 'number',
        editable: false,
      },
      {
        id: 'field-2',
        type: 'field',
        label: 'Toggle',
        value: '☐',
        x: 0,
        y: 0,
        width: 100,
        height: 40,
        fieldType: 'text',
        editable: false,
      },
    ],
  };

  it('goToCard should call setCurrentCardId', () => {
    const setCard = vi.fn();
    const setCurrentCardId = vi.fn();
    const action: Action = { type: 'goToCard', targetCardId: 'card-2' };

    executeAction(action, mockCard, setCard, setCurrentCardId);

    expect(setCurrentCardId).toHaveBeenCalledWith('card-2');
    expect(setCard).not.toHaveBeenCalled();
  });

  it('setField should update field value', () => {
    const setCard = vi.fn();
    const setCurrentCardId = vi.fn();
    const action: Action = { type: 'setField', targetFieldId: 'field-1', value: '42' };

    executeAction(action, mockCard, setCard, setCurrentCardId);

    expect(setCard).toHaveBeenCalled();
    const updatedCard = setCard.mock.calls[0][0];
    const field = updatedCard.objects.find((obj: any) => obj.id === 'field-1');
    expect(field.value).toBe('42');
  });

  it('incrementField should add to numeric field', () => {
    const freshCard: Card = {
      id: 'test-card',
      name: 'Test Card',
      background: '#ffffff',
      objects: [
        {
          id: 'field-1',
          type: 'field',
          label: 'Counter',
          value: '0',
          x: 0,
          y: 0,
          width: 100,
          height: 40,
          fieldType: 'number',
          editable: false,
        },
      ],
    };

    const setCard = vi.fn();
    const setCurrentCardId = vi.fn();
    const action: Action = { type: 'incrementField', targetFieldId: 'field-1', value: '5' };

    executeAction(action, freshCard, setCard, setCurrentCardId);

    expect(setCard).toHaveBeenCalled();
    const updatedCard = setCard.mock.calls[0][0];
    const field = updatedCard.objects.find((obj: any) => obj.id === 'field-1');
    expect(field.value).toBe('5');
  });

  it('incrementField should handle negative increments', () => {
    const cardWithValue: Card = {
      ...mockCard,
      objects: [
        {
          id: 'field-1',
          type: 'field',
          label: 'Counter',
          value: '10',
          x: 0,
          y: 0,
          width: 100,
          height: 40,
          fieldType: 'number',
          editable: false,
        },
      ],
    };

    const setCard = vi.fn();
    const setCurrentCardId = vi.fn();
    const action: Action = { type: 'incrementField', targetFieldId: 'field-1', value: '-3' };

    executeAction(action, cardWithValue, setCard, setCurrentCardId);

    expect(setCard).toHaveBeenCalled();
    const updatedCard = setCard.mock.calls[0][0];
    const field = updatedCard.objects.find((obj: any) => obj.id === 'field-1');
    expect(field.value).toBe('7');
  });

  it('toggleField should switch between two values', () => {
    const setCard = vi.fn();
    const setCurrentCardId = vi.fn();
    const action: Action = { type: 'toggleField', targetFieldId: 'field-2', value: '☐|☑' };

    executeAction(action, mockCard, setCard, setCurrentCardId);

    expect(setCard).toHaveBeenCalled();
    const updatedCard = setCard.mock.calls[0][0];
    const field = updatedCard.objects.find((obj: any) => obj.id === 'field-2');
    expect(field.value).toBe('☑');
  });

  it('toggleField should switch back from second to first value', () => {
    const cardWithChecked: Card = {
      ...mockCard,
      objects: [
        {
          id: 'field-2',
          type: 'field',
          label: 'Toggle',
          value: '☑',
          x: 0,
          y: 0,
          width: 100,
          height: 40,
          fieldType: 'text',
          editable: false,
        },
      ],
    };

    const setCard = vi.fn();
    const setCurrentCardId = vi.fn();
    const action: Action = { type: 'toggleField', targetFieldId: 'field-2', value: '☐|☑' };

    executeAction(action, cardWithChecked, setCard, setCurrentCardId);

    expect(setCard).toHaveBeenCalled();
    const updatedCard = setCard.mock.calls[0][0];
    const field = updatedCard.objects.find((obj: any) => obj.id === 'field-2');
    expect(field.value).toBe('☐');
  });
});
