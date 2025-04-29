import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

interface ChatUser {
  id: string;
  username: string;
  profileImage?: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

const MessagesPage = () => {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  // Mock data - replace with actual API calls
  const mockUsers: ChatUser[] = [
    {
      id: '1',
      username: 'john_doe',
      profileImage: 'https://api.dicebear.com/7.x/avatars/svg?seed=john',
      lastMessage: 'Hey, how are you?',
      lastMessageTime: '5m ago',
    },
    {
      id: '2',
      username: 'jane_smith',
      profileImage: 'https://api.dicebear.com/7.x/avatars/svg?seed=jane',
      lastMessage: 'The project looks great!',
      lastMessageTime: '1h ago',
    },
  ];

  const mockMessages: Message[] = [
    {
      id: '1',
      senderId: '1',
      receiverId: 'current_user',
      content: 'Hey, how are you?',
      timestamp: '5m ago',
    },
    {
      id: '2',
      senderId: 'current_user',
      receiverId: '1',
      content: "I'm doing great, thanks! How about you?",
      timestamp: '4m ago',
    },
  ];

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current_user',
      receiverId: selectedUser.id,
      content: messageInput,
      timestamp: 'Just now',
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)] border rounded-lg overflow-hidden">
        {/* Users list */}
        <div className="col-span-4 border-r overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Messages</h2>
          </div>
          <div className="divide-y">
            {mockUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  setSelectedUser(user);
                  setMessages(mockMessages);
                }}
                className={`w-full p-4 text-left hover:bg-accent transition-colors ${
                  selectedUser?.id === user.id ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.profileImage} alt={user.username} />
                    <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">@{user.username}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.lastMessage}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{user.lastMessageTime}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="col-span-8 flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedUser.profileImage} alt={selectedUser.username} />
                    <AvatarFallback>{selectedUser.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">@{selectedUser.username}</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'current_user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === 'current_user'
                          ? 'bg-brand-500 text-white'
                          : 'bg-accent'
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">{message.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!messageInput.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage; 