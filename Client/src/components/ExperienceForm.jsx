import { Briefcase, Plus, Sparkles, SparklesIcon, Trash, Trash2 } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ExperienceForm = ({data, onChange}) => {
    const { token } = useSelector((state) => state.auth)
    const [enhancingIndex, setEnhancingIndex] = React.useState(null)


    const addExperience= () => {
        const newExperience= {
            company: "",
            position:"",
            start_date:"",
            end_date:"",
            description:"",
            is_current: false,
        };
        onChange([ ...data, newExperience])
    }

    const removeExperience= (index) => {
        const updatedExperience= data.filter((_, i) => i !== index);
        onChange(updatedExperience)
    }

    const updateExperience= (index, field, value) => {
        const updated= [...data];
        updated[index]= {...updated[index], [field]: value};
        onChange(updated)   
    }

    const enhanceDescription = async (index) => {
        const description = data[index]?.description || ''

        if (!description.trim()) {
            toast.error('Please add description text before AI enhancement')
            return
        }

        setEnhancingIndex(index)

        try {
            const { data: responseData } = await api.post(
                '/api/ai/enhance-job-desc',
                { userContent: description },
                { headers: { Authorization: token }, timeout: 45000 }
            )

            if (responseData?.enhancedContent) {
                updateExperience(index, 'description', responseData.enhancedContent)
                toast.success('Job description enhanced')
            }
        } catch (error) {
            const timeoutMessage = error?.code === 'ECONNABORTED'
                ? 'AI request timed out. Please try again.'
                : null
            const rateLimitMessage = error?.response?.status === 429
                ? 'AI is rate limited right now. Please wait a moment and retry.'
                : null
            const networkMessage = !error?.response && error?.message
                ? 'Server not reachable. Please ensure backend is running and try again.'
                : null
            toast.error(rateLimitMessage || timeoutMessage || networkMessage || error?.response?.data?.message || error.message)
        }

        setEnhancingIndex(null)
    }


  return (
    <div className='space-y-6'>
       <div className='flex items-center justify-between'>
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Experience</h3>
            <p className='text-sm text-gray-500'> Add your work experience details here</p>
        </div>
        <button onClick={addExperience} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors '>
            <Plus className="size-5" />
            Add Experience
        </button>
      </div>
      {data.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
            <Briefcase className= "w-12 h-12 mx-auto mb-3 text-gray-300"/>
            <p>No work experience added yet.</p>
            <p className= "text-sm">Click "Add Experience" to get started.</p>
        </div>
      ):(
        <div className="space-y-4">
            {data.map((experience, index)=> (
                <div key= {index} className= "p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className='flex justify-between items-center'>
                        <h4>Experience #{index + 1}</h4>
                        <button onClick={() => removeExperience(index)} className= "text-red-500 hover:text-red-700 transition-colors">
                            <Trash2 className="size-4"/>
                        </button>
                    </div>

                    <div className= 'grid md:grid-cols-2 gap-3'>
                        <input value= {experience.company || ""} onChange={(e) => updateExperience(index, "company", e.target.value)} type="text" placeholder="Company Name" className= "px-3 py-2 text-sm rounded-lg"/>
                        <input value= {experience.position || ""} onChange={(e) => updateExperience(index, "position", e.target.value)} type="text" placeholder="Job Title" className= "px-3 py-2 text-sm rounded-lg"/>
                        <input value= {experience.start_date || ""} onChange={(e) => updateExperience(index, "start_date", e.target.value)} type="month" placeholder="Start Date" className= "px-3 py-2 text-sm rounded-lg"/>
                        <input value= {experience.end_date || ""} onChange={(e) => updateExperience(index, "end_date", e.target.value)} type="month" disabled={experience.is_current} placeholder="End Date" className= "px-3 py-2 text-sm rounded-lg disable:bg-gray-100"/>
                    </div>

                    <label className='flex items-center gap-2'>
                        <input type="checkbox" checked={experience.is_current} onChange={(e) => updateExperience(index, "is_current", e.target.checked? true : false)} className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'/>
                        <span className='text-sm text-gray-700'>
                            Currently Working Here
                        </span>
                    </label>

                    <div className="space-y-2">
                        <div className= "flex items-center justify-between">
                            <label> Job Description</label>
                            <button type='button' onClick={() => enhanceDescription(index)} disabled={enhancingIndex === index} className='flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'>
                                <SparklesIcon className="w-3 h-3"/>
                                {enhancingIndex === index ? 'Enhancing...' : 'Enhance with AI'}
                            </button>
                        </div>
                        <textarea value={experience.description || ""} onChange={(e) => updateExperience(index, "description", e.target.value)} rows={4} className="w-full text-sm px-3 py-2 orunded-lg resize-none" placeholder= "Describe your key responsibilities and acheivements"/>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default ExperienceForm
