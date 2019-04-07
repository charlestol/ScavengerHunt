import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";

const INITIAL_STATE = {
    name: '',
    accessCode: '',
    closed: false,
    dateStart: null,
    dateEnd: null,
    description: '',
    error: null
}

class CreateEvent extends Component {
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
            description,
        } = this.state;        
        
        var eventData = {
            name,
            accessCode,
            email: authUser.email,
            instructor: `${authUser.firstName} ${authUser.lastName}`, // This is a template literal, same as firstName + ' ' + lastName 
            dateStart: this.props.firebase.time.fromDate(new Date(`${dateStart}`)),
            dateEnd: this.props.firebase.time.fromDate(new Date(`${dateEnd}`)),
            closed,
            description,
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
            dateStart,
            dateEnd,
            description,
            error
        } = this.state;

        console.log(dateStart)

        const isInvalid = 
            name === '' ||
            accessCode === '' ||
            description === '' ||
            dateStart === null ||
            dateEnd === null;

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
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
                            <input
                                name="description"
                                value={description}
                                onChange={this.onChange}
                                type="description"
                                placeholder="Type event description here"
                            />
                            <br />
                            {/* <div>
                                <label>
                                    <input
                                        name="submissionType"
                                        value="Image"
                                        checked={submissionType === "Image"}
                                        onChange={this.onChange}
                                        type="radio"
                                    />
                                    Image
                                </label>
                                <label>
                                    <input
                                        name="submissionType"
                                        value="Text"
                                        checked={submissionType === "Text"}
                                        onChange={this.onChange}
                                        type="radio"
                                    />
                                    Text
                                </label>
                            </div> */}
                            <button disabled={isInvalid} type="submit">
                                Create
                            </button>
                            <br />
                            {error && <p>{error}</p>}
                        </form>
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

export default withFirebase(CreateEvent)

