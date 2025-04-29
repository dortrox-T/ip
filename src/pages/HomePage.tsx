
import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import PostCard from '@/components/PostCard';
import { Post } from '@/types';
import { getAllPosts } from '@/services/postService';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ImagePlus } from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = () => {
      setLoading(true);
      const allPosts = getAllPosts();
      setPosts(allPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  return (
    <Container>
      <div className="py-8 max-w-md mx-auto">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-muted rounded-t-md flex items-center px-4 gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted-foreground/30"></div>
                  <div className="h-4 w-24 bg-muted-foreground/30 rounded"></div>
                </div>
                <div className="aspect-square bg-muted"></div>
                <div className="h-28 bg-muted rounded-b-md p-4 space-y-2">
                  <div className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-muted-foreground/30"></div>
                    <div className="h-6 w-6 rounded-full bg-muted-foreground/30"></div>
                  </div>
                  <div className="h-4 w-24 bg-muted-foreground/30 rounded"></div>
                  <div className="h-4 w-3/4 bg-muted-foreground/30 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {!isAuthenticated && (
              <div className="bg-card text-card-foreground shadow-sm rounded-lg p-6 mb-8 text-center">
                <h2 className="font-bold text-lg mb-2">Welcome to InstaNova!</h2>
                <p className="text-muted-foreground mb-4">
                  Sign up or log in to share your moments and interact with others.
                </p>
              </div>
            )}

            {isAuthenticated && (
              <div className="bg-gradient-to-r from-brand-400/30 to-purple-400/30 text-card-foreground shadow-sm rounded-lg p-6 mb-8">
                <h2 className="font-bold text-lg mb-2">Share your moments!</h2>
                <p className="text-muted-foreground mb-4">
                  Try using random Unsplash images by entering URLs like:<br />
                  <code className="bg-background px-2 py-1 rounded text-sm">
                    https://source.unsplash.com/random/800x800/?nature
                  </code>
                </p>
                <Button asChild className="bg-brand-400 hover:bg-brand-500">
                  <Link to="/create" className="flex items-center gap-2">
                    <ImagePlus size={18} />
                    Create Post
                  </Link>
                </Button>
              </div>
            )}

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No Posts Yet</h3>
                <p className="text-muted-foreground">Be the first to share something!</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={handlePostUpdate}
                />
              ))
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default HomePage;
