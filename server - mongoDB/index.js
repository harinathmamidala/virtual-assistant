express = require('express')
app = express();
const connectDB = require('./db/connect');
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

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(3002, () =>
      console.log(`Server is listening on port ${3002}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
