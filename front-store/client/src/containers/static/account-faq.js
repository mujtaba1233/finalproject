import React, { Component } from 'react';
import SideBar from '../../components/side-bar';
import { Link } from 'react-router-dom';
import Scroll from 'react-scroll'
import { TO_CUSTOMER_ACCOUNT, TO_CUSTOMER_ORDERS, TO_RETURN, TO_TERM_AND_CONDITION, WWW_LINK, TO_PRIVACY_POLICY } from '../../helpers/routesConstants';
class AccountFaqContainer extends Component {
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
                        <h3 className="uppercase h4 title-padding">My Account</h3>
                            
                            
                            <p><b>How do I create an account?</b></p>
                            <ol>
                                <li>Click the <Link to={TO_CUSTOMER_ACCOUNT}>"My Account / Orders"</Link> link at the top right side of our site.</li>
                                <li>Enter your email address.</li>
                                <li>Select "I am a new customer".</li>
                            </ol>
                            <p>Then simply follow the prompts to complete setting up your account. Your information is NEVER sold to any other company and is kept completely private. Please view our <Link to={TO_PRIVACY_POLICY}>Privacy Policy</Link> for more information.</p>
                            
                            <p><b>How do I edit my account information?</b></p>
                            <p>Click the <Link to={TO_CUSTOMER_ACCOUNT}>"My Account / Orders"</Link> link at the top right hand side of our site to edit your account information.</p>
                            
                            <p><b>How much is my shipping?</b></p>
                            <p>Shipping is automatically calculated prior to submitting your payment information.  Simply add items to your cart and proceed to the Checkout page where you will be offered Shipping Method choices and their prices.</p>
                            
                            <p><b>I forgot my password.</b></p>
                            <p>Click the <Link to={TO_CUSTOMER_ACCOUNT}>"My Account / Orders"</Link> link at the top right hand side of our site. Under the login box you'll see a link that says "Forgot your password? Click here". That link will send an email to you with your password.</p>
                            
                            <p><b>How do I return my product?</b></p>
                            <p>Please <Link to={TO_RETURN}>click here for more information on returning an item.</Link></p>
                            
                            <p><b>I received the wrong product.</b></p>
                            <p>If you feel that you have received the wrong product, please contact customer service at +1 (800) 859-6265 (toll free in US/Canada), or +1 586 731-7950 or <a href="mailto:icscontactus@intrepidcs.com">email us</a> for assistance. Please contact customer service within 72 hours of receiving the product.</p>
                            
                            <p><b>What is your return policy?</b></p>
                            <p>Please see our <Link to={TO_TERM_AND_CONDITION}>Terms & Conditions</Link> for complete details regarding our return policy.</p>
                    
                            
                            <p><b>When will my order ship?</b></p>
                            <p>Please see each individual item page for more information on the availability of each item. Also, after placing your order, you may click the <Link to={TO_CUSTOMER_ACCOUNT}>"My Account / Orders"</Link> link at the top right hand side of our site to track the status of your order. You will receive a shipment confirmation when your order has shipped and tracking information within 24-48 hours of shipment.</p>
                    
                            <ul>
                                <li>EU</li>
                                <li>India</li>
                                <li>Japan</li>
                                <li>South Korea</li>
                            </ul>
                            <br></br>
                            <p>To get pricing for your region, please <a href="mailto:icscontactus@intrepidcs.com">contact us</a> to get a price quote.</p>
                            
                            <p><b>Why Can't I Add Items to the Shopping Cart?</b></p>
                            <p>Our web site displays prices where applicable, but we only allow online orders for North America and South America at this time. We gladly accept orders worldwide, please <a href="mailto:icscontactus@intrepidcs.com">contact us</a> to get a price quote, or <a href={WWW_LINK} target="_blank">contact one of our distributors and direct offices in your area.</a></p>
                    
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default AccountFaqContainer;
