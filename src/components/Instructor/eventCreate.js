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
    courses: '',
    error: null,
    dateError: null
}

const ERROR_START_DATE = "Your start date can't be greater than your end date, please confirm that your start and end dates are correct.";
const ERROR_END_DATE = "Your end date can't be less than your start date, please confirm that your start and end dates are correct.";

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
            courses,
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
            numOfTasks: 0,
            courses,
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

    handleChangeStart = (date) => {
        let { dateEnd } = this.state; 
        if(dateEnd !== null && dateEnd < date) {
            this.setState({ 
                dateStart: dateEnd,
                dateError: ERROR_START_DATE
            });
        } else {
            this.setState({ 
                dateStart: date,
                dateError: null 
            })
        }
    }

    handleChangeEnd = (date) => {
        let { dateStart } = this.state; 
        if(dateStart !== null && dateStart > date) {
            this.setState({ 
                dateEnd: dateStart,
                dateError: ERROR_END_DATE
            });
        } else {
            this.setState({ 
                dateEnd: date,
                dateError: null
            });
        }
    }  

    render() {
        const {
            name,
            accessCode,
            dateStart,
            dateEnd,
            description,
            courses,
            error,
            dateError
        } = this.state;

        const isInvalid = 
            name === '' ||
            accessCode === '' ||
            description === '' ||
            courses === '' ||
            dateStart === null ||
            dateEnd === null ||
            dateError !== null;

        console.log(dateStart)

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
                                onChange={this.handleChangeStart}
                                selectsStart
                                startDate={dateStart}
                                endDate={dateEnd}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={60}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="Time"
                                placeholderText="Click to set Start time"
                                shouldCloseOnSelect={false}
                            />
                            <br />
                            <DatePicker
                                selected={dateEnd}
                                onChange={this.handleChangeEnd}
                                selectsEnd
                                startDate={dateStart}
                                endDate={dateEnd}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={60}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="Time"
                                placeholderText="Click to set End time"
                                shouldCloseOnSelect={false}
                            />
                            <br />
                            <input
                                name="description"
                                value={description}
                                onChange={this.onChange}
                                type="text"
                                placeholder="Type event description here"
                            />
                            <br />
                            <input
                                name="courses"
                                value={courses}
                                onChange={this.onChange}
                                type="text"
                                placeholder="Course(s) participating"
                            />
                            <br />
                            <button disabled={isInvalid} type="submit">
                                Create
                            </button>
                            <br />
                            {dateError && <p>{dateError}</p>}
                            {error && <p>{error}</p>}
                        </form>
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

export default withFirebase(CreateEvent)

