import  OpenAI from "openai";


const ai = new OpenAI({
    apiKey: process.env.OPENAIAI_API_KEY,
    base_url: process.env.OPENAIAI_BASE_URL,
});

export default ai;
