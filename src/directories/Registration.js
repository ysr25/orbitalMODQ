import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import SuccessfulSignUp from './SuccessfulSignUp';

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
            user_yearOfStudy: e
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
        
        const newUser = {
            user_firstName: this.state.user_firstName,
            user_lastName: this.state.user_lastName,
            user_email: this.state.user_email,
            user_course: this.state.user_course,
            user_yearOfStudy: this.state.user_yearOfStudy,
            user_username: this.state.user_username,
            user_password: this.state.user_password,
        }

        console.log('New User successfully created: ' + newUser.user_yearOfStudy);
        
        axios.post('http://localhost:3000/users/signup', newUser)
            .then(res => console.log(res.data));

        // this.setState({
        //     user_firstName: '',
        //     user_lastName: '',
        //     user_email: '',
        //     user_course: '',
        //     user_yearOfStudy: '',
        //     user_username: '',
        //     user_password: '',
        //     registered: false
        // })
    }

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>Create An Account</h3>
                <form onSubmit={this.onSubmit}>
                <Form.Row>
                    <Col>
                    <Form.Control
                        input  type="text"
                        placeholder="First Name"
                        className="form-control"
                        value={this.state.user_firstName}
                        onChange={this.onChangeFirstName}
                    />
                    </Col>
                    <Col>
                    <Form.Control
                        input  type="text"
                        placeholder="Last Name"
                        className="form-control"
                        value={this.state.user_lastName}
                        onChange={this.onChangeLastName}
                    />
                    </Col>
                </Form.Row>
                <br></br>
                <Form.Row>
                    <Col>
                    <Form.Control
                        input  type="text"
                        placeholder="Email Address"
                        className="form-control"
                        value={this.state.user_email}
                        onChange={this.onChangeEmail}
                    />
                    </Col>
                    <Col>
                    <Form.Control
                        input  type="text"
                        placeholder="Course of Study"
                        className="form-control"
                        value={this.state.user_course}
                        onChange={this.onChangeCourse}
                    />
                    </Col>
                </Form.Row>
                <br></br>
                    {/* <DropdownButton id="dropdown-yearOfStudy" title="Year Of Study">
                        {["Matriculating Soon", "Undergraduate", "Masters", "PhD", "Others"].map(option => 
                            <Dropdown.Item onSelect={this.onChangeYearOfStudy} key={option} eventKey={option}>
                                {option}
                            </Dropdown.Item>
                        )}
                    </DropdownButton> */}
                    <div className="form-group">
                        <label>Year of Study: </label>
                        <select required
                                className="form-control"
                                value={this.state.user_yearOfStudy}
                                onChange={this.onChangeYearOfStudy} 
                        >
                            <option value='matriculatingSoon'>Matriculating Soon</option>
                            <option value='undergrad'>Undergrad</option>
                            <option value='masters'>Masters</option>
                            <option value='doctorate'>Doctorate</option>
                            <option value='others'>Others</option>
                        </select>
                    </div>
                    {/* <DropdownButton id="dropdownYearOfStudy" title="Year of Study" onSelect={this.onChangeYearOfStudy}>
                        <Dropdown.Item user_YOS="MATS">Matriculating Soon</Dropdown.Item>
                        <Dropdown.Item user_YOS="UG">Undergraduate</Dropdown.Item>
                        <Dropdown.Item user_YOS="MS">Master</Dropdown.Item>
                        <Dropdown.Item user_YOS="PhD">Doctorate</Dropdown.Item>
                        <Dropdown.Item user_YOS="ETC">Others</Dropdown.Item>
                    </DropdownButton> */}
                    <Form.Row>
                    <Col>
                        <Form.Control
                            input  type="text"
                            placeholder="Username"
                            className="form-control"
                            value={this.state.user_username}
                            onChange={this.onChangeUsername}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            input  type="password"
                            placeholder="Password"
                            className="form-control"
                            value={this.state.user_password}
                            onChange={this.onChangePassword}
                        />
                    </Col>
                </Form.Row>
                    <br></br>
                    <div className="form-group">
                        <input type="submit" value="Create User" className="btn btn-primary" onClick={SuccessfulSignUp}/>
                    </div>
                </form>
            </div>
        )
    }
}

// export default class Registration extends Component {
//     render() {
//         return (
//             <div style={{marginTop: 10}}>
//                 <Form>
//                     <Form.Group controlId="formSignUp">
//                         <Form.Row>
//                             <Col>
//                                 <Form.Control placeholder="First name" />
//                             </Col>
//                             <Col>
//                                 <Form.Control placeholder="Last name" />
//                             </Col>
//                         </Form.Row>
//                             <br></br>
                        //     <Form.Row>
                        //         <Col>
                        //             <Form.Control type="email" placeholder="Enter email" />
                        //         </Col>
                        //         <Col>
                        //             <Form.Control placeholder="Course of Study" />
                        //         </Col>
                        // </Form.Row>
//                         <br></br>
//                             <DropdownButton id="yearOfStudy" title="Year of Study" variant="outline-secondary">
//                                 <Dropdown.Item href="#/action-1">Matriculating Soon</Dropdown.Item>
//                                 <Dropdown.Item href="#/action-2">Undergraduate</Dropdown.Item>
//                                 <Dropdown.Item href="#/action-3">Masters</Dropdown.Item>
//                                 <Dropdown.Item href="#/action-4">Doctorate</Dropdown.Item>
//                                 <Dropdown.Item href="#/action-5">Others</Dropdown.Item>
//                             </DropdownButton>
//                         <br></br>
//                         <Form.Row>
//                                 <Col>
//                                     <Form.Control placeholder="Username" />
//                                 </Col>
//                                 <Col>
//                                     <Form.Control type="password" placeholder="Password" />
//                                 </Col>
//                         </Form.Row>
//                     </Form.Group>
//                 </Form>
//             </div>
//         )}
// }