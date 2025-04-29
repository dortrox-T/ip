
import { Container } from '@/components/ui/container';
import CreatePostForm from '@/components/CreatePostForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CreatePostPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-3">Authentication Required</h1>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to create posts.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8 max-w-md mx-auto">
        <CreatePostForm />
      </div>
    </Container>
  );
};

export default CreatePostPage;
