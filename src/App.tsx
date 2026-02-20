import { Filters } from './components/Filters'
import { Header } from './components/Header'
import { Todos } from './components/Todos'
import { useTodos } from './hooks/useTodos'

const App: React.FC = () => {
  const {
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
  } = useTodos()

  const hasTodos = filteredTodos.length > 0 || completedCount > 0

  return (
    <>
      <div className='todoapp'>
        <Header saveTodo={handleSave} />
        <Todos
          removeTodo={handleRemove}
          setCompleted={handleCompleted}
          setTitle={handleUpdateTitle}
          todos={filteredTodos}
        />
        {hasTodos && (
          <footer className='footer'>
            <span className='todo-count'>
              <strong>{activeCount}</strong> {activeCount === 1 ? 'item' : 'items'} left
            </span>
            <Filters
              filterSelected={filterSelected}
              handleFilterChange={handleFilterChange}
            />
            {completedCount > 0 && (
              <button className='clear-completed' onClick={handleClearCompleted}>
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>
    </>
  )
}

export default App
