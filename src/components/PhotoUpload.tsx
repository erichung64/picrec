// src/components/PhotoUpload.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react";

export const PhotoUpload = ({ onImageUpload, analysisResult, userProfile  }: { onImageUpload: (base64: string) => void, analysisResult: any, userProfile: any }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const base64 = await convertToBase64(selectedFile);
      onImageUpload(base64);
    }
  };

  const convertToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Ensure the data URL scheme is included
      const result = reader.result as string;
      const dataUrlScheme = `data:${file.type};base64,${result.split(',')[1]}`;
      resolve(dataUrlScheme);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });




  return (
  <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-800 p-4">
    {userProfile && (
        <Badge className="mb-4">
            Logged in as {userProfile.display_name}
        </Badge>
    )}
        <div className="file-upload mb-4">
                <Label htmlFor="photo-upload" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
                    Upload Photo
                </Label>
                <Input 
                    id="photo-upload" 
                    type="file" 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="mt-2 block w-full text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-630 cursor-pointer"
                />
          </div>
    {selectedFile && (
        <Button 
            onClick={handleUpload} 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4"
        >
            Analyze Image
        </Button>
    )}
    
  </div>
  );
};
