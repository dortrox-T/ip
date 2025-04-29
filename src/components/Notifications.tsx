import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Notification {
  id: string;
  message: string;
  timestamp: string;
}

const Notifications = () => {
  // This would typically come from your backend/state management
  const notifications: Notification[] = [
    {
      id: '1',
      message: 'John liked your post',
      timestamp: '5m ago',
    },
    {
      id: '2',
      message: 'Sarah started following you',
      timestamp: '10m ago',
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex flex-col gap-2 p-2">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 cursor-pointer">
                <p className="text-sm">{notification.message}</p>
                <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
              </DropdownMenuItem>
            ))
          ) : (
            <p className="text-sm text-center text-muted-foreground py-4">No new notifications</p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications; 