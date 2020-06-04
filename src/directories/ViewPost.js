import axios from 'axios';
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const mongoose = require('mongoose');
//const User = require();

export default class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post_id: props.match.params.id,
            post_title: '',
            post_content: '',
            post_moduleCode: '',
            post_authorId: '',
            post_author: '',
            post_date: '',
            post_editedDate: ''
        }
    }

    componentDidMount = () => {
        axios.get(`http://localhost:3001/modReviews/view/${this.state.post_id}`)
            .then(res => this.setState({
                 post_id: res.data._id,
                 post_title: res.data.title,
                 post_content: res.data.content,
                 post_moduleCode: res.data.moduleCode,
                 post_authorId: res.data.author,
                 post_date:res.data.datePosted,
                 post_editedDate: res.data.dateEdited
            }))
            .catch(err => console.log(err));
    }

    render() {
        // this.state.post_author = User.find({this.state.post_authorId}).populate('ModReview.author').exec(function(err, modrevs) {
        //     console.log(modrevs[0].author);
        // });
        return (
            <div style={{marginTop: 10}}>
                <h6>Post #{this.state.post_id}</h6>
                {/* <h8><em>Last edited on {this.state.edited_date}</em></h8><br  /> */}
                <Form.Group>
                <br  />
                <h2>{this.state.post_title}</h2>
                <h8>Posted by <em>HAVENT FIGUreD OUT pOPULATe on mongoose {this.state.post_author} on {this.state.post_date}</em></h8> <br  />
                <br  />
                <h5>Review for: <b><em>{this.state.post_moduleCode}</em></b></h5>  <br  />
                <h8>{this.state.post_content}</h8>
                </Form.Group>
                <br  />
                    <Button type="button" variant="outline-secondary" size="sm" href={`/`}>Return to Homepage</Button> {' '}
                
            </div>
        )
    }
}
