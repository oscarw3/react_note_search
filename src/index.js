import React from 'react';
import ReactDOM from 'react-dom';
import { Amplify } from 'aws-amplify';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import config from './config';
import { initSentry } from './libs/errorLib';
import reportWebVitals from './reportWebVitals';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';

initSentry();

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID
  },
  API: {
    endpoints: [
      {
        name: "notes",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
    ]
  }
});

// see https://www.basefactor.com/react-how-to-display-a-loading-indicator-on-fetch-calls for example this is based on
const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress && 
    <div
    style={{
      width: "100%",
      height: "100",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}
    >
    <Loader type="ThreeDots" color="#114E83" height="100" width="100" />
    </div>
  );  
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
      <LoadingIndicator/>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
