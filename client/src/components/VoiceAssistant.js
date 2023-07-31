// import React, { useState, useEffect } from 'react';
// import Animation from './Animation'

// const VoiceAssistant = ({conversations,setConversations}) => {
//   const [isTurnedON, setIsTurnedON] = useState(false);
//   const [trigger,setTrigger] = useState(false)
//   const [isSpeaking, setIsSpeaking] = useState(false);

//   useEffect(() => {
//     let conversationsDup = conversations
//     let recognition;

//     const startListening = () => {
//       recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = true;
//       recognition.interimResults = true;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         console.log('Listening....');
//       };

//       recognition.onresult = async (event) => {
//         const finalTranscript = event.results[event.results.length - 1][0].transcript;
//         const isOver = event.results[event.results.length - 1].isFinal
//         if (isOver&&finalTranscript.trim() !== '') {
//           await sendToAPI(finalTranscript);
//         }
//       };

//       recognition.onend = () => {
//         if(isTurnedON && !isSpeaking) {
//           console.log("trigrring")
//           setTrigger(!trigger)//to avoid auto stop listening
//         }
//         console.log('Listening stopped.');
//         // in case of trigerring it is printed atfer
//         //  listening because it catches the prevous return emiter
//         //so even listening it is printed before this line
//       };

//       recognition.start();
//     };


//     const sendToAPI = async (text) => {
//       conversationsDup = [...conversationsDup,{role: "user", content: text}]
//       const options = {
//         method: 'POST', 
//         url: 'http://localhost:3001/api/v1/ask',
//         data: {
//           conversations : conversationsDup,
//         }, 
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         responseType: 'json',
//       };

//       const { data } = await axios(options)
//       console.log('Sending to API:', text);
//       const responseFromAPI = data.content;
//       readResponse(responseFromAPI);
//       conversationsDup = [...conversationsDup,data]
//       setConversations(conversationsDup)
//       console.log(conversationsDup)

//     };

//     const readResponse = (text) => {
//       const speech = new SpeechSynthesisUtterance();
//       speech.lang = 'en-US';
//       speech.text = text;
//       speech.onstart = () => {
//         setIsSpeaking(true)
//         // recognition.stop()
//       };
//       speech.onend = () => {
//         setIsSpeaking(false)
//         // recognition.start()
//         setTrigger(!trigger)
//       };
//       window.speechSynthesis.speak(speech);
//     };

//     if (isTurnedON) {
//       startListening();
//     }

//     return () => {
//       if (recognition) {
//         recognition.stop();
//       }
//     };
//   }, [isTurnedON,trigger]);

  
  // const saveConvo = async () => {
  //   const options = {
  //     method: 'POST', 
  //     url: `http://localhost:3001/api/v1/conversations/`,
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     data: {
  //       conversations : conversations
  //     },
  //     responseType: 'json', 
  //   };
  //   const response = await axios(options)
  //   setConversations([
  //     {"role": "system", "content": "You are a helpful assistant to your boss 'harinath'. Please give only short answers"},
  //     {"role": "user", "content": "Hello"},
  //     {"role": "assistant", "content": "Hello, how can I help you?"},
  //   ])
  //   console.log(response)
  // }



//   return (
    // <div className='VoiceAssistant'  >
    //   <label className="switch">
    //     <input type="checkbox" checked={isTurnedON} onChange={()=>{setIsTurnedON(!isTurnedON) }}/>
    //     <span className="slider"></span>
    //   </label>
    //   <Animation isSpeaking={isSpeaking}/>
    //   <div>
    //     {
    //     conversations.slice(2).map((ele, index) => {
    //       return(
    //         <div key={index} className={ele.role}> 
    //           <b>{ele.role} : </b>
    //           <p>{ele.content}</p>
    //         </div>
    //       )
    //     })
    //     }
    //   </div>
    //   <button onClick={async() =>{await saveConvo(); }} className='save-button' >save</button>
    // </div>
//   );
// };

// export default VoiceAssistant;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import Animation from './Animation'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
const synth = window.speechSynthesis;
const voice = synth.getVoices()[0]; // Adjust the index based on available voices

const VoiceAssistant = ({conversations,setConversations}) => {
  let conversationsDup = conversations
  const [listening, setListening] = useState(false);
  const isSpeaking = useRef(false); 
  const [speak,setSpeak] = useState(false)
  const [save,setSave] = useState(false)
  
  const handleSpeechRecognition = async (event) => {
    const { transcript } = event.results[0][0];
    // const promises = [];
    // promises.push(isSpeaking.current=true)
    // promises.push(recognition.stop())
    // promises.push(reply(transcript))
    // await Promise.all(promises)
    isSpeaking.current=true
    recognition.stop()
    reply(transcript)
  };
  
  const reply = async(text) => {
    const response = await sendToAPI(text)
    const utterance = new SpeechSynthesisUtterance(response.content);
    utterance.voice = voice;
    synth.speak(utterance);
    utterance.onstart = () => {
      setSpeak(true)
    };
    utterance.onend = () => {
      isSpeaking.current = false 
      setSpeak(false)
      recognition.start()
      console.log("started listening...")
      conversationsDup = [...conversationsDup,response]
      setConversations(conversationsDup)
    };
  };

  const sendToAPI = async (text) => {
    conversationsDup = [...conversationsDup,{role: "user", content: text}]
    const options = {
      method: 'POST', 
      url: '/api/v1/ask',
      data: {
        conversations : conversationsDup,
      }, 
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json',
    };
    const { data } = await axios(options)
    console.log('Sending to API:', text);
    return data;
  };


  
  useEffect(() => {
    recognition.lang = 'en-US';
    recognition.onresult = handleSpeechRecognition;
    recognition.onend = () => {
      console.log("not listening")
      if (listening&&!isSpeaking.current) {
        recognition.start()
        console.log("started 0 listening...")
      }
    };
    if(listening) recognition.start()
    else recognition.stop()
    return () => {
      recognition.onresult = null;
      recognition.onend = null;
    };
  }, [listening]);




  const saveConvo = async () => {
    setSave(true)
    if(conversations.length === 3) {
      setSave(false)
      return
    }
    const options = {
      method: 'POST', 
      url: `/api/v1/conversations/`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        conversations : conversations
      },
      responseType: 'json', 
    };
    const response = await axios(options)
    setConversations([
      {"role": "system", "content": "You are a helpful assistant. You can hear and speak through texts. You give only short answers"},
      {"role": "user", "content": "Hello"},
      {"role": "assistant", "content": "Hello, how can I help you?"},
    ])
    console.log(response)
    setSave(false)
  }
  
  return (
    <div className='VoiceAssistant'  >
      <label className="switch">
        <input type="checkbox" checked={listening} onChange={()=>{setListening(!listening) }}/>
        <span className="slider"></span>
      </label>
      <Animation isSpeaking={speak}/>
      <div>
        {
        conversations.slice(2).map((ele, index) => {
          return(
            <div key={index} className={ele.role}> 
              <b>{ele.role} : </b>
              <p>{ele.content}</p>
            </div>
          )
        })
        }
      </div>
      <button onClick={async() =>{await saveConvo();}} className='save-button' disabled={save} >save</button>
   </div>
  );
};

export default VoiceAssistant;

