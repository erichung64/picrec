
import React, { useEffect, useState, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Loader } from 'lucide-react';

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
  isLoading: boolean;
}

const SpotifyRecommendations = ({ accessToken, topTrackIds, onAnalyzeClick, spotifyParams, isLoading }: SpotifyRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const recommendationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      const queryParameters = new URLSearchParams({
        seed_tracks: topTrackIds.join(','),
        // ...add other query parameters...
      });

      const url = `https://api.spotify.com/v1/recommendations?${queryParameters}`;

      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await response.json();
        setRecommendations(data.tracks);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    }

    if (onAnalyzeClick && accessToken && !recommendations.length) {
      fetchRecommendations();
    }
  }, [onAnalyzeClick, accessToken, topTrackIds, spotifyParams]);

  useEffect(() => {
    if (recommendations.length > 0 && recommendationsRef.current) {
      recommendationsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [recommendations]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div ref={recommendationsRef}>
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
    </div>
  );
};

export default SpotifyRecommendations;
