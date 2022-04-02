import React from "react";
// import { LoginAction } from "../../actions/user/login";
import store from "../../../store";
import { connect } from "react-redux";
import { IN_PROCESS, QUOTE, TO_QUOTE_CREATE, TO_QUOTE_LIST } from "../../../helpers/constants";
import Link from "react-router-dom/Link";
// import { MDBSelect } from "mdbreact";
import { email, gt0, numbers, required } from "../../../helpers/form-validation";
import { Button, Row, Col, Table, FormControl, FormLabel } from "react-bootstrap";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import "./quote-form.scss";
import Select2 from 'react-select'
import Select, { select } from "react-validation/build/select";
import {
	GetCountries,
	GetProducts,
	GetQuote,
	SaveExternalQuote,
} from "../../../actions/quote/quote-actions";
import { getUser, parseFreeAccessoriesForView } from "../../../helpers/utility";
import { BASE_URL } from "../../../api/constants";
import customerTopSection, { CustomerTopSection } from "./customer-top-section";
import { E2BIG } from "constants";
// import { timeStamp } from "console";
class QuoteForm extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleOnSubmit = this.handleOnSubmit.bind(this);
		this.sameAsBilling = this.sameAsBilling.bind(this);
		this.sameAsShipping = this.sameAsShipping.bind(this);
		this.body = this.body.bind(this);		
		this.state = {
			quote: {
				notes: ''
			},
			options: [],
			selectedProducts: [],
			redirect: "",
			total: 0,
			sameAsBilling: false,
			selectValue: [],
			type: "",
			popupFlag: false,
			href:""

		};
		// this.emptyProduct = {};
	}
	handleChange(e, index, childIndex) {
		let selectedProducts = this.state.selectedProducts;
		// console.log(index,this.state.selectedProducts);
		let quote = this.state.quote;
		// if (e.target.name === "productList") {
		// 	let productCode = e.target.value;
		// 	let product = this.props.products.find(
		// 		({ ProductCode }) => ProductCode === productCode
		// 	);
		// 	let productChilds = parseFreeAccessoriesForView(
		// 		product,
		// 		this.props.products
		// 	);
		// 	if (productChilds.length > 0) {
		// 		productChilds.forEach((elem) => {
		// 			// elem.ProductPrice = 0
		// 			elem.Price = 0;
		// 			elem.isChild = 1;
		// 			elem.parent = productCode;
		// 			product.ProductDescriptionShort = product.ProductDescriptionShort ? product.ProductDescriptionShort.replace(/style="[^"]*"/g, "") : '';
		// 		});
		// 	}
		// 	product.Childs = productChilds || [];
		// 	product.Qty = 1;
		// 	product.parentName = product.ProductCode;
		// 	product.isChild = 0;
		// 	product.Price = product.ProductPrice;
		// 	product.description = product.ProductDescriptionShort ? product.ProductDescriptionShort.replace(/style="[^"]*"/g, "") : '';
		// 	selectedProducts[index] = product;
		// 	this.setState({ selectedProducts });
		// 	this.updateTotal();
		// } else 
		if (e.target.name === "Qty") {
			selectedProducts[index].Qty = e.target.value;

			this.setState({ selectedProducts });
			this.updateTotal();
		} else if (e.target.name === "Price") {
			// if (!this.props.quote.lineItems) {
			// 	selectedProducts[index].Price = e.target.value ? e.target.value : 1;
			// } else {
			selectedProducts[index].Price = e.target.value
			// }
			this.setState({ selectedProducts });
			this.updateTotal();
		} else if (e.target.name === "productDescription") {
			selectedProducts[index].description = e.target.value
			this.setState({ selectedProducts });
		} else if (e.target.name === "productDescriptionChild") {
			selectedProducts[index].Childs[childIndex].ProductDescriptionShort = e.target.value
			this.setState({ selectedProducts });
		} 
		else {
			quote[e.target.name] = e.target.value;
		}
		// quote.lineItems = selectedProducts;
		this.setState({ quote });
		this.updateTotal();
	}
	handleSelectChange = (selectValue, index) => {
		// console.log(selectValue, index)
		let productChilds = []
		let selectedProducts = this.state.selectedProducts;
		let selectValueArray = this.state.selectValue
		let productCode = selectValue.label;
		let product = this.props.products.find(
			({ ProductCode }) => ProductCode === productCode
		);
		product = JSON.parse(JSON.stringify(product))
		if(product)
		productChilds = parseFreeAccessoriesForView(
			product,
			this.props.products
		);
		if (productChilds.length > 0) {
			productChilds.forEach((elem) => {
				elem.Price = 0;
				elem.isChild = 1;
				elem.parent = productCode;
				// elem.ProductPrice = 0
				product.ProductDescriptionShort = product.ProductDescriptionShort ? product.ProductDescriptionShort.replace(/style="[^"]*"/g, "") : '';
			});
		}
		product.Childs = productChilds || [];
		product.Qty = 1;
		product.parentName = product.ProductCode;
		product.isChild = 0;
		product.Price = product.ProductPrice;
		product.description = product.ProductDescriptionShort ? product.ProductDescriptionShort.replace(/style="[^"]*"/g, "") : '';
		selectedProducts[index] = product;
		selectValueArray[index] = selectValue
		this.setState({ selectedProducts, selectValue: selectValueArray });
		this.updateTotal();
	}

	handleOnSubmit(e,flag) {
		e.preventDefault();
		this.form.validateAll();
		if (this.form.getChildContext()._errors.length === 0) {
			var lineItems = [];
			let validPrice = true;
			for (var i = 0; i < this.state.selectedProducts.length; i++) {
				if (this.state.selectedProducts[i].ProductName != undefined)
					lineItems.push({
						Qty: this.state.selectedProducts[i].Qty,
						ProductName: this.state.selectedProducts[i].ProductName.replace(
							/'/g,
							"\\'"
						).replace(/"/g, '\\"'),
						description: this.state.selectedProducts[i].description
							.replace(/'/g, "\\'")
							.replace(/"/g, '\\"'),
						ProductCode: this.state.selectedProducts[i].ProductCode,
						isChild: this.state.selectedProducts[i].isChild,
						Price: this.state.selectedProducts[i].isChild ? 0 : parseFloat(this.state.selectedProducts[i].Price),
						Discount: 0,
						isTaxable: 1,
						parent: this.state.selectedProducts[i].parent
							? this.state.selectedProducts[i].parent
							: "",
						parentName: this.state.selectedProducts[i].parentName
							? this.state.selectedProducts[i].parentName
							: "",
					});
				if (
					this.state.selectedProducts[i].Childs &&
					this.state.selectedProducts[i].Childs.length
				)
					this.state.selectedProducts[i].Childs.forEach((child) => {
						if (this.state.quote.QuoteNo) {
							child.QuoteNo = this.state.quote.QuoteNo;
						}
						lineItems.push({
							Qty: parseInt(child.Qty) * this.state.selectedProducts[i].Qty,
							ProductName: child.ProductName.replace(/'/g, "\\'").replace(
								/"/g,
								'\\"'
							),
							description: child.ProductDescriptionShort.replace(
								/'/g,
								"\\'"
							).replace(/"/g, '\\"'),
							ProductCode: child.ProductCode,
							isChild: child.isChild,
							Price: child.isChild ? 0 : parseFloat(child.ProductPrice),
							Discount: 0,
							isTaxable: child.isChild ? 0 : 1,
							parent: child.parent ? child.parent : "",
							parentName: child.parentName ? child.parentName : "",
							QuoteNo: child.QuoteNo
						});
					});
			}

			this.setState(
				{
					quote: {
						...this.state.quote,
						lineItems,
						createdBy: getUser().id,
						modBy: null,
						notes: this.state.quote.notes ? "<span>" + this.replaceNewline(this.state.quote.notes) + "</span>" : '',
						PrivateNotes: "",
						shippingMethodId: 0,
						Freight: 0,
						TaxShipping: 0,
						InsuranceValue: 0,
						SelectedCustomerDiscount: false,
						IssueDate: null,
						isApproved: 0,
						modifiedOn: null,
						IsCustomerEmailShow: 1,
						IsCustomerNameShow: 1,
						isSendEmail:flag==='email'?flag==='email':false
					},
				},
				() => {
					store.dispatch(SaveExternalQuote(this.state.quote)); 	//set in session storage
					// if(flag==='email'){
					// 	this.setState({popupFlag:true})
					// 	if(this.props.match.params.QuoteId)
					// 	this.setState({href:'mailto:?subject='+this.props.match.params.QuoteId+ "/" +this.state.quote.ShippingCompany +'&body='+this.body(this.props.match.params.QuoteId)},()=> {
					// 		if(this.state.popupFlag){
					// 			window.open(this.state.href)
					// 			console.log(this.props.match.params.QuoteId)
					// 		}
					// 	})

					// }else{
					// 	this.setState({popupFlag:false})

					// }
				}
			);
		}
	}
	handleAddRowClick = (e) => {
		this.setState(
			{
				selectedProducts: [...this.state.selectedProducts, this.emptyProduct()],
			},
			() => this.updateTotal()
		);
	};
	replaceNewline = (val) => {
		if (val !== '') {
			return val.replace(/(?:\r\n|\r|\n)/g, '<br>');
		}

	}
	handlerRemoveRowClick = (e, index) => {
		this.setState(
			{
				selectedProducts: [
					...this.state.selectedProducts.slice(0, index),
					...this.state.selectedProducts.slice(index + 1),
				],
			},
			() => this.updateTotal()
		);
	};
	sameAsShipping(e) {
		if (e.target.checked === true) {
			let quote = this.state.quote;
			this.setState({ sameAsBilling: !this.state.sameAsBilling }, () => {
				this.setState({
					quote: {
						...quote,
						...{
							BillingStreetAddress1: quote.ShippingAddress1,
							BillingStreetAddress2: quote.ShippingAddress2,
							BillingCompany: quote.ShippingCompany,
							BillingCity1: quote.ShippingCity,
							BillingCountry1: quote.ShippingCountry,
							BillingPostalCode: quote.ShippingPostalCode,
							BillingState: quote.ShippingState,
							BillingPhoneNumber: quote.ShippingPhoneNumber,
						},
					},
				});
			});
		}
	}
	sameAsBilling(e) {
		if (e.target.checked === true) {
			let quote = this.state.quote;
			this.setState({ sameAsBilling: !this.state.sameAsBilling }, () => {
				this.setState({
					quote: {
						...quote,
						...{
							ShippingAddress1: quote.BillingStreetAddress1,
							ShippingAddress2: quote.BillingStreetAddress2,
							ShippingCompany: quote.BillingCompany,
							ShippingCity: quote.BillingCity1,
							ShippingCountry: quote.BillingCountry1,
							ShippingPostalCode: quote.BillingPostalCode,
							ShippingState: quote.BillingState,
							ShippingPhoneNumber: quote.BillingPhoneNumber,
						},
					},
				});
			});
		}
	}
	emptyProduct = () => {
		return {
			ProductCode: "",
			Qty: 1,
			Price: 0,
			ProductDescriptionShort: "",
			Childs: [],
		};
		// return this
	};
	updateTotal = () => {
		this.setState({
			total: this.state.selectedProducts.reduce(function (a, b) {
				return a + b["Price"] * b["Qty"];
			}, 0),
		});

	};

	resetForm = () => {
		window.location = BASE_URL + TO_QUOTE_CREATE
	}
	componentDidUpdate(prevProps) {
		if (prevProps.products !== this.props.products) {
			let options = this.state.options;
			let ProductCode = ''
			this.props.products.map((product, index) => {
				ProductCode = product.ProductCode
				options.push({ value: ProductCode, index: index })
			})
			this.setState({
				options: options
			})
			this.updateTotal()
			
		}
		if ((JSON.stringify(prevProps.quote) !== JSON.stringify(this.props.quote) || prevProps.products !== this.props.products)) {
			let quote = this.state.quote;
			if (this.props.match.params.QuoteId) {

				if (this.props.quote.lineItems) {
					let selectValueArray = this.state.selectValue
					let selectedProducts = this.props.quote.lineItems.filter(
						(elem) => !elem.isChild
					);
					console.log(selectedProducts)
					selectedProducts.forEach((main) => {
						if (this.props.products)
							if (this.props.products.length > 0) {
								let productChilds = []
								selectValueArray.push({ label: main.parentName, value: main })
								console.log(selectValueArray)
								let product = this.props.products.find(
									({ ProductCode }) => ProductCode === main.parentName
								);
								if(product)
								productChilds = parseFreeAccessoriesForView(
									product,
									this.props.products
								);
								if (productChilds.length > 0) {
									productChilds.forEach((elem) => {
										// elem.ProductPrice = 0
										elem.isChild = 1;
										elem.Price = 0;
										elem.parent = main.ProductCode;
									});
								}
								main.Childs = productChilds || [];
							}
						// main.Childs = this.props.quote.lineItems.filter(elem => main.parentName === elem.parent)
					});
					// quote.lineItems = selectedProducts;
					this.setState({ selectedProducts, quote: this.props.quote, type: "Update", selectValue: selectValueArray }, () =>
						console.log("selectedProducts", selectedProducts)
					);

				}
			}
			else {
				this.setState({ type: "Submit" })
			}
			this.updateTotal()
		}
		if (this.props.quotes) {
			if (!this.props.match.params.QuoteId && prevProps.quotes !== this.props.quotes) {
				window.location = BASE_URL + TO_QUOTE_LIST
				// this.setState({href:'mailto:?subject='+this.props.quotes.quoteNo + "/" +this.state.quote.ShippingCompany +'&body='+this.body(this.props.quotes.quoteNo)},()=> {
					// if(this.state.popupFlag){
						// window.open(this.state.href)
						// window.location = BASE_URL + TO_QUOTE_LIST
					// }
					// else{
					// 	window.location = BASE_URL + TO_QUOTE_LIST
					// }
				// })
			this.updateTotal()

				
		 	}
	   }
	}
	componentDidMount() {
		var type;
		if (this.props.match.params.QuoteId) {
			store.dispatch(GetQuote(this.props.match.params.QuoteId));

			type = "Update"
		}
		else {
			type = "Submit"
		}
		store.dispatch(GetCountries());
		store.dispatch(GetProducts());

		this.setState(
			{
				selectedProducts: [...this.state.selectedProducts, this.emptyProduct()],
				type: type
			},
			() => this.updateTotal()
		);
	}
	componentWillUnmount() {
		store.dispatch({
			type: QUOTE,
			payload: {}
		});
	}
	  
	orderItemDetails = (selectedProducts) => {
		
		let list = ""
		selectedProducts.map((obj,index) => {
           list += `<tr>
			<td valign="top">${obj.ProductCode}  </td>
			<td valign="top">${obj.ProductName}  </td> 
			<td valign="top">${obj.Qty} <br/> </td>
			<td valign="top">${obj.Price}</td>
			<td valign="top">${obj.Price * obj.Qty}</td>
		    </tr>`;

				obj.Childs.map((objChild)=> { 
					list += `<tr>
					<td valign="top">${objChild.ProductCode}    </td>
					<td valign="top">${objChild.ProductName}    </td> 
					<td valign="top">${objChild.Qty * obj.Qty}  </td>
				
			
		    		</tr>`;
				
				});
		});
			return list;
	}
	roundTo2Decimals = (number = 0.00) => {
		console.log("yooo",Math.round((number + Number.EPSILON) * 100) / 100)
		return Math.round((number + Number.EPSILON) * 100) / 100
	}
	body(){
		let quoteId
		if(this.props.match.params.QuoteId){
			 quoteId = this.props.match.params.QuoteId
		}
		else if(this.props.quotes.quoteNo){
			quoteId = this.props.quotes.quoteNo
		}
		else{
			quoteId = 0
		}
		let total = this.roundTo2Decimals(this.state.total)
		console.log(total)
		return encodeURIComponent(
			
		`<div>
		<table width="650" border="1" cellspacing="0" cellpadding="20" bgcolor="#FFFFFF" align="center">
		 <tbody><tr>
		  <td>
		   <table width="100%" border="0" cellspacing="1" cellpadding="5">
			<tbody><tr valign="top">
			     <td align="left">	<b>Quote Number:</b> ${quoteId} </td> 
				 <td align="right"><b>Customer Name:</b> ${this.state.quote.CustomerFName + " " + this.state.quote.CustomerLName}</td>
				</tr>
			 </tbody></table>
			 <br>
		   <br>
		   <table width="100%" border="0" cellspacing="1" cellpadding="5">
			 <tbody><tr valign="top"> 
			 <td><b>Bill To:</b><br>
			 ${this.state.quote.BillingCompany}<br> ${this.state.quote.CustomerFName + " " + this.state.quote.CustomerLName}<br>
			 ${this.state.quote.BillingStreetAddress1 +" " + this.state.quote.BillingCity1 + " " + this.state.quote.BillingState + " " + this.state.quote.BillingPostalCode+ " " + this.state.quote.BillingCountry1}<br>
			 ${this.state.quote.BillingPhoneNumber}<br>
			 <a href="mailto:${this.state.quote.CustomerEmail}" target="_blank">${this.state.quote.CustomerEmail}</a><br>
			    <br></td>
				<td><b>Ship To:</b><br>
				${this.state.quote.ShippingCompany}<br> ${this.state.quote.CustomerFName + " " + this.state.quote.CustomerLName} <br>
				${this.state.quote.ShippingAddress1 +" " + this.state.quote.ShippingCity + " " + this.state.quote.ShippingState + " " + this.state.quote.ShippingPostalCode}
			  <br>
			  ${this.state.quote.ShippingCountry} <br>
			  ${this.state.quote.ShippingPhoneNumber} <br> </td>
			  </tr>
			  <tr valign="top"> 
			 <td colspan="2"><b>Order Details:</b><br> <br>
              <table width="100%" bgcolor="#EEEEEE">
              <tbody>
              <tr>
                <td style="width: 18%"><b>Code</b></td>
                <td style="width: 52%"><b>Item / Options </b></td>
                <td style="text-align: right; width: 5%"><b>Qty</b></td>
                <td style="text-align: right; width: 10%"><b>Price</b></td>
                <td style="text-align: right; width: 15%"><b>Grand Total</b></td>
              </tr>
			  	 ${this.orderItemDetails(this.state.selectedProducts)}
            </tbody>
			<tr>
                <td  colspan="4" style="text-align: right"><b> Subtotal:</b> </td>
                <td style="text-align: right">$${total}</td>
              </tr>
			  <tr>
                <td colspan="4" style="text-align: right"><b> Grand Total: </b></td>
                <td style="text-align: right">$${total} </td>
              </tr>
			</table>
		</div>	  
		`
		)
		
	}
	render() {
		const customStyles = {
			control: base => ({
				...base,
				height: 35,
				minHeight: 35
			})
		};

		return (
			<div className="quote-form">
				<div className="container">
					<Col lg="12" className="mb-3">
						<h3>{this.state.type} Quote</h3>
						<p className="text-muted"> Submit Quote to IntrepidCS</p>
					</Col>
					<div className="col-lg-12 mx-auto">
						<Form
							ref={(c) => {
								this.form = c;
							}}>
							<CustomerTopSection handleChange={this.handleChange} quote={this.state.quote} />
							{/* <CustomerAddressSection handleChange={this.handleChange} quote={this.state.quote} sameAsShipping={this.sameAsShipping} sameAsBilling={this.sameAsBilling} countries={this.props.countries} ></CustomerAddressSection> */}
							<Row>
								<Col lg="6" className="mb-2">
									<Row>
										<Col lg="12" className="mb-2">
											<h6>Billing Address</h6>
											<label htmlFor="sameAsShipping">
												{" "}
												<input
													onChange={this.sameAsShipping}
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
												value={this.state.quote.BillingStreetAddress1}
												name="BillingStreetAddress1"
												onChange={this.handleChange}
												placeholder="Address 1"
											/>
										</Col>
										<Col lg="12" className="mb-3">
											<Input
												validations={[]}
												className="input form-control custom-input"
												type="text"
												value={this.state.quote.BillingStreetAddress2}
												name="BillingStreetAddress2"
												onChange={this.handleChange}
												placeholder="Address 2"
											/>
										</Col>
										<Col lg="12" className="mb-3">
											<Input
												validations={[required]}
												className="input form-control custom-input"
												type="text"
												value={this.state.quote.BillingCompany}
												name="BillingCompany"
												onChange={this.handleChange}
												placeholder="Company"
											/>
										</Col>
										<Col lg="12" className="mb-3">
											<Input
												validations={[required]}
												className="input form-control custom-input"
												type="text"
												value={this.state.quote.BillingCity1}
												name="BillingCity1"
												onChange={this.handleChange}
												placeholder="City"
											/>
										</Col>
										<Col lg="12" className="mb-3">
											<Input
												validations={[required]}
												className="input form-control custom-input"
												type="text"
												value={this.state.quote.BillingState}
												name="BillingState"
												onChange={this.handleChange}
												placeholder="State/Province"
											/>
										</Col>
										<Col lg="12" className="mb-3">
											<Input
												validations={[required]}
												className="input form-control custom-input"
												type="text"
												value={this.state.quote.BillingPostalCode}
												name="BillingPostalCode"
												onChange={this.handleChange}
												placeholder="Postal Code"
											/>
										</Col>

										<Col lg="12" className="mb-3">
											<Select
												name="BillingCountry1"
												validations={[required]}
												onChange={this.handleChange}
												value={this.state.quote.BillingCountry1}
												id="BillingCountry1"
												placeholder="Country"
												className="form-control">
												<option value="">-- Select Country --</option>
												{this.props.countries &&
													this.props.countries.map((country) => {
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
												value={this.state.quote.BillingPhoneNumber}
												name="BillingPhoneNumber"
												onChange={this.handleChange}
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
													onChange={this.sameAsBilling}
													name="sameAsBilling"
													id="sameAsBilling"
													value={this.state.sameAsBilling}
													type="checkbox"></input>{" "}
												Same as billing{" "}
											</label>
										</Col>
										<Col lg="12" className="mb-3">
											<Input
												validations={[required]}
												className="input form-control custom-input"
												type="text"
												value={this.state.quote.ShippingAddress1}
												name="ShippingAddress1"
												onChange={this.handleChange}
												placeholder="Address 1"
											/>
										</Col>
										<Col lg="12" className="mb-3">
											<Input
												validations={[]}
												className="input form-control custom-input"
												type="text"
												value={this.state.quote.ShippingAddress2}
												name="ShippingAddress2"
												onChange={this.handleChange}
												placeholder="Address 2"
											/>
										</Col>
										<Col lg="12" className="mb-3">
											<Input
												validations={[required]}
												className="input form-control custom-input"
												type="text"
												value={this.state.quote.ShippingCompany}
												name="ShippingCompany"
												onChange={this.handleChange}
												placeholder="Company"
											/>
										</Col>
										<Col lg="12" className="mb-3">
											<Input
												validations={[required]}
												className="input form-control custom-input"
												type="text"
												value={this.state.quote.ShippingCity}
												name="ShippingCity"
												onChange={this.handleChange}
												placeholder="City"
											/>
										</Col>
										<Col lg="12" className="mb-3">
											<Input
												validations={[required]}
												className="input form-control custom-input"
												type="text"
												value={this.state.quote.ShippingState}
												name="ShippingState"
												onChange={this.handleChange}
												placeholder="State/Province"
											/>
										</Col>
										<Col lg="12" className="mb-3">
											<Input
												validations={[required]}
												className="input form-control custom-input"
												type="text"
												value={this.state.quote.ShippingPostalCode}
												name="ShippingPostalCode"
												onChange={this.handleChange}
												placeholder="Postal Code"
											/>
										</Col>
										<Col lg="12" className="mb-3">
											<Select
												name="ShippingCountry"
												onChange={this.handleChange}
												validations={[required]}
												value={this.state.quote.ShippingCountry}
												id="ShippingCountry"
												placeholder="Country"
												className="form-control">
												<option value="">-- Select Country --</option>
												{this.props.countries &&
													this.props.countries.map((country) => {
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
												value={this.state.quote.ShippingPhoneNumber}
												name="ShippingPhoneNumber"
												onChange={this.handleChange}
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
										onChange={this.handleChange}
										value={
											this.state.quote.notes &&
											this.state.quote.notes.replace(/(<([^>]+)>)/gi, "")
										}></FormControl>
								</Col>
							</Row>
							<Row className="mb-5">
								<Table size="sm" responsive>
									<thead>
										<tr>
											<td>
												<strong>Part Number</strong>
											</td>
											<td className="text-center">
												<strong>Description</strong>
											</td>

											<td className="text-center">
												<strong>Qty</strong>
											</td>
											<td className="text-center">
												<strong>Unit Price ($)</strong>
											</td>
											<td className="text-right">
												<strong>Totals</strong>
											</td>
											<td className="text-center">
												<strong></strong>
											</td>
										</tr>
									</thead>
									<tbody>
										{this.state.selectedProducts &&
											this.state.selectedProducts.map(
												(selectedProduct, index) => (
													<>
														<tr key={index}>
															<td className="mb-3 tdClassForSelectIssue">
																{/* <Select
																	name="productList"
																	onChange={(e) => this.handleChange(e, index,childIndex)}
																	validations={[required]}
																	id="productList"
																	placeholder="Product Code"
																	key={index}
																	value={selectedProduct.ProductCode}
																	className="form-control">
																	<option value="">-- Select Product --</option>
																	{this.props.products &&
																		this.props.products.map(
																			(product, index) => {
																				return (
																					<option
																						key={index}
																						value={
																							(selectedProduct &&
																								selectedProduct.productCode) ||
																							product.ProductCode
																						}>
																						{(selectedProduct &&
																							selectedProduct.productCode) ||
																							product.ProductCode}
																					</option>
																				);
																			}
																		)}
																</Select> */}
																<Select2
																	name="productList"
																	onChange={(selectValue) => this.handleSelectChange(selectValue, index)}
																	validations={[required]}
																	id="productList"
																	style={{ width: "200px" }}
																	styles={customStyles}
																	placeholder="Product Code" key={index}
																	value={this.state.selectValue[index]} label options={this.props.products && this.props.products.length > 0 && this.props.products.map(elem => { return { label: elem.ProductCode, value: elem } })} />
															</td>
															<td>
																<FormControl
																	as="textarea"
																	className="form-control text-small"
																	name="productDescription"
																	rows={1}
																	cols={50}
																	onChange={(e) => this.handleChange(e, index)}
																	value={
																		selectedProduct.description &&
																		selectedProduct.description.replace(
																			/<[^>]+>/g,
																			""
																		)
																	}></FormControl>
															</td>

															<td>
																<Input
																	type="textbox"
																	className="form-control"
																	name="Qty"
																	validations={[required, gt0]}
																	placeholder="Qty"
																	min={0}
																	value={selectedProduct.Qty}
																	onChange={(e) => this.handleChange(e, index)}
																/>
															</td>
															<td>
																<Input
																	type="textbox"
																	className="form-control"
																	validations={[required, numbers]}
																	name="Price"
																	placeholder="Price"
																	onChange={(e) => this.handleChange(e, index)}
																	value={selectedProduct.Price}
																/>
															</td>
															<td
																className="text-right"
																style={{ verticalAlign: "middle" }}>
																{(
																	selectedProduct.Price * selectedProduct.Qty
																).toLocaleString()}
															</td>
															<td>
																<Button
																	size="sm"
																	onClick={(e) =>
																		this.handlerRemoveRowClick(e, index)
																	}>
																	<i className="fa fa-times"></i>
																</Button>
															</td>
														</tr>
														{selectedProduct.Childs &&
															selectedProduct.Childs.map(
																(ChildrenOfSelectedProduct, childIndex) => (
																	<tr>
																		<td>
																			{ChildrenOfSelectedProduct.ProductCode}
																		</td>
																		<td>
																			<FormControl
																				as="textarea"
																				className="form-control text-small"
																				name="productDescriptionChild"
																				rows={1}
																				cols={50}
																				onChange={(e) =>
																					this.handleChange(e, index, childIndex)
																				}
																				value={
																					ChildrenOfSelectedProduct.ProductDescriptionShort
																				}></FormControl>
																		</td>

																		<td>
																			{ChildrenOfSelectedProduct.Qty *
																				selectedProduct.Qty}
																		</td>
																		<td></td>
																		<td></td>
																	</tr>
																)
															)}
													</>
												)
											)}
										<tr>
											<td colSpan="100%" className="text-right">
												<Button size="sm" onClick={this.handleAddRowClick}>
													{" "}
													Add More{" "}
												</Button>
											</td>
										</tr>
									</tbody>
								</Table>
								<Col lg="6" className="mb-2" />
								<Col lg="6" className="mb-2 d-flex justify-content-between">
									<h6>SubTotal:</h6>
									<strong>${this.state.total.toLocaleString()}</strong>
								</Col>
								<Col lg="6" className="mb-2" />
								<Col lg="6" className="mb-2 d-flex justify-content-between">
									<h2> Total:</h2>
									<h2>${this.state.total.toLocaleString()}</h2>
								</Col>
								<Col lg="12" className="text-right  d-flex flex-row-reverse">
								<Button onClick={(e)=>this.handleOnSubmit(e,'email')} size="sm" type="button" className="mw-100 ml-2" variant="success" value="saveAndEmail" >  
										{/* {this.state.type} Save */}
										Save and Email
									</Button>
									<Button onClick={(e) => this.handleOnSubmit(e,'save')} size="sm" type="button" className="mw-100 ml-2" value="save">
										Save
									</Button>
									{!this.props.match.params.QuoteId && <Button size="sm" variant="danger" onClick={this.resetForm} className="mw-100 ml-1">
										Reset 
									</Button>}
									


								</Col>

							</Row>
						</Form>
					</div>
				</div>
			</div>
		);
	}
}
const stateMap = (state) => {
	return {
		user: state.user,
		products: state.user.products,
		countries: state.user.countries,
		global: state.global,
		quote: state.user.quote,
		quotes: state.user.quotes,
	};
};
export default connect(stateMap)(QuoteForm);
