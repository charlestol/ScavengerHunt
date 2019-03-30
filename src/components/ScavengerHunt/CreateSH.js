import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";
// ADDING START DATE AND END DATE LATER

const INITIAL_STATE = {
    name: '',
    accessCode: '',
    closed: false,
    dateStart: null,
    dateEnd: null,
    instructions: '',
    error: null
}

class CreateEventFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onCreateEvent = (event, authUser) => {
        const {
            name,
            accessCode,
            closed,
            dateStart, 
            dateEnd,
            instructions,
        } = this.state;        
        
        var eventData = {
            name,
            accessCode,
            email: authUser.email,
            instructor: `${authUser.firstName} ${authUser.lastName}`, // This is a template literal, same as firstName + ' ' + lastName 
            dateStart: this.props.firebase.time.fromDate(new Date(`${dateStart}`)),
            dateEnd: this.props.firebase.time.fromDate(new Date(`${dateEnd}`)),
            closed,
            instructions,
        };

        this.props.firebase.scavengerHunt(accessCode).set(eventData)
            .then(() => {
                console.log("Document successfully written!");
                this.setState({ ...INITIAL_STATE });
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
                this.setState({error})
            });

        event.preventDefault();
    };

    onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    };

    onStartDateSelect = (date) => {
        this.setState({ dateStart: date})
    }

    onEndDateSelect = (date) => {
        this.setState({ dateEnd: date})
    }  

    render() {
        const {
            name,
            accessCode,
            closed,
            dateStart,
            dateEnd,
            instructions,
            error
        } = this.state;

        const isInvalid = 
            name === '' ||
            accessCode === '' ||
            instructions === '' ||
            dateStart === null ||
            dateEnd === null;

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                <form onSubmit={event => this.onCreateEvent(event, authUser)}>
                    <input
                        name="name"
                        value={name}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Event Name"
                    />
                    <br />
                    <input
                        name="accessCode"
                        value={accessCode}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Access Code"
                    />
                    <br />
                    <input
                        name="instructions"
                        value={instructions}
                        onChange={this.onChange}
                        type="instructions"
                        placeholder="Type event instructions here"
                    />
                    <br />
                    <DatePicker
                        selected={dateStart}
                        onChange={this.onStartDateSelect}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={60}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        timeCaption="Time"
                        placeholderText="Click to set Start time"
                    />
                    <br />
                    <DatePicker
                        selected={dateEnd}
                        onChange={this.onEndDateSelect}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={60}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        timeCaption="Time"
                        placeholderText="Click to set End time"
                    />
                    <br />
                    <button disabled={isInvalid} type="submit">
                        Create
                    </button>
                    <br />
                    {error && <p>{error}</p>}
                </form>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

export default withFirebase(CreateEventFormBase)

