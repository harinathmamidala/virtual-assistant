express = require('express')
app = express();
const cors = require("cors");
app.use(cors());
routes = require('./Routes/routes')
path = require("path")

app.use(express.static('./public/build'))

app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, './public/build/index.html'));
});

app.use(express.json())

app.use('/api/v1',routes)

app.use((req, res) => res.status(404).send('Route does not exist'))

app.use((err, req, res, next) => {
  console.log({err:err})
  return res.status(500).json({ err: err })
})

app.listen(3001,()=>{
  console.log("server is running on port 3001")
})

