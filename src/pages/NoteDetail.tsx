import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Trash2 } from "lucide-react";
import { getItemById, deleteItem } from '@/lib/storage';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: note } = useQuery({
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
        className: "fixed bottom-4 right-4 md:static",
      });
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
    if (!note) return;
    
    try {
      await deleteItem(note.id);
      toast({
        title: "Deleted",
        description: "Note has been removed",
        className: "fixed bottom-4 right-4 md:static",
      });
      navigate('/');
    } catch (err) {
      console.error('Failed to delete:', err);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
        className: "fixed bottom-4 right-4 md:static",
      });
    }
  };

  if (!note) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2" /> Back
          </Button>
        </Link>
        <div className="text-center">Note not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <Link to="/">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2" /> Back
        </Button>
      </Link>
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg p-6 shadow-lg">
          <p className="text-sm text-muted-foreground mb-4">
            Expires in: {Math.floor((note.expiresAt - Date.now()) / (1000 * 60))} minutes
          </p>
          <p className="whitespace-pre-wrap break-words text-card-foreground mb-6">
            {note.content}
          </p>
          <div className="flex gap-4 justify-end">
            <Button onClick={handleCopy} className="w-32">
              <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
            <Button onClick={handleDelete} variant="destructive" className="w-32">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;