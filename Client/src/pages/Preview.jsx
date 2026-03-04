import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from 'lucide-react'
import { dummyResumeData } from '../assets/assets'
import ResumePreview from '../components/ResumePreview'

const Preview = () => {
const { resumeId } = useParams()

const [resumeData] = useState(() => dummyResumeData.find((resume) => resume._id === resumeId) || null)

  return resumeData? (
    <div className='bg-slate-100'>
      <div className= 'max-w-3xl mx-auto py-10'>
      <ResumePreview data={resumeData} template={resumeData.template}  accentColor={resumeData.accent_color}/>
      </div>
    </div>
  ) : (
      <div className='flex flex-col items-center justify-center h-screen'>
      <h2 className='text-4xl font-semibold mb-4 text-gray-500'>Resume Not Found</h2>
      <p className='text-base text-gray-500'>The resume you are looking for does not exist or has been removed.</p>
      <Link to='/' className='mt-6 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-indigo-400 flex items-center transition-colors'>
        <ArrowLeftIcon className= 'mr-2 size-4'/>
        Go to Homepage
      </Link>
      </div>
  )
}
export default Preview
