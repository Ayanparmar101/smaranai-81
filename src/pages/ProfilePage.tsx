
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const ProfilePage = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data?.username) {
          setUsername(data.username);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // First, check if the profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      let error;
      
      if (!existingProfile) {
        // If profile doesn't exist, insert
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              username: username,
              updated_at: new Date().toISOString(),
            }
          ]);
        error = insertError;
      } else {
        // If profile exists, update
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username: username,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
        error = updateError;
      }

      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <div className="max-w-md mx-auto bg-card rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Display Name
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your display name"
              />
            </div>
            <Button
              onClick={updateProfile}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
