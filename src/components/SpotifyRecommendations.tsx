import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
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
  const [isFetched, setIsFetched] = useState(false); // New state to track if fetch has happened

  useEffect(() => {
    if (onAnalyzeClick && accessToken && Object.keys(spotifyParams).length > 0 && !isFetched) {
      fetchRecommendations();
      setIsFetched(true); // Set to true after fetching
    }
  }, [onAnalyzeClick, accessToken, spotifyParams, isFetched]); // Add isFetched as a dependency

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
    <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Track Name</TableHead>
        <TableHead>Artists</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {recommendations.map((track) => (
        <TableRow key={track.id}>
          <TableCell>{track.name}</TableCell>
          <TableCell>{track.artists.map(artist => artist.name).join(', ')}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  );
};

export default SpotifyRecommendations;
