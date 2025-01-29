import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ClipboardItem as IClipboardItem, deleteItem } from '@/lib/storage';
import { QRCode } from './QRCode';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  item: IClipboardItem;
  onDelete: () => void;
}

export const ClipboardItem = ({ item, onDelete }: Props) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.content);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
        className: "fixed bottom-4 right-4 md:static",
      });
      console.log('Copied to clipboard:', item.id);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
        className: "fixed bottom-4 right-4 md:static",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteItem(item.id);
      onDelete();
      setShowDeleteDialog(false);
      toast({
        title: "Deleted",
        description: "Item removed from clipboard",
        className: "fixed bottom-4 right-4 md:static",
      });
    } catch (err) {
      console.error('Failed to delete:', err);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
        className: "fixed bottom-4 right-4 md:static",
      });
    }
  };

  const getTimeLeft = () => {
    const timeLeft = Math.floor((item.expiresAt - Date.now()) / (1000 * 60));
    if (timeLeft < 60) {
      return `${timeLeft} minutes`;
    }
    const hours = Math.floor(timeLeft / 60);
    return `${hours} hours`;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking buttons
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;
    navigate(`/note/${item.id}`);
  };

  const trimContent = (content: string) => {
    const lines = content.split('\n').slice(0, 3);
    let trimmed = lines.join('\n');
    if (content.split('\n').length > 3 || trimmed.length > 200) {
      trimmed = trimmed.slice(0, 200) + '...';
    }
    return trimmed;
  };

  return (
    <>
      <Card 
        className="p-4 space-y-4 hover:shadow-lg transition-shadow duration-200 bg-card cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-4">
            <p className="text-sm text-muted-foreground">
              Expires in {getTimeLeft()}
            </p>
            <p className="mt-2 break-words text-card-foreground whitespace-pre-wrap">
              {trimContent(item.content)}
            </p>
          </div>
          <QRCode text={item.content} />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCopy} className="flex-1">
            Copy
          </Button>
          <Button 
            onClick={() => setShowDeleteDialog(true)} 
            variant="destructive"
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this clipboard item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};