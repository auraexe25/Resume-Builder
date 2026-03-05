import React, { useEffect, useState } from 'react' // Added useState
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadCloudIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User } from 'lucide-react' // FIX: Added missing import
import { dummyResumeData } from '../assets/assets'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ResumeBuilder = () => {

  const { resumeId } = useParams()
  const {token} = useSelector(state=> state.auth)


  const [resumeData, setResumeData] = useState(() => {
    const existingResume = dummyResumeData.find((resume) => resume._id === resumeId)
    return existingResume || {
      _id: '',
      title: '',
      personal_info: {},
      professional_summary: '',
      experience: [],
      education: [],
      projects: [],
      project: [],
      skills: [],
      template: 'classic',
      accent_color: '#3B82F6',
      public: false,
    }
  })
const saveResume = async () => {
  try {
    const formData = new FormData()
    formData.append('resumeId', resumeId)
    formData.append('removeBackground', String(removeBackground))

    const resumeDataToSave = JSON.parse(JSON.stringify(resumeData))
    const selectedImage = resumeData?.personal_info?.image

    if (selectedImage instanceof File) {
      formData.append('image', selectedImage)
      if (!resumeDataToSave.personal_info) {
        resumeDataToSave.personal_info = {}
      }
      delete resumeDataToSave.personal_info.image
    }

    formData.append('resumeData', JSON.stringify(resumeDataToSave))

    const { data } = await api.put(
      '/api/resumes/update',
      formData,
      { headers: { Authorization: token } }
    )

    if (data?.resume) {
      setResumeData(data.resume)
    }

    toast.success(data?.message || 'Saved successfully')
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message)
  }
}



const [activeSectionIndex, setActiveSectionIndex] = useState(0);
const [removeBackground, setRemoveBackground] = useState(false);




const sections=[
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'summary', title: 'Summary', icon: FileText },
  { id: 'experience', title: 'Experience', icon: Briefcase },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'projects', title: 'Projects', icon: FolderIcon },
  { id: 'skills', title: 'Skills', icon: Sparkles },
]

const activeSection= sections[activeSectionIndex]

  useEffect(() => {
    if (resumeData.title) {
      document.title = resumeData.title
    }
  }, [resumeData.title])

  useEffect(() => {
    if (!resumeId || !token) return

    api
      .get('/api/resumes/get/' + resumeId, { headers: { Authorization: token } })
      .then(({ data }) => {
        if (data?.resume) {
          setResumeData(data.resume)
          document.title = data.resume.title
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message)
      })
  }, [resumeId, token])


  const changeResumeVislibility= async () => {
    const nextPublic = !resumeData.public

    try {
      const { data } = await api.put(
        '/api/resumes/update',
        {
          resumeId,
          resumeData: { public: nextPublic },
        },
        { headers: { Authorization: token } }
      )

      if (data?.resume) {
        setResumeData((prev) => ({ ...prev, public: data.resume.public }))
      } else {
        setResumeData((prev) => ({ ...prev, public: nextPublic }))
      }

      toast.success(`Resume is now ${nextPublic ? 'Public' : 'Private'}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const handleShare = () => {
    const frontendUrl= window.location.href.split('/app/')[0];
    const resumeUrl= frontendUrl + '/view/' + resumeId;

    if(navigator.share) {
      navigator.share({url : resumeUrl, text: "My resume",})
    }
    else{
      alert("Sharing is not supported in this browser. Please copy the URL to share your resume.")
    }
  }

  const downloadResume = () => {
    window.print();
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>
      
      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-8'>
          {/*Left Panel-form*/}
          <div className='relative lg:col-span-5 rounded-lg overflow-visible'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
              {/*progress bar using activeSectionIndex */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200"/>
              <hr className="absolute top-0 left-0 h-1 bg-linear-to-r from-indigo-500 to-indigo-600 border-none transition-all duration-2000" style={{width: `${activeSectionIndex * 100 / (sections.length - 1)}%`}}/>
              
              {/*Section Navigation*/}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-2 gap-2">
                <div className='flex items-center gap-2'>
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(templateId) => setResumeData(prev => ({ ...prev, template: templateId }))} />
                  <ColorPicker selectedColor={resumeData.accent_color} onColorChange={(color) => setResumeData(prev => ({ ...prev, accent_color: color }))} />
                </div>

                <div className='flex items-center'>
                  {activeSectionIndex !== 0 && (
                    <button onClick={()=> setActiveSectionIndex((prevIndex)=> Math.max(prevIndex-1, 0))} className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all' disabled={activeSectionIndex === 0}>
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}

                  <button onClick={()=> setActiveSectionIndex((prevIndex)=> Math.min(prevIndex+1, sections.length - 1))} className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length-1 && 'opacity-50'}`} disabled={activeSectionIndex === sections.length - 1}>
                    Next <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/*Form Content*/}
              <div className='space-y-6'>
                {activeSection.id === 'personal' && (
                  <PersonalInfoForm data={resumeData.personal_info} onChange={(data)=> setResumeData(prev=> ({...prev, personal_info: data}))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground}/>
                )}
                {activeSection.id === 'summary' && (
                  <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data)=> setResumeData(prev=> ({...prev, professional_summary: data}))} />
                )}
                {activeSection.id === 'experience' && (
                  <ExperienceForm data={resumeData.experience} onChange={(data)=> setResumeData(prev=> ({...prev, experience: data}))} />
                )}
                 {activeSection.id === 'education' && (
                  <EducationForm data={resumeData.education} onChange={(data)=> setResumeData(prev=> ({...prev, education: data}))} />
                )}
                {activeSection.id === 'projects' && (
                  <ProjectForm data={resumeData.project || []} onChange={(data)=> setResumeData(prev=> ({...prev, project: data}))} />
                )}
                {activeSection.id === 'skills' && (
                  <SkillsForm data={resumeData.skills || []} onChange={(data)=> setResumeData(prev=> ({...prev, skills: data}))} />
                )}
              </div>

                <button onClick={saveResume} className= 'bg-indigo-800 ring-indigo-600 text-white ring hover:ring-indigo-700 hover:bg-indigo-400 hover:text-white transition-all rounded-md px-6 py-2 mt-6 text-sm '>
                  Save Changes
                </button>

            </div>
          </div>

          {/*Right Panel-preview*/}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className= 'relative w-full'>
              <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
                {resumeData.public && (
                <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue300 hover:ring transition-colors'>
                  <Share2Icon className='size-4' /> Share
                </button>
                )}

                <button onClick={changeResumeVislibility} className='flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-violet-100 to-violet-200 text-violet-700 rounded-lg ring-violet-300 hover:ring transition-colors'>
                  {resumeData.public ? <EyeIcon className="size-4"/> : <EyeOffIcon className="size-4"/> }
                  {resumeData.public ? 'Public' : 'Private'}
                </button>

                <button onClick={downloadResume} className='flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-emerald-100 to-emerald-200 text-emerald-700 rounded-lg ring-emerald-300 hover:ring transition-colors'>
                  <DownloadCloudIcon className="size-4" />
                  Download Resume
                </button>
              </div>
            </div>
            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes="mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder