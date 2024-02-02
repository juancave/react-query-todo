import logo from './logo.svg';
import './App.css';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const todos = [];

const getTodos = async () => {
  return new Promise(resolve => setTimeout(() => resolve(todos), 1000));
}

const postTodo = async (todo) => {
  todos.push({ ...todo, id: todos.length });
};

const mutateTodo = async (partialTodo) => {
  todos[partialTodo.id] = { ...todos[partialTodo.id], ...partialTodo };
};

function Todos() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  const addTodoMutation = useMutation({
    mutationFn: (newTodo) => postTodo(newTodo),
  });
  
  const updateTodoMutation = useMutation({
    mutationFn: (newTodo) => mutateTodo(newTodo),
  });

  const handleChangeTodo = (change, idx) => {
    updateTodoMutation.mutate({ ...change, id: idx });
  };

  if (isLoading) return <span className='Loader'></span>;
  if (error) return "An error has occurred: " + error.message;

  return (
    <div className='Container'>
      <button
        onClick={() => {
          addTodoMutation.mutate({
            title: ""
          });
        }}
      >
        Add Todo
      </button>
      {data.map((todo, idx) => {
        return (
          <div key={idx}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={(e) =>
                handleChangeTodo({ completed: e.target.checked }, idx)
              }
            />{" "}
            <input
              type="text"
              value={todo.title}
              onChange={(e) => handleChangeTodo({ title: e.target.value }, idx)}
            />
          </div>
        );
      })}
      <hr/>
      <div className='List'>
        {data.map((todo, idx) => {
          return (
            <div className='Todo' key={idx}>
              {todo.id ?? '0'} - {todo.title ? todo.title : <i>Pending</i>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>React Query</p>
        </header>
        <Todos />
      </div>
    </QueryClientProvider>
  );
}

export default App;
