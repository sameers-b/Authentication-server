const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db')

const app = express();
const PORT = 8080;

// Connect to database
connectDB();

//body parser
app.use(bodyParser.json())

app.use(cors({
   origin:'http://localhost:3000',
   // methods: ["GET","POST"]
}))

//load routes
const authRouter = require('./routes/auth.route');

// use Routes
app.use('/api',authRouter)
// app.use('/api/signup',(req)=>{
//    console.log(req.body);
// })

app.use((req, res) =>{
   res.status(404).json({
      success: false,
      msg: "Page not founded"
   })
})

app.listen(PORT,() => {
   console.log(`Server is listening on port ${PORT}`);
})


