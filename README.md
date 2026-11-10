# 🏗️ Stackyard

**Click together personal tools in the browser.**

Stackyard resurrects the spirit of HyperCard (1987) for the modern web. Create stacks of interactive cards with buttons, fields, and text. Build counters, checklists, flashcards, habit trackers, and more—no programming required.

## What is Stackyard?

Stackyard is a web app that lets non-programmers build simple, personal tools through direct manipulation:

- **Stacks** are collections of cards (think: screens or pages)
- **Cards** contain buttons, text fields, and text objects you can arrange visually
- **Buttons** perform actions: navigate to another card, set a field value, increment a counter, toggle a checkbox, etc.
- **Fields** store and display data: text, numbers, or lists
- **Everything persists** in your browser's localStorage—your work survives a refresh

The app includes several starter stacks to demonstrate what's possible:
- **Simple Counter** – buttons that increment and decrement a number
- **Daily Checklist** – toggle tasks on/off
- **Flashcards** – question/answer pairs with navigation
- **Quick Notes** – an editable text field

## Running Stackyard

### Prerequisites
- Node.js 18+ and npm

### Installation & Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will open at `http://localhost:5173` (or the next available port).

### Building for Production

```bash
# Create an optimized production build
npm run build

# Preview the production build locally
npm preview
```

The build output goes to the `dist/` directory, which can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## Using Stackyard

### Opening a Stack
1. On the home screen, click **Open** on any starter stack
2. You'll see the first card of that stack
3. Click buttons to trigger actions (navigate, increment counters, toggle fields)
4. Editable fields can be typed into directly

### Creating a New Stack
1. Click **+ Create New Stack** on the home screen
2. The editor opens with a blank card
3. Add objects from the toolbar: **+ Button**, **+ Field**, **+ Text**
4. Select an object to edit its properties in the right panel
5. Configure button actions (e.g., "Go to Card", "Set Field", "Increment Field")
6. Add more cards from the left panel
7. Click **Save & Close** when done

### Editing an Existing Stack
1. Click **Edit** on a stack card
2. The editor opens—modify cards, objects, and actions
3. Save your changes

### Deleting a Stack
- Click the **✕** button on a stack card
- Confirm the deletion

### AI-Assisted Stack Generation
1. Click **✨ AI-Assisted Creation** on the home screen
2. Describe the tool you want to build (e.g., "water intake tracker", "5 daily habits", "flashcards for studying")
3. Click **Generate Stack**

**Built-in Templates** (no API key needed):
- Recognizes common patterns: counter, tracker, checklist, habit, flashcards, notes
- Parses numbers and units from your description
- Examples:
  - "water intake tracker" → generates a tracker with glasses/cups
  - "checklist with 10 items" → generates a 10-item checklist
  - "track 5 daily habits" → generates a habit tracker with 5 slots
  - "flashcards for vocab" → generates a vocabulary flashcard deck
  - "coffee counter" → generates a coffee intake counter

**Optional LLM Enhancement**:
- Click the ⚙️ settings icon to add your OpenAI API key
- Used for complex or custom prompts that don't match built-in templates
- Key stored only in your browser's localStorage
- Falls back to template generator if LLM fails

## What Can You Build?

Stackyard is ideal for small, personal tools:

- **Counters** – track anything with +/- buttons
- **Checklists** – daily tasks, shopping lists
- **Flashcards** – study decks with Q&A navigation
- **Habit Trackers** – toggle habits on/off each day
- **Quick Notes** – text fields for ideas
- **Simple Forms** – collect and display info across cards

## Architecture

Stackyard is built with:
- **Vite** – fast build tool and dev server
- **React** – component-based UI
- **TypeScript** – type safety and better tooling
- **localStorage** – client-side persistence (no backend needed)

### Project Structure

```
src/
  types.ts              # Core data model (Stack, Card, Button, Field, etc.)
  storage.ts            # localStorage persistence layer
  actions.ts            # Action executor (button click logic)
  starterStacks.ts      # Demo/template stacks
  stackGenerator.ts     # AI-assisted stack generation (templates + LLM)
  App.tsx               # Main app component (home, play, edit views)
  main.tsx              # Entry point
  components/
    CardViewer.tsx      # Renders a card in play or edit mode
    StackEditor.tsx     # Full-featured stack editor UI
    ObjectEditor.tsx    # Property panel for editing objects
  *.test.ts             # Unit tests
```

### Data Model

- **Stack**: `{ id, name, description, cards, currentCardId, createdAt, updatedAt }`
- **Card**: `{ id, name, background, objects }`
- **CardObject**: `StackButton | StackField | StackText`
  - **StackButton**: `{ id, type: 'button', label, x, y, width, height, actions }`
  - **StackField**: `{ id, type: 'field', label, value, x, y, width, height, fieldType, editable }`
  - **StackText**: `{ id, type: 'text', content, x, y, width, height, fontSize, bold }`
- **Action**: `{ type, targetCardId?, targetFieldId?, value? }`

### Action Types

- `goToCard` – navigate to another card
- `setField` – set a field to a specific value
- `incrementField` – add/subtract from a numeric field
- `toggleField` – switch between two values (e.g., `☐|☑`)
- `addListItem` – append an item to a list field

## Testing

```bash
npm test
```

Tests cover:
- Core action execution (buttons, fields, toggles, increments)
- Stack generator templates (counter, tracker, checklist, habit, flashcards, notes)
- Template keyword matching and parameter extraction
- Generated stack validity

## License

MIT – see [LICENSE](LICENSE)

## Inspiration

HyperCard (1987) by Bill Atkinson was a revolutionary tool that let non-programmers build interactive software. Stackyard brings that direct-manipulation, "click together your own tools" spirit to the modern web.

---

**Built with ❤️ for people who want to make their own tools.**
