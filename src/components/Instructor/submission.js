// import React, {Component} from 'react';
// import { withFirebase } from '../Firebase';
// import { withRouter } from 'react-router-dom';

// class Submission extends Component {
//     state = { type: '', image: '', text: '' }

//     componentDidMount() {
//         let ac = this.props.match.params.eventId;
//         let email = this.props.match.params.memberId;
//         let task = this.props.match.params.submission;
//         console.log(task)
    
//        this.props.firebase.scavgerHuntSubmission(ac, task.name, email).get()
//        .then(doc => {
//            const task = doc.data();
//             this.setState({
//                 type: task.
//             });
           
//         });
//     }
//       componentWillUnmount() {
//           this.unsubscribe();
//       }

//     render() {
//         const { type, image, text } = this.state;

//         return ( 
//             <div>
//                 {type==='image' && 
//                     <div>
//                         <img src={image} alt='submission' />
//                     </div>
//                 }
//                  {type==='text' && 
//                     <div>
//                         <p>{text}</p>
//                     </div>
//                 }
//             </div>
//         )
//     }
// }

// export default withRouter(withFirebase(Submission));