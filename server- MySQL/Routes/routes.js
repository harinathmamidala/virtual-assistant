express = require('express')
mysql = require("mysql")
const { Configuration, OpenAIApi } = require("openai")
require('dotenv').config();
const router = express.Router()

const pool = mysql.createPool({
  host: process.env.DB_HOST, // MySQL database host
  user: process.env.DB_USER, // MySQL username
  password: process.env.DB_PASSWORD, // MySQL password
  database: process.env.DB_DATABASE, // MySQL database name
});

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
  await pool.query('select * from conversation',(err,results)=>{
    if(err){
      console.log(err);
      return res.status(500).json({err:err});
    }
    res.json(results)
  })
})


const getCoversation = asyncWrapper(async (req,res) => {
  const {conversation_id}= req.params
  await pool.query(`select * from messages where conversation_id = ? ORDER BY message_id`,[conversation_id],(err,results)=>{
    if(err){
      console.log(err);
    }
    res.json(results)
  })
})


const deleteCoversation = asyncWrapper(async (req,res) => {
  const {conversation_id}= req.params
  await pool.query(`delete from conversation where conversation_id  = ?`,[conversation_id],(err,results)=>{
    if(err){
      console.log(err);
    }
    res.json(results)
  })
})




const translat = asyncWrapper(async (req,res) => {

  const { source_language, target_language, source_text, is_user_speaking } = req.body;
  const { text } = await translate(source_text, {
    to: target_language,
    from: source_language
  });
  console.log(text)

  res.json({ translated_text : text})

  const query = `INSERT INTO Conversations (source_language, target_language, source_text, translated_text, is_user_speaking) VALUES (?, ?, ?, ?, ?)`;
  const values = [source_language, target_language, source_text, text, is_user_speaking];

  await pool.query(query, values, (error, results) => {
    if (error) {
      console.error('Error inserting row:', error);
    }
  });

})


const ask = asyncWrapper(async (req,res) => {
  
  const { conversations } = req.body;
  
  // const openAi = new OpenAIApi(
  //   new Configuration({
  //     apiKey: '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',
  //   })
  // )

  console.log(conversations)
  // const response = await openAi.createChatCompletion({
  //   model: "gpt-3.5-turbo",
  //   messages: conversations,
  // })

  // const reply = response.data.choices[0].message.content
  // res.json({role: "assistant", content: reply })
  res.json({role: "assistant", content: "xhdvjhgvxm" })

})

const saveConversation = asyncWrapper(async (req,res) => {
  const { conversations } = req.body;

  await pool.query('SELECT MAX(conversation_id) AS max_id FROM Conversation',async(error,results)=>{

    if(error) res.status(500).json({error:error})
    const maxId = results[0].max_id || 0; 
    const conversationId = maxId + 1;

    await pool.query(`INSERT INTO Conversation (start_time) VALUES (NOW());`,async (error,results)=>{
      if(error) res.status(500).json({error:error})
      const promises = [];

      for (let i = 1; i+1 < conversations.length; i += 2) {
        const userMessage = conversations[i].content;
        const botResponse = conversations[i + 1].content;
        promises.push(pool.query(`INSERT INTO Messages (conversation_id, user_message, bot_response) VALUES (?, ?, ?)`, [conversationId,userMessage, botResponse]));
      }

      await Promise.all(promises)
    });

  });

  
    
  res.json("saving success")
  console.log('Conversations inserted successfully.');

})


router.route('/conversations').get(getAllCoversations).post(saveConversation)
router.route('/conversations/:conversation_id').get(getCoversation).delete(deleteCoversation)
router.route('/translate').post(translat)
router.route('/ask').post(ask)

module.exports = router




// CREATE TABLE Conversation (
//   conversation_id INT AUTO_INCREMENT PRIMARY KEY,
//   start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE Messages (
//   message_id INT AUTO_INCREMENT PRIMARY KEY,
//   conversation_id INT,
//   user_message TEXT,
//   bot_response TEXT,
//   FOREIGN KEY (conversation_id) REFERENCES conversation(conversation_id) ON DELETE CASCADE
// );

// API_KEY=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
// DB_USER=if0_34706740
// DB_PASSWORD=A9gjA47x5fzda
// DB_DATABASE=if0_34706740_myfirstdb
// DB_HOST=sql203.infinityfree.com