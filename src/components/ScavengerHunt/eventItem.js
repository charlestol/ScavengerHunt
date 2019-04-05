import React from 'react';

import { AuthUserContext } from '../Session';

let EventItem = (props) => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        yes
      </div>
    )}
  </AuthUserContext.Consumer>
);

export default EventItem;