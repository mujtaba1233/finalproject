import React, { Component } from 'react';
import SideBar from '../../components/side-bar';
import { Link } from 'react-router-dom'
import Scroll from 'react-scroll'
import { TO_CUSTOMER_ACCOUNT, TO_CUSTOMER_ORDERS, TO_TERM_AND_CONDITION, WWW_LINK } from '../../helpers/routesConstants';
class ShipFaqContainer extends Component {
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
                            <h3 className="uppercase h4 title-padding"><b>International Shipping</b></h3>
                            
                            
                            <p><b>Do you ship to my country?</b></p>
                            <p>We do accept and ship orders worldwide! However, we only accept online orders from countries in North America, South America and the United Kingdom through our online store.
If you are located outside of these regions, start the process by requesting a quotation first. You can request a quotation <a href="mailto:icscontactus@intrepidcs.com">by email</a>. Once you receive a quotation, you can place an order using the instructions on the quotation you receive.
Your order will be processed by one of our international offices or distributors. Please contact the office closest to your location from the list below for further assistance, get a quotation, and to place your order.</p>
                            
                            <h3>Please visit <a href={WWW_LINK} target="_blank">{WWW_LINK}</a> for full contact information for all Intrepid offices and distributors.</h3>


                            <p><b>What are my payment choices?</b></p>
                            <p>For online orders, we only accept credit card orders. During the checkout process you may choose any of our available payment options and continue to place your order. Please note that we will not ship your order until we receive payment from you. We do accept Purchase Orders and Wire Transfers for payment, but we cannot accept these online. Please send them by fax to +1 586-731-2274 or <a href="mailto:icscontactus@intrepidcs.com">by email</a>.</p>
                            

                            <p><b>When will my order ship and what are my shipping charges?</b></p>
                            <p>For online orders, shipping is automatically calculated prior to submitting your payment information.  Simply add items to your cart and proceed to the Checkout page where you will be offered Shipping Method choices and their prices. We will ship your order shortly after we receive payment from you.</p>
                            

                            <p><b>What is the return policy?</b></p>
                            <p>Please see our <Link to={TO_TERM_AND_CONDITION}>Terms &amp; Conditions</Link> for complete details regarding our return policy.</p>
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default ShipFaqContainer;
