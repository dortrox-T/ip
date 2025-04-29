
import { User } from '@/types';
import { mockUsers } from './mockData';

// Simulating a user database with local storage
const localStorageKey = 'pixelpal-users';

// Initialize local storage with mock data if empty
const initializeUsers = (): User[] => {
  const storedUsers = localStorage.getItem(localStorageKey);
  if (!storedUsers) {
    localStorage.setItem(localStorageKey, JSON.stringify(mockUsers));
    return mockUsers;
  }
  return JSON.parse(storedUsers);
};

// Get all users
export const getAllUsers = (): User[] => {
  return initializeUsers();
};

// Get user by ID
export const getUserById = (id: string): User | undefined => {
  const users = getAllUsers();
  return users.find(user => user.id === id);
};

// Get user by username
export const getUserByUsername = (username: string): User | undefined => {
  const users = getAllUsers();
  return users.find(user => user.username === username);
};

// Authenticate user (mock login)
export const authenticateUser = (email: string, password: string): User | null => {
  // In a real app, you would check against encrypted passwords
  // For this demo, we'll just check if the email exists
  const users = getAllUsers();
  const user = users.find(user => user.email === email);
  return user || null;
};

// Register new user
export const registerUser = (userData: Omit<User, 'id' | 'createdAt'>): User => {
  const users = getAllUsers();
  
  // Check if username or email already exists
  const existingUser = users.find(
    user => user.username === userData.username || user.email === userData.email
  );
  
  if (existingUser) {
    throw new Error('Username or email already exists');
  }
  
  // Create new user
  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}`,
    createdAt: new Date(),
  };
  
  // Save to local storage
  localStorage.setItem(localStorageKey, JSON.stringify([...users, newUser]));
  
  return newUser;
};

// Current user session management
const userSessionKey = 'pixelpal-current-user';

export const setCurrentUser = (user: User): void => {
  localStorage.setItem(userSessionKey, JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(userSessionKey);
  return userJson ? JSON.parse(userJson) : null;
};

export const logoutCurrentUser = (): void => {
  localStorage.removeItem(userSessionKey);
};
