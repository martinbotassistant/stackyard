export type ActionType = 
  | 'goToCard'
  | 'setField'
  | 'incrementField'
  | 'toggleField'
  | 'addListItem';

export interface Action {
  type: ActionType;
  targetCardId?: string;
  targetFieldId?: string;
  value?: string;
}

export interface StackButton {
  id: string;
  type: 'button';
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  actions: Action[];
}

export interface StackField {
  id: string;
  type: 'field';
  label: string;
  value: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fieldType: 'text' | 'number' | 'list';
  editable: boolean;
}

export interface StackText {
  id: string;
  type: 'text';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  bold: boolean;
}

export type CardObject = StackButton | StackField | StackText;

export interface Card {
  id: string;
  name: string;
  background: string;
  objects: CardObject[];
}

export interface Stack {
  id: string;
  name: string;
  description: string;
  cards: Card[];
  currentCardId: string;
  createdAt: number;
  updatedAt: number;
}
