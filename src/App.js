import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarElements from './NavbarElements';
import LoginHome from './login';

function App() {

  // determines if user is logged in or not.
  const [login, setLogin] = useState(false)

{/*export default class App extends React.Component{*/}
  {/*render(){*/}
  return (
    
      <div contextMenu=''>
            {/* If user is logged in, display home screen, otherwise user will be prompted to log in/sign up. */}
            {login ? 
            <NavbarElements></NavbarElements> :
            <LoginHome login={login} setLogin={setLogin}/>
            }
            
            
      </div>
  );
}

export default App;
