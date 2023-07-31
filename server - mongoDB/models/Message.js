const mongoose = require('mongoose')

const MessagesSchema = new mongoose.Schema({
  message_id:{
    type:Number
  },
  conversation_id:{
    type:Number
  }, 
  user_message:{
    type:String
  },
  bot_response:{
    type:String
  }
})

module.exports = mongoose.model('Message', MessagesSchema)
