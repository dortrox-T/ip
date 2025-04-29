
import { Post } from '@/types';
import { mockPosts } from './mockData';
import { getCurrentUser } from './userService';

// Simulating a posts database with local storage
const localStorageKey = 'pixelpal-posts';

// Initialize local storage with mock data if empty
const initializePosts = (): Post[] => {
  const storedPosts = localStorage.getItem(localStorageKey);
  if (!storedPosts) {
    localStorage.setItem(localStorageKey, JSON.stringify(mockPosts));
    return mockPosts;
  }
  return JSON.parse(storedPosts);
};

// Get all posts
export const getAllPosts = (): Post[] => {
  const posts = initializePosts();
  // Sort posts by date (newest first)
  return [...posts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// Get post by ID
export const getPostById = (id: string): Post | undefined => {
  const posts = getAllPosts();
  return posts.find(post => post.id === id);
};

// Get posts by user ID
export const getPostsByUserId = (userId: string): Post[] => {
  const posts = getAllPosts();
  return posts.filter(post => post.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Create a new post
export const createPost = (postData: { imageUrl: string; caption: string }): Post | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null; // User must be logged in to create a post
  }
  
  const posts = getAllPosts();
  
  const newPost: Post = {
    id: `post-${Date.now()}`,
    userId: currentUser.id,
    username: currentUser.username,
    userProfileImage: currentUser.profileImage,
    imageUrl: postData.imageUrl,
    caption: postData.caption,
    likes: 0,
    comments: 0,
    createdAt: new Date(),
  };
  
  // Save to local storage
  localStorage.setItem(localStorageKey, JSON.stringify([...posts, newPost]));
  
  return newPost;
};

// Toggle like on a post
export const toggleLikePost = (postId: string): Post | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null; // User must be logged in to like a post
  }
  
  const posts = getAllPosts();
  const postIndex = posts.findIndex(post => post.id === postId);
  
  if (postIndex === -1) {
    return null; // Post not found
  }
  
  // Get likes for current user
  const likesKey = `pixelpal-likes-${currentUser.id}`;
  const userLikes = JSON.parse(localStorage.getItem(likesKey) || '[]');
  
  // Check if user already liked this post
  const alreadyLiked = userLikes.includes(postId);
  
  // Update post likes count
  const updatedPost = { ...posts[postIndex] };
  
  if (alreadyLiked) {
    // Unlike the post
    updatedPost.likes = Math.max(0, updatedPost.likes - 1);
    localStorage.setItem(likesKey, JSON.stringify(userLikes.filter((id: string) => id !== postId)));
  } else {
    // Like the post
    updatedPost.likes += 1;
    localStorage.setItem(likesKey, JSON.stringify([...userLikes, postId]));
  }
  
  // Update posts in local storage
  posts[postIndex] = updatedPost;
  localStorage.setItem(localStorageKey, JSON.stringify(posts));
  
  return updatedPost;
};

// Check if user has liked a post
export const hasUserLikedPost = (postId: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }
  
  const likesKey = `pixelpal-likes-${currentUser.id}`;
  const userLikes = JSON.parse(localStorage.getItem(likesKey) || '[]');
  
  return userLikes.includes(postId);
};
