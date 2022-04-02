import React from "react";
import store from "../../../store";
import { connect } from "react-redux";
import { Col, Table } from "react-bootstrap";
import { GetQuotesList, RemoveQuote } from "../../../actions/quote/quote-actions";

import "../create/quote-form.scss";
import { Link } from "react-scroll";
import { TO_QUOTE_CREATE } from "../../../helpers/constants";
import { getUser } from "../../../helpers/utility";

class QuoteList extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			quotes: [],
			searchInput: "",
		};

		// this.emptyProduct = {};
	}
	handleChange(e) {
		if (e.target.value) {
			if (e.target.name !== "globalSearch") {
				let filteredData = this.props.quotes.filter((quote) => {
					return (
						quote[e.target.name] &&
						quote[e.target.name]
							.toString()
							.toLowerCase()
							.includes(e.target.value)
					);
				});
				this.setState({ quotes: filteredData || [] });
			} else {
				let filteredData = this.props.quotes.filter((quote) => {
					console.log(quote);
					return (
						quote.QuoteNo.toString().toLowerCase().includes(e.target.value) ||
						quote.CustomerName.toString().toLowerCase().includes(e.target.value) ||
						quote.CustomerEmail.toString().toLowerCase().includes(e.target.value) ||
						quote.ShippingCompany.toString().toLowerCase().includes(e.target.value) ||
						quote.ShippingCountry.toString().toLowerCase().includes(e.target.value)

					);
				});
				this.setState({ quotes: filteredData || [] });
			}
		} else {
			this.setState({
				quotes: this.props.quotes || [],
			});
		}
	}
	componentDidUpdate(prevProps) {
		// if(this.props.quotes.data !== "Unathorized access"){
			
			if (prevProps.quotes !== this.props.quotes) {
				this.setState({
					quotes: this.props.quotes || [],
				},()=>{
					console.log(this.state.quotes)
				});
			}
		// }
	}
	componentDidMount() {
		console.log("user: ",getUser())
		store.dispatch(GetQuotesList());
		this.setState({
			quotes: this.props.quotes || [],
		});
	}
	render() {
		return (
			<div className="quote-form">
				<div className="container">
					<Col lg="12" className="mb-3">
						<h3>Search Quote</h3>
						<p className="text-muted">Search Quote from IntrepidCS</p>
					</Col>
					<Col lg="12">
						<Table responsive striped>
							<thead>
								<tr>
									<th scope="col">Quote</th>
									<th scope="col">Name</th>
									<th scope="col">Email</th>
									<th scope="col">Created on</th>
									<th scope="col">Ship to Company</th>
									<th scope="col">Ship to Country</th>
									<th scope="col" style={{width:'17%'}}>Action</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td colSpan="7">
										<input
											onChange={this.handleChange}
											name="globalSearch"
											type="text"
											placeholder="Global Search"
											className="form-control"
										/>
									</td>
								</tr>
								<tr>
									<td colSpan="1">
										<input
											style={{ marginRight: "50px !important" }}
											onChange={this.handleChange}
											name="QuoteNo"
											type="text"
											placeholder="Id search"
											className="form-control customQuoteNo"
										/>
									</td>
									<td>
										<input
											onChange={this.handleChange}
											name="CustomerName"
											type="text"
											placeholder="Name search"
											className="form-control"
										/>
									</td>
									<td>
										<input
											onChange={this.handleChange}
											name="CustomerEmail"
											type="text"
											placeholder="Email search"
											className="form-control"
										/>
									</td>
									<td>
										<input
											onChange={this.handleChange}
											name="createdOn"
											type="text"
											placeholder="created on search"
											className="form-control"
										/>
									</td>
									<td>
										<input
											onChange={this.handleChange}
											name="ShippingCompany"
											type="text"
											placeholder="Company Name search"
											className="form-control"
										/>
									</td>
									<td colSpan={2}>
										<input
											onChange={this.handleChange}
											name="ShippingCountry"
											type="text"
											placeholder="Country Name search"
											className="form-control"
										/>
									</td>
									<td></td>

								</tr>
								{this.state.quotes && this.state.quotes.length>0 && this.state.quotes.map((quote, index) => (
									<tr key={index}>
										<td>{quote.QuoteNo}</td>
										<td>{quote.CustomerName}</td>
										<td>{quote.CustomerEmail}</td>
										<td>{ new Date(quote.createdOn).toLocaleDateString()}</td>
										<td>{quote.ShippingCompany}</td>
										<td>{quote.ShippingCountry}</td>
										<td>
											<a className="btn btn-sm btn-primary ml-1" href={TO_QUOTE_CREATE + '/' + quote.QuoteNo} ><i className="fa fa-pencil"></i>Edit</a>
											<a className="btn btn-sm btn-danger ml-1" onClick={()=>store.dispatch(RemoveQuote(quote.QuoteNo))} ><i className="fa fa-pencil"></i>Delete</a>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					</Col>
				</div>
			</div>
		);
	}
}
const stateMap = (state) => {
	return {
		user: state.user,
		quotes: state.user.quotes,
		global: state.global,
	};
};
export default connect(stateMap)(QuoteList);
