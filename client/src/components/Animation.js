 import React from 'react'
 import '../styles/Animation.css'
 import logo from '../images/chatgpt2.png'
 
 export default function Animation({isSpeaking}) {
   return (
     <div className={isSpeaking?'blobAnim':'blob'}>
      <div className={isSpeaking?'logodivAnim':'logodiv'}>
       <img src={logo} style={{width:'100%',borderRadius:"50%"}} alt=''/>
      </div>
     </div>
   )
 }
 