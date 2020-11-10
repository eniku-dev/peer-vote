import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Route,Switch } from "react-router-dom";
import Voterlogin from "./Auth/Voterlogin";
import Home from "./Auth/Componet/Home";

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route path="/" strict exact component={Voterlogin}/>
            <Route path="/Home" strict exact component={Home} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
