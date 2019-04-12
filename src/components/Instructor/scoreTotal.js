import React, {Component} from 'react';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

const INITIAL_STATE = {
    score: '',
    comment: '',
    loading: false
}

const SUCCESS_MSG = 'Student Reviewed Submitted!';
const ERROR_MSG = 'Error submitting Review';

class TotalScore extends Component {
    state = { ...INITIAL_STATE, submitMsg: null }

    componentDidMount() {
        
    }

    onSubmit = event => {
        const { score, comment } = this.state;
        let self = this;
        
        this.setState({ loading: true })
        let ac = this.props.ac;
        let email = this.props.email;
        let task = this.props.task;

        let data = {
            results: {
                score,
                comment
            }
        }
        this.props.firebase.scavengerHuntMember(ac, email).update(data)
        .then(() => {
            self.setState({ 
                submitMsg: SUCCESS_MSG,
                ...INITIAL_STATE
            })
            console.log("Document successfully updated!");
        })
        .catch(error => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
            self.setState({ 
                submitMsg: ERROR_MSG,
                loading: false,
            })
        });

        event.preventDefault();
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        const {   
            score,
            comment,
            submitMsg,
            loading 
        } = this.state;

        const isInvalid = score === '';

        return (
            <div>
             
                {loading && <div>Submitting...</div>}
                {submitMsg && <div>{submitMsg}</div>}
            </div>
        );
    }
}

export default withRouter(withFirebase(TotalScore))