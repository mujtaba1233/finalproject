import React, { Component } from 'react';
import SideBar from '../../components/side-bar';
import { Link } from 'react-router-dom'
import Scroll from 'react-scroll'
import { TO_CUSTOMER_ACCOUNT, TO_CUSTOMER_ORDERS } from '../../helpers/routesConstants';
class PbFaqContainer extends Component {
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
                        <h3 className="uppercase h4 title-padding">Pricing and Billing</h3>
                            
                            
                            <h4 className="uppercase h4 title-padding">Do I have to pay sales tax?</h4>
                            <p><b>Entities in the USA:</b></p>
                            <p>You must pay sales tax if required by state or federal law. If your shipping address is in the state of Michigan, you must pay sales tax. If you have a Tax Exempt Certificate please send it <a href="mailto:icscontactus@intrepidcs.com">by email</a> or fax it to +1 586-731-2274.</p>
                        
                            <p><b>Entities outside the USA:</b></p>
                            <p>You do not pay sales tax, but you are responsible for all tariffs, duties and taxes for the destination country.</p>
                            
                            <p><b>I have a question on my charges.</b></p>
                            <p>Click the <Link to={TO_CUSTOMER_ACCOUNT}>"My Account / Orders"</Link> link at the top right hand side of our site to review your orders. You may reconcile your order history on our website against your financial records. If you have further questions or concerns, please contact customer service at +1 (800) 859-6265 (toll free in US/Canada), or +1 586 731-7950 or by emailby email for assistance.</p>
                        
                            
                            <p><b>I need a copy of my receipt/invoice.</b></p>
                            <p>Click the <Link to={TO_CUSTOMER_ACCOUNT}>"My Account / Orders"</Link> link at the top right hand side of our site to print invoices. If you need additional details or need assistance, please contact customer service at +1 (800) 859-6265 (toll free in US/Canada), or +1 586 731-7950 or <a href="mailto:icscontactus@intrepidcs.com">by email</a> .</p>
                
                            
                            <p><b>When will my credit appear on my account?</b></p>
                            <p>Credits usually take 7-10 business days from the time we receive your item(s).</p>
                        
                            
                            <p><b>When will my credit card be charged?</b></p>
                            <p>Your credit card will be charged the day of shipment, or within 24 hours prior to shipment of your item(s).</p>
                        

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default PbFaqContainer;
