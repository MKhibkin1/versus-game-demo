import './login.scss'

import {connect} from 'react-redux'
import { Navigate } from "react-router-dom"

import {Component} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

class ConnectedLogin extends Component{

    state = {
        showLogin: true,
        loginError: false,
        userExistsError: false,
        nonPWMatchError: false,
        emptySignUpFieldsError: false
    }

    login = (e) => {
        e.preventDefault()

        let uName = e.target.elements.username.value
        let pw  = e.target.elements.password.value

        fetch('http://localhost:8000/users/')
        .then(resp => resp.json())
        .then(users => {
            if(uName in users){
                if(users[uName].password == pw){
                    //trigger logged in state for redux and get the images they like
                    this.props.login(uName, users)
                }
            }else{
                this.setState({loginError: true})
            }


        })
    }

    signUp = (e) => {
        e.preventDefault()

        let uName = e.target.elements.username.value
        let pw = e.target.elements.password.value
        let pwConfirm = e.target.elements.passwordConfirm.value

        if(!pw || !uName){
            this.setState({emptySignUpFieldsError: true})
            return
        }else{
            this.setState({emptySignUpFieldsError: false})
        }

        if(pwConfirm != pw){
            this.setState({nonPWMatchError: true})
            return
        }else{
            this.setState({nonPWMatchError: false})
        }

        fetch('http://localhost:8000/users/')
        .then(resp => resp.json())
        .then(users => {
            if(uName in users){
                this.setState({userExistsError: true})
                return
            }else{
                let newUser = {
                    [uName] : {
                        password: pw,
                        likedImages: {}
                    }}
                users = {...users, ...newUser}
                fetch('http://localhost:8000/users/', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(users),
                })
                .then(response => response.json())
                .catch(error => console.error('Error:', error))
                .then(response => this.props.login(uName, users));
            }
        })
    }

    render(){
        return(
            <div className="login-view">
                <div className="form-container">
                    <div className={`container-slider ${!this.state.showLogin ? 'active' : null}`}>
                        <div className='login form-view'>
                        <h4>Login</h4>
                        <form className="form" onSubmit={this.login}>
                            <div className="fields">
                                <label htmlFor="username">Username</label>
                                <input type="text" name="username" placeholder="User" />
    
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" />
                            </div>
                            {this.state.loginError ? <div className="error">No account with those credentials</div> : null}
                            <button className="primary button-27">Login</button>
                        </form>
                        <button onClick={() => this.setState({showLogin:false})} className="sign-up-button button-27">Create Account</button>
                    </div>
                        <div className="signup form-view">
                        <FontAwesomeIcon size="2x" className="back-button" onClick={() => this.setState({showLogin: true})} icon={faArrowLeft} />
                        <h4>Create Account</h4>
                        <form className="form" onSubmit={this.signUp}>
                            <div className="fields">
                                <label htmlFor="username">Username</label>
                                <input type="text" name="username" placeholder="User" />
                                
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" />
    
                                <label htmlFor="passwordConfirm">Confirm password</label>
                                <input type="password" name="passwordConfirm" />
                            </div>

                            {this.state.userExistsError? <div className="error">Username already exists</div> : null}
                            {this.state.nonPWMatchError? <div className="error">Passwords don't match</div> : null}
                            {this.state.emptySignUpFieldsError? <div className="error">Username or password can't be null</div> : null}

                            <button className="primary button-27">Sign Up</button>
                        </form>
                    </div>
                </div>
            </div>

            {this.props.loggedIn && <Navigate to='/explore' replace={true}/>}

          </div>
        )
    }
}

const mapStateToProps = (state) => {
    return(
        {
            loggedIn: state.loggedIn,
        }
    )
}

const mapDispatchToProps = (dispatch) => ({
    login: (userName, users) => dispatch({type:"login", userName, users}),
})

const Login = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedLogin)

export default Login


