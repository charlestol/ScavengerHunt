import React, {Component} from 'react';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

class TaskResults extends Component {
    state = { score: '-', feedback: null, loading: false }

    componentDidMount() {
        let ac = this.props.match.params.eventId;
        let task = this.props.match.params.taskId;
        let email = this.props.email;

        this.setState({ loading: true })

        this.props.firebase.scavengerHuntMember(ac, email).get()
        .then(doc => {
             let data = doc.data();
            // console.log(data)
             if(data.hasOwnProperty('result')) {
                this.props.firebase.scavengerHuntSubmission(ac, email, task).get()
                .then(doc => {
                     let data = doc.data();
                    
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
                <h3>Submission Review</h3>
                <div>
                    <div>Score: {score}/1</div>
                    {feedback && <p>{feedback}</p>}
                </div>
            </div>
        )
    }
}

export default withRouter(withFirebase(TaskResults));