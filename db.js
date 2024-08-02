const mongoose = require("mongoose");

// Connect to MongoDB using environment variables
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://admin:nGxWx4XozRCkdMze@cluster0.n8lnejz.mongodb.net/keeper"; // Fallback URI for development
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB:", err));

const todoSchema = new mongoose.Schema({
  title: String,
  content: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },  
  password: { type: String, required: true }
});

const Todo = mongoose.model('Todo', todoSchema); // Note: 'Todo' is singular
const User = mongoose.model('User', userSchema); 

module.exports = { Todo, User };
