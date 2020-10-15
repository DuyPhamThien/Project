import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Keycloak from 'keycloak-js';
var auth = () => {
    global.keycloak = new Keycloak({
        realm: "demo",
        url: "https://authen.ecolandvn.com/auth",
        clientId: 'base-auth',
    });

    return global.keycloak.init({ onLoad: 'check-sso' }).then(authenticated => {
        if (authenticated) {
            //  return  global.keycloak.loadUserInfo().then(userInfo => {
            global.keycloak.loadUserInfo().then(userInfo => {
                global.userInfo = userInfo;
                global.keycloak.updateToken(15);

                //return global.userInfo;
            });
        }
        else {
            global.keycloak.login();
        }
    })
}
auth().then((res) => {
    ReactDOM.render(<App />,
        document.getElementById('root')
    );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
