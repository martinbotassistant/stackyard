import { Stack } from './types';

const STORAGE_KEY = 'stackyard_stacks';

export function loadStacks(): Stack[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load stacks:', error);
    return [];
  }
}

export function saveStacks(stacks: Stack[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stacks));
  } catch (error) {
    console.error('Failed to save stacks:', error);
  }
}

export function saveStack(stack: Stack): void {
  const stacks = loadStacks();
  const index = stacks.findIndex(s => s.id === stack.id);
  
  if (index >= 0) {
    stacks[index] = { ...stack, updatedAt: Date.now() };
  } else {
    stacks.push(stack);
  }
  
  saveStacks(stacks);
}

export function deleteStack(stackId: string): void {
  const stacks = loadStacks().filter(s => s.id !== stackId);
  saveStacks(stacks);
}

export function getStack(stackId: string): Stack | undefined {
  return loadStacks().find(s => s.id === stackId);
}
