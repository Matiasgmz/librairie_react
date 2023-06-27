import './App.css';
import ListBook from './components/ListBook';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <h1 className='my-5 fw-bold'>My Book</h1>
      <ListBook></ListBook>
    </div>
  );
}

export default App;
