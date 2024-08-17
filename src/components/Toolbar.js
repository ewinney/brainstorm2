import { Button } from '@/components/ui/button';
import { PlusCircle, Type, Image, BarChart2, ArrowRight, FolderPlus } from 'lucide-react';

export default function Toolbar({ onAddNote, onAddChart, onAddConnector, onAddGroup }) {
  return (
    <div className="w-16 bg-gray-800 dark:bg-gray-900 p-2 flex flex-col items-center space-y-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAddNote('New note')}
        title="Add Note (Ctrl+N)"
      >
        <PlusCircle className="h-6 w-6 text-white" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAddChart()}
        title="Add Chart (Ctrl+C)"
      >
        <BarChart2 className="h-6 w-6 text-white" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAddConnector()}
        title="Add Connector"
      >
        <ArrowRight className="h-6 w-6 text-white" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAddGroup()}
        title="Add Group"
      >
        <FolderPlus className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
}