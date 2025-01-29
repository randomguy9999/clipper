import { supabase } from "@/integrations/supabase/client";

export interface ClipboardItem {
  id: string;
  content: string;
  createdAt: number;
  expiresAt: number;
}

export const saveItem = async (content: string, expiryTime: number): Promise<ClipboardItem> => {
  const item = {
    content,
    expires_at: new Date(Date.now() + expiryTime).toISOString(),
  };

  const { data, error } = await supabase
    .from('notes')
    .insert(item)
    .select()
    .single();

  if (error) {
    console.error('Error saving note:', error);
    throw error;
  }

  console.log('Saved new note:', data);
  
  return {
    id: data.id,
    content: data.content,
    createdAt: new Date(data.created_at).getTime(),
    expiresAt: new Date(data.expires_at).getTime(),
  };
};

export const getItems = async (): Promise<ClipboardItem[]> => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }

  return data.map(item => ({
    id: item.id,
    content: item.content,
    createdAt: new Date(item.created_at).getTime(),
    expiresAt: new Date(item.expires_at).getTime(),
  }));
};

export const getItemById = async (id: string): Promise<ClipboardItem | null> => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching note:', error);
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    content: data.content,
    createdAt: new Date(data.created_at).getTime(),
    expiresAt: new Date(data.expires_at).getTime(),
  };
};

export const deleteItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
  
  console.log('Deleted note:', id);
};

export const deleteExpiredItems = async (): Promise<void> => {
  const { error } = await supabase
    .from('notes')
    .delete()
    .lt('expires_at', new Date().toISOString());

  if (error) {
    console.error('Error deleting expired notes:', error);
    throw error;
  }
  
  console.log('Removed expired notes');
};