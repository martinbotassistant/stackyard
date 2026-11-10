import { Action, Card, StackField } from './types';

export function executeAction(
  action: Action,
  card: Card,
  setCard: (card: Card) => void,
  setCurrentCardId: (id: string) => void
): void {
  switch (action.type) {
    case 'goToCard':
      if (action.targetCardId) {
        setCurrentCardId(action.targetCardId);
      }
      break;

    case 'setField': {
      if (!action.targetFieldId) break;
      const newCard = { ...card };
      const fieldIndex = newCard.objects.findIndex(
        obj => obj.id === action.targetFieldId && obj.type === 'field'
      );
      if (fieldIndex >= 0) {
        const field = newCard.objects[fieldIndex] as StackField;
        newCard.objects[fieldIndex] = {
          ...field,
          value: action.value || '',
        };
        setCard(newCard);
      }
      break;
    }

    case 'incrementField': {
      if (!action.targetFieldId) break;
      const newCard = { ...card };
      const fieldIndex = newCard.objects.findIndex(
        obj => obj.id === action.targetFieldId && obj.type === 'field'
      );
      if (fieldIndex >= 0) {
        const field = newCard.objects[fieldIndex] as StackField;
        const currentValue = parseFloat(field.value) || 0;
        const increment = parseFloat(action.value || '1');
        newCard.objects[fieldIndex] = {
          ...field,
          value: String(currentValue + increment),
        };
        setCard(newCard);
      }
      break;
    }

    case 'toggleField': {
      if (!action.targetFieldId || !action.value) break;
      const values = action.value.split('|');
      if (values.length !== 2) break;

      const newCard = { ...card };
      const fieldIndex = newCard.objects.findIndex(
        obj => obj.id === action.targetFieldId && obj.type === 'field'
      );
      if (fieldIndex >= 0) {
        const field = newCard.objects[fieldIndex] as StackField;
        const newValue = field.value === values[0] ? values[1] : values[0];
        newCard.objects[fieldIndex] = {
          ...field,
          value: newValue,
        };
        setCard(newCard);
      }
      break;
    }

    case 'addListItem': {
      if (!action.targetFieldId || !action.value) break;
      const newCard = { ...card };
      const fieldIndex = newCard.objects.findIndex(
        obj => obj.id === action.targetFieldId && obj.type === 'field'
      );
      if (fieldIndex >= 0) {
        const field = newCard.objects[fieldIndex] as StackField;
        const currentList = field.value ? field.value.split('\n') : [];
        currentList.push(action.value);
        newCard.objects[fieldIndex] = {
          ...field,
          value: currentList.join('\n'),
        };
        setCard(newCard);
      }
      break;
    }
  }
}
