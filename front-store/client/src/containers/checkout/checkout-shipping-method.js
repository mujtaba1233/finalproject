import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import OrderSummary from "../../components/order-summary";
import { Link } from "react-router-dom";
import {
	TO_CHECKOUT_PAYMENT,
	TO_CHECKOUT_USER_DETAIL,
	TO_CHECKOUT_SHIPPING,
	TO_CHECKOUT_BILLING_ADDRESS,
	TO_CHECKOUT_CONFIRM,
} from "../../helpers/routesConstants";
import Form from "react-bootstrap/Form";
import NavLink from "react-router-dom/NavLink";
import { getTax, getShippings } from "../../actions/orderAction";
import store from "../../store";
import {
	totalShipping,
	cartTotal,
	totalTax,
} from "../../actions/globalActions";
import { PREPARE_ORDER, IN_PROCESS } from "../../helpers/actionConstants";
import Loader from "../../components/Loader";
import Scroll from "react-scroll";
import Button from "react-bootstrap/Button";

import { MyVerticallyCenteredModal } from "../../components/Modal";
import { roundTo2Decimals } from "../../helpers/utility";
const ShippingMethods = ({ thisobj, methods, onChangeHandler ,condition,myChangeHandler,valueOfFeild}) => (
	<Fragment>
				<div className="row">
		{methods &&
			methods.map((method) => (
					<div key={method.charges} className="col-sm-6">
						<div className="box shipping-method">
							<h4>{method.service}</h4>
							<p>
								{" "}
								<label
									className=" text-center"
									htmlFor={"delivery_" + method.id}>
									<input
										className="mr-2"
										onChange={onChangeHandler.bind(thisobj)}
										id={"delivery_" + method.id}
										type="radio"
										value={JSON.stringify(method)}
										name="delivery"></input>
									{method.currency} {method.charges}
								</label>{" "}
							</p>
						</div>
					</div>
			))}
			<div className="col-sm-6">
		<div className="box shipping-method">
			<h4>
			Use my Shipping Account
			</h4>

			<p>
				{" "}
				<label className=" text-center" htmlFor={"1000"}>
					<input
						className="mr-2"
						onChange={onChangeHandler.bind(thisobj)}
						id={"1000"}
						value={JSON.stringify({service:"Customer Carrier Account",type: "CCA", charges: 0, id: 1000 })}
						type="radio"
						name="delivery"
					/>
					{"USD 0"}
				</label>
			</p>
			
			{condition && <Form
				ref={(c) => {
					this.form = c;
				}}
				>
				<Form.Group controlId="formGroupPassword">
					
					<Form.Control
						value={valueOfFeild.Custom_Field_CarrierAcctNo && valueOfFeild.Custom_Field_CarrierAcctNo}
						onChange={myChangeHandler.bind(thisobj)}
						name="Custom_Field_CarrierAcctNo"
						type="text"
						placeholder="Carrier Acc # / Shipping Name"
					/>
					<Form.Label>only for pre approved customers</Form.Label>
				</Form.Group>
				
			</Form>}
		</div>
		</div>
		</div>

	</Fragment>
);

class CheckoutShippingContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Custom_Field_CarrierAcctNo:"",
			nextStepBtn: false,
			setModalShow: false,
			user: {},
		};
	}
	onRadioSelect = (e) => {
	};
	onShippingSelect(e) {
		let orderObj = this.props.orderToBePlace;

		if (e.currentTarget.id === "1000") {
			this.setState({
				setModalShow: true,
				nextStepBtn:this.state.user.Custom_Field_CarrierAcctNo ? true : false
			});
			
		}
		else{
		orderObj.Custom_Field_CarrierAcctNo = ''
		this.setState({
			setModalShow: false,
			nextStepBtn: true
		});
		}
		let shippingCost = parseFloat(JSON.parse(e.currentTarget.value).charges);
		store.dispatch(totalShipping(shippingCost));
		
		orderObj.ShippingMethodID = JSON.parse(e.currentTarget.value).id;
		orderObj.TotalShippingCost = JSON.parse(e.currentTarget.value).charges?JSON.parse(e.currentTarget.value).charges:0;
		orderObj.ShippingDetails = JSON.parse(e.currentTarget.value);
		// orderObj.TaxDetails = this.props.global.taxResponse;
		orderObj.PaymentAmount =
			parseFloat(this.props.global.cartSubTotal) +
			parseFloat(orderObj.TotalShippingCost) +
			parseFloat(this.props.global.totalTax);

		if(orderObj.PaymentAmount){
			store.dispatch({ type: PREPARE_ORDER, payload: orderObj });

		}
		else{
			orderObj.PaymentAmount = 0
		store.dispatch({ type: PREPARE_ORDER, payload: orderObj });

		}

	}
	componentDidMount() {
		Scroll.animateScroll.scrollToTop();
		//get tax and shipping methods
		store.dispatch(cartTotal(0));
		// store.dispatch(totalTax(0));
		store.dispatch(totalShipping(0));
		store.dispatch(getShippings(this.props.orderToBePlace));
		store.dispatch({ type: IN_PROCESS, payload: true });
		window.onbeforeunload = function () {
			return "are you sure?";
		};
	}
	myChangeHandler = (e) => {
		let user = this.state.user;
		user[e.target.name] = e.target.value;
		this.setState({ user });
		if(user[e.target.name]){
			this.setState({nextStepBtn: true})
			
		}
		else{
			this.setState({nextStepBtn: false})
		}
	};
	componentDidUpdate(prevProps) {
		if (
			prevProps.isLoggedIn !== this.props.isLoggedIn &&
			!this.props.isLoggedIn
		) {
			this.props.history.push(TO_CHECKOUT_BILLING_ADDRESS);
		}
		if (
			JSON.stringify(this.props.global.taxResponse) !== JSON.stringify(prevProps.global.taxResponse) ||
			this.props.global.totalShipping !== prevProps.global.totalShipping ||
			this.props.global.cartSubTotal !== prevProps.global.cartSubTotal ||
			this.props.global.cartSubTotal * this.props.global.taxRate !==
				prevProps.global.cartSubTotal * prevProps.global.taxRate
		) {
			let total = roundTo2Decimals(this.props.global.cartSubTotal + this.props.global.totalShipping);
			let totalTaxCal = roundTo2Decimals(this.props.global.cartSubTotal * this.props.global.taxRate / 100);
			total = roundTo2Decimals(total + totalTaxCal);
			store.dispatch(cartTotal(total));
			store.dispatch(totalTax(totalTaxCal));
		}
		if (!this.props.orderToBePlace.CustomerID) {
			let thisObj = this;
			setTimeout(() => {
				thisObj.props.history.push(TO_CHECKOUT_BILLING_ADDRESS);
			}, 0);
		}
	}
	handleOnSubmit = () => {
		let orderObj = this.props.orderToBePlace;
		if(this.state.setModalShow && this.state.user.Custom_Field_CarrierAcctNo !== ''){
			
			orderObj.Custom_Field_CarrierAcctNo = this.state.user.Custom_Field_CarrierAcctNo
			store.dispatch({ type: PREPARE_ORDER, payload: orderObj });
			this.setState({nextStepBtn: true})
		}
		else{
			this.setState({nextStepBtn: false})
			
		}
		
	};
	// componentWillUnmount() {
	//     store.dispatch(cartTotal(0));
	//     store.dispatch(totalTax(0));
	// }
	render() {
		return (
			<div id="content">
				<div className="container">
					
					<div className="row">
						<div id="checkout" className="col-lg-9">
							<div className="box">
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
									<li className="nav-item">
										<NavLink
											to={TO_CHECKOUT_SHIPPING}
											activeClassName="active"
											className="nav-link">
											<i className="fa fa-truck"></i>
											<br></br>Delivery Method
										</NavLink>
									</li>
									<li className="nav-item">
										<a href="javascript:void(0)" className="nav-link disabled">
											<i className="fa fa-eye"></i>
											<br></br>Order Review
										</a>
									</li>
									<li className="nav-item">
										<a href="javascript:void(0)" className="nav-link disabled">
											<i className="fa fa-money"></i>
											<br></br>Payment Method
										</a>
									</li>
								</ul>
								<div className="content">
										{this.props.global.inProcess && <Loader />}
										{!this.props.global.inProcess && (
											<ShippingMethods
												thisobj={this}
												onChangeHandler={this.onShippingSelect}
												methods={this.props.global.shippingMethods}
												condition={this.state.setModalShow}
												myChangeHandler={this.myChangeHandler}
												valueOfFeild = {this.state.user}
											/>
										)}
								</div>
								<div className="row mgTp30">
									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
										<Link
											to={TO_CHECKOUT_USER_DETAIL}
											className="btn btn-secondary mt-0">
											<i className="fa fa-chevron-left"></i> Back to shipping
											address
										</Link>
									</div>
									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
										{!this.state.nextStepBtn && (
											<button
												disabled={!this.state.nextStepBtn}
												className="btn btn-template-outlined pull-right">
												{" "}
												Choose shipping method{" "}
												<i className="fa fa-chevron-right"></i>
											</button>
										)}
										{this.state.nextStepBtn && (
											<Link
												onClick={this.handleOnSubmit}
												to={TO_CHECKOUT_CONFIRM}
												className="btn btn-template-outlined pull-right mgTp0">
												Continue to Review Order{" "}
												<i className="fa fa-chevron-right"></i>
											</Link>
										)}
									</div>
								</div>
							</div>
						</div>

						<div className="col-lg-3">
							<OrderSummary showTaxAndShipping={true} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const stateMap = (state) => {
	return {
		orderToBePlace: state.order.orderToBePlace,
		isLoggedIn: state.global.isLoggedIn,
		global: state.global,
	};
};

export default connect(stateMap)(CheckoutShippingContainer);
