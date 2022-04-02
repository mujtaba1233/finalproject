import React from "react";
import "./logo.scss";
import { TO_DASHBOARD, TO_LOGIN } from "../../helpers/constants";
import { Link } from "react-router-dom";


export default class Logo extends React.Component {
    render() {
        return (
            <div className="justify-content-sm-center">
                <div className="container">
                    <div className="col-sm-6 col-md-4 mx-auto">
                        <div className="container-fluid login">
                            <Link to={TO_LOGIN}>
                                <img
                                    className="mb-4 mt-5"
                                    src={require("../../assets/images/logo.png")}
                                    alt="logo"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
