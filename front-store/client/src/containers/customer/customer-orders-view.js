import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import NumberFormat from "react-number-format";
import CustomerSectionTabs from "../../components/customer-section-tabs";
import { CUSTOMER_COOKIE, DATE_FORMAT, IMAGE_BASE_URL } from "../../helpers/constants";
import Link from "react-router-dom/Link";
import { TO_STORE, TO_LOGIN, TO_PRODUCT } from "../../helpers/routesConstants";
import store from "../../store";
import { getCookie } from "../../helpers/cookie-helper";
import { getOrder } from "../../actions/orderAction";
import { IN_PROCESS } from "../../helpers/actionConstants";
import ViewProductOptions from "../../components/view-product-options";
import { roundTo2Decimals } from "../../helpers/utility";
var dateFormat = require("dateformat");
const OrderRows = ({ orderDetails }) => (
	<Fragment>
		{(orderDetails &&
			orderDetails.length > 0 &&
			orderDetails.map((row) => (
				<tr key={row.OrderDetailID}>
					<td>
						<Link to={TO_PRODUCT + row.ProductCode}>
							<img
								src={IMAGE_BASE_URL + row.ProductPhotoURL}
								alt={row.ProductName}
								className="img-fluid"></img>
						</Link>
					</td>
					<td>
						<Link to={TO_PRODUCT + row.ProductCode}>{row.ProductName}</Link>
						{row.Options && Object.keys(JSON.parse(row.Options)).length > 0 && (
							<ViewProductOptions
								code={row.ProductCode}
								options={JSON.parse(row.Options)}
							/>
						)}
					</td>
					<td>{row.Quantity}</td>
					<td>
						{(row.ProductPrice !== null && (
							<NumberFormat
								isNumericString={true}
								decimalScale={2}
								value={row.ProductPrice}
								displayType={"text"}
								thousandSeparator={true}
								prefix={"$"}
							/>
						)) ||
							"N/A"}
					</td>
					<td>
						{(row.DiscountValue !== null && (
							<NumberFormat
								isNumericString={true}
								decimalScale={2}
								value={row.DiscountValue}
								displayType={"text"}
								thousandSeparator={true}
								prefix={"$"}
							/>
						)) ||
							"N/A"}
					</td>
					<td className="text-right">
						{(row.TotalPrice !== null && (
							<NumberFormat
								isNumericString={true}
								decimalScale={2}
								value={row.TotalPrice}
								displayType={"text"}
								thousandSeparator={true}
								prefix={"$"}
							/>
						)) ||
							"N/A"}
					</td>
				</tr>
			))) || (
				<tr>
					<th colSpan="6" className="text-center">
						{" "}
					No Product found in this order, go to <Link to={TO_STORE}>
							Store
					</Link>{" "}
					to place a new order
				</th>
				</tr>
			)}
	</Fragment>
);
class CustomerOrderContainer extends Component {
	componentWillMount() {
		// if ( parseInt(this.props.order.OrderID) !== parseInt(this.props.match.params.id)) {
		// }
		let customer = getCookie(CUSTOMER_COOKIE,true)
		store.dispatch({ type: IN_PROCESS, payload: true });
		store.dispatch(getOrder(this.props.match.params.id,customer.result.CustomerID));
	}
	componentDidUpdate(prevProps) {
		if (
			prevProps.isLoggedIn !== this.props.isLoggedIn &&
			!this.props.isLoggedIn
		) {
			this.props.history.push(TO_LOGIN);
		}
		if (JSON.stringify(prevProps.order) !== JSON.stringify(this.props.order)) {
			store.dispatch({ type: IN_PROCESS, payload: false });
		}
	}
	replaceHtmlTags = (val)=>{
		if (val !== '')
		{	
			return val.replace(/<br\s?\/?>/g,"\n").replace(/<span>/g, '').replace(/<\/span>/g,'').replace(/<hr>/g,'\n ---------------------------------------');
		}
	}
	render() {
		return (
			<div id="content">
				<div className="container">
					<div className="row bar mb-0">
						<div id="customer-order" className="col-md-9">
							{this.props.order &&( <p className="lead">
								Order #{this.props.order && this.props.order.OrderID} was placed on{" "}
								<strong>
									{this.props.order && (this.props.order.OrderDate !== null &&
										dateFormat(this.props.order.OrderDate, DATE_FORMAT)) ||
										"N/A"}
								</strong>{" "}
								and its current status is{" "}
								<strong>{this.props.order && this.props.order.OrderStatus}</strong>.
							</p>) || 
							<p><strong>Order not found</strong></p>
							}
							<p className="lead text-muted">
								If you have any questions, please feel free to{" "}
								<a href="mailto:icscontactus@intrepidcs.com">contact us</a>, our customer service
								center is working for you 24/7.
							</p>
							{!this.props.inProcess && this.props.orderError.status === false && (
								<div className="alert alert-danger">
									<strong>Whoops!</strong>{" "}
									<span> Something went wrong, try again.</span>
								</div>
							)}
							{this.props.order && this.props.order.OrderID && (
								<div className="">
									<div className="table-responsive">
										<table className="table">
											<thead>
												<tr>
													<th colSpan="2" className="border-top-0">
														Product
													</th>
													<th className="border-top-0">Quantity</th>
													<th className="border-top-0">Unit price</th>
													<th className="border-top-0">Discount</th>
													<th className="border-top-0 text-right">Total</th>
												</tr>
											</thead>
											<tbody>
												<OrderRows
													orderDetails={this.props.order && this.props.order.orderDetails}
												/>
											</tbody>
											<tfoot>
												<tr>
													<th colSpan="5" className="text-right">
														Subtotal
													</th>
													<th className="text-right">
														{(this.props.order
															.Affiliate_Commissionable_Value !== null && (
																<NumberFormat
																	isNumericString={true}
																	decimalScale={4}
																	value={
																		this.props.order
																			.Affiliate_Commissionable_Value
																	}
																	displayType={"text"}
																	thousandSeparator={true}
																	prefix={"$"}
																/>
															)) ||
															"N/A"}
													</th>
												</tr>
												<tr>
													<th colSpan="5" className="text-right">
														Shipping and handling
													</th>
													<th className="text-right">
														{(this.props.order.TotalShippingCost !== null && (
															<NumberFormat
																isNumericString={true}
																decimalScale={4}
																value={this.props.order && this.props.order.TotalShippingCost}
																displayType={"text"}
																thousandSeparator={true}
																prefix={"$"}
															/>
														)) ||
															"N/A"}
													</th>
												</tr>
												<tr>
													<th colSpan="5" className="text-right">
														Tax ({this.props.order && this.props.order.SalesTaxRate1}%)
													</th>
													<th className="text-right">
														{(this.props.order.SalesTax1 !== null && (
															<NumberFormat
																isNumericString={true}
																decimalScale={2}
																value={roundTo2Decimals(this.props.order.SalesTax1)}
																displayType={"text"}
																thousandSeparator={true}
																prefix={"$"}
															/>
														)) ||
															"N/A"}
													</th>
												</tr>
												<tr>
													<th colSpan="5" className="text-right">
														Total
													</th>
													<th className="text-right">
														{(this.props.order.PaymentAmount !== null && (
															<NumberFormat
																isNumericString={true}
																decimalScale={2}
																value={roundTo2Decimals(this.props.order.PaymentAmount)}
																displayType={"text"}
																thousandSeparator={true}
																prefix={"$"}
															/>
														)) ||
															"N/A"}
													</th>
												</tr>
											</tfoot>
										</table>
									</div>
									<div className="row addresses">
										<div className="col-md-6 text-right">
											<h3 className="text-uppercase">Invoice address</h3>
											<p>
												{this.props.order && this.props.order.BillingFirstName}{" "}
												{this.props.order && this.props.order.BillingLastName}
												<br />
												{this.props.order && this.props.order.BillingCompanyName}
												<br />
												{this.props.order && this.props.order.BillingAddress1}
												<br />
												{this.props.order && this.props.order.BillingAddress2}
												<br />
												{this.props.order && this.props.order.BillingCity},{" "}
												{this.props.order && this.props.order.BillingState}{" "}
												{this.props.order && this.props.order.BillingPostalCode}
												<br />
												{this.props.order && this.props.order.BillingCountry}
											</p>
										</div>
										<div className="col-md-6 text-right">
											<h3 className="text-uppercase">Shipping address</h3>
											<p>
												{this.props.order && this.props.order.ShipFirstName
													? this.props.order.ShipFirstName
													: this.props.order.BillingFirstName}{" "}
												{this.props.order && this.props.order.ShipLastName
													? this.props.order.ShipLastName
													: this.props.order.BillingLastName}
												<br />
												{this.props.order && this.props.order.ShipCompanyName
													? this.props.order.ShipCompanyName
													: this.props.order.BillingCompanyName}
												<br />
												{this.props.order && this.props.order.ShipAddress1}
												<br />
												{this.props.order && this.props.order.ShipAddress2}
												<br />
												{this.props.order && this.props.order.ShipCity},{" "}
												{this.props.order && this.props.order.ShipState}{" "}
												{this.props.order && this.props.order.ShipPostalCode}
												<br />
												{this.props.order && this.props.order.ShipCountry}
											</p>
										</div>
									</div>
									<div className="form-group">
										<label
											style={{ fontWeight: "bold" }}
											for="exampleFormControlTextarea1">
											Order Comments:
										</label>
										<textarea
											className="form-control textarea input"
											name="notes"
											value={this.props.order.Order_Comments && this.replaceHtmlTags(this.props.order.Order_Comments).replace(
												/(<([^>]+)>)/gi,
												"",
											).replace(/\&nbsp;/g, '')}
											disabled="disabled"
											id="exampleFormControlTextarea1"
											rows="3">
										</textarea>
										{/* <div className="p-3" style={{ fontWeight: "bold",fontSize:'px',backgroundColor:'#d3d3d3',minHeight:'50px' }}>
											<p>{this.props.order.Order_Comments && this.props.order.Order_Comments.replace(
												/(<([^>]+)>)/gi,
												"",
											).replace(/\&nbsp;/g, '')}</p>

										</div> */}
										{/* <textarea
											className="form-control"
											id="exampleFormControlTextarea1"
											rows="3">
											{this.props.order.Order_Comments ? this.props.order.Order_Comments.replace(
												/(<([^>]+)>)/gi,
												"",
											).replace(/\&nbsp;/g, '') : ''}
										</textarea> */}
									</div>
								</div>
							)}
						</div>
						<div className="col-md-3 mt-4 mt-md-0">
							<CustomerSectionTabs history={this.props.history} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const stateMap = (state) => {
	return {
		order: state.order.order,
		inProcess: state.global.inProcess,
		orderError: state.global.orderError,
		isLoggedIn: state.global.isLoggedIn,
	};
};

export default connect(stateMap)(CustomerOrderContainer);
