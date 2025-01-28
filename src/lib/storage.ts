export interface ClipboardItem {
  id: string;
  content: string;
  createdAt: number;
  expiresAt: number;
}

export const saveItem = (content: string, expiryTime: number): ClipboardItem => {
  const item: ClipboardItem = {
    id: Math.random().toString(36).substring(7),
    content,
    createdAt: Date.now(),
    expiresAt: Date.now() + expiryTime,
  };

  const items = getItems();
  localStorage.setItem('clipboard-items', JSON.stringify([item, ...items]));
  
  console.log('Saved new clipboard item:', item);
  return item;
};

export const getItems = (): ClipboardItem[] => {
  const items = localStorage.getItem('clipboard-items');
  return items ? JSON.parse(items) : [];
};

export const deleteItem = (id: string): void => {
  const items = getItems().filter(item => item.id !== id);
  localStorage.setItem('clipboard-items', JSON.stringify(items));
  console.log('Deleted clipboard item:', id);
};

export const deleteExpiredItems = (): void => {
  const items = getItems();
  const currentTime = Date.now();
  const validItems = items.filter(item => item.expiresAt > currentTime);
  
  if (items.length !== validItems.length) {
    localStorage.setItem('clipboard-items', JSON.stringify(validItems));
    console.log('Removed expired items');
  }
};