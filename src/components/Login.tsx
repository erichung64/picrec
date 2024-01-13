// src/components/Login.tsx
import React from 'react';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID; 
const REDIRECT_URI = "http://localhost:3000/callback";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "code";
const SCOPES = ["user-read-private", "user-read-email", "user-top-read"]; // Add more scopes as needed

export const Login = () => {
  const handleLogin = () => {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES.join(" ")}`;
  };

  return (
    <div>
      <button onClick={handleLogin}>Login to Spotify</button>
    </div>
  );
};
