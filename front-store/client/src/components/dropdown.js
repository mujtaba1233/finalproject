import React, { Component } from 'react';
export default class Dropdown extends Component {
	constructor(props) {
		super(props);
		this.optionsChange = this.optionsChange.bind(this);
		this.state = {
			selectedOptions: {}
		}
	}
	optionsChange(event) {
		let selectedOptions = { ...this.state.selectedOptions };
		selectedOptions[event.target.name] = {
			id: event.target.value,
			name: event.target.selectedOptions[0].innerText,
			type: event.target.dataset.type,
			price: event.target.selectedOptions[0].dataset.price || 0
		}
		this.setState({ selectedOptions });
		this.props.detailRef.getSelectedOptions(selectedOptions)
	}
	componentDidMount() {
		let selectedOptions = {};
		if (this.props.detailRef.state.product.SelectedOptions) {
			selectedOptions = this.props.detailRef.state.product.SelectedOptions
		} else {
			this.props.options.map(option => {
				selectedOptions[option.key] = {
					id: option.options[0].id,
					name: option.options[0].optionsDesc,
					type: option.label,
					price: option.priceDiff || 0
				}
			})
		}
		this.setState({ selectedOptions });
		this.props.detailRef.getSelectedOptions(selectedOptions)
	}
	componentDidUpdate(prevProps) {
		if (JSON.stringify(prevProps.options) !== JSON.stringify(this.props.options)) {
			let selectedOptions = {};
			if (this.props.detailRef.state.product.SelectedOptions) {
				selectedOptions = this.props.detailRef.state.product.SelectedOptions
			} else {
				this.props.options.map(option => {
					selectedOptions[option.key] = {
						id: option.options[0].id,
						name: option.options[0].optionsDesc,
						type: option.label,
						price: option.priceDiff || 0
					}
				})
			}
			this.setState({ selectedOptions });
			this.props.detailRef.getSelectedOptions(selectedOptions)
		}
		// console.log('Update dropdown');
	}

	render() {
		return (
			<div>
				<hr></hr>
				<strong className="lighter-note">Choose your options</strong>
				{this.props.options.map(dropdown => {
					return (this.state.selectedOptions[dropdown.key] && <div key={dropdown.key} className="form-group">
						<div className="row">
							<label className="col-sm-12">{dropdown.label}: </label>
							<div className="col-sm-12">
								<select data-type={dropdown.label} name={dropdown.key} value={this.state.selectedOptions[dropdown.key].id} onChange={this.optionsChange.bind(this)} className="form-control">
									{dropdown.options.map(option => {
										let priceDiff = (option.priceDiff !== 0) ? (' [Add $' + option.priceDiff + ']') : '';
										return <option key={option.id} data-price={option.priceDiff || 0} value={option.id}>{option.optionsDesc}{priceDiff}</option>
									})}
								</select>
							</div>
						</div>
					</div>)
				})}
			</div>
		)
	}
}
