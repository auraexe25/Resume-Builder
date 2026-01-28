import { PlusIcon, UploadCloudIcon  } from 'lucide-react'
import React from 'react'
import { dummyResumeData } from '../assets/assets'

const Dashboard = () => {

  const [allResumes, setAllResumes] = useState([])

  const loadAllResumes = async () => {async()=>{
    setAllResumes(dummyResumeData)
  }}

  useEffect(() => {
    loadAllResumes()
  }, [])



  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-8'>

      <p className='text-2xl font-medium mb-6 bg-linear-to-r from-slate-600 to-slate-700 bg0clip-text text-transparent sm:hidden '>Welcome to your dashboard!</p>

      <div className='flex gap-4'>
        <button className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow:lg transition-all duration-300 cursor-pointer'>
          <PlusIcon className= 'size-11 transition-all duration-300 p-2.5 bg-linear-to-br from-indigo-300 to-indigo-600 text-white rounded-full'/>
          <p className='text-sm group-hover:text-indigo-600 transition-all duration-300'>Create Resume</p>
        </button>
        <button className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-green-500 hover:shadow:lg transition-all duration-300 cursor-pointer'>
          <UploadCloudIcon className= 'size-11 transition-all duration-300 p-2.5 bg-linear-to-br from-green-300 to-green-500 text-white rounded-full'/>
          <p className='text-sm group-hover:text-green-600 transition-all duration-300'>Create Resume</p>
        </button>
      </div>

      <hr className='border-slate-300 my-6 sm:w-76.25'/>

      
      </div>
    </div>
  )
}

export default Dashboard
