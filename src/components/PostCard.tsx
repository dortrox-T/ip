
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Post } from '@/types';
import { toggleLikePost, hasUserLikedPost } from '@/services/postService';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  onLike?: (post: Post) => void;
}

const PostCard = ({ post, onLike }: PostCardProps) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [liked, setLiked] = useState(hasUserLikedPost(post.id));
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
        variant: "destructive",
      });
      return;
    }

    const updatedPost = toggleLikePost(post.id);
    if (updatedPost) {
      setLiked(!liked);
      setLikesCount(updatedPost.likes);
      if (onLike) {
        onLike(updatedPost);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border border-border overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.username}`}>
            <Avatar>
              <AvatarImage src={post.userProfileImage} alt={post.username} />
              <AvatarFallback className="bg-brand-300 text-white">
                {post.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <Link 
              to={`/profile/${post.username}`}
              className="font-medium hover:underline"
            >
              {post.username}
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-square bg-secondary relative overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col p-4 pt-2 space-y-2">
        <div className="flex items-center w-full gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            className="p-0 hover:bg-transparent"
          >
            <Heart
              className={cn(
                "h-6 w-6 transition-colors duration-200",
                liked ? "fill-red-500 text-red-500" : "text-foreground"
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-0 hover:bg-transparent"
            asChild
          >
            <Link to={`/post/${post.id}`}>
              <MessageCircle className="h-6 w-6" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-0 hover:bg-transparent"
          >
            <Share className="h-6 w-6" />
          </Button>
        </div>

        {likesCount > 0 && (
          <p className="text-sm font-medium self-start">
            {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </p>
        )}

        <div className="text-sm self-start w-full">
          <Link to={`/profile/${post.username}`} className="font-medium mr-2 hover:underline">
            {post.username}
          </Link>
          {post.caption}
        </div>

        {post.comments > 0 && (
          <Link to={`/post/${post.id}`} className="text-sm text-muted-foreground self-start">
            View all {post.comments} comments
          </Link>
        )}

        <p className="text-xs text-muted-foreground self-start mt-1">
          {format(new Date(post.createdAt), 'MMMM d, yyyy')}
        </p>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
