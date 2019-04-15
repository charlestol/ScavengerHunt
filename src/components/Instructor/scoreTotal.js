import React, {Component} from 'react';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

const INITIAL_STATE = {
    score: '',
    feedback: '',
    loading: false
}

const SUCCESS_MSG = 'Student Reviewed Submitted!';
const ERROR_MSG = 'Error submitting Review';

class TotalScore extends Component {
    state = { score: '', feedback: '', loading: '', numOfTasks: null, totalScore: null, submitMsg: null }

    componentDidMount() {
        // const { score, feedback } = this.state;
        let self = this;
        
        this.setState({ loading: true });

        let ac = this.props.ac;
        let email = this.props.email;
        let totalScore = 0;
        // let task = this.props.task;

        // let data = {
        //     result: {
        //         score,
        //         feedback
        //     }
        // }

        this.props.firebase.scavengerHunt(ac).get()
        .then(doc=> {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            let numOfTasks = doc.data().numOfTasks;
            // console.log(numOfTasks)
            let noneGraded = true;
            let noneGradedMark = '-';
            this.props.firebase.scavengerHuntSubmissions(ac, email).get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.data())
                    let submission = doc.data();
                    if(submission.hasOwnProperty('result')) {
                        console.log(submission.result.score)
                        totalScore += Number(submission.result.score);
                        noneGraded = false;
                    }
                })
                
                if(noneGraded) {
                    totalScore = noneGradedMark;
                }

                this.setState({
                    totalScore,
                    numOfTasks
                })
            })
        })
        .catch(error => {
            // The document probably doesn't exist.
            console.error("Error getting document: ", error);
            self.setState({ 
                submitMsg: ERROR_MSG,
                loading: false,
            })
        });
    }

    onSubmit = event => {
        // const { score, feedback } = this.state;
        // let self = this;
        
        // this.setState({ loading: true })
        // let ac = this.props.ac;
        // let email = this.props.email;
        // let task = this.props.task;

        // let data = {
        //     results: {
        //         score,
        //         feedback
        //     }
        // }
        // this.props.firebase.scavengerHuntMember(ac, email).update(data)
        // .then(() => {
        //     self.setState({ 
        //         submitMsg: SUCCESS_MSG,
        //         ...INITIAL_STATE
        //     })
        //     console.log("Document successfully updated!");
        // })
        // .catch(error => {
        //     // The document probably doesn't exist.
        //     console.error("Error updating document: ", error);
        //     self.setState({ 
        //         submitMsg: ERROR_MSG,
        //         loading: false,
        //     })
        // });

        event.preventDefault();
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        const {   
            score,
            feedback,
            submitMsg,
            loading,
            totalScore,
            numOfTasks
        } = this.state;

        const isInvalid = score === '';

        return (
            <div>
                <h3>Total Score: {`${totalScore}/${numOfTasks}`}</h3>
                {/* {loading && <div>Submitting...</div>} */}
            </div>
        );
    }
}

export default withRouter(withFirebase(TotalScore))