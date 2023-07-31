const mongoose = require('mongoose')

const ConversationSchema = new mongoose.Schema({
  conversation_id:{
    type:Number
  },
  start_time:{
    type: Date, 
    default: Date.now
  }
})

module.exports = mongoose.model('Conversation', ConversationSchema)
