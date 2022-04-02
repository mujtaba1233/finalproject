import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Routes from "./routes/Routes";
import store from './store';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Notifications from 'react-notify-toast';
import { getToken, getUser } from "./helpers/utility";
import { IS_LOGIN, LOGIN_RES, ORIGIN } from "./helpers/constants";
import { connect } from 'react-redux';
import { BASE_URL } from "./api/constants";

//basic compnent of which holds all routes
class App extends Component {
    componentDidMount() {
        this.checkuserType()
        if (getToken()) {
            store.dispatch({ type: IS_LOGIN, payload: true });
            store.dispatch({ type: LOGIN_RES, payload: getUser() || {} });
            // store.dispatch(GetProfileAction());
            // window.location = BASE_URL + '/login'
        }
    }
    componentDidUpdate() {
        this.checkuserType()
    }
    checkuserType(){
        if (getUser() && getUser().usertype !== 'external') {
            var next = window.location.href.split('login?')
            if (next.length == 2 && next[1].indexOf('next') > -1) {
                next = next[1].split('next=')[1]
                window.location = next;
            } else {
                window.location = '/order-search';
            }
        }
    }
    componentWillUnmount() {
        // this.socket.disconnect()
    }
    render() {
        return (
            <div id="all" history={this.props.history}>
                <Notifications options={{ zIndex: 9999999, top: '0px' }} />
                <Routes socket={this.socket} />
            </div>
        );
    }
}
const stateMap = (state) => {
    return {
        user: state.user.user,
    };
};
export default connect(stateMap)(withRouter(App));