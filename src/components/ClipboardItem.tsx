import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ClipboardItem as IClipboardItem, deleteItem } from '@/lib/storage';
import { QRCode } from './QRCode';

interface Props {
  item: IClipboardItem;
  onDelete: () => void;
}

export const ClipboardItem = ({ item, onDelete }: Props) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.content);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
      console.log('Copied to clipboard:', item.id);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    deleteItem(item.id);
    onDelete();
    toast({
      title: "Deleted",
      description: "Item removed from clipboard",
    });
  };

  const timeLeft = Math.floor((item.expiresAt - Date.now()) / (1000 * 60 * 60));

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 mr-4">
          <p className="text-sm text-gray-500">
            Expires in {timeLeft} hours
          </p>
          <p className="mt-2 break-words">
            {item.content}
          </p>
        </div>
        <QRCode text={item.content} />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleCopy} className="flex-1">
          Copy
        </Button>
        <Button 
          onClick={handleDelete} 
          variant="destructive"
          className="flex-1"
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};