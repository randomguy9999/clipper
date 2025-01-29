import React, { useState, useEffect } from 'react';
import { Editor } from '@/components/Editor';
import { ClipboardItem as ClipboardItemComponent } from '@/components/ClipboardItem';
import { getItems, ClipboardItem, deleteExpiredItems } from '@/lib/storage';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const Index = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { data: items = [], refetch, isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: getItems,
  });

  const updateItems = async () => {
    await deleteExpiredItems();
    refetch();
  };

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(updateItems, 1000);
    return () => clearInterval(interval);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6 md:space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
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

        <div className="bg-card p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">Create New Note</h2>
          <Editor onSave={updateItems} />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-card-foreground">Your Notes</h2>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-card rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading your notes...</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;