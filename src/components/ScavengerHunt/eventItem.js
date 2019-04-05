import React from 'react';

let EventItem = props => {
  const sh = props.location.state.sh;

  return (
    <div>
      {sh.name}
      <br />
      {sh.accessCode}
      <br />
      {sh.description}
    </div>
  )
}
export default EventItem;