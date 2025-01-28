import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getItemById } from '@/lib/storage';

const NoteDetail = () => {
  const { id } = useParams();
  const note = id ? getItemById(id) : null;

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
          <p className="whitespace-pre-wrap break-words text-card-foreground">
            {note.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;