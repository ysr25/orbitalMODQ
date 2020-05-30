import React, {Component} from 'react';
import axios from 'axios';
import SuccessfulLogIn from './SuccessfulLogIn';
import { BrowserRouter as Route, Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Homepage from './Homepage';

export default class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            user_username: '',
            user_password: ''
        }
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
                
        axios.post('http://localhost:3001/users/login', userLogIn)
            .then(res => console.log(res.data))
            .then(res => this.props.history.push('/'))
            .catch(err => console.log(err));
    }

    render() {
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
                    <Button type="submit" className="btn btn-primary">Log In</Button>
                </div>
            </form>
            </div>
        )
    }
}