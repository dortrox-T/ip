
import { Container } from '@/components/ui/container';
import AuthForm from '@/components/AuthForm';

const LoginPage = () => {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-brand-300 to-brand-500 text-transparent bg-clip-text">
            InstaNova
          </h1>
          <p className="text-muted-foreground">
            Sign in to see photos and videos from your friends
          </p>
        </div>
        <AuthForm type="login" />
      </div>
    </Container>
  );
};

export default LoginPage;
