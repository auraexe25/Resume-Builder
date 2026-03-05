import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import mongoose from 'mongoose';
import fs from 'fs';

//controller for creating a new resume
//POST: /api/resumes/create
export const createResume= async (req, res) => {   
    try{
        const userId= req.userId;
        const {title} = req.body;

        //create new resume
        const newResume= await Resume.create({
            userId,
            title,
        })

        //return sucess message
        return res.status(201).json({message: 'Resume created successfully', resume: newResume})
    }
    catch(error){
        return res.status(400).json({message: error.message})
    }
}

//controller for deleting a resume
//DELETE: /api/resumes/:id
export const deleteResume= async (req, res) => {   
    try{
        const userId= req.userId;
        const {resumeId} = req.params;

        await Resume.findOneAndDelete({_id: resumeId, userId})
       
        //return sucess message
        return res.status(201).json({message: 'Resume deleted successfully'})
    }
    catch(error){
        return res.status(400).json({message: error.message})
    }
}


//get usser resume by id
//GET: /api/resumes/:id
export const getResumeById= async (req, res) => {   
    try{
        const userId= req.userId;
        const {resumeId} = req.params;

        const resume= await Resume.findOne({_id: resumeId, userId})
       
        if(!resume){
            return res.status(404).json({message: 'Resume not found'})
        }
        resume.__v= undefined;
        resume.createdAt= undefined;
        resume.updatedAt= undefined;
        return res.status(200).json({resume})
    }
    catch(error){
        return res.status(400).json({message: error.message})
    }
}

//get resume by id publiic
//GET: /api/resumes/public
export const getPublicResumeById= async (req, res) => {   
    try{
        const {resumeId} = req.params;
        const normalizedResumeId = String(resumeId || '').match(/[a-fA-F0-9]{24}/)?.[0];

        if (!normalizedResumeId || !mongoose.Types.ObjectId.isValid(normalizedResumeId)) {
            return res.status(404).json({message: 'Resume not found'})
        }

        const resume= await Resume.findOne({_id: normalizedResumeId, public: true})

        if(!resume){
            return res.status(404).json({message: 'Resume not found'})
        }
        return res.status(200).json({resume})
    }
    catch(error){
        return res.status(400).json({message: error.message})
    }
}

//controller for updating a resume
//PUT: /api/resumes/update
export const updateResume= async (req, res) => {
    try {
        const userId= req.userId;
        const {resumeId, resumeData, removeBackground} = req.body;
        const image= req.file;

        let resumeDataCopy = {};

        if (typeof resumeData === 'string') {
            resumeDataCopy = JSON.parse(resumeData || '{}');
        } else {
            resumeDataCopy = JSON.parse(JSON.stringify(resumeData || {}));
        }

        const shouldRemoveBackground = removeBackground === true || removeBackground === 'true';

        if(image){
            const imageBufferData= fs.createReadStream(image.path)
            const response= await imagekit.files.upload({
                file: imageBufferData,
                fileName: 'resume.png',
                folder:'user-resumes',
                transformation: {
                    pre: 'w-300 h-300, fo-face, z-0.75' + (shouldRemoveBackground ? ', e-bgremove' : '')
                }
            });

            if (!resumeDataCopy.personal_info) {
                resumeDataCopy.personal_info = {};
            }

            resumeDataCopy.personal_info.image= response.url;

            fs.unlink(image.path, () => {});
        }

        const resume= await Resume.findOneAndUpdate({_id: resumeId, userId}, resumeDataCopy, {returnDocument: 'after'})

        if(!resume){
            return res.status(404).json({message: 'Resume not found'})
        }

        return res.status(200).json({message: 'Saved successfully', resume})
    }
    catch(error){
        return res.status(400).json({message: error.message})
    }
}
