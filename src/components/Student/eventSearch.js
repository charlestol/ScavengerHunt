import React, { Component } from 'react';
import { Button } from "reactstrap"
import { withFirebase } from '../Firebase';

import JoinEvent from './eventJoin';

// ADDING START DATE AND END DATE LATER

const INITIAL_STATE = {
    accessCode: '',
    scavengerHunt: null,
    closed: false,
    loading: false,
    error: null
}

const ERROR_DOES_NOT_EXIST = "Invalid access code entered. Either the event has ended, it was mis-typed or it does not exist. Contact your instructor for verification."

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
                    const sh = doc.data();
                    const closed = sh.closed;
                    const endDate = sh.dateEnd.seconds;
                    // convert millisec to sec
                    const today = (Date.now() / 1000).toFixed(0);

                    // console.log("e",endDate)
                    // console.log("today", today)
                    if(today > endDate || closed) {
                        this.setState({
                            scavengerHunt: null,
                            closed: true,
                            loading: false,
                            error: ERROR_DOES_NOT_EXIST
                        })
                    } else {
                        this.setState({
                            scavengerHunt: sh,
                            closed: false,
                            loading: false,
                            error: null
                        })
                    }
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!", ERROR_DOES_NOT_EXIST);
                    this.setState({
                        error: ERROR_DOES_NOT_EXIST,
                        loading: false,
                        scavengerHunt: null,
                        closed: false
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
            closed,
            scavengerHunt,
            error
        } = this.state;

        const isInvalid = accessCode === '';

        return (
                <form onSubmit={this.onSearch}>
                    <input
                        name="accessCode"
                        value={accessCode}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Access Code"
                    />
                    <Button color="danger" disabled={isInvalid} type="submit">
                        Search
                    </Button>
                    {loading && <div>Loading ...</div>}
                    {scavengerHunt && !closed &&
                        <div>
                            <div>
                                {scavengerHunt.name}
                            </div>
                            <br />
                            <div>
                                {scavengerHunt.instructions}
                            </div>
                            <br />
                            <JoinEvent scavengerHunt={scavengerHunt} />
                        </div>
                    }
                    {error && <p>{error}</p>}
                </form>
        );
    }
}

export default withFirebase(SearchScavengerHunt)
