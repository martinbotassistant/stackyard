import { CardObject, StackField, Action } from '../types';
import './ObjectEditor.css';

interface ObjectEditorProps {
  object?: CardObject;
  cardIds: string[];
  onUpdate: (object: CardObject) => void;
  onDelete: () => void;
}

export function ObjectEditor({ object, cardIds, onUpdate, onDelete }: ObjectEditorProps) {
  if (!object) {
    return (
      <div className="object-editor empty">
        <p>Select an object to edit, or add a new one</p>
      </div>
    );
  }

  const updateObject = (updates: Partial<CardObject>) => {
    onUpdate({ ...object, ...updates } as CardObject);
  };

  const updateAction = (index: number, action: Action) => {
    if (object.type !== 'button') return;
    const newActions = [...object.actions];
    newActions[index] = action;
    updateObject({ actions: newActions });
  };

  const addAction = () => {
    if (object.type !== 'button') return;
    const newActions = [...object.actions, { type: 'goToCard' as const }];
    updateObject({ actions: newActions });
  };

  const deleteAction = (index: number) => {
    if (object.type !== 'button') return;
    const newActions = object.actions.filter((_, i) => i !== index);
    updateObject({ actions: newActions });
  };

  return (
    <div className="object-editor">
      <div className="editor-header">
        <h3>{object.type.toUpperCase()}</h3>
        <button className="delete-btn" onClick={onDelete}>
          Delete
        </button>
      </div>

      <div className="editor-section">
        <label>Position & Size</label>
        <div className="input-row">
          <input
            type="number"
            placeholder="X"
            value={object.x}
            onChange={e => updateObject({ x: parseInt(e.target.value) || 0 })}
          />
          <input
            type="number"
            placeholder="Y"
            value={object.y}
            onChange={e => updateObject({ y: parseInt(e.target.value) || 0 })}
          />
          <input
            type="number"
            placeholder="Width"
            value={object.width}
            onChange={e => updateObject({ width: parseInt(e.target.value) || 0 })}
          />
          <input
            type="number"
            placeholder="Height"
            value={object.height}
            onChange={e => updateObject({ height: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      {object.type === 'button' && (
        <>
          <div className="editor-section">
            <label>Label</label>
            <input
              type="text"
              value={object.label}
              onChange={e => updateObject({ label: e.target.value })}
            />
          </div>

          <div className="editor-section">
            <label>Actions</label>
            {object.actions.map((action, index) => (
              <div key={index} className="action-editor">
                <select
                  value={action.type}
                  onChange={e =>
                    updateAction(index, { ...action, type: e.target.value as Action['type'] })
                  }
                >
                  <option value="goToCard">Go to Card</option>
                  <option value="setField">Set Field</option>
                  <option value="incrementField">Increment Field</option>
                  <option value="toggleField">Toggle Field</option>
                  <option value="addListItem">Add List Item</option>
                </select>

                {action.type === 'goToCard' && (
                  <select
                    value={action.targetCardId || ''}
                    onChange={e => updateAction(index, { ...action, targetCardId: e.target.value })}
                  >
                    <option value="">Select card...</option>
                    {cardIds.map(id => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                )}

                {(action.type === 'setField' ||
                  action.type === 'incrementField' ||
                  action.type === 'toggleField' ||
                  action.type === 'addListItem') && (
                  <>
                    <input
                      type="text"
                      placeholder="Field ID"
                      value={action.targetFieldId || ''}
                      onChange={e =>
                        updateAction(index, { ...action, targetFieldId: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder={
                        action.type === 'toggleField' ? 'value1|value2' : 'Value'
                      }
                      value={action.value || ''}
                      onChange={e => updateAction(index, { ...action, value: e.target.value })}
                    />
                  </>
                )}

                <button className="small-btn" onClick={() => deleteAction(index)}>
                  ✕
                </button>
              </div>
            ))}
            <button className="add-btn" onClick={addAction}>
              + Add Action
            </button>
          </div>
        </>
      )}

      {object.type === 'field' && (
        <>
          <div className="editor-section">
            <label>Label</label>
            <input
              type="text"
              value={object.label}
              onChange={e => updateObject({ label: e.target.value })}
            />
          </div>
          <div className="editor-section">
            <label>Default Value</label>
            <input
              type="text"
              value={object.value}
              onChange={e => updateObject({ value: e.target.value })}
            />
          </div>
          <div className="editor-section">
            <label>Field Type</label>
            <select
              value={object.fieldType}
              onChange={e =>
                updateObject({ fieldType: e.target.value as StackField['fieldType'] })
              }
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="list">List</option>
            </select>
          </div>
          <div className="editor-section">
            <label>
              <input
                type="checkbox"
                checked={object.editable}
                onChange={e => updateObject({ editable: e.target.checked })}
              />
              Editable by user
            </label>
          </div>
        </>
      )}

      {object.type === 'text' && (
        <>
          <div className="editor-section">
            <label>Content</label>
            <textarea
              value={object.content}
              onChange={e => updateObject({ content: e.target.value })}
              rows={3}
            />
          </div>
          <div className="editor-section">
            <label>Font Size</label>
            <input
              type="number"
              value={object.fontSize}
              onChange={e => updateObject({ fontSize: parseInt(e.target.value) || 12 })}
            />
          </div>
          <div className="editor-section">
            <label>
              <input
                type="checkbox"
                checked={object.bold}
                onChange={e => updateObject({ bold: e.target.checked })}
              />
              Bold
            </label>
          </div>
        </>
      )}
    </div>
  );
}
