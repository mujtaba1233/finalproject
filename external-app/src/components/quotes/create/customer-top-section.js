import React from "react";
import { email, required } from "../../../helpers/form-validation";
import { Row, Col } from "react-bootstrap";
import Input from "react-validation/build/input";
import "./quote-form.scss";
export const CustomerTopSection = ({ quote, handleChange }) => {
    return (
        <Row>
            <Col lg="6" className="mb-3">
                <Input
                    validations={[required]}
                    className="input form-control custom-input"
                    type="text"
                    value={quote.CustomerFName}
                    name="CustomerFName"
                    onChange={handleChange}
                    placeholder="First Name"
                />
            </Col>
            <Col lg="6" className="mb-3">
                <Input
                    validations={[required]}
                    className="input form-control custom-input"
                    type="text"
                    value={quote.CustomerLName}
                    name="CustomerLName"
                    onChange={handleChange}
                    placeholder="Last Name"
                />
            </Col>
            <Col lg="12" className="mb-4">
                <Input
                    validations={[required, email]}
                    className="input form-control custom-input"
                    type="text"
                    value={quote.CustomerEmail}
                    name="CustomerEmail"
                    onChange={handleChange}
                    placeholder="Email Address"
                />
            </Col>
        </Row>
    )
}