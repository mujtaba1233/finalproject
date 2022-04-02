import React, { Component } from 'react';
export default class Search extends Component {

	render() {
		return (
			<div className="input-group" style={{marginTop: "20px"}}>
				<input onChange={this.props.onChangeHandler} type="text"value={this.props.value}  placeholder="Search" className="form-control"></input><span className="input-group-btn">
					<button type="submit" className="btn btn-template-main"><i className="fa fa-search"></i></button></span>
			</div>
			
		)
	}
}
