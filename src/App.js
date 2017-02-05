import React, { Component } from 'react'
import logo from './static/logo.svg'
import './styles/App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
          <div className='container'>
              <div className='row'>
                  <div className='col-md-4'>
                      Test
                  </div>
                  <div className='col-md-4'>
                      Test
                  </div>
                  <div className='col-md-4'>
                      Test
                  </div>
              </div>
          </div>
      </div>
    )
  }
}

export default App
