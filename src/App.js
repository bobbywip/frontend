import React from 'react'
import { Switch, Route, HashRouter } from 'react-router-dom'

import Home from "./pages/index"
import Dashboard from "./pages/dashboard"

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path='/' component={Home}></Route>
        <Route exact path='/dashboard' component={Dashboard}></Route>
      </Switch>
    </HashRouter>
  );
}

export default App;
