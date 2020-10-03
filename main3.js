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

const TodoList = ({todos, onClick}) => {
  return (
    <ul>
      { todos.map(t => (
          <Todo key={t.id} 
                todo={t}
                onClick={() => onClick(t.id)} 
          />))
      } 
    </ul>
  )
}

const AddTodo = ({ onClick }) => {
  let input;
  return (
    <div>
      <input ref={node => { input = node} } />
      <button onClick={() => {
        onClick(input.value)
        input.value = ''
        }}>
        +
      </button>
    </div>
  )
}

const Header = ({ visibility }) => (
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
)

const { Component } = React;

let nextTodoId = 0
const ToDoApp = ({ todos, visibility }) => (
  <div>
    <Header visibility={visibility} />
    <AddTodo 
      onClick={text => store.dispatch({ 
          type: 'ADD_TODO',
          text: text,
          id: nextTodoId++
        })
      } />
    <TodoList 
      todos={getVisibleTodos(todos, visibility)}
      onClick={(i) => store.dispatch({ type: 'TOGGLE_TODO', id: i })} />
  </div>
)

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

