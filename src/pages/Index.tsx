import React, { useState, useEffect } from 'react';
import { Editor } from '@/components/Editor';
import { ClipboardItem as ClipboardItemComponent } from '@/components/ClipboardItem';
import { getItems, ClipboardItem, deleteExpiredItems } from '@/lib/storage';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const Index = () => {
  const [items, setItems] = useState<ClipboardItem[]>([]);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const updateItems = () => {
    deleteExpiredItems();
    setItems(getItems());
  };

  useEffect(() => {
    setMounted(true);
    updateItems();
    const interval = setInterval(updateItems, 1000);
    return () => clearInterval(interval);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-foreground">
            Clipper
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">Create New Note</h2>
          <Editor onSave={updateItems} />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-card-foreground">Your Notes</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <ClipboardItemComponent
                key={item.id}
                item={item}
                onDelete={updateItems}
              />
            ))}
            
            {items.length === 0 && (
              <div className="text-center p-8 bg-card rounded-lg">
                <p className="text-muted-foreground">No notes yet. Create one above!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;