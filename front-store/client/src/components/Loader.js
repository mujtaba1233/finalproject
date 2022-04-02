import React, { Component } from 'react';
import Loader from 'react-loader-spinner'
export default class Custom extends Component {

	render() {
		return (
			<div className="loader">
				<Loader type="Oval" color="#467fbf" height={80} width={80} />
			</div>
		)
	}
}
