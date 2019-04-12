import React from 'react'
import * as ROUTES from '../../constants/routes';
import { Link, withRouter } from 'react-router-dom';

const DashboardNav = props => {
    let accessCode = props.match.params.eventId;

    return (
        <ul>
            <li>
                <Link to={`${ROUTES.ADMIN}/${accessCode}/members/`}>Members</Link>
            </li>
            <li>
                <Link to={`${ROUTES.ADMIN}/${accessCode}/tasks/`}>Tasks</Link>
            </li>
        </ul>
    );
}

  export default withRouter(DashboardNav);