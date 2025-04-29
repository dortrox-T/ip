
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Camera, Upload } from 'lucide-react';
import { createPost } from '@/services/postService';

const imageCategories = [
  'nature', 'food', 'travel', 'technology', 'architecture', 
  'art', 'animals', 'people', 'fashion', 'sports'
];

const CreatePostForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // For demo purposes, we're using direct URLs, but in a real app we'd upload files
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreviewUrl(url); // In a real app, this would be a local file preview
  };
  
  const handleCategoryClick = (category: string) => {
    const randomId = Math.floor(Math.random() * 100);
    const newUrl = `https://source.unsplash.com/random/800x800/?${category}&id=${randomId}`;
    setImageUrl(newUrl);
    setPreviewUrl(newUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Convert file to data URL for storage
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!imageUrl) {
        toast({
          title: "Missing image",
          description: "Please add an image URL or upload a file",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      const newPost = createPost({ imageUrl, caption });
      
      if (newPost) {
        toast({
          title: "Post created",
          description: "Your post has been published successfully",
        });
        navigate('/');
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
        <CardDescription>
          Share a new photo with your followers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />

          <div className="space-y-2">
            <p className="text-sm font-medium">Choose how to add your image:</p>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full gap-2 h-20 flex-col"
                onClick={triggerFileInput}
              >
                <Upload className="h-6 w-6" />
                Upload from device
              </Button>
              
              <div className="space-y-2">
                <Label htmlFor="image">Or enter image URL</Label>
                <Input
                  id="image"
                  placeholder="Enter image URL"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                />
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Try an Unsplash URL like: https://source.unsplash.com/random/800x800/?nature
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 my-2">
            <p className="w-full text-sm font-medium mb-1">Quick image categories:</p>
            {imageCategories.map((category) => (
              <Button 
                key={category} 
                type="button" 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          
          {previewUrl && (
            <div className="aspect-square overflow-hidden rounded-md bg-secondary">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setPreviewUrl(null)}
              />
            </div>
          )}
          
          {!previewUrl && (
            <div className="aspect-square flex items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 bg-secondary">
              <div className="flex flex-col items-center text-muted-foreground">
                <Camera className="h-10 w-10 mb-2" />
                <p className="text-sm">Image preview will appear here</p>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Write a caption for your post..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-brand-400 hover:bg-brand-500"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          variant="link"
          onClick={() => navigate('/')}
          className="text-muted-foreground"
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatePostForm;
