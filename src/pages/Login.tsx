
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/AuthNavbar';
import { toast } from 'sonner';
import { authService, LoginRequest } from '@/lib/auth';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsLoading(true)

    try{
      const loginRequest : LoginRequest = {username,password};
      const response = await authService.login(loginRequest);
      localStorage.setItem('token' , response.token)
      const payload = JSON.parse(atob(response.token.split('.')[1]));
      localStorage.setItem('userId', payload.userId.toString());

      toast.success('Login Succesfull!');
      navigate('/admin');
    }
    catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid username or password');
    }
    finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-quizrush-purple/90 to-quizrush-purple/70">
      <Navbar />
      <div className="container flex items-center justify-center min-h-screen py-20">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">Username</label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Enter your username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <Button className="w-full bg-quizrush-purple hover:bg-quizrush-light-purple" type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center">
            <div className="w-full text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-quizrush-purple hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
