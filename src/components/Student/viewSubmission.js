import React, {Component} from 'react';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

class ViewSubmission extends Component {
    state = { type: '', submission: null, loading: false}

    componentDidMount() {
        let ac = this.props.match.params.eventId;
        let task = this.props.match.params.taskId;
        let email = this.props.email;

        // console.log(ac, email, task)
        this.setState({ loading: true })
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
           
            this.setState({
                type,
                submission,
                loading: false
            });
        
        })
        .catch(error => {
            this.setState({
                loading: false
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
                {submission && 
                    <div>
                        <h3>Submission</h3>
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
                }
            </div>
        )
    }
}

export default withRouter(withFirebase(ViewSubmission));