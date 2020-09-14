import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from "./pages/index"
import Dashboard from "./pages/dashboard"

function App() {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/dashboard' component={Dashboard}></Route>
    </Switch>
  );
}

export default App;
