import { useState } from 'react';
import { Stack, Card, CardObject } from '../types';
import { CardViewer } from './CardViewer';
import { ObjectEditor } from './ObjectEditor';
import './StackEditor.css';

interface StackEditorProps {
  stack: Stack;
  onSave: (stack: Stack) => void;
  onClose: () => void;
}

export function StackEditor({ stack, onSave, onClose }: StackEditorProps) {
  const [editedStack, setEditedStack] = useState<Stack>(stack);
  const [selectedObjectId, setSelectedObjectId] = useState<string | undefined>(undefined);

  const currentCard = editedStack.cards.find(c => c.id === editedStack.currentCardId);
  const selectedObject = currentCard?.objects.find(o => o.id === selectedObjectId) || null;

  const updateStack = (updates: Partial<Stack>) => {
    setEditedStack({ ...editedStack, ...updates, updatedAt: Date.now() });
  };

  const updateCard = (card: Card) => {
    const newCards = editedStack.cards.map(c => (c.id === card.id ? card : c));
    updateStack({ cards: newCards });
  };

  const addCard = () => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      name: 'New Card',
      background: '#ffffff',
      objects: [],
    };
    updateStack({ cards: [...editedStack.cards, newCard] });
  };

  const deleteCard = (cardId: string) => {
    if (editedStack.cards.length <= 1) {
      alert('Cannot delete the last card');
      return;
    }
    const newCards = editedStack.cards.filter(c => c.id !== cardId);
    const newCurrentId =
      cardId === editedStack.currentCardId ? newCards[0].id : editedStack.currentCardId;
    updateStack({ cards: newCards, currentCardId: newCurrentId });
  };

  const addObject = (type: 'button' | 'field' | 'text') => {
    if (!currentCard) return;

    const newObject: CardObject =
      type === 'button'
        ? {
            id: `btn-${Date.now()}`,
            type: 'button',
            label: 'New Button',
            x: 50,
            y: 50,
            width: 100,
            height: 40,
            actions: [],
          }
        : type === 'field'
        ? {
            id: `field-${Date.now()}`,
            type: 'field',
            label: 'Label',
            value: '',
            x: 50,
            y: 50,
            width: 200,
            height: 40,
            fieldType: 'text',
            editable: true,
          }
        : {
            id: `text-${Date.now()}`,
            type: 'text',
            content: 'New Text',
            x: 50,
            y: 50,
            width: 200,
            height: 30,
            fontSize: 16,
            bold: false,
          };

    const updatedCard = {
      ...currentCard,
      objects: [...currentCard.objects, newObject],
    };
    updateCard(updatedCard);
    setSelectedObjectId(newObject.id);
  };

  const updateObject = (object: CardObject) => {
    if (!currentCard) return;
    const updatedCard = {
      ...currentCard,
      objects: currentCard.objects.map(o => (o.id === object.id ? object : o)),
    };
    updateCard(updatedCard);
  };

  const deleteObject = () => {
    if (!currentCard || !selectedObjectId) return;
    const updatedCard = {
      ...currentCard,
      objects: currentCard.objects.filter(o => o.id !== selectedObjectId),
    };
    updateCard(updatedCard);
    setSelectedObjectId(undefined);
  };

  const handleSave = () => {
    onSave(editedStack);
    onClose();
  };

  return (
    <div className="stack-editor-container">
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <input
            type="text"
            className="stack-name-input"
            value={editedStack.name}
            onChange={e => updateStack({ name: e.target.value })}
            placeholder="Stack name"
          />
        </div>
        <div className="toolbar-right">
          <button className="toolbar-btn save" onClick={handleSave}>
            Save & Close
          </button>
          <button className="toolbar-btn cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>

      <div className="editor-main">
        <div className="cards-panel">
          <div className="panel-header">
            <h3>Cards</h3>
            <button className="add-card-btn" onClick={addCard}>
              + Add Card
            </button>
          </div>
          <div className="cards-list">
            {editedStack.cards.map(card => (
              <div
                key={card.id}
                className={`card-item ${card.id === editedStack.currentCardId ? 'active' : ''}`}
              >
                <input
                  type="text"
                  value={card.name}
                  onChange={e => {
                    const updatedCard = { ...card, name: e.target.value };
                    updateCard(updatedCard);
                  }}
                  onClick={() => updateStack({ currentCardId: card.id })}
                />
                <button
                  className="card-delete-btn"
                  onClick={() => deleteCard(card.id)}
                  disabled={editedStack.cards.length <= 1}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="card-settings">
            <label>Background Color</label>
            <input
              type="color"
              value={currentCard?.background || '#ffffff'}
              onChange={e => {
                if (currentCard) {
                  updateCard({ ...currentCard, background: e.target.value });
                }
              }}
            />
          </div>
        </div>

        <div className="viewer-panel">
          <div className="panel-header">
            <h3>{currentCard?.name}</h3>
          </div>
          {currentCard && (
            <CardViewer
              card={currentCard}
              onCardChange={updateCard}
              onNavigate={cardId => updateStack({ currentCardId: cardId })}
              editMode={true}
              selectedObjectId={selectedObjectId}
              onSelectObject={setSelectedObjectId}
            />
          )}
          <div className="add-object-bar">
            <button onClick={() => addObject('button')}>+ Button</button>
            <button onClick={() => addObject('field')}>+ Field</button>
            <button onClick={() => addObject('text')}>+ Text</button>
          </div>
        </div>

        <div className="properties-panel">
          <div className="panel-header">
            <h3>Properties</h3>
          </div>
          <ObjectEditor
            object={selectedObject || undefined}
            cardIds={editedStack.cards.map(c => c.id)}
            onUpdate={updateObject}
            onDelete={deleteObject}
          />
        </div>
      </div>
    </div>
  );
}
