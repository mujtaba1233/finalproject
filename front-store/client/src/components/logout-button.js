import React, { Component } from 'react';
import { TO_LOGOUT } from '../helpers/routesConstants';
import NavLink from 'react-router-dom/NavLink';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

export default class LogoutButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(event) {
        event.preventDefault();
        var thisObj = this;
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 id="login-modalLabel" className="modal-title"> Confirmation</h4>
                            {/* <button type="button" data-dismiss="modal" aria-label="Close" className="close"><span aria-hidden="true">×</span></button> */}
                        </div>
                        <div className="modal-body">
                            <p>You want to logout?</p>
                            <button className="btn btn-template-outlined" onClick={onClose}>No, Keep me logged in</button> &nbsp;
                            <button className="btn btn-template-outlined" onClick={() => {thisObj.props.history.push(TO_LOGOUT);onClose()}}>Yes, Log me out</button>
                        </div>
                    </div>
                )
            }
        })
        // confirmAlert({
        //     title: 'Confirm to Logout',
        //     message: 'Are you sure to do this.',
        //     buttons: [
        //         {
        //             label: 'Yes, log me out',
        //             onClick: () => thisObj.props.history.push(TO_LOGOUT)
        //         },
        //         {
        //             label: 'No, keep me logged in',
        //             // onClick: () => alert('Click No')
        //         }
        //     ]
        // })
    }

    render() {

        return (
            // from customer section
            <NavLink title="Sign Out" activeClassName='active' to={TO_LOGOUT} onClick={this.handleClick.bind(this)} className={this.props.class}><i className="fa fa-sign-out"></i> {this.props.text}</NavLink>
            // from header
            // <Link title="Sign Out" to={TO_LOGOUT} className="signup-btn"><span className="d-none d-md-inline-block"><i className="fa fa-power-off"></i> </span></Link>
        )
    }
}
