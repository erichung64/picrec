// src/components/PhotoUpload.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PhotoUpload = ({ onImageUpload, analysisResult, userProfile }: { onImageUpload: (base64: string) => void, analysisResult: any, userProfile: any }) => {
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

  useEffect(() => {
    // Navigate to the recommendations page once analysisResult is available
    if (analysisResult) {
      navigate('/recommendations');
    }
  }, [analysisResult, navigate]);


  return (
    <div>
      {userProfile && <p>Logged in as {userProfile.email}</p>}
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {selectedFile && <button onClick={handleUpload}>Analyze Image</button>}
      {analysisResult && <div>
        <h3>Image Analysis Result:</h3>
        <p>{JSON.stringify(analysisResult, null, 2)}</p>
      </div>}
    </div>
  );
};
