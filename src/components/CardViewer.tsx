import { Card, StackButton, StackField } from '../types';
import { executeAction } from '../actions';
import './CardViewer.css';

interface CardViewerProps {
  card: Card;
  onCardChange: (card: Card) => void;
  onNavigate: (cardId: string) => void;
  editMode?: boolean;
  selectedObjectId?: string;
  onSelectObject?: (id: string) => void;
}

export function CardViewer({
  card,
  onCardChange,
  onNavigate,
  editMode = false,
  selectedObjectId,
  onSelectObject,
}: CardViewerProps) {
  const handleButtonClick = (button: StackButton) => {
    if (editMode) {
      onSelectObject?.(button.id);
      return;
    }
    button.actions.forEach(action => {
      executeAction(action, card, onCardChange, onNavigate);
    });
  };

  const handleFieldChange = (field: StackField, value: string) => {
    if (!field.editable) return;
    const newCard = { ...card };
    const fieldIndex = newCard.objects.findIndex(obj => obj.id === field.id);
    if (fieldIndex >= 0) {
      newCard.objects[fieldIndex] = { ...field, value };
      onCardChange(newCard);
    }
  };

  const handleObjectClick = (objectId: string) => {
    if (editMode) {
      onSelectObject?.(objectId);
    }
  };

  return (
    <div className="card-viewer" style={{ background: card.background }}>
      {card.objects.map(obj => {
        const isSelected = editMode && obj.id === selectedObjectId;
        const commonStyle = {
          left: obj.x,
          top: obj.y,
          width: obj.width,
          height: obj.height,
        };

        if (obj.type === 'button') {
          return (
            <button
              key={obj.id}
              className={`stack-button ${isSelected ? 'selected' : ''}`}
              style={commonStyle}
              onClick={() => handleButtonClick(obj)}
            >
              {obj.label}
            </button>
          );
        }

        if (obj.type === 'field') {
          const isTextarea = obj.height > 40 || obj.fieldType === 'list';
          return (
            <div
              key={obj.id}
              className={`stack-field ${isSelected ? 'selected' : ''}`}
              style={commonStyle}
              onClick={() => handleObjectClick(obj.id)}
            >
              {obj.label && <label>{obj.label}</label>}
              {isTextarea ? (
                <textarea
                  value={obj.value}
                  onChange={e => handleFieldChange(obj, e.target.value)}
                  readOnly={!obj.editable || editMode}
                  className={obj.editable ? 'editable' : 'readonly'}
                />
              ) : (
                <input
                  type={obj.fieldType === 'number' ? 'number' : 'text'}
                  value={obj.value}
                  onChange={e => handleFieldChange(obj, e.target.value)}
                  readOnly={!obj.editable || editMode}
                  className={obj.editable ? 'editable' : 'readonly'}
                />
              )}
            </div>
          );
        }

        if (obj.type === 'text') {
          return (
            <div
              key={obj.id}
              className={`stack-text ${isSelected ? 'selected' : ''}`}
              style={{
                ...commonStyle,
                fontSize: obj.fontSize,
                fontWeight: obj.bold ? 'bold' : 'normal',
              }}
              onClick={() => handleObjectClick(obj.id)}
            >
              {obj.content}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
