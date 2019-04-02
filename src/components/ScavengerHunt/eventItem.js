import React from 'react';

import { AuthUserContext } from '../Session';

let EventItem = (props) => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h2>{props.sh.name}</h2>
      </div>
    )}
  </AuthUserContext.Consumer>
);

export default EventItem;