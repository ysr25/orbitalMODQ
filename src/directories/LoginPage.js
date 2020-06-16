import React, {Component} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import {Redirect} from 'react-router-dom'

export default class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            user_username: '',
            user_password: '',
            isButtonDisabled: false,
            buttonVariant: 'primary',
            loginStatus:'Log In',
            loggedIn: false,
            redirectTo: null
        }
    }

    updateGlobalLoginStatus(e) {
        this.props.login(e);
    }

    onChangeUsername(e) {
        this.setState({
            user_username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            user_password: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        
        const userLogIn = {
            username: this.state.user_username,
            password: this.state.user_password
        }
                
        axios.post('http://localhost:3001/users/login', userLogIn, {withCredentials: true})
            .then(res =>  {
                console.log(res.data);
                this.props.login();
                if(res.status === 200) {
                    this.props.updateGlobalLoginStatus({
                        loggedIn: true
                    })
                    this.setState({
                        redirectTo: '/'
                    })
                }
            })
            .catch(err => console.log(err));

        this.setState({
            isButtonDisabled: true,
            buttonVariant: 'dark',
            loginStatus:'Logging In...'
        });
        
    }

    render() {
        if(this.state.redirectTo) {
            return <Redirect to= {{ pathname: this.state.redirecTo}} />
            } else {
            return (
                <div style={{marginTop: 10}}>
                <div>
                    <h3>Log in to existing account</h3>
                    <p className="grey-text text-darken-1">
                        <em>Don't have an account? </em>
                        <Link to="/users/signup">Register</Link>
                    </p>
                </div>
                <form onSubmit={this.onSubmit}>
                    <input  type="text"
                        placeholder="Username"
                        className="form-control"
                        value={this.state.user_username}
                        onChange={this.onChangeUsername}
                    />
                    <br></br>
                    <input  type="password"
                        placeholder="Password"
                        className="form-control"
                        value={this.state.user_password}
                        onChange={this.onChangePassword}
                    />
                    <br />
                    <div className="form-group">
                    <Button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={this.state.isButtonDisabled}
                            variant={this.state.buttonVariant}>
                                {this.state.loginStatus}
                            
                            </Button>
                    </div>
                </form>
                </div>
            )
        }
    }
}