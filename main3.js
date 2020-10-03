const todo = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false,
      }
    case 'TOGGLE_TODO':
      return {
        ...state,
        completed: !state.completed,
      }
    default:
      return state
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ]
    case 'TOGGLE_TODO':
      return state.map((t) => {
        if (t.id == action.id) {
          return todo(t, action)
        }
        return t
      })
    default:
      return state
  }
};

const visibility = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY':
      return action.filter
    default:
      return state
  }
};

const { combineReducers } = Redux;
const todoApp = combineReducers({
  todos,
  visibility
})

const { createStore } = Redux;
const store = createStore(todoApp);

const SelectFilter = ({
  filter,
  currentFilter,
  children
}) => {
  if (filter === currentFilter) {
    return <span>{children}</span>
  }
  return (
    <a href="#"
       onClick={(e) => {
         e.preventDefault()
         store.dispatch({
           type: 'SET_VISIBILITY',
           filter: filter,
         })}} >
      {children}
    </a>
  )
}

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
    default:
      return todos
  }
}

const Todo = ({todo, onClick}) => {
  return (
    <li 
      onClick={onClick}
      style={{
        textDecoration: todo.completed ? 'line-through' : 'none'
      }}
    >{todo.text}</li>
  )
}

const TodoList = ({todos, onTodoClick}) => {
  return (
    <ul>
      { todos.map(t => (
          <Todo key={t.id} 
                todo={t}
                onClick={() => onTodoClick(t.id)} 
          />))
      } 
    </ul>
  )
}

const { Component } = React;

let nextTodoId = 0
class ToDoApp extends Component {
  render() {
    const { todos, visibility } = this.props
    const currentTodos = getVisibleTodos(todos, visibility)
    return (
      <div>
        <p>
          Show: 
          {' '}
          <SelectFilter
            filter="SHOW_ALL"
            currentFilter={visibility} >
            All
          </SelectFilter>
          {' '}
          <SelectFilter
            filter="SHOW_COMPLETED"
            currentFilter={visibility} >
            Completed
          </SelectFilter>
          {' '}
          <SelectFilter
            filter="SHOW_ACTIVE"
            currentFilter={visibility} >
            Active
          </SelectFilter>
        </p>
        <input ref={node => { this.input = node} } />
        <button onClick={() => {
          store.dispatch({ 
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
          })
          this.input.value = ''
          }}>
          +
        </button>
        <TodoList 
          todos={currentTodos}
          onTodoClick={(i) => store.dispatch({ type: 'TOGGLE_TODO', id: i })} />
      </div>
    )
  }
}

const render = () => {
  ReactDOM.render(
    <ToDoApp
      {...store.getState()}
    />,
    document.getElementById('root')
  )
}
store.subscribe(render)
render()

