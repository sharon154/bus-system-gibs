// import React, { Component } from 'react';

// export class Chat extends Component {
//   componentDidMount() {
//     // Check if the script is already present
//     if (!document.querySelector('script[src="https://widget.kommunicate.io/v2/kommunicate.app"]')) {
//       (function (d, m) {
//         var kommunicateSettings = {
//           "appId": "3d23033b1bd3f186cf50c2ce56b8566e3",
//           "popupWidget": true,
//           "automaticChatOpenOnNavigation": true,
//           "quickReplies": ["Speak with an Agent", "Book a Demo", "Sample Bots"]
//         };
//         var s = document.createElement("script"); 
//         s.type = "text/javascript"; 
//         s.async = true;
//         s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
//         var h = document.getElementsByTagName("head")[0]; 
//         h.appendChild(s);
//         window.kommunicate = m; 
//         m._globals = kommunicateSettings;
//       })(document, window.kommunicate || {});
//     }
//   }

//   render() {
//     return (
//       <div>
//         {/* Chat component rendering */}
//       </div>
//     );
//   }
// }

// export default Chat;
