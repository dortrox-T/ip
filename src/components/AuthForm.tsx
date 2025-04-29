import React, { useState } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { authenticateUser, registerUser } from '@/services/userService';
import { Eye, EyeOff } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (type === 'login') {
        const user = authenticateUser(formData.email, formData.password);
        if (user) {
          login(user);
          navigate('/');
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password",
            variant: "destructive",
          });
        }
      } else {
        // Register
        if (!formData.username || !formData.email || !formData.password || !formData.displayName) {
          toast({
            title: "Registration failed",
            description: "All fields are required",
            variant: "destructive",
          });
          return;
        }
        
        const newUser = registerUser({
          username: formData.username,
          displayName: formData.displayName,
          email: formData.email,
          profileImage: `https://source.unsplash.com/random/100x100/?portrait&${Date.now()}`,
        });
        
        login(newUser);
        navigate('/');
        
        toast({
          title: "Registration successful",
          description: "Your account has been created",
        });
      }
    } catch (error) {
      toast({
        title: type === 'login' ? "Login failed" : "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          {type === 'login' ? 'Welcome Back' : 'Create Account'}
        </CardTitle>
        <CardDescription className="text-center">
          {type === 'login'
            ? 'Enter your credentials to access your account'
            : 'Fill out the form to create your PixelPal account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Choose a unique username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  placeholder="Your display name"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground hover:text-instagram-purple transition-colors" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground hover:text-instagram-purple transition-colors" />
                )}
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full bg-brand-gradient hover:opacity-90 text-white">
            {type === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        {type === 'login' ? (
          <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Button
              variant="link"
              className="p-0 text-brand-400 hover:text-brand-500"
              onClick={() => navigate('/register')}
            >
              Sign up
            </Button>
          </p>
        ) : (
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Button
              variant="link"
              className="p-0 text-brand-400 hover:text-brand-500"
              onClick={() => navigate('/login')}
            >
              Log in
            </Button>
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
