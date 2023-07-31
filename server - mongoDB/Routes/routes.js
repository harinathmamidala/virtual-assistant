express = require('express')
const Conversation = require('../models/Conversation')
const Message = require('../models/Message')
const { Configuration, OpenAIApi } = require("openai")
require('dotenv').config();
const router = express.Router()


const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

const getAllCoversations = asyncWrapper(async (req, res) => {
  const response = await Conversation.find({}).sort({ start_time: -1 })
  res.json(response)
})


const getCoversation = asyncWrapper(async (req,res) => {
  const {conversation_id}= req.params
  const response = await Message.find({conversation_id:conversation_id}).sort({ message_id: 1 })
  res.json(response)
})


const deleteCoversation = asyncWrapper(async (req,res) => {
  const {conversation_id}= req.params
  await Conversation.deleteOne({ conversation_id: conversation_id })
  await Message.deleteMany({conversation_id: conversation_id});
  res.json({status:"success"})
})






const ask = asyncWrapper(async (req,res) => {
  
  const { conversations } = req.body;
  
  const openAi = new OpenAIApi(
    new Configuration({
      apiKey: process.env.API_KEY,
    })
  )

  const response = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversations,
  })

  const reply = response.data.choices[0].message.content
  res.json({role: "assistant", content: reply })
 

})

const saveConversation = asyncWrapper(async (req,res) => {
  const { conversations } = req.body;
  const maxDocument = await Conversation.aggregate([
    {
      $sort: { conversation_id: -1 } 
    },
    {
      $limit: 1
    }
  ]);
  const conversation_id = maxDocument.length === 0? 1:maxDocument[0].conversation_id+1;
  const response = await Conversation.create({conversation_id:conversation_id})
  
  let promises=[]
  for (let i = 1; i+1 < conversations.length; i += 2) {
    const userMessage = conversations[i].content;
    const botResponse = conversations[i + 1].content;
    promises.push(Message.create(
      {
        message_id:i,
        conversation_id:conversation_id ,
        user_message:userMessage,
        bot_response:botResponse 
      }
    ));
  }

  await Promise.all(promises)

  res.json("saving success")

})


router.route('/conversations').get(getAllCoversations).post(saveConversation)
router.route('/conversations/:conversation_id').get(getCoversation).delete(deleteCoversation)
router.route('/ask').post(ask)

module.exports = router
