import React, {Component} from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

export default class Registration extends Component {

    constructor(props) {
        super(props);

        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeCourse = this.onChangeCourse.bind(this);
        this.onChangeYearOfStudy = this.onChangeYearOfStudy.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            user_firstName: '',
            user_lastName: '',
            user_email: '',
            user_course: '',
            user_yearOfStudy: '',
            user_username: '',
            user_password: '',
            registered: false
        }
    }

    onChangeFirstName(e) {
        this.setState({
            user_firstName: e.target.value
        });
    }

    onChangeLastName(e) {
        this.setState({
            user_lastName: e.target.value
        });
    }

    onChangeEmail(e) {
        this.setState({
            user_email: e.target.value
        });
    }

    onChangeCourse(e) {
        this.setState({
            user_course: e.target.value
        });
    }

    onChangeYearOfStudy(e) {
        this.setState({
            user_yearOfStudy: e.target.value
        });
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
        
        console.log(`New User Registered Successfully`);
        console.log(`First Name: ${this.state.user_firstName}`);
        console.log(`Last Name: ${this.state.user_lastName}`);
        console.log(`Email: ${this.state.user_email}`);
        console.log(`Course of Study: ${this.state.user_course}`);
        console.log(`Year of Study: ${this.state.user_yearOfStudy}`);
        console.log(`Username: ${this.state.user_username}`);
        console.log(`Password: ${this.state.user_password}`);
        
        this.setState({
            user_firstName: '',
            user_lastName: '',
            user_email: '',
            user_course: '',
            user_yearOfStudy: '',
            user_username: '',
            user_password: '',
            registered: false
        })
    }

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>Create An Account</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                        <label>First Name: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.user_firstName}
                                onChange={this.onChangeFirstName}
                                />
                    </div>
                    <div className="form-group"> 
                        <label>Last Name: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.user_lastName}
                                onChange={this.onChangeLastName}
                                />
                    </div>
                    <div className="form-group">
                        <label>Email Address: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.user_email}
                                onChange={this.onChangeEmail}
                                />
                    </div>
                    <div className="form-group">
                        <label>Course of Study: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.user_course}
                                onChange={this.onChangeCourse}
                                />
                    </div>
                    <DropdownButton id="dropdown-yearOfStudy" title="Year Of Study">
                        <Dropdown.Item href="#/action-1">Matriculating Soon</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Undergraduate</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Masters</Dropdown.Item>
                        <Dropdown.Item href="#/action-4">PhD</Dropdown.Item>
                        <Dropdown.Item href="#/action-5">Others</Dropdown.Item>
                    </DropdownButton>
                    <div className="form-group">
                        <label>Username: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.user_username}
                                onChange={this.onChangeUsername}
                                />
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.user_password}
                                onChange={this.onChangePassword}
                                />
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Create User" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}