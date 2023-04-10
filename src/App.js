import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarElements from './NavbarElements';
import LoginHome from './login';


// Import the functions you need from the SDKs you need
//Authorization imports
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

function App() {

    // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyB45KzUwC2AeFXHHcaAD6A0Mu1Mg77s-2U",
    authDomain: "coffee-beans-final.firebaseapp.com",
    databaseURL: "https://coffee-beans-final-default-rtdb.firebaseio.com",
    projectId: "coffee-beans-final",
    storageBucket: "coffee-beans-final.appspot.com",
    messagingSenderId: "260660376463",
    appId: "1:260660376463:web:a3b701b0b7512c040791fa"
  };

  const databaseURL = "https://coffee-beans-final-default-rtdb.firebaseio.com";


  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // determines if user is logged in or not.
  const [login, setLogin] = useState(false)


  return (
    
      <div contextMenu=''>
            {/* If user is logged in, display home screen, otherwise user will be prompted to log in/sign up. */}
            {login ? 
            <NavbarElements app={app}></NavbarElements> :
            <LoginHome login={login} setLogin={setLogin} auth={auth}/>
            }
            
            
      </div>
  );
}

export default App;
