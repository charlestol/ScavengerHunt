import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
// ADDING START DATE AND END DATE LATER

const INITIAL_STATE = {
    name: '',
    accessCode: '',
    isActive: false,
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
            isActive,
            instructions
        } = this.state;        
       
        var eventData = {
            name,
            accessCode,
            instructorName: authUser.firstName + ' ' + authUser.lastName,
            instructorEmail: authUser.email,
            isActive,
            instructions
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
    
      onChangeCheckbox = event => {
        this.setState({ [event.target.name]: event.target.checked });
      };    

    render() {
        const {
            name,
            accessCode,
            isActive,
            instructions,
            error
        } = this.state;

        const isInvalid = 
            name === '' ||
            accessCode === '' ||
            instructions === '';

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
                    <input
                        name="accessCode"
                        value={accessCode}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Access Code"
                    />

                    <label>
                        Active:
                        <input
                            name="isActive"
                            type="checkbox"
                            checked={isActive}
                            onChange={this.onChangeCheckbox}
                        />
                    </label>
                    <input
                        name="instructions"
                        value={instructions}
                        onChange={this.onChange}
                        type="instructions"
                        placeholder="Type event instructions here"
                    />
                    <button disabled={isInvalid} type="submit">
                        Create
                    </button>
                    {error && <p>{error.message}</p>}
                </form>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

export default withFirebase(CreateEventFormBase)

