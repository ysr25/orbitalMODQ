import React, {Component} from 'react';
import Card from 'react-bootstrap/Card'
import axios from 'axios';

export default class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post_list: []
        }
    }

     componentDidMount = () => {
        axios.get('http://localhost:3001/modReviews/view/all')
            .then(res => this.setState({
                 post_list: res.data
            }))
            .catch(err => console.log(err));
    }

    render() {
        return (
            <div style={{marginTop: 10}}>
                {this.state.post_list.map(post =>
                    <>
                        <Card>
                            <Card.Body key={post._id}>
                                <Card.Title>{post.title}</Card.Title>
                                <Card.Subtitle>{post.moduleCode}</Card.Subtitle>
                                <Card.Text>{post.content}</Card.Text>
                                <Card.Link href={`/modreviews/editpost/${post._id}`}>Edit</Card.Link>
                            </Card.Body>
                        </Card>
                        <br />
                    </>
                )}
            </div>
        )
    }
}