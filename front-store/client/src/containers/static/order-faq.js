import React, { Component } from 'react';
import SideBar from '../../components/side-bar';
import { Link } from 'react-router-dom'
import Scroll from 'react-scroll'
import { TO_CUSTOMER_ACCOUNT, TO_CUSTOMER_ORDERS, WWW_LINK } from '../../helpers/routesConstants';
class OrderFaqContainer extends Component {
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
                            <h3 className="uppercase h4 title-padding">Orders</h3>
                            
                            
                            <p><b>Has my order shipped?</b></p>
                            <p>Click the <Link to={TO_CUSTOMER_ACCOUNT}>"My Account / Orders"</Link> link at the top right hand side of our site to check your orders status.</p>
                            
                            {/* <p><b>How do I change quantities or cancel an item in my order?</b></p>
                            <p>Click the <Link to={TO_CUSTOMER_ACCOUNT}>"My Account / Orders"</Link> link at the top right hand side of our site to view orders you have placed. Then click the <Link to={TO_CUSTOMER_ORDERS}>"Change quantities / cancel orders"</Link> link to find and edit your order. Please note that once an order has begun processing or has shipped, the order is no longer editable. Please contact customer service at +1 (800) 859-6265 (toll free in US/Canada), or +1 586 731-7950 or <a href="mailto:icscontactus@intrepidcs.com">email us</a> for assistance with changing or canceling orders.</p> */}
                            
                            <p><b>How do I track my order?</b></p>
                            <p>Click the <Link to={TO_CUSTOMER_ACCOUNT}>"My Account / Orders"</Link> link at the top right hand side of our site to check your order.</p>
                            
                            <p><b>My order never arrived.</b></p>
                            <p>Click the <Link to={TO_CUSTOMER_ACCOUNT}>"My Account / Orders"</Link> link at the top right hand side of our site to track your order status. Be sure that all of the items in your order have shipped already. If you order displays your Package Tracking Numbers, check with the shipper to confirm that your packages were delivered. If your packages each show a status of "delivered", please contact customer service at +1 (800) 859-6265 (toll free in US/Canada), or +1 586 731-7950 or <a href="mailto:icscontactus@intrepidcs.com">email us</a> for assistance.</p>
                            
                            <p><b>An item is missing from my shipment.</b></p>
                            <p>Click the <Link to={TO_CUSTOMER_ACCOUNT}>"My Account / Orders"</Link> link at the top right hand side of our site to track your order status. Be sure that all of the items in your order have shipped already. If you order displays your Package Tracking Numbers, check with the shipper to confirm that your packages were delivered. If your packages each show a status of "delivered", please contact customer service at +1 (800) 859-6265 (toll free in US/Canada), or +1 586 731-7950 or <a href="mailto:icscontactus@intrepidcs.com">email us</a> for assistance.</p>
                            
                            <p><b>My product is missing parts.</b></p>
                            <p>Click the <Link to={TO_CUSTOMER_ACCOUNT}>"My Account / Orders"</Link> link at the top right hand side of our site to track your order status. Be sure that all of the items in your order have shipped already. If you order displays your Package Tracking Numbers, check with the shipper to confirm that your packages were delivered. If your packages each show a status of "delivered", please contact customer service at +1 (800) 859-6265 (toll free in US/Canada), or +1 586 731-7950 or <a href="mailto:icscontactus@intrepidcs.com">email us</a> for assistance.</p>
                            
                            <p><b>When will my backorder arrive?</b></p>
                            <p>Backordered items are uncommon, but do happen on occasion or for new products. Please contact customer service at +1 (800) 859-6265 (toll free in US/Canada), or +1 586 731-7950 or <a href="mailto:icscontactus@intrepidcs.com">email us</a> for assistance.</p>
                    
                            
                            {/* <p><b>Why Can't I See The Prices?</b></p>
                            <p>Rest assured, we do sell worldwide! Depending on your location, or if your location cannot be detected by our website, you may not see prices displayed. If we do not sell in USD to your region, we do not show the prices. <br></br>Examples of regions where we sell only in local currencies are:</p>
                    
                            <ul>
                                <li>EU</li>
                                <li>India</li>
                                <li>Japan</li>
                                <li>South Korea</li>
                            </ul>
                            <br></br>
                            <p>To get pricing for your region, please <a href="mailto:icscontactus@intrepidcs.com">contact us</a> to get a price quote.</p>
                            
                            <p><b>Why Can't I Add Items to the Shopping Cart?</b></p>
                            <p>Our web site displays prices where applicable, but we only allow online orders for North America and South America at this time. We gladly accept orders worldwide, please <a href="mailto:icscontactus@intrepidcs.com">contact us</a> to get a price quote, or <a href={WWW_LINK} target="_blank">contact one of our distributors and direct offices in your area.</a></p> */}
                    
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default OrderFaqContainer;
