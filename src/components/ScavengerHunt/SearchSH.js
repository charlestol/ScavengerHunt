import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import JoinScavengerHunt from './JoinSH';

// ADDING START DATE AND END DATE LATER

const INITIAL_STATE = {
    accessCode: '',
    scavengerHunt: null,
    loading: false,
    error: null
}

const ERROR_DOES_NOT_EXIST = "Invalid access code entered. Either it was mis-typed or it does not exist. Contact your instructor for verification."

class SearchScavengerHunt extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSearch = event => {
        this.setState({ loading: true });

       const { accessCode } = this.state
       
        this.props.firebase.scavengerHunt(accessCode).get()
            .then(doc => {
                if (doc.exists) {
                    // console.log("Document data:", doc.data());
                    this.setState({ 
                        scavengerHunt: doc.data(),
                        loading: false,
                        error: null
                    })
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!", ERROR_DOES_NOT_EXIST);
                    this.setState({ 
                        error: ERROR_DOES_NOT_EXIST,
                        loading: false,
                        scavengerHunt: null
                    })
                }
            }).catch(error => {
                this.setState({ 
                    error: error,
                    loading: false,
                    scavengerHunt: null
                })
                console.log("Error getting document:", error);
            });

        event.preventDefault();
      };
    
      onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
      };

    render() {
        const {
            accessCode,
            loading,
            scavengerHunt,
            error
        } = this.state;

        const isInvalid = accessCode === '';

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                <form onSubmit={this.onSearch}>
                    <input
                        name="accessCode"
                        value={accessCode}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Access Code"
                    />
                    <button disabled={isInvalid} type="submit">
                        Search
                    </button>
                    {loading && <div>Loading ...</div>}   
                    {scavengerHunt && 
                        <div>
                            <div>
                                {scavengerHunt.name}
                            </div>
                            <br />
                            <div>
                                {scavengerHunt.instructions}
                            </div>
                            <br />
                            <JoinScavengerHunt accessCode={accessCode} />
                        </div>
                    }
                    {error && <p>{error}</p>}
                </form>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

export default withFirebase(SearchScavengerHunt)

