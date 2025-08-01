import { createContext, useContext, useState, ReactNode } from 'react';
import { originalContent } from '@/data/content';
import { processContentWithGemini, GeminiAnalysis } from '@/lib/gemini';

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  images?: {mimeType: string, data: string}[];
  type: 'text' | 'link' | 'file';
  category: string;
  tags: string[];
  createdAt: Date;
  analysis?: GeminiAnalysis;
  isFavorite?: boolean;
  status?: 'pending' | 'processing' | 'processed' | 'error' | 'sensitive';
}

interface ContentContextType {
  content: ContentItem[];
  addContent: (item: Omit<ContentItem, 'id' | 'createdAt' | 'analysis' | 'status'>) => Promise<void>;
  deleteContent: (id: string) => void;
  getContentById: (id: string) => ContentItem | undefined;
  toggleFavorite: (id: string) => void;
  processQueue: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<ContentItem[]>(originalContent.map(c => ({...c, createdAt: new Date(c.createdAt), status: 'processed' })));

  const addContent = async (item: Omit<ContentItem, 'id' | 'createdAt' | 'analysis' | 'status'>) => {
    const newItem: ContentItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: 'pending',
    };
    setContent(prevContent => [newItem, ...prevContent]);
  };

  const processQueue = async () => {
    const pendingItem = content.find(item => item.status === 'pending');
    if (pendingItem) {
      setContent(prevContent => prevContent.map(item => item.id === pendingItem.id ? { ...item, status: 'processing' } : item));
      const analysis = await processContentWithGemini(pendingItem.content, pendingItem.images);
      
      if (analysis.error === 'sensitive') {
        setContent(prevContent => prevContent.map(item => item.id === pendingItem.id ? { ...item, status: 'sensitive' } : item));
        return;
      }

      setContent(prevContent => prevContent.map(item => item.id === pendingItem.id ? {
        ...item,
        analysis,
        title: analysis.title || item.title,
        tags: analysis.tags || item.tags,
        category: analysis.category || item.category,
        status: 'processed'
      } : item));
    }
  };

  const deleteContent = (id: string) => {
    setContent(prevContent => prevContent.filter(item => item.id !== id));
  };

  const getContentById = (id: string) => {
    return content.find(item => item.id === id);
  };

  const toggleFavorite = (id: string) => {
    setContent(prevContent =>
      prevContent.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  return (
    <ContentContext.Provider value={{ content, addContent, deleteContent, getContentById, toggleFavorite, processQueue }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};