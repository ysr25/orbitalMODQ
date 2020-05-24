import React, {Component} from 'react';
import axios from 'axios';
import SuccessfulSignUp from './SuccessfulSignUp';

export default class Registration extends Component {
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
            user_username: this.state.user_username,
            user_password: this.state.user_password,
        }
                
        axios.post('http://localhost:3000/users/login', userLogIn)
            .then(res => console.log(res.data));
    }

    render() {
        return (
            <div style={{marginTop: 10}}>
            <h3>Log in to existing account</h3>
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
                        <input type="submit" value="Log In" className="btn btn-primary" onClick={SuccessfulSignUp}/>
                    </div>
            </form>
            </div>
        )
    }
}