import type { TODO_FILTERS } from './consts'

export interface Todo {
  id: string       // alias kept for component compatibility (maps to task_id)
  task_id: string
  user_id: string
  title: string
  completed: boolean
}

export type TodoId = Pick<Todo, 'id'>
export type TodoTitle = Pick<Todo, 'title'>

export type FilterValue = typeof TODO_FILTERS[keyof typeof TODO_FILTERS]

export type TodoList = Todo[]
