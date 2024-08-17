import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import withAuth from '@/components/withAuth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

function Dashboard() {
  const [boards, setBoards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Mock API call to get user's boards
    const mockBoards = [
      { id: 1, name: 'Project Alpha', lastEdited: '2023-06-01' },
      { id: 2, name: 'Marketing Campaign', lastEdited: '2023-05-28' },
      { id: 3, name: 'Product Roadmap', lastEdited: '2023-05-25' },
    ];
    setBoards(mockBoards);
  }, []);

  const createNewBoard = () => {
    // Mock creating a new board
    const newBoard = { id: Date.now(), name: 'New Board', lastEdited: new Date().toISOString().split('T')[0] };
    setBoards([...boards, newBoard]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Brainstorming Boards</h1>
      <Button onClick={createNewBoard} className="mb-4">
        <PlusCircle className="mr-2 h-4 w-4" /> Create New Board
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board) => (
          <Card key={board.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(`/brainstorm-board?id=${board.id}`)}>
            <CardHeader>
              <CardTitle>{board.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Last edited: {board.lastEdited}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default withAuth(Dashboard);