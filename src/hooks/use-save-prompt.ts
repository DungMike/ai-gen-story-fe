import { useState, useEffect } from 'react';

interface Prompt {
  id: string;
  name: string;
  prompt: string;
}

export const useLocalStoragePrompts = (storageKey: string = 'storyPrompts') => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  // Helper function to get data from localStorage
  const getLocalStorage = (key: string): string | null => {
    return localStorage.getItem(key);
  };

  // Helper function to set data in localStorage
  const setLocalStorage = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };

  // Helper function to remove data from localStorage
  const removeLocalStorage = (key: string) => {
    localStorage.removeItem(key);
  };

  // Load prompts from localStorage on mount
  useEffect(() => {
    const storedData = getLocalStorage(storageKey);
    if (storedData) {
      setPrompts(JSON.parse(storedData));
    }
  }, [storageKey]);

  // Add a new prompt
  const addPrompt = (newPrompt: Prompt) => {
    if (!newPrompt.prompt.trim()) return; // Skip if prompt is empty
    const updatedPrompts = [...prompts, newPrompt];
    setPrompts(updatedPrompts);
    setLocalStorage(storageKey, JSON.stringify(updatedPrompts));
  };

  // Remove a prompt by id
  const removePrompt = (id: string) => {
    const updatedPrompts = prompts.filter((prompt) => prompt.id !== id);
    setPrompts(updatedPrompts);
    setLocalStorage(storageKey, JSON.stringify(updatedPrompts));
  };

  // Clear all prompts
  const clearPrompts = () => {
    setPrompts([]);
    removeLocalStorage(storageKey);
  };

  return { prompts, addPrompt, removePrompt, clearPrompts };
};