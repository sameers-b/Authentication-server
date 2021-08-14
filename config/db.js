const mongoose = require('mongoose');

const URL = 'mongodb://localhost:27017/Authentication';

const connectDB = async () => {
   const connection = await mongoose.connect(URL,{
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
   });
   console.log(`MongoDB Connect: ${connection.connection.host}`);
};

module.exports = connectDB;