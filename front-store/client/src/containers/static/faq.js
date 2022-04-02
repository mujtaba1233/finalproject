import React, { Component } from 'react';
import SideBar from '../../components/side-bar';
import Scroll from 'react-scroll';
import { Link } from 'react-router-dom';
import { TO_ORDER_FAQ_ANSWERS, TO_ACCOUNT_FAQ_ANSWERS, TO_SHIP_FAQ_ANSWERS, TO_GUARENTEE_FAQ_ANSWERS, TO_PB_FAQ_ANSWERS, TO_GUIDE_FAQ_ANSWERS, TO_SUPPORT_FAQ_ANSWERS, TO_TERM_AND_CONDITION, TO_PRIVACY_POLICY } from '../../helpers/routesConstants';
class FaqContainer extends Component {
    constructor(){
        super()
    }
    componentWillMount() {
        Scroll.animateScroll.scrollToTop();
    }
    render() {
        return (
            <div id="content">
                <div className="container">
                    <div className="row bar">
                        <SideBar />
                        <div className="col-md-9">
                            <h3 className="uppercase h4 title-padding">Find quick answers to your questions below...</h3>
                            <div className="row">
                                <div className="col-sm-6">
                                    <h3 className="h4 sub-heading-padding">Orders</h3>
                                    <ul className="nav nav-pills flex-column text-sm">
                                        <li><Link to={TO_ORDER_FAQ_ANSWERS}>Has my order shipped?</Link></li>
                                        {/* <li><Link to={TO_ORDER_FAQ_ANSWERS}>How do I change quantities or cancel an item in my order?</Link></li> */}
                                        <li><Link to={TO_ORDER_FAQ_ANSWERS}>How do I track my order?</Link></li>
                                        <li><Link to={TO_ORDER_FAQ_ANSWERS}>My order never arrived.</Link></li>
                                        <li><Link to={TO_ORDER_FAQ_ANSWERS}>An item is missing from my shipment.</Link></li>
                                        <li><Link to={TO_ORDER_FAQ_ANSWERS}>My product is missing parts.</Link></li>
                                        <li><Link to={TO_ORDER_FAQ_ANSWERS}>When will my backorder arrive?</Link></li>
                                        {/* <li><Link to={TO_ORDER_FAQ_ANSWERS}>Why can't I see prices?</Link></li>
                                        <li><Link to={TO_ORDER_FAQ_ANSWERS}>Why can't I add items to the shopping cart?</Link></li> */}
                                    </ul>

                                    <h3 className="h4 sub-heading-padding">My Account</h3>
                                    <ul className="nav nav-pills flex-column text-sm">
                                        <li><Link to={TO_ACCOUNT_FAQ_ANSWERS}>How do I create an account?</Link></li>
                                        <li><Link to={TO_ACCOUNT_FAQ_ANSWERS}>How do I edit my account information?</Link></li>
                                        <li><Link to={TO_ACCOUNT_FAQ_ANSWERS}>How much is my shipping?</Link></li>
                                        <li><Link to={TO_ACCOUNT_FAQ_ANSWERS}>I forgot my password.</Link></li>
                                        <li><Link to={TO_ACCOUNT_FAQ_ANSWERS}>How do I return my product?</Link></li>
                                        <li><Link to={TO_ACCOUNT_FAQ_ANSWERS}>I received the wrong product.</Link></li>
                                        <li><Link to={TO_ACCOUNT_FAQ_ANSWERS}>What is your return policy?</Link></li>
                                        <li><Link to={TO_ACCOUNT_FAQ_ANSWERS}>When will my order ship?</Link></li>
                                    </ul>
                                </div>
                                <div className="col-sm-6">
                                    <h3 className="h4 sub-heading-padding">International Shipping</h3>
                                    <ul className="nav nav-pills flex-column text-sm">
                                        <li><Link to={TO_SHIP_FAQ_ANSWERS}>Do you ship to my country?</Link></li>
                                        <li><Link to={TO_SHIP_FAQ_ANSWERS}>What are my payment choices?</Link></li>
                                        <li><Link to={TO_SHIP_FAQ_ANSWERS}>When will my order ship and what are my shipping charges?</Link></li>
                                        <li><Link to={TO_SHIP_FAQ_ANSWERS}>What is the return policy?</Link></li>
                                    </ul>

                                    <h3 className="h4 sub-heading-padding">Guarantees</h3>
                                    <ul className="nav nav-pills flex-column text-sm">
                                        <li><Link to={TO_TERM_AND_CONDITION}>Terms and Conditions</Link></li>
                                        <li><Link to={TO_PRIVACY_POLICY}>Privacy Policy</Link></li>
                                        <li><Link to={TO_GUARENTEE_FAQ_ANSWERS}>Security</Link></li>
                                    </ul>

                                    <h3 className="h4 sub-heading-padding">Pricing and Billing</h3>
                                    <ul className="nav nav-pills flex-column text-sm">
                                        <li><Link to={TO_PB_FAQ_ANSWERS}>Do I have to pay sales tax?</Link></li>
                                        <li><Link to={TO_PB_FAQ_ANSWERS}>I have a question on my charges.</Link></li>
                                        <li><Link to={TO_PB_FAQ_ANSWERS}>I need a copy of my receipt/invoice.</Link></li>
                                        <li><Link to={TO_PB_FAQ_ANSWERS}>When will my credit appear on my account?</Link></li>
                                        <li><Link to={TO_PB_FAQ_ANSWERS}>When will my credit card be charged?</Link></li>
                                    </ul>

                                    <h3 className="h4 sub-heading-padding">Buyer's Guide</h3>
                                    <ul className="nav nav-pills flex-column text-sm">
                                        <li><Link to={TO_GUIDE_FAQ_ANSWERS}>How do I find my product?</Link></li>
                                        <li><Link to={TO_GUIDE_FAQ_ANSWERS}>How do I navigate the site?</Link></li>
                                    </ul>

                                    <h3 className="h4 sub-heading-padding">Additional Support</h3>
                                    <ul className="nav nav-pills flex-column text-sm">
                                        <li><Link to={TO_SUPPORT_FAQ_ANSWERS}>How do I contact you?</Link></li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default FaqContainer;
