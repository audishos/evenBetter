import React from 'react'
import { Switch, Route } from 'react-router-dom'
import LandingPage from './components/landingpage/LandingPage'


// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Switch>
      <Route path='/landing' component={LandingPage}/>
    </Switch>
  </main>
)

export default Main