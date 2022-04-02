import React from "react";
import { required } from "../../../helpers/form-validation";
import { Row, Col, FormControl } from "react-bootstrap";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import "./quote-form.scss";
export const CustomerAddressSection = ({ quote, handleChange, sameAsShipping, countries, sameAsBilling }) => {
    return (
        <Row>
            <Col lg="6" className="mb-2">
                <Row>
                    <Col lg="12" className="mb-2">
                        <h6>Billing Address</h6>
                        <label htmlFor="sameAsShipping">
                            {" "}
                            <input
                                onChange={sameAsShipping}
                                id="sameAsShipping"
                                name="sameAsShipping"
                                type="checkbox"></input>{" "}
                            Same as shipping{" "}
                        </label>
                    </Col>

                    <Col lg="12" className="mb-3">
                        <Input
                            validations={[required]}
                            className="input form-control custom-input"
                            type="text"
                            value={quote.BillingStreetAddress1}
                            name="BillingStreetAddress1"
                            onChange={handleChange}
                            placeholder="Address 1"
                        />
                    </Col>
                    <Col lg="12" className="mb-3">
                        <Input
                            validations={[]}
                            className="input form-control custom-input"
                            type="text"
                            value={quote.BillingStreetAddress2}
                            name="BillingStreetAddress2"
                            onChange={handleChange}
                            placeholder="Address 2"
                        />
                    </Col>
                    <Col lg="12" className="mb-3">
                        <Input
                            validations={[required]}
                            className="input form-control custom-input"
                            type="text"
                            value={quote.BillingCompany}
                            name="BillingCompany"
                            onChange={handleChange}
                            placeholder="Company"
                        />
                    </Col>
                    <Col lg="12" className="mb-3">
                        <Input
                            validations={[required]}
                            className="input form-control custom-input"
                            type="text"
                            value={quote.BillingCity1}
                            name="BillingCity1"
                            onChange={handleChange}
                            placeholder="City"
                        />
                    </Col>
                    <Col lg="12" className="mb-3">
                        <Input
                            validations={[required]}
                            className="input form-control custom-input"
                            type="text"
                            value={quote.BillingState}
                            name="BillingState"
                            onChange={handleChange}
                            placeholder="State/Province"
                        />
                    </Col>
                    <Col lg="12" className="mb-3">
                        <Input
                            validations={[required]}
                            className="input form-control custom-input"
                            type="text"
                            value={quote.BillingPostalCode}
                            name="BillingPostalCode"
                            onChange={handleChange}
                            placeholder="Postal Code"
                        />
                    </Col>

                    <Col lg="12" className="mb-3">
                        <Select
                            name="BillingCountry1"
                            validations={[required]}
                            onChange={handleChange}
                            value={quote.BillingCountry1}
                            id="BillingCountry1"
                            placeholder="Country"
                            className="form-control">
                            <option value="">-- Select Country --</option>
                            {countries &&
                                countries.map((country) => {
                                    return (
                                        <option key={country.code} value={country.code}>
                                            {country.name}
                                        </option>
                                    );
                                })}
                        </Select>
                    </Col>

                    <Col lg="12" className="mb-3">
                        <Input
                            validations={[required]}
                            className="input form-control custom-input"
                            type="text"
                            value={quote.BillingPhoneNumber}
                            name="BillingPhoneNumber"
                            onChange={handleChange}
                            placeholder="Phone Number"
                        />
                    </Col>
                </Row>
            </Col>
            <Col lg="6" className="mb-2">
                <Row>
                    <Col lg="12" className="mb-2">
                        <h6>Shipping Address</h6>
                        <label htmlFor="sameAsBilling">
                            {" "}
                            <input
                                onChange={sameAsBilling}
                                name="sameAsBilling"
                                id="sameAsBilling"
                                value={sameAsBilling}
                                type="checkbox"></input>{" "}
                            Same as billing{" "}
                        </label>
                    </Col>
                    <Col lg="12" className="mb-3">
                        <Input
                            validations={[required]}
                            className="input form-control custom-input"
                            type="text"
                            value={quote.ShippingAddress1}
                            name="ShippingAddress1"
                            onChange={handleChange}
                            placeholder="Address 1"
                        />
                    </Col>
                    <Col lg="12" className="mb-3">
                        <Input
                            validations={[]}
                            className="input form-control custom-input"
                            type="text"
                            value={quote.ShippingAddress2}
                            name="ShippingAddress2"
                            onChange={handleChange}
                            placeholder="Address 2"
                        />
                    </Col>
                    <Col lg="12" className="mb-3">
                        <Input
                            validations={[required]}
                            className="input form-control custom-input"
                            type="text"
                            value={quote.ShippingCompany}
                            name="ShippingCompany"
                            onChange={handleChange}
                            placeholder="Company"
                        />
                    </Col>
                    <Col lg="12" className="mb-3">
                        <Input
                            validations={[required]}
                            className="input form-control custom-input"
                            type="text"
                            value={quote.ShippingCity}
                            name="ShippingCity"
                            onChange={handleChange}
                            placeholder="City"
                        />
                    </Col>
                    <Col lg="12" className="mb-3">
                        <Input
                            validations={[required]}
                            className="input form-control custom-input"
                            type="text"
                            value={quote.ShippingState}
                            name="ShippingState"
                            onChange={handleChange}
                            placeholder="State/Province"
                        />
                    </Col>
                    <Col lg="12" className="mb-3">
                        <Input
                            validations={[required]}
                            className="input form-control custom-input"
                            type="text"
                            value={quote.ShippingPostalCode}
                            name="ShippingPostalCode"
                            onChange={handleChange}
                            placeholder="Postal Code"
                        />
                    </Col>
                    <Col lg="12" className="mb-3">
                        <Select
                            name="ShippingCountry"
                            onChange={handleChange}
                            validations={[required]}
                            value={quote.ShippingCountry}
                            id="ShippingCountry"
                            placeholder="Country"
                            className="form-control">
                            <option value="">-- Select Country --</option>
                            {countries &&
                                countries.map((country) => {
                                    return (
                                        <option key={country.code} value={country.code}>
                                            {country.name}
                                        </option>
                                    );
                                })}
                        </Select>
                    </Col>
                    <Col lg="12" className="mb-3">
                        <Input
                            validations={[required]}
                            className="input form-control custom-input"
                            type="text"
                            value={quote.ShippingPhoneNumber}
                            name="ShippingPhoneNumber"
                            onChange={handleChange}
                            placeholder="Phone Number"
                        />
                    </Col>
                </Row>
            </Col>
            <Col lg="12" className="mb-2">
                <label htmlFor="notes">
                    Notes:
                </label>
                <FormControl
                    as="textarea"
                    className="form-control text-small"
                    name="notes"
                    rows={7}
                    style={{ fontSize: " 1rem" }}
                    cols={50}
                    onChange={handleChange}
                    value={
                        quote.notes &&
                        quote.notes.replace(/(<([^>]+)>)/gi, "")
                    }></FormControl>
            </Col>
        </Row>

    )
}