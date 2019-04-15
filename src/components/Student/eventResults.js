import React, {Component} from 'react';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

class EventResults extends Component {
    state = { score: null, feedback: null, loading: false }

    componentDidMount() {
        let ac = this.props.match.params.eventId;
        let email = this.props.email;

        this.setState({ loading: true })

       this.props.firebase.scavengerHuntMember(ac, email).get()
       .then(doc => {
            let data = doc.data();
           console.log(data)
            if(data.hasOwnProperty('result')) {
                let score = data.result.score;
                let feedback = data.result.feedback;
                this.setState({
                    score, 
                    feedback,
                    loading: false
                });
            } else {
                this.setState({
                    loading: false
                });
            }
        });
    }
    //   componentWillUnmount() {
    //       this.unsubscribe();
    //   }

    render() {
        const { score, feedback} = this.state;

        return ( 
            <div>
                {score && 
                    <div>
                        <h3>Event Review</h3>
                        <div>
                            <div>Score: {score}</div>
                            {feedback && <p>{feedback}</p>}
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default withRouter(withFirebase(EventResults));