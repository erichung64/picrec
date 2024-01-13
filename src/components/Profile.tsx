// src/components/Profile.tsx
import React, { useEffect, useState } from 'react';
import useAuthRedirect from '../useAuthRedirect';

interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  // ... add other profile fields as needed
}


interface ProfileProps {
  accessToken: string | null;
}

export const Profile = ({ accessToken }: ProfileProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useAuthRedirect(accessToken, '/photo-upload');

  useEffect(() => {
    if (accessToken) {
      fetchProfileData();
    }
  }, [accessToken]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile', error);
    }
  };
  

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>ID: {profile.id}</p>
      <p>Name: {profile.display_name}</p>
      <p>Email: {profile.email}</p>
      {/* Display other profile data as needed */}
    </div>
  );
};
