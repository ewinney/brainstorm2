import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const shortcuts = [
  { key: 'Ctrl + N', description: 'Add new note' },
  { key: 'Ctrl + C', description: 'Add new chart' },
  { key: 'Ctrl + G', description: 'Add new group' },
  { key: 'Ctrl + S', description: 'Save board' },
  { key: 'Ctrl + E', description: 'Export board' },
  { key: 'Ctrl + F', description: 'Search notes' },
  { key: 'Ctrl + Z', description: 'Undo' },
  { key: 'Ctrl + Y', description: 'Redo' },
  { key: 'Ctrl + H', description: 'Open help' },
];

export default function KeyboardShortcuts({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {shortcuts.map((shortcut, index) => (
            <React.Fragment key={index}>
              <div className="font-bold">{shortcut.key}</div>
              <div>{shortcut.description}</div>
            </React.Fragment>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}