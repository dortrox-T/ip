import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, PlusSquare, Search, User, LogOut, MessageCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Notifications from './Notifications';
import { ThemeToggle } from './ThemeToggle';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-instagram-gradient bg-clip-text text-transparent">
            InstaNova
          </span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="hover:text-instagram-purple">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/search">
              <Button variant="ghost" size="icon" className="hover:text-instagram-orange">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/create">
              <Button variant="ghost" size="icon" className="hover:text-instagram-blue">
                <PlusSquare className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/messages">
              <Button variant="ghost" size="icon" className="relative hover:text-instagram-purple">
                <MessageCircle className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-300 text-[10px] font-medium text-white flex items-center justify-center">
                  2
                </span>
              </Button>
            </Link>
            <Notifications />
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImage} alt={user?.username} />
                    <AvatarFallback className="bg-brand-300 text-white">
                      {user?.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to={`/profile/${user?.username}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-brand-gradient text-white hover:opacity-90">Sign up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
