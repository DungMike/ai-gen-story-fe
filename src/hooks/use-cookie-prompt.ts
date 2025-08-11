import { useState, useEffect } from 'react';

interface Prompt {
  name: string;
  prompt: string;
}

export const useCookiePrompts = (cookieKey: string = 'storyPrompts') => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  // Helper function to get cookie value
  const getCookie = (key: string): string | null => {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find((row) => row.startsWith(`${key}=`));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
  };

  // Helper function to set cookie value
  const setCookie = (key: string, value: string, days: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${key}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
  };

  // Helper function to remove cookie
  const removeCookie = (key: string) => {
    document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  };

  // Load prompts from cookie on mount
  useEffect(() => {
    const cookieData = getCookie(cookieKey);
    if (cookieData) {
      setPrompts(JSON.parse(cookieData));
    }
  }, [cookieKey]);

  // Add a new prompt
  const addPrompt = (newPrompt: Prompt) => {
    if (!newPrompt.prompt.trim()) return; // Bỏ qua nếu prompt rỗng
    const updatedPrompts = [...prompts, newPrompt];
    setPrompts(updatedPrompts);
    setCookie(cookieKey, JSON.stringify(updatedPrompts), 365);
  };

  // Remove a prompt by name
  const removePrompt = (name: string) => {
    const updatedPrompts = prompts.filter((prompt) => prompt.name !== name);
    setPrompts(updatedPrompts);
    setCookie(cookieKey, JSON.stringify(updatedPrompts), 365);
  };

  // Clear all prompts
  const clearPrompts = () => {
    setPrompts([]);
    removeCookie(cookieKey);
  };

  return { prompts, addPrompt, removePrompt, clearPrompts };
};