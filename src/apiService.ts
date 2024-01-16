const { VertexAI } = require('@google-cloud/vertexai');

// Assuming you've already authenticated and have necessary environment variables set up
const vertex_ai = new VertexAI({ project: process.env.REACT_APP_GCP_PROJECT_ID, location: 'us-central1' });
const model = 'gemini-pro-vision';

export const fetchImageAnalysis = async (base64Image: string) => {
  // Initialize the generative model with your specific model details
  const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: model,
    generation_config: {
      "max_output_tokens": 2048,
      "temperature": 0.4,
      "top_p": 1,
      "top_k": 32
    },
  });

  try {
    // Construct the request with the base64 image and your prompt
    const req = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: "Analyze this image and provide Spotify recommendation parameters",
              image: {
                base64: base64Image
              }
            }
          ]
        }
      ],
    };

    const streamingResp = await generativeModel.generateContentStream(req);
    let aggregatedResponse = '';

    for await (const item of streamingResp.stream) {
      aggregatedResponse += item;
    }

    return aggregatedResponse;
  } catch (error) {
    console.error('Error in Vertex AI model query:', error);
    return null;
  }
}
