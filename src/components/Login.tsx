// src/components/Login.tsx
import React from 'react';
import { Button } from "./ui/button"
import { AudioLines } from "lucide-react"

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
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 dark:bg-gray-800">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">ShutterSound</h1>
        <p className="text-md text-gray-600 dark:text-gray-300">
          Discover music that matches any picture. Upload an image and get a personalized Spotify playlist.
        </p>
      </div>
      <Button onClick={handleLogin} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-lg">
        Login to Spotify
      </Button>
    </div>
  );
};
