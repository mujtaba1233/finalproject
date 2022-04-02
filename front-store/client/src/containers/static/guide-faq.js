import React, { Component } from 'react';
import SideBar from '../../components/side-bar';
import { Link } from 'react-router-dom'
import Scroll  from 'react-scroll'
import { TO_CUSTOMER_ACCOUNT, TO_CUSTOMER_ORDERS } from '../../helpers/routesConstants';
class GuideFaqContainer extends Component {
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
                        <h3 className="uppercase h4 title-padding">Buyer's Guide</h3>
                            
                            
                            <p><b>How do I find my product?</b></p>
                            <p>To find the product(s) you're looking for, there are several ways:</p>
                            <ul>
                                <li>Use the navigation menus on the left & top of our website.</li>
                                <li>Type a keyword into the SEARCH box.</li>
                                <li>Use the All Products listing in the navigation menu on the left of our website</li>
                            </ul>
                            <br></br>        
                            <p>If you have any trouble locating a product, please contact customer service at +1 (800) 859-6265 (toll free in US/Canada), or +1 586 731-7950 or <a href="mailto:icscontactus@intrepidcs.com">by email</a>.</p>
                            
                            
                            <p><b>How do I navigate the site?</b></p>
                            <p>To navigate this website, simply click on a category you might be interested in. </p>
                            <ul>
                                <li>Categories are located on the top, left & bottom of our website. </li>
                                <li>Place your mouse cursor over anything you think could be a clickable link. You'll notice that anytime you scroll over something that is a link, your mouse cursor will become a "hand". </li>
                                <li>Scrolling over anything that is NOT a link will leave your cursor as an "arrow".</li>
                                <li>You may also type a keyword into the SEARCH box to quickly find a specific product. </li>
                                <li>You can find a list of recently visited items at the bottom of the webpage.</li>
                                <li>Items that are related to the item you are viewing will be shown to the right.</li>
                            </ul>
                            <br></br>        
                            <p>If you have any trouble locating a product, please contact customer service at +1 (800) 859-6265 (toll free in US/Canada), or +1 586 731-7950 or <a href="mailto:icscontactus@intrepidcs.com">by email</a>.</p>
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default GuideFaqContainer;
