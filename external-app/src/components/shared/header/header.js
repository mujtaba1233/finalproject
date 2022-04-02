import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { TO_QUOTE_CREATE, TO_QUOTE_LIST } from "../../../helpers/constants";
import { getUser, logout } from "../../../helpers/utility";

class Header extends React.Component {
    constructor(props) {
        super(props);
        // this.handleChange = this.handleChange.bind(this);
    }
    render() {
        return (
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href="#">
                    <img
                        src={require("../../../assets/images/logo.png")}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Link className="nav-link" to={TO_QUOTE_LIST}>Search Quote</Link>
                        <Link className="nav-link" to={TO_QUOTE_CREATE}>Create Quote</Link>
                    </Nav>
                    <Nav>
                        <Nav.Link eventKey={2} href="#"> {getUser() ? `${getUser().lastname}, ${getUser().firstname}` : 'N/A'}</Nav.Link>
                        <Nav.Link href="#" onClick={logout}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}
export default Header