//controller for enhancing resume's professional summary using AI
//POST: /api/ai/enhance-pro-sum
import ai, { getAIConfigError } from "../configs/ai.js";
import Resume from "../models/Resume.js";

const ensureAIConfigured = (res) => {
    const configError = getAIConfigError();

    if (configError) {
        res.status(503).json({ message: configError });
        return false;
    }

    return true;
};

export const enhanceProfessionalSummary= async (req, res) => {
    try{
        if (!ensureAIConfigured(res)) return;

        const {userContent} = req.body;

        if(!userContent){
            return res.status(400).json({message: 'Missing required fields'})   
        }

        const response = await ai.chat.completions.create({
        model:process.env.OPENAI_MODEL,
        messages:[
        {   "role": "system",
            "content": "You are a helpful assistant for enhancing the professional summary of a resume. You take the user's input and enhance it to make it more professional, concise and impactful. You can use industry-specific keywords and action verbs to make the summary stand out. You should also ensure that the enhanced summary is grammatically correct and free of any spelling errors.The resume summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. Only return text without any additional commentary or formatting."
        },
        {
            "role": "user",
            "content": userContent,
        }
    ], 
    })
    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({enhancedContent})

    } catch(error) {
        return res.status(400).json({message: error.message})
    }
}

//controller for enhancing reumes's job description using AI
//POST: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
    try {
        if (!ensureAIConfigured(res)) return;

        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert in resume writing and your task is to enhance the job description of a resume. The job description should be only 1 to 2 sentences, highlighting key responsibilities and acheivements. Use action verbs and quantifiable results where possible. Make it ATS-friendly and only return text with no options or additional commentary.',
                },
                {
                    role: 'user',
                    content: userContent,
                },
            ],
        });

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}


//controller for uploading a resume to the database
//POST:/api/ai/upload-resume
export const uploadResume = async (req, res) => {
    try {
        if (!ensureAIConfigured(res)) return;

        const {resumeText, title} = req.body;
        const userId= req.userId;

        if(!resumeText){
          return res.status(400).json({ message: 'Missing required fields' });
        }

        const systemPrompt="You are an expert AI agent to extract data from resume. "

        const userPrompt= `extract data from this resume: ${resumeText}
        Provde data in the following JSON format with no additional text before or after:
        {
        skills: [{ type: String, default: "" }],
        personal_info: {
            image: { type: String, default: "" },
            full_name: { type: String, default: "" },
            profession: { type: String, default: "" },
            email: { type: String, default: "" },
            phone: { type: String, default: "" },
            location: { type: String, default: "" },
            linkedin: { type: String, default: "" },
            website: { type: String, default: "" },
        },
        experience: [
            {
                company: { type: String, default: "" },
                position: { type: String, default: "" },
                start_date: { type: String, default: "" },
                end_date: { type: String, default: "" },
                description: { type: String, default: "" },
                is_current: { type: Boolean, default: false },
            },
        ],
        education: [
            {
                institution: { type: String, default: "" },
                degree: { type: String, default: "" },
                field: { type: String, default: "" },
                graduation_date: { type: String, default: "" },
                gpa: { type: String, default: "" },
            },
        ],
        project: [
            {
                name: { type: String, default: "" },
                type: { type: String, default: "" },
                description: { type: String, default: "" },
            },
        ],
        }
        `


        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: userPrompt,
                },
            ],
            response_format: {
                type: 'json_object',
        }
    });

        const extractedData = response.choices[0].message.content;
        const parsedData=JSON.parse(extractedData)
        const newResume= await Resume.create({userId, title, ...parsedData})

        res.json({ resumeId: newResume._id });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

