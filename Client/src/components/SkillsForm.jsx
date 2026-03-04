import React, { useState } from 'react'
import { Plus, Sparkles, X } from 'lucide-react'

const SkillsForm = ({ data, onChange }) => {
  const [skillInput, setSkillInput] = useState('')

  const addSkill = () => {
    const nextSkill = skillInput.trim()
    if (!nextSkill) return
    onChange([...(data || []), nextSkill])
    setSkillInput('')
  }

  const removeSkill = (index) => {
    const updatedSkills = (data || []).filter((_, i) => i !== index)
    onChange(updatedSkills)
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Skills</h3>
          <p className='text-sm text-gray-500'>Add your technical and soft skills</p>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <input
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addSkill()
            }
          }}
          type='text'
          placeholder='Enter a skill (e.g., JavaScript, Project Management)'
          className='flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300'
        />
        <button onClick={addSkill} className='flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
          <Plus className='size-4' />
          Add
        </button>
      </div>

      {(data || []).length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          <Sparkles className='w-12 h-12 mx-auto mb-3 text-gray-300' />
          <p>No skills added yet.</p>
          <p className='text-sm'>Add your technical and soft skills above.</p>
        </div>
      ) : (
        <div className='flex flex-wrap gap-2'>
          {(data || []).map((skill, index) => (
            <div key={`${skill}-${index}`} className='px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-2'>
              <span>{skill}</span>
              <button onClick={() => removeSkill(index)} className='text-blue-600 hover:text-blue-800 transition-colors'>
                <X className='size-3.5' />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className='bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-900'>
        <p>
          Tip: Add 8-12 relevant <span className='font-semibold'>skills</span>. Include both technical skills (programming languages, tools) and soft skills (leadership, communication).
        </p>
      </div>
    </div>
  )
}

export default SkillsForm
