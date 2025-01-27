import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { saveItem } from '@/lib/storage';

export const Editor = () => {
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content",
        variant: "destructive",
      });
      return;
    }

    const item = saveItem(content);
    setContent('');
    
    toast({
      title: "Success",
      description: "Content saved to clipboard",
    });
    
    console.log('Content saved:', item);
  };

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste your content here..."
        className="min-h-[200px] text-lg p-4"
      />
      <Button 
        onClick={handleSave}
        className="w-full"
      >
        Save to Clipboard
      </Button>
    </div>
  );
};