import { type Todo } from '../types'

const API_URL = import.meta.env.VITE_API_URL
const USER_ID = import.meta.env.VITE_USER_ID

// GET /tasks?user_id=<id>
export const getTodos = async (): Promise<Todo[]> => {
  const res = await fetch(`${API_URL}/tasks?user_id=${USER_ID}`)
  if (!res.ok) {
    console.error('Error fetching todos')
    return []
  }
  const data = await res.json() as Todo[]
  return data
}

// POST /tasks  { user_id, title }
export const createTodo = async (title: string): Promise<Todo | null> => {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: USER_ID, title })
  })
  if (!res.ok) {
    console.error('Error creating todo')
    return null
  }
  return await res.json() as Todo
}

// PUT /tasks  { user_id, task_id, title?, completed? }
export const updateTodo = async (
  taskId: string,
  changes: { title?: string, completed?: boolean }
): Promise<boolean> => {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: USER_ID, task_id: taskId, ...changes })
  })
  if (!res.ok) {
    console.error('Error updating todo')
  }
  return res.ok
}

// DELETE /tasks  { user_id, task_id }
export const deleteTodo = async (taskId: string): Promise<boolean> => {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: USER_ID, task_id: taskId })
  })
  if (!res.ok) {
    console.error('Error deleting todo')
  }
  return res.ok
}
