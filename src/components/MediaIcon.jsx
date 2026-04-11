import React from 'react'
import LikeButton from './LikeButton'
import { BookMarked, HeartHandshake, MessageCircleHeart, Send, } from 'lucide-react'
import SaveButton from './SaveButton'

const MediaIcon = ({ type, item, size=24, shareIcon, handleOpenModal}) => {
  return (
    <div className='flex justify-between items-center p-3 border-t border-gray-800'>
      <div className='flex items-center space-x-4'>
        {/* <LikeButton type={type} item={item} size={size}/> */}
        <HeartHandshake />
        <button onClick={() => handleOpenModal('comments')} className='text-gray-300'>
          <MessageCircleHeart size={size} strokeWidth={2} />
        </button>
        {
          !shareIcon && <button className='text-gray-300'>
            <Send size={size} strokeWidth={2} />
          </button>
        }
      </div>

      {/* <SaveButton post={item} /> */}
      <div>
        <BookMarked />
      </div>
    </div>
  )
}

export default MediaIcon