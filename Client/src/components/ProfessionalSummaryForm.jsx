import React from 'react'
import { Sparkles } from 'lucide-react'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ProfessionalSummaryForm = ({ data, onChange }) => {
  const { token } = useSelector((state) => state.auth)
  const [isEnhancing, setIsEnhancing] = React.useState(false)

  const handleAIEnhance = async () => {
    if (!data?.trim()) {
      toast.error('Please add summary text before using AI Enhance')
      return
    }

    setIsEnhancing(true)

    try {
      const { data: responseData } = await api.post(
        '/api/ai/enhance-pro-sum',
        { userContent: data },
        { headers: { Authorization: token }, timeout: 45000 }
      )

      if (responseData?.enhancedContent) {
        onChange(responseData.enhancedContent)
        toast.success('Summary enhanced')
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

    setIsEnhancing(false)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Summary</h3>
            <p className='text-sm text-gray-500'> Add summary for your resume here</p>
        </div>
        <button type='button' onClick={handleAIEnhance} disabled={isEnhancing} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'>
            <Sparkles className="size-5" />
            {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
        </button>
      </div>
     
     <div className="mt-6">
        <textarea name="" id="" value={data || ''} rows={6} onChange={(e)=> onChange(e.target.value)} className='w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors resize-none' placeholder='Write a compelling professional summary that highlights your key strengths and career objectives'/>
        <p className='text-xs text-gray-500 max-w-4/5 mx-auto text-center'>Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.</p>
     </div>
    </div>
  )
}

export default ProfessionalSummaryForm
