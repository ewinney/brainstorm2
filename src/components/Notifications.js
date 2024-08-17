import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Mock fetching notifications
    const mockNotifications = [
      { id: 1, message: 'John shared a board with you', timestamp: new Date() },
      { id: 2, message: 'New comment on your board', timestamp: new Date() },
    ];
    setNotifications(mockNotifications);
  }, []);

  return (
    <div className="relative">
      <Button onClick={() => setIsOpen(!isOpen)} variant="ghost">
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </Button>
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-64 bg-white shadow-xl z-10">
          <div className="py-2">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500">No new notifications</p>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="px-4 py-2 hover:bg-gray-100">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {notification.timestamp.toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
}