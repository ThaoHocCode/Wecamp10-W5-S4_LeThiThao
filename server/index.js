const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://lethao4725_db_user:qBvkTFzcq5w6F3hk@cluster0.c0cgpzc.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error.message))

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: 'my-todo-list' }
)

const Todo = mongoose.model('Todo', todoSchema)

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 })
    res.json(todos)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách' })
  }
})

app.post('/todos', async (req, res) => {
  const { title } = req.body
  if (!title) {
    return res.status(400).json({ message: 'Title là bắt buộc' })
  }

  try {
    const todo = new Todo({ title })
    const savedTodo = await todo.save()
    res.status(201).json(savedTodo)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm task' })
  }
})

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params
  try {
    const deletedTodo = await Todo.findByIdAndDelete(id)
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Task không tồn tại' })
    }
    res.json({ message: 'Xóa task thành công' })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa task' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})