import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ResizableBox } from 'react-resizable';
import { Link } from 'lucide-react';
import 'react-resizable/css/styles.css';

const colors = ['bg-yellow-200', 'bg-blue-200', 'bg-green-200', 'bg-pink-200', 'bg-purple-200'];

export default function StickyNote({ id, content, position, onMove, canvasRef, dispatch }) {
  const [noteContent, setNoteContent] = useState(content);
  const [color, setColor] = useState(colors[0]);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const [{ isDragging }, drag] = useDrag({
    type: 'note',
    item: { id, left: position.x, top: position.y },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleResize = (event, { size }) => {
    dispatch({ type: 'UPDATE_NOTE', payload: { id, size } });
  };

  const handleContentChange = (e) => {
    setNoteContent(e.target.value);
    dispatch({ type: 'UPDATE_NOTE', payload: { id, content: e.target.value } });
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
    dispatch({ type: 'UPDATE_NOTE', payload: { id, color: newColor } });
  };

  const handleAddLink = () => {
    if (linkUrl) {
      dispatch({ type: 'UPDATE_NOTE', payload: { id, link: linkUrl } });
      setShowLinkInput(false);
      setLinkUrl('');
    }
  };

  if (isDragging) {
    return <div ref={drag} />;
  }

  return (
    <ResizableBox
      width={200}
      height={200}
      minConstraints={[100, 100]}
      maxConstraints={[300, 300]}
      onResize={handleResize}
      resizeHandles={['se']}
      handle={<div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" />}
    >
      <Card
        ref={drag}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          opacity: isDragging ? 0.5 : 1,
        }}
        className={`p-2 cursor-move ${color}`}
      >
        <Textarea
          value={noteContent}
          onChange={handleContentChange}
          className="w-full h-full resize-none bg-transparent border-none focus:ring-0"
        />
        <div className="absolute bottom-1 left-1 flex space-x-1">
          {colors.map((c) => (
            <div
              key={c}
              className={`w-4 h-4 rounded-full cursor-pointer ${c}`}
              onClick={() => handleColorChange(c)}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-1 right-1"
          onClick={() => setShowLinkInput(!showLinkInput)}
        >
          <Link className="h-4 w-4" />
        </Button>
        {showLinkInput && (
          <div className="absolute bottom-8 right-1 bg-white p-2 rounded shadow">
            <Input
              type="url"
              placeholder="Enter URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="mb-2"
            />
            <Button size="sm" onClick={handleAddLink}>Add Link</Button>
          </div>
        )}
      </Card>
    </ResizableBox>
  );
}