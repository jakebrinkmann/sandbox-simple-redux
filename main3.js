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
const { Component } = React;

const Link = ({ children, active, onClick }) => {
  if (active) {
    return <span>{children}</span>
  }
  return (
    <a href="#"
       onClick={(e) => {
         e.preventDefault()
         onClick()
         }} >
      {children}
    </a>
  )
}

class SelectFilter extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate()
    })
  }

  componentDidUnmount() {
    this.unsubscribe()
  }

  render() {
    const { filter, children } = this.props;
    const state = store.getState();

    return (
      <Link
        active={ filter == state.visibility }
        onClick={() => {
           store.dispatch({
             type: 'SET_VISIBILITY',
             filter: filter,
           })}} >
        {children}
      </Link>
    )
  }
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

let nextTodoId = 0
const AddTodo = () => {
  let input;
  return (
    <div>
      <input ref={node => { input = node} } />
      <button onClick={() => {
         store.dispatch({
          type: 'ADD_TODO',
          text: input.value,
          id: nextTodoId++
        })
        input.value = ''
        }}>
        +
      </button>
    </div>
  )
}

const Header = () => (
  <p>
    Show:
    {' '}
    <SelectFilter
      filter="SHOW_ALL">
      All
    </SelectFilter>
    {' '}
    <SelectFilter
      filter="SHOW_COMPLETED">
      Completed
    </SelectFilter>
    {' '}
    <SelectFilter
      filter="SHOW_ACTIVE">
      Active
    </SelectFilter>
  </p>
)

class VisibleTodos extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate()
    })
  }

  componentDidUnmount() {
    this.unsubscribe()
  }

  render() {
    const state = store.getState();
    return (
    <TodoList
      todos={getVisibleTodos(state.todos, state.visibility)}
      onClick={(i) => store.dispatch({ type: 'TOGGLE_TODO', id: i })} />
    )
  }
}

const ToDoApp = () => (
  <div>
    <Header />
    <AddTodo />
    <VisibleTodos />
  </div>
)

ReactDOM.render(
  <ToDoApp />,
  document.getElementById('root')
)

