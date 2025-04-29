export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  profileImage?: string;
  bio?: string;
  website?: string;
  location?: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userProfileImage?: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  createdAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userProfileImage?: string;
  text: string;
  createdAt: Date;
}
