import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Trash2, Loader2 } from "lucide-react";
import { getItemById, deleteItem } from '@/lib/storage';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';
import { QRCode } from '@/components/QRCode';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', id],
    queryFn: () => id ? getItemById(id) : null,
  });

  const handleCopy = async () => {
    if (!note) return;
    
    try {
      await navigator.clipboard.writeText(note.content);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
        duration: 1000,
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
        duration: 1000,
      });
    }
  };

  const handleDelete = async () => {
    if (!note) return;
    
    try {
      setIsDeleting(true);
      await deleteItem(note.id);
      toast({
        title: "Deleted",
        description: "Note has been removed",
        duration: 1000,
      });
      navigate('/');
    } catch (err) {
      console.error('Failed to delete:', err);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
        duration: 1000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2" /> Back
          </Button>
        </Link>
        <div className="flex flex-col items-center justify-center space-y-4 mt-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading note details...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2" /> Back
          </Button>
        </Link>
        <div className="text-center mt-12">
          <p className="text-muted-foreground">Note not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Link to="/">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2" /> Back
        </Button>
      </Link>
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg p-6 shadow-lg space-y-6">
          <div className="flex justify-between items-start">
            <p className="text-sm text-muted-foreground">
              Expires in: {Math.floor((note.expiresAt - Date.now()) / (1000 * 60))} minutes
            </p>
            <QRCode text={note.content} />
          </div>
          
          <p className="whitespace-pre-wrap break-words text-card-foreground">
            {note.content}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button onClick={handleCopy} className="w-full sm:w-32">
              <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-32" disabled={isDeleting}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Note</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this note? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;