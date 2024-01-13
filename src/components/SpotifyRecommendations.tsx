import React, { useEffect, useState } from 'react';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  // Add other properties as needed
}

interface SpotifyRecommendationsProps {
  accessToken: string | null;
  topTrackIds: string[];
  onAnalyzeClick: boolean;
  spotifyParams: Record<string, string | string[]>; // Parameters including genres as array
}

const SpotifyRecommendations = ({ accessToken, topTrackIds, onAnalyzeClick, spotifyParams }: SpotifyRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Track[]>([]);

  useEffect(() => {
    if (onAnalyzeClick && accessToken && Object.keys(spotifyParams).length > 0) {
      fetchRecommendations();
    }
  }, [onAnalyzeClick, accessToken, spotifyParams]);

  const fetchRecommendations = async () => {
    const queryParameters = new URLSearchParams({
      seed_tracks: topTrackIds.join(','),
    });

    // Add other parameters and handle genres separately
    for (const [key, value] of Object.entries(spotifyParams)) {
      if (value !== 'N/A') {
        if (key === 'genres' && Array.isArray(value)) {
          queryParameters.set(key, value.join(','));
        } else {
          queryParameters.set(key, value as string);
        }
      }
    }

    const url = `https://api.spotify.com/v1/recommendations?${queryParameters}`;
    console.log(url); // Log the URL for debugging
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      setRecommendations(data.tracks);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  return (
    <div>
      {recommendations.map((track) => (
        <div key={track.id}>
          <p>{track.name} by {track.artists.map((artist) => artist.name).join(', ')}</p>
          {/* Display other track details as needed */}
        </div>
      ))}
    </div>
  );
};

export default SpotifyRecommendations;
