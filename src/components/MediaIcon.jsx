import React from 'react'
import LikeButton from './LikeButton'
import { BookMarked, MessageCircleHeart, Send, } from 'lucide-react'
import SaveButton from './SaveButton'

const MediaIcon = ({ type, item, size=24, shareIcon, handleOpenModal, onToggle}) => {
  return (
    <div className='flex justify-between items-center p-3 border-t border-gray-800'>
      <div className='flex items-center space-x-4'>
        <LikeButton type={type} item={item} size={size} onToggle={onToggle}/>

          <button onClick={() => handleOpenModal()} className='text-gray-300'>
            <MessageCircleHeart size={size} strokeWidth={2} />
          </button>
   

        {
          !shareIcon && <button className='text-gray-300'>
            <Send size={size} strokeWidth={2} />
          </button>
        }
      </div>

      <SaveButton post={item} size={size} type={type}/>
      
    
     
    </div>
  )
}

export default MediaIcon