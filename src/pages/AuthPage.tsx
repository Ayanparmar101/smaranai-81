
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import DoodleButton from '@/components/DoodleButton';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, Lock, LogIn, UserPlus, Google } from 'lucide-react';
import { Input } from '@/components/ui/input';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast.success('Account created! Please check your email for verification.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast.success('Logged in successfully!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback',
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Google login failed');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md py-12">
      <Card className="p-8 shadow-lg rounded-3xl border-2 border-gray-200">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-kid-blue via-kid-purple to-kid-red bg-clip-text text-transparent mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back!'}
          </h1>
          <p className="text-gray-600">
            {isSignUp ? 'Join the fun learning adventure!' : 'Sign in to continue your learning journey'}
          </p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-5">
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <DoodleButton 
            type="submit"
            color={isSignUp ? "green" : "blue"}
            loading={loading}
            className="w-full"
            icon={isSignUp ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </DoodleButton>
        </form>

        <div className="relative flex items-center justify-center mt-6 mb-6">
          <div className="absolute w-full border-t border-gray-300"></div>
          <div className="relative bg-white px-4 text-sm text-gray-500">
            Or continue with
          </div>
        </div>

        <Button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
          variant="outline"
        >
          <Google className="h-5 w-5 text-red-500" />
          <span>Google</span>
        </Button>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
