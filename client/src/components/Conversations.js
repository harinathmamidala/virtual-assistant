import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
// import { Link } from 'react-router-dom'
import ConversationPath from './ConversationPath'

export default function Conversations() {
  const [list,setList] = useState([])
  useEffect(()=>{
    const getAllConversations = async() =>{
      const options = {
        method: 'GET', 
        url: '/api/v1/conversations',
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'json', 
      };

      const { data } = await axios(options)
      setList(data);
    }
    getAllConversations()
  },[])


  const deleteConvo = async (id) =>{
    setList((list)=>{
      return list.filter((conv)=>conv.conversation_id!==id)
    })
    const options = {
      method: 'DELETE', 
      url: `/api/v1/conversations/${id}`,
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json', 
    };

    const { data } = await axios(options)
    console.log(data)
  }

  return (
    <div className='conversations'>
      <h3>Chats</h3>
      <div className='ul'>
        {
          list.map((conversation,index) => {
            return(
              <ConversationPath conversation={conversation} key={index} deleteConvo={deleteConvo}/>
            )
          })
        }
      </div>
    </div>
  )
}
