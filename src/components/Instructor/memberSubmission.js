import React, {Component} from 'react';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import GiveScore from './scoreTask';

class Submission extends Component {
    state = { type: '', submission: '', score: '-', comment: null }

    componentDidMount() {
        let ac = this.props.match.params.eventId;
        let email = this.props.match.params.memberId;
        let task = this.props.match.params.taskId;
        // console.log(ac, email, task)
    
       this.props.firebase.scavengerHuntSubmission(ac, email, task).get()
       .then(doc => {
            let submitData = doc.data();
            let submission = '';
            let type = '';
        //    console.log('sub ',doc.data())
            if(submitData.hasOwnProperty('textEntry')) {
                type = 'text';
                submission = submitData.textEntry;
            } else if(submitData.hasOwnProperty('imageURL')) {
                type = 'image';
                submission = submitData.imageURL;
            } 
           
            if(submitData.hasOwnProperty('result')) {
                let score = submitData.result.score;
                let comment = submitData.result.feedback;
                this.setState({
                    type,
                    submission,
                    score, 
                    comment,
                });
            } else {
                this.setState({
                    type,
                    submission,
                });
            }
        });
    }
    //   componentWillUnmount() {
    //       this.unsubscribe();
    //   }

    render() {
        const { type, submission, score, comment} = this.state;

        let ac = this.props.match.params.eventId;
        let email = this.props.match.params.memberId;
        let task = this.props.match.params.taskId;

        return ( 
            <div>
                <h3>Submission Review</h3>
                <div>Score: {score}/1</div>
                {type==='image' && 
                    <div>
                        <img src={submission} alt='submission' />
                    </div>
                }
                {type==='text' && 
                    <div>
                        <p>{submission}</p>
                    </div>
                }
                <GiveScore ac={ac} email={email} task={task} />
            </div>
        )
    }
}

export default withRouter(withFirebase(Submission));