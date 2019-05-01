import React from 'react'
import * as ROUTES from '../../constants/routes';
import { Link, withRouter } from 'react-router-dom';

const DashboardNav = props => {
    let accessCode = props.match.params.eventId;

    return (
        <div>
            <div>
                <Link to={`${ROUTES.ADMIN}/${accessCode}/members/`} className="text-danger">Members</Link>
            </div>
            <div>
                <Link to={`${ROUTES.ADMIN}/${accessCode}/tasks/`} className="text-danger">Tasks</Link>
            </div>
        </div>
    );
}

  export default withRouter(DashboardNav);