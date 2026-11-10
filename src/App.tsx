import { useState, useEffect } from 'react';
import { Stack } from './types';
import { loadStacks, saveStack, deleteStack } from './storage';
import { starterStacks } from './starterStacks';
import { CardViewer } from './components/CardViewer';
import { StackEditor } from './components/StackEditor';
import { generateStack, generateStackWithLLM } from './stackGenerator';
import './App.css';

type View = 'home' | 'play' | 'edit';

const API_KEY_STORAGE = 'stackyard_api_key';

function App() {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [currentStack, setCurrentStack] = useState<Stack | null>(null);
  const [view, setView] = useState<View>('home');
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loaded = loadStacks();
    if (loaded.length === 0) {
      starterStacks.forEach(stack => saveStack(stack));
      setStacks(starterStacks);
    } else {
      setStacks(loaded);
    }

    const savedApiKey = localStorage.getItem(API_KEY_STORAGE);
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleCreateStack = () => {
    const newStack: Stack = {
      id: `stack-${Date.now()}`,
      name: 'New Stack',
      description: 'A new personal tool',
      cards: [
        {
          id: 'card-1',
          name: 'Card 1',
          background: '#ffffff',
          objects: [],
        },
      ],
      currentCardId: 'card-1',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveStack(newStack);
    setStacks([...stacks, newStack]);
    setCurrentStack(newStack);
    setView('edit');
  };

  const handleOpenStack = (stack: Stack) => {
    setCurrentStack(stack);
    setView('play');
  };

  const handleEditStack = (stack: Stack) => {
    setCurrentStack(stack);
    setView('edit');
  };

  const handleSaveStack = (stack: Stack) => {
    saveStack(stack);
    setStacks(stacks.map(s => (s.id === stack.id ? stack : s)));
    setCurrentStack(stack);
  };

  const handleDeleteStack = (stackId: string) => {
    if (confirm('Are you sure you want to delete this stack?')) {
      deleteStack(stackId);
      setStacks(stacks.filter(s => s.id !== stackId));
    }
  };

  const handleCardChange = (card: any) => {
    if (!currentStack) return;
    const updatedStack = {
      ...currentStack,
      cards: currentStack.cards.map(c => (c.id === card.id ? card : c)),
    };
    setCurrentStack(updatedStack);
    saveStack(updatedStack);
  };

  const handleNavigate = (cardId: string) => {
    if (!currentStack) return;
    const updatedStack = {
      ...currentStack,
      currentCardId: cardId,
    };
    setCurrentStack(updatedStack);
    saveStack(updatedStack);
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    try {
      let newStack: Stack;

      if (apiKey && aiPrompt.length > 50) {
        try {
          newStack = await generateStackWithLLM(aiPrompt, apiKey);
        } catch (error) {
          console.error('LLM generation failed, falling back to template:', error);
          newStack = generateStack(aiPrompt);
        }
      } else {
        newStack = generateStack(aiPrompt);
      }

      saveStack(newStack);
      setStacks([...stacks, newStack]);
      setCurrentStack(newStack);
      setView('edit');
      setShowAIPrompt(false);
      setAiPrompt('');
    } catch (error) {
      console.error('Stack generation failed:', error);
      alert('Failed to generate stack. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE, apiKey.trim());
    } else {
      localStorage.removeItem(API_KEY_STORAGE);
    }
    setShowApiKeyDialog(false);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE);
    setApiKey('');
    setShowApiKeyDialog(false);
  };

  if (view === 'edit' && currentStack) {
    return (
      <StackEditor
        stack={currentStack}
        onSave={handleSaveStack}
        onClose={() => {
          setView('home');
          setCurrentStack(null);
        }}
      />
    );
  }

  if (view === 'play' && currentStack) {
    const currentCard = currentStack.cards.find(c => c.id === currentStack.currentCardId);
    
    return (
      <div className="play-container">
        <div className="play-header">
          <h2>{currentStack.name}</h2>
          <div className="play-controls">
            <button onClick={() => handleEditStack(currentStack)}>Edit</button>
            <button onClick={() => setView('home')}>Close</button>
          </div>
        </div>
        {currentCard && (
          <div className="play-viewer">
            <CardViewer
              card={currentCard}
              onCardChange={handleCardChange}
              onNavigate={handleNavigate}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1>🏗️ Stackyard</h1>
          <p className="tagline">Click together personal tools</p>
        </div>
      </header>

      <main className="home-main">
        <section className="intro-section">
          <p>
            Stackyard resurrects HyperCard's spirit in the browser. Create stacks of cards with
            buttons, fields, and text. Build counters, checklists, flashcards, habit trackers, and
            more—no programming required.
          </p>
          <div className="action-buttons">
            <button className="primary-btn" onClick={handleCreateStack}>
              + Create New Stack
            </button>
            <button className="secondary-btn" onClick={() => setShowAIPrompt(!showAIPrompt)}>
              ✨ AI-Assisted Creation
            </button>
          </div>
          
          {showAIPrompt && (
            <div className="ai-prompt-box">
              <div className="ai-header">
                <h3>Generate a Stack</h3>
                <button className="settings-btn" onClick={() => setShowApiKeyDialog(true)} title="API Key Settings">
                  ⚙️
                </button>
              </div>
              <textarea
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="Describe the tool you want to build..."
                rows={3}
                disabled={isGenerating}
              />
              <div className="ai-examples">
                <strong>Try:</strong>
                <button onClick={() => setAiPrompt('water intake tracker')}>water tracker</button>
                <button onClick={() => setAiPrompt('checklist with 10 items')}>checklist</button>
                <button onClick={() => setAiPrompt('5 daily habits')}>habit tracker</button>
                <button onClick={() => setAiPrompt('flashcards for studying')}>flashcards</button>
              </div>
              <button 
                className="generate-btn" 
                onClick={handleAIGenerate}
                disabled={isGenerating || !aiPrompt.trim()}
              >
                {isGenerating ? 'Generating...' : 'Generate Stack'}
              </button>
              <div className="ai-note">
                <p>
                  <strong>✨ Built-in Templates:</strong> Works without an API key! Supports counters,
                  trackers, checklists, habits, flashcards, and notes.
                </p>
                <p>
                  <strong>🤖 Optional LLM:</strong> Add your OpenAI API key (⚙️ above) for custom prompts.
                  Key stored locally, never sent to our servers.
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="stacks-section">
          <h2>Your Stacks</h2>
          <div className="stacks-grid">
            {stacks.map(stack => (
              <div key={stack.id} className="stack-card">
                <div className="stack-card-header">
                  <h3>{stack.name}</h3>
                  <button
                    className="delete-stack-btn"
                    onClick={() => handleDeleteStack(stack.id)}
                    title="Delete stack"
                  >
                    ✕
                  </button>
                </div>
                <p className="stack-description">{stack.description}</p>
                <div className="stack-meta">
                  <span>{stack.cards.length} cards</span>
                </div>
                <div className="stack-actions">
                  <button onClick={() => handleOpenStack(stack)}>Open</button>
                  <button onClick={() => handleEditStack(stack)}>Edit</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="demo-section">
          <h2>What can you build?</h2>
          <div className="demo-grid">
            <div className="demo-card">
              <h3>Counters</h3>
              <p>Track anything with increment/decrement buttons</p>
            </div>
            <div className="demo-card">
              <h3>Checklists</h3>
              <p>Daily tasks, shopping lists, project todos</p>
            </div>
            <div className="demo-card">
              <h3>Flashcards</h3>
              <p>Study decks with question/answer navigation</p>
            </div>
            <div className="demo-card">
              <h3>Notes</h3>
              <p>Quick text fields for jotting down ideas</p>
            </div>
            <div className="demo-card">
              <h3>Habit Trackers</h3>
              <p>Toggle daily habits on/off</p>
            </div>
            <div className="demo-card">
              <h3>Simple Forms</h3>
              <p>Collect and display information</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>
          Inspired by HyperCard (1987) • Built with modern web tech • All data stays in your
          browser
        </p>
      </footer>

      {showApiKeyDialog && (
        <div className="modal-overlay" onClick={() => setShowApiKeyDialog(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <h2>API Key Settings</h2>
            <p>
              Optional: Add your OpenAI API key to enable LLM-powered stack generation for complex
              or custom prompts. The built-in template generator works without a key.
            </p>
            <div className="api-key-input">
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleSaveApiKey}>Save</button>
              <button onClick={handleClearApiKey}>Clear</button>
              <button onClick={() => setShowApiKeyDialog(false)}>Cancel</button>
            </div>
            <p className="modal-note">
              <strong>Privacy:</strong> Your API key is stored only in your browser's localStorage
              and never sent to our servers. It's used directly for OpenAI API calls from your
              browser.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
