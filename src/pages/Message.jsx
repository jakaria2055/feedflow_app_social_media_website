import React from 'react'
import MessageSidebar from '../components/MessageSidebar'

const Message = () => {
  return (
    <div className='flex min-h-screen bg-black'>
      <MessageSidebar />

      <main className='rounded-xl text-white flex-1 w-full mx-auto flx flex-col gap-6 overflow-auto'>

      </main>
    </div>
  )
}

export default Message