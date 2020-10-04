// REDUCERS ============================================================================

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

const { combineReducers } = Redux;
const todoApp = combineReducers({
  todos,
})

// ACTION CREATORS =====================================================================

const addTodo = (text) => ({ type: "ADD_TODO", id: String(Date.now()), text })
const toggleTodo = (id) => ({ type: 'TOGGLE_TODO', id })

// COMPONENTS ==========================================================================

const { createStore } = Redux;
const { Provider, connect } = ReactRedux;
const { Component } = React;
const { BrowserRouter, Link, Redirect, Route } = ReactRouterDOM;

// presentation ...................
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

// container ...............................
const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'completed':
      return todos.filter(t => t.completed)
    case 'active':
      return todos.filter(t => !t.completed)
    default:
      return todos
  }
}
const mapStateToProps = (state, props) => (
  {
    todos: getVisibleTodos(state.todos, props.filter)
  }
)
const mapDispatchToProps = (dispatch) => (
  {
    onClick: (i) => dispatch(toggleTodo(i))
  }
)
const VisibleTodos = connect(mapStateToProps, mapDispatchToProps)(TodoList)

// conatiner ....................
let AddTodo = ({ dispatch }) => {
  let input;
  return (
    <div>
      <input ref={node => { input = node} } />
      <button onClick={() => {
         dispatch(addTodo(input.value))
        input.value = ''
        }}>
        +
      </button>
    </div>
  )
}
AddTodo = connect()(AddTodo)

// presentation ................................
const SelectFilter = ({ filter, children }) => (
  <Link
    to={filter === 'all' ? '' : filter}
    activeStyle={{
      textDecoration: 'none',
      color: 'black'
    }}
  >
    {children}
  </Link>
)

// presentation ......
const Header = () => (
  <p>
    Show:
    {' '}
    <SelectFilter filter="all">
      All
    </SelectFilter>
    {', '}
    <SelectFilter filter="completed">
      Completed
    </SelectFilter>
    {', '}
    <SelectFilter filter="active">
      Active
    </SelectFilter>
  </p>
)

// APPLICATION =========================================================================
const loadState = () => {
  try {
    const serialized = localStorage.getItem('state')
    if (serialized == null) { return undefined }
    return JSON.parse(serialized)
  } catch (err) {
    return undefined
  }
}

const saveState = (state) => {
  try {
    const serialized = JSON.stringify(state)
    localStorage.setItem('state', serialized)
  } catch (err) {
    // Ignore
  }
}

const store = createStore(todoApp, loadState())
store.subscribe(() => {
  saveState({
    todos: store.getState().todos
  })
})

const ToDoApp = ({ match }) => (
  <div>
    <Header />
    <AddTodo />
    <VisibleTodos filter={match.params.filter || 'all'} />
  </div>
)

const Root = ({ store }) => (
  <Provider store={store} >
    <BrowserRouter>
      <Redirect from='' to='/' exact />
      <Route path="/:filter?" component={ToDoApp} />
    </BrowserRouter>
  </Provider>
)

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('root')
)

