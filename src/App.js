import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {MainPage, UserPage, ProjectPage} from './pages'
import {Nav} from './components' 
import {ApolloProvider} from '@apollo/react-hooks'
import {client} from './api'

function App() {
  return (
    <ApolloProvider client={client}>

      <Router>
        <div className="d-flex h-100">

          <Route path="/" >
            <Nav/>
          </Route>
          <div>
            <Route exact path="/">
              <MainPage/>
            </Route>

            <Route path="/users">
              <UserPage/>
            </Route>

            <Route path="/projects"> 
              <ProjectPage/>
            </Route>
          </div>
        </div>

      </Router>
    </ApolloProvider>
  );
}

export default App;
