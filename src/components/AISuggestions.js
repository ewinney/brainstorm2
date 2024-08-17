import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles } from 'lucide-react';
import { getAISuggestion } from '@/lib/ai-suggestions';
import { useToast } from "@/components/ui/use-toast";

export default function AISuggestions({ onAddSuggestion, notes, connectors, groups }) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoSuggestion, setAutoSuggestion] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const generateAutoSuggestion = async () => {
      const context = notes.map(note => note.content).join(' ');
      const groupNames = groups.map(group => group.name).join(', ');
      const suggestion = await getAISuggestion(`Given the current board state with ${notes.length} notes, ${connectors.length} connectors, and groups: ${groupNames}, suggest a new idea or connection.`, context);
      setAutoSuggestion(suggestion);
    };

    generateAutoSuggestion();
  }, [notes, connectors, groups]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const context = notes.map(note => note.content).join(' ');
      const suggestion = await getAISuggestion(prompt, context);
      onAddSuggestion(suggestion);
      setPrompt('');
      toast({
        title: "AI Suggestion Added",
        description: "A new suggestion has been added to your board.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4">
      <h2 className="text-lg font-semibold mb-4">AI Suggestions</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Enter a prompt for AI..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mb-2"
        />
        <Button type="submit" className="w-full mb-4" disabled={isLoading}>
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? "Thinking..." : "Get Suggestion"}
        </Button>
      </form>
      {autoSuggestion && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">Auto Suggestion:</h3>
          <p className="text-sm">{autoSuggestion}</p>
          <Button onClick={() => onAddSuggestion(autoSuggestion)} className="mt-2 w-full">
            Add to Board
          </Button>
        </div>
      )}
    </div>
  );
}