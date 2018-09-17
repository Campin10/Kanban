// @flow

import { connect } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import FacebookLogin from 'react-facebook-login';

const responseFacebook = (response) => {
    console.log(response);
  }


//   ReactDOM.render(
//     <FacebookLogin
//       appId="371826310023952"
//       autoLoad={true}
//       fields="name,email,picture"
//       callback={responseFacebook} />,
//     document.getElementById('App')
//   );


