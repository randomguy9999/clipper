import React, { useState, KeyboardEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { saveItem } from '@/lib/storage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface EditorProps {
  onSave: () => void;
}

export const Editor = ({ onSave }: EditorProps) => {
  const [content, setContent] = useState('');
  const [customHours, setCustomHours] = useState('1');
  const [expiryOption, setExpiryOption] = useState('1');
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

    const expiryHours = expiryOption === 'custom' 
      ? parseInt(customHours) 
      : expiryOption === 'forever' 
        ? 8760 // 1 year
        : parseInt(expiryOption);

    const item = saveItem(content, expiryHours * 60 * 60 * 1000);
    setContent('');
    onSave();
    
    toast({
      title: "Success",
      description: "Content saved to clipboard",
      className: "bottom-0 right-0 fixed md:static",
    });
    
    console.log('Content saved:', item);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write your note here... (Shift + Enter or Ctrl + Enter to save)"
        className="min-h-[200px] text-lg p-4 bg-background border-2 focus:ring-2 transition-all duration-200"
      />
      
      <div className="flex gap-4 flex-col sm:flex-row">
        <Select
          value={expiryOption}
          onValueChange={setExpiryOption}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select expiry time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 hour</SelectItem>
            <SelectItem value="6">6 hours</SelectItem>
            <SelectItem value="12">12 hours</SelectItem>
            <SelectItem value="24">24 hours</SelectItem>
            <SelectItem value="forever">Forever</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>

        {expiryOption === 'custom' && (
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              value={customHours}
              onChange={(e) => setCustomHours(e.target.value)}
              className="w-24"
              min="1"
            />
            <span className="text-muted-foreground">hours</span>
          </div>
        )}

        <Button 
          onClick={handleSave}
          className="w-full sm:w-auto sm:flex-1"
        >
          Save to Clipboard
        </Button>
      </div>
    </div>
  );
};