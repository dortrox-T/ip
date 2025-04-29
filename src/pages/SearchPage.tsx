import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  profileImage?: string;
  fullName: string;
}

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // This would typically come from your backend
  const mockUsers: User[] = [
    { id: '1', username: 'john_doe', fullName: 'John Doe', profileImage: 'https://api.dicebear.com/7.x/avatars/svg?seed=john' },
    { id: '2', username: 'jane_smith', fullName: 'Jane Smith', profileImage: 'https://api.dicebear.com/7.x/avatars/svg?seed=jane' },
    { id: '3', username: 'mike_wilson', fullName: 'Mike Wilson', profileImage: 'https://api.dicebear.com/7.x/avatars/svg?seed=mike' },
  ];

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const results = mockUsers.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="container max-w-2xl py-8">
      <div className="flex gap-4 mb-8">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 focus-visible:ring-instagram-purple"
        />
        <Button 
          onClick={handleSearch} 
          disabled={isLoading}
          className="bg-brand-gradient text-white hover:opacity-90"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg border animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-instagram-purple to-instagram-orange"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-gradient-to-r from-instagram-purple to-instagram-orange rounded"></div>
                  <div className="h-3 w-32 bg-gradient-to-r from-instagram-purple to-instagram-orange rounded opacity-70"></div>
                </div>
              </div>
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          searchResults.map((user) => (
            <Link
              key={user.id}
              to={`/profile/${user.username}`}
              className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/5 transition-colors group"
            >
              <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-transparent group-hover:ring-instagram-purple transition-all">
                <AvatarImage src={user.profileImage} alt={user.username} />
                <AvatarFallback className="bg-brand-300 text-white">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium group-hover:text-instagram-purple transition-colors">{user.fullName}</h3>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
            </Link>
          ))
        ) : searchQuery && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No users found</p>
            <p className="text-sm text-muted-foreground mt-1">Try searching for a different name or username</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 