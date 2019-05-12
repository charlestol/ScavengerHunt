import React, { Component } from 'react';
import { Button, Container, Input, Form, FormGroup, Label, Alert } from 'reactstrap';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import 'react-widgets/dist/css/react-widgets.css';

Moment.locale('en')
momentLocalizer()

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
const SUCCESS_CREATE = "Event successfully created!";
const ERROR_START_DATE = "Your start date can't be greater than your end date, please confirm that your start and end dates are correct.";
const ERROR_END_DATE = "Your end date can't be less than your start date, please confirm that your start and end dates are correct.";
const ERROR_AC_TAKEN = "This access code is already in use. Please try another."

class CreateEvent extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE, msg: null };
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
        this.props.firebase.scavengerHunt(accessCode).get()
        .then(doc => {
            if(doc.exists) {
                this.setState({ error: ERROR_AC_TAKEN })
            } else {
                this.props.firebase.scavengerHunt(accessCode).set(eventData)
                .then(() => {
                    console.log("Document successfully written!");
                    this.setState({ ...INITIAL_STATE, msg: SUCCESS_CREATE });
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                    this.setState({error})
                });
            }
         })
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
            dateError,
            msg
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
                    <Container>
                        <Form onSubmit={event => this.onCreateEvent(event, authUser)}>
                            <h4>Create a Scavenger Hunt Event!</h4>
                            <Input
                                name="name"
                                value={name}
                                onChange={this.onChange}
                                type="text"
                                placeholder="Event Name"
                                className="mb-3 rounded-sm"
                            />
                            <Input
                                name="accessCode"
                                value={accessCode}
                                onChange={this.onChange}
                                type="text"
                                placeholder="Access Code"
                                className="mb-3 rounded-sm"
                            />
                            <DateTimePicker
                                value={dateStart}
                                onChange={dateStart => this.handleChangeStart(dateStart)}
                                placeholder="Click calendar and clock to set Start time"
                                className="mb-3 rounded-sm"
                            />
                            <DateTimePicker 
                                value={dateEnd}
                                onChange={dateEnd => this.handleChangeEnd(dateEnd)}
                                placeholder="Click calendar and clock to set End time"
                                className="mb-3 rounded-sm"
                            />
                            <Input
                                name="courses"
                                value={courses}
                                onChange={this.onChange}
                                type="text"
                                placeholder="Course(s) participating"
                                className="mb-3 rounded-sm"
                            />
                            <Input
                                name="description"
                                value={description}
                                onChange={this.onChange}
                                type="text"
                                placeholder="Type event description here"
                                className="mb-3 rounded-sm"
                            />
                            <Button color="danger" disabled={isInvalid} type="submit" className="mb-3 rounded-sm">
                                Create
                            </Button>
                            {msg && <Alert color="success">{msg}</Alert>}
                            {dateError && <Alert color="danger">{dateError}</Alert>}
                            {error && <Alert color="danger">{error}</Alert>}
                        </Form>
                    </Container>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

export default withFirebase(CreateEvent)

