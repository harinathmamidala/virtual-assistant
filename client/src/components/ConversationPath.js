import React from 'react'
import { Link } from 'react-router-dom'

export default function ConversationPath({conversation,deleteConvo}) {
  const id =  conversation.conversation_id

  const utcDate = new Date(conversation.start_time);
  const localTimeInMilliseconds = utcDate.getTime();
  const localDate = new Date(localTimeInMilliseconds);
  const localTimeFormatted = localDate.toLocaleString()

  
  return (
    <div className='li'>
      <Link to={`/conversations/${id}`} className='link'>
        {localTimeFormatted}
      </Link>
      <button onClick={async()=>{await deleteConvo(id)}}>delete</button>
    </div>
    
  )
}
