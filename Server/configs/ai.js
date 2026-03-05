import OpenAI from "openai";

// Grabs the key (also handles the typo in your .env file)
const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAIAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL || process.env.OPENAIAI_BASE_URL;

const hasApiKey = Boolean(apiKey);

// Create the client without blocking Google keys
const ai = hasApiKey
  ? new OpenAI({
      apiKey,
      baseURL,
      timeout: 45000,
      maxRetries: 1,
    })
  : null;

export const getAIConfigError = () => {
  if (!hasApiKey) {
    return "Missing OPENAI_API_KEY in server environment";
  }
  // The strict Google Key validation has been removed!
  return null;
};

export default ai;