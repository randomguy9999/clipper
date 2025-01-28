import React, { useState, useEffect } from 'react';
import { Editor } from '@/components/Editor';
import { ClipboardItem as ClipboardItemComponent } from '@/components/ClipboardItem';
import { getItems, ClipboardItem } from '@/lib/storage';

const Index = () => {
  const [items, setItems] = useState<ClipboardItem[]>([]);

  useEffect(() => {
    setItems(getItems());
  }, []);

  const handleDelete = () => {
    setItems(getItems());
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Clipper
        </h1>
        
        <Editor />
        
        <div className="space-y-4">
          {items.map((item) => (
            <ClipboardItemComponent
              key={item.id}
              item={item}
              onDelete={handleDelete}
            />
          ))}
          
          {items.length === 0 && (
            <p className="text-center text-gray-500">
              No items in clipboard yet. Paste something above!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;