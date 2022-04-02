import React, { Component, Fragment } from "react";
import NumberFormat from "react-number-format";
import QuantityBar from "./QuantityBar";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { removeItem } from "./../actions/cartActions";
import { syncQuantity } from "./../actions/catalogActions";
import store from "./../store";
import {
	TO_STORE,
	TO_CHECKOUT_USER_DETAIL,
	TO_LOGIN,
	TO_CHECKOUT_PAYMENT,
	TO_CHECKOUT_SHIPPING,
	TO_CHECKOUT_CONFIRM,
	TO_CART,
	TO_PRODUCT,
	TO_CHECKOUT_BILLING_ADDRESS,
	TO_CHECKOUT_FREE_SHIPPING,
} from "../helpers/routesConstants";
import OrderSummary from "./order-summary";
import { checkCartForFreeShipping, doCartMath, doLineTotalMath, roundTo2Decimals } from "../helpers/utility";
import NavLink from "react-router-dom/NavLink";
import { IMAGE_BASE_URL, MAXIMUM_ORDER_TOTAL, MINIMUM_ORDER_TOTAL } from "../helpers/constants";
import ViewProductOptions from "./view-product-options";
import { PREPARE_ORDER } from "../helpers/actionConstants";
import Scroll from "react-scroll";
import { cartTotal, totalShipping, totalTax } from "../actions/globalActions";
const ProductChilds = ({ childs }) => (
	<Fragment>
		{childs.map((item) => (
			<tr className="child-row" key={item.ProductID}>
				<td>
					<Link
						target="_blank"
						to={TO_PRODUCT + item.ProductCode.toLowerCase()}>
						<img
							src={IMAGE_BASE_URL + item.ProductPhotoURL}
							alt={item.ProductName}
							className="img-fluid"></img>
					</Link>
				</td>
				<td>
					<Link
						target="_blank"
						to={TO_PRODUCT + item.ProductCode.toLowerCase()}>
						{item.ProductName}
					</Link>
				</td>
				<td>{item.Quantity}</td>
				<td>
					<NumberFormat
						isNumericString={true}
						decimalScale={2}
						value={item.ProductPrice}
						displayType={"text"}
						thousandSeparator={true}
						prefix={"$"}
					/>
				</td>
				<td>
					<NumberFormat
						isNumericString={true}
						decimalScale={2}
						value={(item.ProductPrice / 100) * item.Discount}
						displayType={"text"}
						thousandSeparator={true}
						prefix={"$"}
					/>
				</td>
				<td>
					<NumberFormat
						isNumericString={true}
						decimalScale={2}
						value={doLineTotalMath(item)}
						displayType={"text"}
						thousandSeparator={true}
						prefix={"$"}
					/>
				</td>
				<td></td>
			</tr>
		))}
	</Fragment>
);
const CartTemp = ({ cartItems, callbackHandler, thisObj }) => (
	<Fragment>
		{cartItems.length > 0 &&
			cartItems.map((item) => (
				<Fragment key={item.ProductID}>
					<tr>
						<td>
							<Link
								target="_blank"
								to={TO_PRODUCT + item.ProductCode.toLowerCase()}>
								<img
									src={IMAGE_BASE_URL + item.ProductPhotoURL}
									alt={item.ProductName}
									className="img-fluid"></img>
							</Link>
						</td>
						<td>
							<Link
								target="_blank"
								to={TO_PRODUCT + item.ProductCode.toLowerCase()}>
								{item.ProductName}
							</Link>
							{item.SelectedOptions &&
								Object.keys(item.SelectedOptions).length > 0 && (
									<ViewProductOptions
										code={item.ProductCode}
										options={item.SelectedOptions}
									/>
								)}
						</td>
						<td>
							{!thisObj.props.finalOrderView && (
								<QuantityBar callback={callbackHandler} product={item} />
							)}
							{thisObj.props.finalOrderView && <span>{item.Quantity}</span>}
							{/* <input type="number" onChange={this.handleQuantityChange} value={item.Quantity} className="form-control"></input> */}
						</td>
						<td>
							<NumberFormat
								isNumericString={true}
								decimalScale={2}
								value={roundTo2Decimals(item.ProductPrice)}
								displayType={"text"}
								thousandSeparator={true}
								prefix={"$"}
							/>
						</td>
						<td>
							<NumberFormat
								isNumericString={true}
								decimalScale={2}
								value={roundTo2Decimals((item.ProductPrice / 100) * item.Discount)}
								displayType={"text"}
								thousandSeparator={true}
								prefix={"$"}
							/>
						</td>
						<td>
							<NumberFormat
								isNumericString={true}
								decimalScale={2}
								value={doLineTotalMath(item)}
								displayType={"text"}
								thousandSeparator={true}
								prefix={"$"}
							/>
						</td>
						<td>
							{!thisObj.props.finalOrderView && (
								<a
									href="javascript:void(0)"
									onClick={() => {
										thisObj._removeProduct(item);
									}}>
									<i className="fa fa-trash-o"></i>
								</a>
							)}
						</td>
					</tr>
					<ProductChilds childs={item.Childs} />
				</Fragment>
			))}
	</Fragment>
);

class CartDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			productQuantity: [],
			cartItems: [],
			product: [],
			orderRes: {},
			notes: {},
			freeShipping:checkCartForFreeShipping()
		};
	}
	_removeProduct = (product) => {
		store.dispatch(removeItem(product));
		const syncCatalog = {
			ProductCode: product.ProductCode,
			Quantity: product.Quantity,
		};
		store.dispatch(syncQuantity(syncCatalog));
	};
	_quantityUpdate = (updatedQuantity) => {
		var product = this.state.product;
		product.Quantity = updatedQuantity;
		this.setState(
			{
				Quantity: updatedQuantity,
			},
			() => {
				doCartMath(
					this.state.cartItems,
					this.props.global.totalTax,
					this.props.global.totalShipping
				);
				// doCartMath(this.state.cartItems)
			}
		);
	};
	handleChange = (e) => {
		let notes = this.state.notes;
		notes[e.target.name] = e.target.value;
		this.setState({ notes });
	};
	notesSubmit = () => {
        let orderObj = this.props.orderToBePlace;
		if (
			this.state.notes.notes
		) {
			orderObj.Order_Comments ="<span>"+ this.replaceNewline(this.state.notes.notes) + " <hr> <br> </span><br>";
			store.dispatch({ type: PREPARE_ORDER, payload: orderObj });
		}
		else{
			orderObj.Order_Comments = "";
			store.dispatch({ type: PREPARE_ORDER, payload: orderObj });
		}
	};
	replaceNewline = (val) => {
		if (val !== '')
		{	
			return val.replace(/(?:\r\n|\r|\n)/g, '<br>');
		}
		
	}
	replaceHtmlTags = (val)=>{
		if (val !== '')
		{	
			return val.replace(/<br\s?\/?>/g,"\n").replace(/<span>/g, '').replace(/<\/span>/g,'').replace(/<hr>/g,'\n ---------------------------------------');
		}
	}
	componentDidMount() {
		Scroll.animateScroll.scrollToTop();
		let notes = this.state.notes;
		notes["notes"] = this.props.orderToBePlace.Order_Comments;
		this.setState(
			{ cartItems: this.props.cartItems ? this.props.cartItems : [],  notes},
			() => {
				doCartMath(
					this.state.cartItems,
					this.props.global.totalTax,
					this.props.global.totalShipping
				);
				// console.log(this.state.cartItems);
			}
		);
		
	}
	componentWillReceiveProps(props) {
		this.props = props;
		// console.log(this.props);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.cartItems.length !== this.props.cartItems.length) {
			this.setState({ cartItems: this.props.cartItems }, () => {
				// console.log(this.props.finalOrderView);

				doCartMath(
					this.state.cartItems,
					this.props.global.totalTax,
					this.props.global.totalShipping
				);
			});
		}
		if (
			this.props.orderPlaceError &&
			this.props.orderPlaceError.code !== prevProps.orderPlaceError.code
		) {
			let orderToBePlace = this.props.orderToBePlace;
			// this.setState({OrderID:this.props.orderPlaceError.result.result.orderId})
			this.setState({ orderRes: this.props.orderPlaceError });
			if (
				this.props.orderPlaceError.result &&
				this.props.orderPlaceError.result.result &&
				this.props.orderPlaceError.result.result.orderId
			) {
				orderToBePlace.OrderID = this.props.orderPlaceError.result.result.orderId;
				store.dispatch({ type: PREPARE_ORDER, payload: orderToBePlace });
			}
		}
	}
	render() {
		// console.log(this.props.global.cartSubTotal)
		let cartSubTotal = this.props.global.cartSubTotal;
		let total = roundTo2Decimals(parseFloat(cartSubTotal));
		// console.log(parseFloat(total) > 0);
		// console.log(parseFloat(total) < MINIMUM_ORDER_TOTAL);
		return (
			<div className="row bar">
				{/* <div className="col-lg-12">
                {this.state.cartItems.length > 0 && this.state.cartItems.map(item => (
                    <p className="text-muted lead">You currently have {item.Quantity} item(s) in your cart. {(this.props.finalOrderView && <span> To update your order, click <NavLink activeClassName='active' to={TO_CART}>View Cart </NavLink></span>)}</p>
                 ))} 
                </div> */}
				<div id="basket" className="col-lg-9">
					{this.props.finalOrderView && (
						<ul className="nav nav-pills nav-fill">
							<li className="nav-item">
								<NavLink
									to={TO_CHECKOUT_BILLING_ADDRESS}
									activeClassName="active"
									className="nav-link">
									{" "}
									<i className="fa fa-address-card"></i>
									<br></br>Billing Address
								</NavLink>
							</li>
							<li className="nav-item">
								<NavLink
									to={TO_CHECKOUT_USER_DETAIL}
									activeClassName="active"
									className="nav-link">
									{" "}
									<i className="fa fa-map-marker"></i>
									<br></br>Shipping Address
								</NavLink>
							</li>
							{!this.state.freeShipping && <li className="nav-item">
								<NavLink
									to={TO_CHECKOUT_SHIPPING}
									activeClassName="active"
									className="nav-link">
									<i className="fa fa-truck"></i>
									<br></br>Delivery Method
								</NavLink>
							</li>}
							<li className="nav-item">
								<NavLink
									to={TO_CHECKOUT_CONFIRM}
									activeClassName="active"
									className="nav-link">
									<i className="fa fa-eye"></i>
									<br></br>Order Review
								</NavLink>
							</li>
							<li className="nav-item">
								<NavLink
									to={TO_CHECKOUT_PAYMENT}
									activeClassName="active"
									className="nav-link">
									<i className="fa fa-money"></i>
									<br></br>Payment Method
								</NavLink>
							</li>
							{/* <li className="nav-item"><a href="javascript:void(0)" className="nav-link disabled"><i className="fa fa-eye"></i><br></br>Order Review</a></li> */}
						</ul>
					)}
					<div className="box mt-0 pb-0 no-horizontal-padding">
						<div className="table-responsive">
							<table className="table">
								<thead>
									<tr>
										<th colSpan="2">Product</th>
										<th>Quantity</th>
										<th>Unit price</th>
										<th>Discount</th>
										<th colSpan="2">Total</th>
									</tr>
								</thead>
								<tbody>
									<CartTemp
										cartItems={this.state.cartItems}
										callbackHandler={this._quantityUpdate}
										thisObj={this}
									/>
								</tbody>
								<tfoot>
									<tr>
										<th colSpan="5">Subtotal</th>
										<th colSpan="2">
											<NumberFormat
												isNumericString={true}
												decimalScale={2}
												value={roundTo2Decimals(parseFloat(cartSubTotal))}
												displayType={"text"}
												thousandSeparator={true}
												prefix={"$"}
											/>
										</th>
									</tr>
								</tfoot>
							</table>
							{window.location.pathname!=="/cart" && <form
								ref={(c) => {
									this.form = c;
								}}
								onSubmit={this.handleOnSubmit}>
								<label style={{ fontWeight: "bold" }} for="notes">
									Order Comments
								</label>
								<textarea
									className="form-control textarea input"
									name="notes"
									value={
										this.state.notes.notes &&
										this.replaceHtmlTags(this.state.notes.notes)
									}
									onChange={this.handleChange}
									id="exampleFormControlTextarea1"
									rows="3"></textarea>
							</form>}
							{this.props.containerRef.state.orderPlaced && (
								<div className="alert alert-success">
									<strong>Success!</strong>{" "}
									<span>Order has been placed successfully.</span>
								</div>
							)}
							{this.state.orderRes.code === 400 &&
								this.state.orderRes.result.payment && (
									<div className="alert alert-danger">
										<strong>Error!</strong>{" "}
										<span>
											{this.state.orderRes.result.payment.errorMessage}
										</span>
									</div>
								)}
							{this.state.orderRes.code === 400 &&
								this.state.orderRes.result.payment &&
								this.state.orderRes.result.payment.errorCode === "65" && (
									<div className="alert alert-danger">
										<strong>Error!</strong>{" "}
										<span>Invalid billing address or credit card details.</span>
									</div>
								)}
						</div>
					</div>
					{!this.props.finalOrderView && (
						<div className="box-footer d-flex justify-content-between align-items-center mb-1">
							<div className="left-col">
								<Link to={TO_STORE} className="btn btn-secondary mt-0">
									<i className="fa fa-chevron-left"></i> Continue shopping
								</Link>
							</div>
							<div className="right-col">
								{(this.state.cartItems.length > 0 &&
									this.props.isLoggedIn &&
									(this.props.global.cartAccess &&
									(parseFloat(total) < MAXIMUM_ORDER_TOTAL)||!this.state.freeShipping? (
										<Link
											to={TO_CHECKOUT_BILLING_ADDRESS}
											className="btn btn-template-outlined ">
											Proceed to checkout{" "}
											<i className="fa fa-chevron-right"></i>
										</Link>
									) : !this.state.freeShipping &&(
										<a
											href="javascript:void(0);"
											className="btn btn-template-outlined disabled">
											Proceed to checkout{" "}
											<i className="fa fa-chevron-right"></i>
										</a>
									)||
										<Link
											to={TO_CHECKOUT_BILLING_ADDRESS}
											className="btn btn-template-outlined">
											Proceed to checkout{" "}
											<i className="fa fa-chevron-right"></i>
										</Link>
									)) ||
									(!this.props.isLoggedIn &&  (
										<Link to={TO_LOGIN} className="btn btn-template-outlined">
											Login to Proceed to checkout{" "}
											<i className="fa fa-chevron-right"></i>
										</Link>
									))}
							</div>
						</div>
					)}
					
					{this.props.isLoggedIn &&
						parseFloat(total) > 0 &&
						parseFloat(total) > MAXIMUM_ORDER_TOTAL && (
							<div className="end">
								<div className="alert alert-info w-100 text-center">
								Your order amount is greater than ${MAXIMUM_ORDER_TOTAL}, please 
                                    call/contact us for additional directions.
								</div>
							</div>
						)}
					{this.props.finalOrderView && (
						<div className="row mgTp30">
							{!this.state.freeShipping && <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
								<Link
									to={TO_CHECKOUT_SHIPPING}
									className="btn btn-secondary mt-0">
									<i className="fa fa-chevron-left"></i> Back to delivery method
								</Link>
							</div>
							||
									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
										<Link
											to={TO_CHECKOUT_USER_DETAIL}
											className="btn btn-secondary mt-0">
											<i className="fa fa-chevron-left"></i> Back to shipping
											address
										</Link>
									</div>
							}
							{((parseFloat(total) > 0 && parseFloat(total) < MAXIMUM_ORDER_TOTAL ) || this.state.freeShipping) &&<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
								<Link
									to={TO_CHECKOUT_PAYMENT}
									onClick={this.notesSubmit}
									className="btn btn-template-main pull-right">
									{" "}
									Continue to payment method{" "}
									<i className="fa fa-chevron-right"></i>
								</Link>
							</div>}
						</div>
					)}
				</div>
				<div className="col-lg-3">
					<OrderSummary
						className="mt-0"
						showTaxAndShipping={this.props.finalOrderView}
					/>
				</div>
			</div>
		);
	}
}
const stateMapCartDetail = (state) => {
	return {
		orderToBePlace: state.order.orderToBePlace,
		orderProcess: state.order.orderProcess,
		isLoggedIn: state.global.isLoggedIn,
		orderPlaceError: state.global.orderPlaceError,
		cartItems: state.cart,
		global: state.global,
	};
};

export default connect(stateMapCartDetail)(CartDetail);
