import React, { Component } from "react";
import Button from "react-bootstrap/esm/Button";
import { Link } from "react-router-dom";
import { getCookie, setCookie } from "../helpers/cookie-helper";
import { TO_PRIVACY_POLICY } from "../helpers/routesConstants";

export class CookieView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			IAgree: false,
			crossButtonClicked: false
		};
	}
	onCrossButtonClick = () =>{
		this.setState({
			IAgree: true
		})
	}
	onAgreeClick = () => {
		let getCookieValue;
		this.setState(
			{
				IAgree: true,
			},
			() => {
				getCookieValue = setCookie("acceptCookie", this.state.IAgree, {
					maxAge: 60 * 60 * 24 * 365,
				});
				let getCookieValue = getCookie("acceptCookie");
				window.location.reload(false);
			}
		);
	};
	componentDidMount = () => {
		let getCookieValue = getCookie("acceptCookie");
		this.setState({
			IAgree: getCookieValue,
		});
	};
	render() {
		return (
			<div>
				{!this.state.IAgree && (

					<div className="cookie-consent-banner">
						<div className="d-flex justify-content-end">
							<button 
							onClick={this.onCrossButtonClick}
							className="cross_button">
								x
							</button>
						</div>
						
						<div className="cookie-consent-banner__inner">
							<div className="cookie-consent-banner__copy">
								<div className="cookie-consent-banner__description">
									By continuing to browse this site, you are agreeing to use of
									cookies, whose purpose it is to provide web analytics and
									measurements of visitor traffic and browsing behavior
								</div>
							</div>

							<div className="cookie-consent-banner__actions">
								<Button
									onClick={this.onAgreeClick}
									className="cookie-consent-banner__cta">
									I Agree
								</Button>
								<Link to={TO_PRIVACY_POLICY	} >
									<Button className="cookie-consent-banner__cta">
										Privacy Policy
									</Button>
								</Link>
							</div>
						</div>
						
					</div>
				)}
			</div>
		);
	}
}
