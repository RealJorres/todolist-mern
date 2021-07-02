import React, { useState } from "react";
import './skeleton.css';
import './normalize.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./component/NotFound";


export const CredentialContext = React.createContext();


function App() {

  var user = JSON.parse(localStorage.getItem('user'));
  const credentialsState = useState(user);

  return (
    <div className="App">
      <CredentialContext.Provider value={credentialsState}>
      <Router>
        <Switch>
          <Route exact path='/'>
            <Home/>
          </Route>
          <Route exact path='/register'>
            <Register/>
          </Route>
          <Route exact path='/login'>
            <Login/>
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Router>
      </CredentialContext.Provider>
    </div>
  );
}

export default App;
