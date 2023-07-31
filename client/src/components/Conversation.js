import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'

export default function Conversation() {
  const [texts,setTexts] = useState([])
  const params = useParams();
  useEffect(()=>{
    const getConversation = async()=>{
      const options = {
        method: 'GET', 
        url: `/api/v1/conversations/${params.conversation_id}`,
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'json', 
      };

      const { data } = await axios(options)
      setTexts(data);
    }
    getConversation();
  },[])
  return (
    <div className='conversation'>
      <Link to="/conversations" className='back'>back</Link>
      {
        texts.map((ele, index) => {
          return(
            <React.Fragment key={index}>
              <div className='user'> 
                <b>user : </b>
                <p>{ele.user_message}</p>
              </div>
              <div className='assistant'> 
                <b>assistant : </b>
                <p>{ele.bot_response}</p>
              </div>
            </React.Fragment>
            
          )
        })
      }
    </div>
  )
}
