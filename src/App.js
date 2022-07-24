import './App.scss';
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import react from 'react'
import {Explore, Login, } from 'views'
import {connect} from 'react-redux'

function connectedApp(props){
  return (
    <div className="App" id="main-screen">
      <Routes>
        <Route index element={<Login />} /> 
        <Route path="/explore" element={props.loggedIn ? <Explore /> : null}/>
      </Routes>
    </div>
  );
}

const mapStateToProps = (state) => {
  return(
      {
          loggedIn: state.loggedIn,
      }
  )
}

const App = connect(
  mapStateToProps,
  null
)(connectedApp)

export default App





