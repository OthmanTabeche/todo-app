import { useEffect, useReducer } from 'react'
import { TODO_FILTERS } from '../consts'
import { getTodos, createTodo, updateTodo, deleteTodo } from '../services/todos'
import { type TodoList, type FilterValue, type Todo } from '../types'

const initialState = {
  todos: [] as TodoList,
  filterSelected: (() => {
    const params = new URLSearchParams(window.location.search)
    const filter = params.get('filter') as FilterValue | null
    if (filter === null) return TODO_FILTERS.ALL
    return Object
      .values(TODO_FILTERS)
      .includes(filter)
      ? filter
      : TODO_FILTERS.ALL
  })()
}

type Action =
  | { type: 'INIT_TODOS', payload: { todos: TodoList } }
  | { type: 'ADD_TODO', payload: { todo: Todo } }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'COMPLETED', payload: { id: string, completed: boolean } }
  | { type: 'FILTER_CHANGE', payload: { filter: FilterValue } }
  | { type: 'REMOVE', payload: { id: string } }
  | { type: 'UPDATE_TITLE', payload: { id: string, title: string } }

interface State {
  todos: TodoList
  filterSelected: FilterValue
}

const reducer = (state: State, action: Action): State => {
  if (action.type === 'INIT_TODOS') {
    return { ...state, todos: action.payload.todos }
  }

  if (action.type === 'ADD_TODO') {
    return { ...state, todos: [...state.todos, action.payload.todo] }
  }

  if (action.type === 'CLEAR_COMPLETED') {
    return {
      ...state,
      todos: state.todos.filter((todo) => !todo.completed)
    }
  }

  if (action.type === 'COMPLETED') {
    const { id, completed } = action.payload
    return {
      ...state,
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed } : todo
      )
    }
  }

  if (action.type === 'FILTER_CHANGE') {
    return { ...state, filterSelected: action.payload.filter }
  }

  if (action.type === 'REMOVE') {
    return {
      ...state,
      todos: state.todos.filter((todo) => todo.id !== action.payload.id)
    }
  }

  if (action.type === 'UPDATE_TITLE') {
    const { id, title } = action.payload
    return {
      ...state,
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, title } : todo
      )
    }
  }

  return state
}

export const useTodos = (): {
  activeCount: number
  completedCount: number
  todos: TodoList
  filterSelected: FilterValue
  handleClearCompleted: () => void
  handleCompleted: (id: string, completed: boolean) => void
  handleFilterChange: (filter: FilterValue) => void
  handleRemove: (id: string) => void
  handleSave: (title: string) => void
  handleUpdateTitle: (params: { id: string, title: string }) => void
} => {
  const [{ todos, filterSelected }, dispatch] = useReducer(reducer, initialState)

  // Load todos from the API on mount
  useEffect(() => {
    getTodos()
      .then((fetched) => {
        // The backend returns task_id as the unique key; expose it as `id`
        // so existing components keep working without changes.
        const normalised = fetched.map((t) => ({ ...t, id: t.task_id }))
        dispatch({ type: 'INIT_TODOS', payload: { todos: normalised } })
      })
      .catch((err: unknown) => { console.error(err) })
  }, [])

  // Create a new todo → POST /tasks, then add to local state
  const handleSave = (title: string): void => {
    createTodo(title)
      .then((todo) => {
        if (todo !== null) {
          dispatch({ type: 'ADD_TODO', payload: { todo: { ...todo, id: todo.task_id } } })
        }
      })
      .catch((err: unknown) => { console.error(err) })
  }

  // Toggle completed → PUT /tasks + update local state
  const handleCompleted = (id: string, completed: boolean): void => {
    updateTodo(id, { completed })
      .then((ok) => {
        if (ok) dispatch({ type: 'COMPLETED', payload: { id, completed } })
      })
      .catch((err: unknown) => { console.error(err) })
  }

  // Rename title → PUT /tasks + update local state
  const handleUpdateTitle = ({ id, title }: { id: string, title: string }): void => {
    updateTodo(id, { title })
      .then((ok) => {
        if (ok) dispatch({ type: 'UPDATE_TITLE', payload: { id, title } })
      })
      .catch((err: unknown) => { console.error(err) })
  }

  // Delete → DELETE /tasks + remove from local state
  const handleRemove = (id: string): void => {
    deleteTodo(id)
      .then((ok) => {
        if (ok) dispatch({ type: 'REMOVE', payload: { id } })
      })
      .catch((err: unknown) => { console.error(err) })
  }

  // Clear completed → DELETE each completed todo in parallel
  const handleClearCompleted = (): void => {
    const completed = todos.filter((t) => t.completed)
    Promise.all(completed.map((t) => deleteTodo(t.id)))
      .then(() => {
        dispatch({ type: 'CLEAR_COMPLETED' })
      })
      .catch((err: unknown) => { console.error(err) })
  }

  const handleFilterChange = (filter: FilterValue): void => {
    dispatch({ type: 'FILTER_CHANGE', payload: { filter } })
    const params = new URLSearchParams(window.location.search)
    params.set('filter', filter)
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`)
  }

  const filteredTodos = todos.filter((todo) => {
    if (filterSelected === TODO_FILTERS.ACTIVE) return !todo.completed
    if (filterSelected === TODO_FILTERS.COMPLETED) return todo.completed
    return true
  })

  const completedCount = todos.filter((t) => t.completed).length
  const activeCount = todos.length - completedCount

  return {
    activeCount,
    completedCount,
    filterSelected,
    handleClearCompleted,
    handleCompleted,
    handleFilterChange,
    handleRemove,
    handleSave,
    handleUpdateTitle,
    todos: filteredTodos
  }
}
