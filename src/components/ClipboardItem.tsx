import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ClipboardItem as IClipboardItem, deleteItem } from '@/lib/storage';
import { QRCode } from './QRCode';
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
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.content);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
        className: "bottom-0 right-0 fixed md:static",
      });
      console.log('Copied to clipboard:', item.id);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
        className: "bottom-0 right-0 fixed md:static",
      });
    }
  };

  const handleDelete = () => {
    deleteItem(item.id);
    onDelete();
    setShowDeleteDialog(false);
    toast({
      title: "Deleted",
      description: "Item removed from clipboard",
      className: "bottom-0 right-0 fixed md:static",
    });
  };

  const getTimeLeft = () => {
    const timeLeft = Math.floor((item.expiresAt - Date.now()) / (1000 * 60));
    if (timeLeft < 60) {
      return `${timeLeft} minutes`;
    }
    const hours = Math.floor(timeLeft / 60);
    return `${hours} hours`;
  };

  return (
    <>
      <Card className="p-4 space-y-4 hover:shadow-lg transition-shadow duration-200 bg-card">
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-4">
            <p className="text-sm text-muted-foreground">
              Expires in {getTimeLeft()}
            </p>
            <p className="mt-2 break-words text-card-foreground">
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