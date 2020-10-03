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

// ACTION CREATORS =====================================================================

let nextTodoId = 0
const addTodo = (text) => ({ type: "ADD_TODO", id: nextTodoId++, text })
const setVisibility = (filter) => ({ type: 'SET_VISIBILITY', filter })
const toggleTodo = (id) => ({ type: 'TOGGLE_TODO', id })

// COMPONENTS ==========================================================================

const { createStore } = Redux;
const { Provider, connect } = ReactRedux;
const { Component } = React;

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
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
    default:
      return todos
  }
}
const mapStateToProps = (state) => (
  {
    todos: getVisibleTodos(state.todos, state.visibility)
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

// presentation .................................
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

// container ..................................
const mapStateToLinkProps = (state, props) => (
  {
    active: props.filter == state.visibility
  }
)
const mapDispatchToLinkProps = (dispatch, props) => (
  {
    onClick: () => dispatch(setVisibility(props.filter))
  }
)
const SelectFilter = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link)

// presentation ......
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

// APPLICATION =========================================================================
const ToDoApp = () => (
  <div>
    <Header />
    <AddTodo />
    <VisibleTodos />
  </div>
)

ReactDOM.render(
  <Provider store={createStore(todoApp)} >
    <ToDoApp />
  </Provider>,
  document.getElementById('root')
)

