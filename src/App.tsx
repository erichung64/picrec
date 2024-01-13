// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './components/Login';
import { Profile } from './components/Profile';
import { PhotoUpload } from './components/PhotoUpload';
import { fetchImageAnalysis } from './apiService';
import SpotifyRecommendations from './components/SpotifyRecommendations';
import axios from 'axios';
import qs from 'qs';

interface Track {
  id: string;

  // ... other track fields as needed ...
}

const App = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [onAnalyzeClick, setOnAnalyzeClick] = useState(false);
  const [spotifyParams, setSpotifyParams] = useState<Record<string, string | string[]>>({});

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      fetchAccessToken(code);
    }
  }, []);

  const fetchAccessToken = async (code: string) => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
  
    // Check if clientId and clientSecret are defined
    if (!clientId || !clientSecret) {
      console.error('Client ID or Client Secret is not defined');
      // Handle the error appropriately
      return;
    }
  
    // Prepare the request data
    const data = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: "http://localhost:3000/callback",
    };
  
    // Prepare the request headers
    const headers = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: clientId,
        password: clientSecret,
      },
    };
  
    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        qs.stringify(data),
        headers
      );
      setAccessToken(response.data.access_token);
    } catch (error) {
      console.error('Error fetching access token', error);
    }
  };

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = await response.json();
      setUserProfile(profileData);
    } catch (error) {
      console.error('Error fetching user profile', error);
    }
  };

  const fetchTopTracks = async (token: string) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const tracks: Track[] = data.items; // Use the Track interface here
      setTopTracks(tracks);
      console.log('Top Track IDs:', tracks.map((track: Track) => track.id)); // Explicitly type 'track' as Track
    } catch (error) {
      console.error('Error fetching top tracks', error);
    }
  };

  const handleImageUpload = async (base64Image: string) => {
    console.log("handleImageUpload called");

    const analysis = await fetchImageAnalysis(base64Image);
    console.log("GPT analysis response:", analysis);

    setImageAnalysis(analysis);
    // Parse the GPT response to get Spotify parameters
    if (analysis) {
      const gptResponse = analysis.choices[0].message.content;
      const parsedParams = parseGptResponse(gptResponse);
      console.log('Raw GPT Response:', gptResponse);
      console.log('Parsed Parameters:', parsedParams);

      setSpotifyParams(parsedParams);
    }

    setOnAnalyzeClick(true); 
  };

  const validSpotifyParameters: Record<string, 'number' | 'integer' | 'string'> = {
    min_energy: 'number',
    max_energy: 'number',
    target_energy: 'number',
    min_tempo: 'number',
    max_tempo: 'number',
    target_tempo: 'number',
    min_acousticness: 'number',
    max_acousticness: 'number',
    target_acousticness: 'number',
    min_danceability: 'number',
    max_danceability: 'number',
    target_danceability: 'number',
    min_duration_ms: 'integer',
    max_duration_ms: 'integer',
    target_duration_ms: 'integer',
    min_instrumentalness: 'number',
    max_instrumentalness: 'number',
    target_instrumentalness: 'number',
    min_key: 'integer',
    max_key: 'integer',
    target_key: 'integer',
    min_liveness: 'number',
    max_liveness: 'number',
    target_liveness: 'number',
    min_loudness: 'number',
    max_loudness: 'number',
    target_loudness: 'number',
    min_mode: 'integer',
    max_mode: 'integer',
    target_mode: 'integer',
    min_popularity: 'integer',
    max_popularity: 'integer',
    target_popularity: 'integer',
    min_speechiness: 'number',
    max_speechiness: 'number',
    target_speechiness: 'number',
    min_time_signature: 'integer',
    max_time_signature: 'integer',
    target_time_signature: 'integer',
    min_valence: 'number',
    max_valence: 'number',
    target_valence: 'number',
    genres: 'string'
    // ... other parameters as needed ...
  };
    
  const parseGptResponse = (response: string): Record<string, string | string[]> => {
    const lines = response.split('\n');
    const params: Record<string, string | string[]> = {};
  
    for (const line of lines) {
      const [key, rawValue] = line.split(':').map(part => part.trim());
      if (!rawValue || rawValue === 'N/A' || !validSpotifyParameters[key]) {
        continue; // Skip if value is not valid or key is not recognized
      }
  
      // Handle genres separately
      if (key === 'genres') {
        const genres = rawValue.split(',').map(genre => genre.trim());
        params[key] = genres;
        continue;
      }
  
      // Validate based on the expected type
      let isValidValue = false;
      const value = validSpotifyParameters[key] === 'integer' ? parseInt(rawValue) : parseFloat(rawValue);
  
      switch (validSpotifyParameters[key]) {
        case 'number':
          isValidValue = !isNaN(value);
          break;
        case 'integer':
          isValidValue = Number.isInteger(value);
          break;
      }
  
      if (isValidValue) {
        params[key] = rawValue;
      }
    }
  
    return params;
  };  

  useEffect(() => {
    if (accessToken) {
      fetchUserProfile(accessToken);
      fetchTopTracks(accessToken); // Fetch top tracks here
    }
  }, [accessToken]);

  
  return (
<Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Profile accessToken={accessToken} />} />
        <Route path="/photo-upload" element={
          <div className="container mx-auto px-4">
            <PhotoUpload 
              onImageUpload={handleImageUpload} 
              analysisResult={imageAnalysis} 
              userProfile={userProfile} 
            />
            {onAnalyzeClick && (
              <div className="transition-opacity duration-500 ease-in-out mt-8">
                <SpotifyRecommendations 
                  accessToken={accessToken} 
                  topTrackIds={topTracks.map(track => track.id)}
                  onAnalyzeClick={onAnalyzeClick}
                  spotifyParams={spotifyParams}
                />
              </div>
            )}
          </div>
        } />
        {/* Other routes... */}
      </Routes>
    </Router>
  );
};

export default App;
