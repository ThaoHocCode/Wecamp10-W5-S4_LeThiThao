import { useEffect, useState } from 'react'
import Create from './Create.jsx'

const API_URL = 'http://localhost:3001'

function Home() {
  const [todos, setTodos] = useState([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchTodos = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch(`${API_URL}/todos`)
      if (!response.ok) throw new Error('Không lấy được danh sách')
      const data = await response.json()
      setTodos(data)
    } catch (err) {
      setError(err.message || 'Lỗi kết nối')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const handleAdd = async () => {
    if (!newTask.trim()) return
    try {
      setLoading(true)
      setError('')
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask.trim() })
      })
      if (!response.ok) throw new Error('Không thêm được task')
      const createdTodo = await response.json()
      setTodos([createdTodo, ...todos])
      setNewTask('')
    } catch (err) {
      setError(err.message || 'Lỗi thêm task')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Xóa task không thành công')
      setTodos(todos.filter((todo) => todo._id !== id))
    } catch (err) {
      setError(err.message || 'Lỗi xóa task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home">
      <h1>Todo List</h1>
      <Create
        task={newTask}
        setTask={setNewTask}
        onAdd={handleAdd}
        loading={loading}
      />

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Đang tải...</div>}

      <div className="todo_list">
        {todos.length === 0 ? (
          <div className="empty-state">No Record</div>
        ) : (
          todos.map((todo) => (
            <div className="todo_item" key={todo._id}>
              <span>{todo.title}</span>
              <button
                className="delete_button"
                type="button"
                onClick={() => handleDelete(todo._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Home;