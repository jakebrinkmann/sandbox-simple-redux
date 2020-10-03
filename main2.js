const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
};

// Presentation Component
const Counter = ({
  value,
  onIncrement,
  onDecrement,
}) => (
  <div>
    <h1>State: { value }</h1>
    <button onClick={onIncrement}>++</button>
    <button onClick={onDecrement}>--</button>
  </div>
)

// Container
const { createStore } = Redux;
const store = createStore(counter);

const render = () => {
  ReactDOM.render(
    <Counter 
      value={store.getState()}
      onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
      onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
    />,
    document.getElementById('root')
  )
}
store.subscribe(render)
render()

