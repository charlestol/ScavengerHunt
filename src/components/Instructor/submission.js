import React, {Component} from 'react';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

class Submission extends Component {
    state = { type: '', submission: '' }

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
           
            // console.log('sub',submission)
            this.setState({
                type,
                submission,
            });

        });
    }
    //   componentWillUnmount() {
    //       this.unsubscribe();
    //   }

    render() {
        const { type, submission} = this.state;

        return ( 
            <div>
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
            </div>
        )
    }
}

export default withRouter(withFirebase(Submission));