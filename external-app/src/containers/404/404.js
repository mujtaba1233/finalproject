import React from "react";
import { Link } from "react-router-dom/";
import "./404.scss";
import { TO_HOME, TO_QUOTE_CREATE, TO_QUOTE_LIST } from "../../helpers/constants";



export default class Container404 extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="main-content container mt-5">
                <div className="h-90vh flex-column d-flex align-items-center justify-content-center">
                    <Link className="" to={"#"}>
                        <img className="mb-4" src={require("../../assets/images/logo.png")} alt="logo" />
                    </Link>
                    <h1 className="mb-4">404</h1>
                    <h4>Take me back to <Link to={TO_QUOTE_LIST}>Quote List</Link> or <Link to={TO_QUOTE_CREATE}>Quote Create</Link></h4>
                </div>
            </div>
        )
    }
}