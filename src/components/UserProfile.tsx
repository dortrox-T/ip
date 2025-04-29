import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid3X3, User as UserIcon } from 'lucide-react';
import { User } from '@/types';
import { Post } from '@/types';
import { getUserByUsername } from '@/services/userService';
import { getPostsByUserId } from '@/services/postService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import EditProfileDialog from './EditProfileDialog';

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const isCurrentUser = currentUser?.username === username;
  
  useEffect(() => {
    const loadUserData = () => {
      if (!username) return;
      
      setLoading(true);
      const userData = getUserByUsername(username);
      
      if (userData) {
        setUser(userData);
        const userPosts = getPostsByUserId(userData.id);
        setPosts(userPosts);
      }
      
      setLoading(false);
    };
    
    loadUserData();
  }, [username]);

  const handleProfileUpdate = async (updatedData: Partial<User>) => {
    if (!user) return;

    try {
      // This would typically be an API call
      const updatedUser = {
        ...user,
        ...updatedData,
      };
      
      setUser(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-pulse h-16 w-16 rounded-full bg-gradient-to-r from-instagram-purple to-instagram-orange mx-auto mb-4"></div>
          <div className="animate-pulse h-6 w-48 bg-gradient-to-r from-instagram-purple to-instagram-orange mx-auto mb-2"></div>
          <div className="animate-pulse h-4 w-24 bg-gradient-to-r from-instagram-purple to-instagram-orange mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">User not found</h2>
          <p className="text-muted-foreground">The user you're looking for doesn't exist</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
        <Avatar className="w-24 h-24 md:w-32 md:h-32 ring-4 ring-offset-4 ring-instagram-purple">
          <AvatarImage src={user.profileImage} alt={user.username} />
          <AvatarFallback className="text-2xl bg-brand-300 text-white">
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold">{user.username}</h1>
            {isCurrentUser ? (
              <EditProfileDialog user={user} onSave={handleProfileUpdate} />
            ) : (
              <Button size="sm" className="bg-brand-gradient text-white hover:opacity-90">
                Follow
              </Button>
            )}
          </div>
          
          <div className="flex justify-center md:justify-start gap-6 mb-4">
            <div>
              <span className="font-bold">{posts.length}</span>{" "}
              <span className="text-muted-foreground">posts</span>
            </div>
            <div>
              <span className="font-bold">127</span>{" "}
              <span className="text-muted-foreground">followers</span>
            </div>
            <div>
              <span className="font-bold">84</span>{" "}
              <span className="text-muted-foreground">following</span>
            </div>
          </div>
          
          <div>
            <h2 className="font-bold mb-1">{user.displayName}</h2>
            <p className="text-sm mb-2 text-muted-foreground">{user.bio || "No bio yet"}</p>
          </div>
        </div>
      </div>
      
      <Separator className="my-8" />
      
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="posts" className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white">
            <Grid3X3 className="h-4 w-4 mr-2" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="tagged" className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white">
            <UserIcon className="h-4 w-4 mr-2" />
            Tagged
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No Posts Yet</h3>
              <p className="text-muted-foreground">When you post, they'll appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 md:gap-3">
              {posts.map((post) => (
                <div 
                  key={post.id}
                  className="aspect-square overflow-hidden rounded-md bg-secondary hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="tagged">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No Tagged Posts</h3>
            <p className="text-muted-foreground">When people tag you, they'll appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
