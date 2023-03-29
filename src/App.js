import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarElements from './components/Navbar/NavbarElements';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
        <NavbarElements>

        </NavbarElements>



      </header>
    </div>
  );
}

export default App;
