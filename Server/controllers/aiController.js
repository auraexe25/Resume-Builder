//controller for enhancing resume's professional summary using AI
//POST: /api/ai/enhance-pro-sum
import ai, { getAIConfigError } from "../configs/ai.js";
import Resume from "../models/Resume.js";

const AI_TIMEOUT_MS = 45000;
const AI_RATE_LIMIT_RETRY_MS = 2000;
const AI_BASE_URL = process.env.OPENAI_BASE_URL || process.env.OPENAIAI_BASE_URL || '';
const PRIMARY_MODEL = process.env.OPENAI_MODEL;

const getModelCandidates = () => {
    const candidates = [];

    if (PRIMARY_MODEL) {
        candidates.push(PRIMARY_MODEL);
    }

    const customFallbacks = (process.env.OPENAI_FALLBACK_MODELS || '')
        .split(',')
        .map((model) => model.trim())
        .filter(Boolean);

    if (customFallbacks.length) {
        candidates.push(...customFallbacks);
    }

    const isGoogleCompatible = AI_BASE_URL.includes('generativelanguage.googleapis.com');

    if (isGoogleCompatible) {
        candidates.push('gemini-2.0-flash', 'gemini-1.5-flash');
    } else {
        candidates.push('gpt-4o-mini', 'gpt-4.1-mini');
    }

    return [...new Set(candidates)];
};

const ensureAIConfigured = (res) => {
    const configError = getAIConfigError();

    if (configError) {
        res.status(503).json({ message: configError });
        return false;
    }

    return true;
};

const handleAIError = (res, error) => {
    const statusCode = error?.status || error?.response?.status || 503;
    const isRateLimited = statusCode === 429;

    const message = isRateLimited
        ? "AI rate limit reached. Please wait a moment and try again."
        : error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "AI service is temporarily unavailable. Please try again.";

    return res.status(statusCode).json({ message });
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const withTimeout = (promise, ms, timeoutMessage) =>
    new Promise((resolve, reject) => {
        const timerId = setTimeout(() => {
            const timeoutError = new Error(timeoutMessage);
            timeoutError.status = 504;
            reject(timeoutError);
        }, ms);

        promise
            .then((result) => {
                clearTimeout(timerId);
                resolve(result);
            })
            .catch((error) => {
                clearTimeout(timerId);
                reject(error);
            });
    });

const createChatCompletionWithFallback = async ({ messages, responseFormat, timeoutMessage }) => {
    const models = getModelCandidates();

    if (!models.length) {
        const missingModelError = new Error('No AI model configured. Set OPENAI_MODEL.');
        missingModelError.status = 503;
        throw missingModelError;
    }

    let lastError = null;

    for (const model of models) {
        try {
            return await withTimeout(
                ai.chat.completions.create({
                    model,
                    messages,
                    ...(responseFormat ? { response_format: responseFormat } : {}),
                }),
                AI_TIMEOUT_MS,
                timeoutMessage
            );
        } catch (error) {
            lastError = error;
            const message = (error?.response?.data?.error?.message || error?.message || '').toLowerCase();
            const status = error?.status || error?.response?.status;

            if (status === 429) {
                await sleep(AI_RATE_LIMIT_RETRY_MS);

                try {
                    return await withTimeout(
                        ai.chat.completions.create({
                            model,
                            messages,
                            ...(responseFormat ? { response_format: responseFormat } : {}),
                        }),
                        AI_TIMEOUT_MS,
                        timeoutMessage
                    );
                } catch (retryError) {
                    lastError = retryError;
                }
            }

            const shouldTryNextModel =
                status === 404 ||
                status === 400 ||
                message.includes('model') ||
                message.includes('not found') ||
                message.includes('unsupported');

            if (!shouldTryNextModel) {
                throw error;
            }
        }
    }

    throw lastError || new Error('AI request failed for all configured models.');
};

const buildResumeFallbackData = (resumeText) => {
    const safeText = String(resumeText || '').trim();
    const summary = safeText.slice(0, 800);

    return {
        professional_summary: summary,
        skills: [],
        personal_info: {
            image: '',
            full_name: '',
            profession: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            website: '',
        },
        experience: [],
        education: [],
        project: [],
    };
};

export const enhanceProfessionalSummary= async (req, res) => {
    try{
        if (!ensureAIConfigured(res)) return;

        const {userContent} = req.body;

        if(!userContent){
            return res.status(400).json({message: 'Missing required fields'})   
        }

        const response = await createChatCompletionWithFallback({
        messages:[
        {   "role": "system",
            "content": "You are a helpful assistant for enhancing the professional summary of a resume. You take the user's input and enhance it to make it more professional, concise and impactful. You can use industry-specific keywords and action verbs to make the summary stand out. You should also ensure that the enhanced summary is grammatically correct and free of any spelling errors.The resume summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. Only return text without any additional commentary or formatting."
        },
        {
            "role": "user",
            "content": userContent,
        }
    ], 
    timeoutMessage: 'AI enhancement timed out. Please try again.'
    })
    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({enhancedContent})

    } catch(error) {
        return handleAIError(res, error)
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

        const response = await createChatCompletionWithFallback({
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
            timeoutMessage: 'AI enhancement timed out. Please try again.'
        });

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        return handleAIError(res, error);
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


        let parsedData = null;
        let usedFallback = false;

        try {
            const response = await createChatCompletionWithFallback({
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
                responseFormat: {
                    type: 'json_object',
                },
                timeoutMessage: 'AI resume parsing timed out. Please try again.'
            });

            const extractedData = response.choices[0].message.content;
            parsedData = JSON.parse(extractedData);
        } catch (error) {
            const status = error?.status || error?.response?.status;
            const message = (error?.response?.data?.error?.message || error?.response?.data?.message || error?.message || '').toLowerCase();

            const shouldFallback =
                status === 429 ||
                status === 504 ||
                message.includes('rate limit') ||
                message.includes('timed out');

            if (!shouldFallback) {
                throw error;
            }

            usedFallback = true;
            parsedData = buildResumeFallbackData(resumeText);
        }

        const newResume = await Resume.create({userId, title, ...parsedData});

        return res.status(200).json({
            resumeId: newResume._id,
            usedFallback,
            message: usedFallback
                ? 'Resume uploaded. AI autofill was unavailable, so a draft was created.'
                : 'Resume uploaded and parsed successfully.'
        });
    } catch (error) {
        return handleAIError(res, error);
    }
}

