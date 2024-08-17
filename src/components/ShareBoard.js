import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Share2 } from 'lucide-react';

export default function ShareBoard({ boardId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleShare = () => {
    // Mock API call to share the board
    console.log(`Sharing board ${boardId} with ${email}`);
    setIsOpen(false);
    setEmail('');
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Share2 className="mr-2 h-4 w-4" /> Share Board
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Board</DialogTitle>
          </DialogHeader>
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleShare}>Share</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}