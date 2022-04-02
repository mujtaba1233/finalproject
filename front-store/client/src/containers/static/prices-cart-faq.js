import React, { Component } from 'react';
import SideBar from '../../components/side-bar';
import Scroll from 'react-scroll';
import { Link } from 'react-router-dom'
import { TO_CUSTOMER_ACCOUNT, TO_CUSTOMER_ORDERS, WWW_LINK } from '../../helpers/routesConstants';
class PricesCartFaqContainer extends Component {
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
                            <h3 className="uppercase h4 title-padding">Can't See Prices or Add Items to Cart?</h3>
                            
                            <p><b>Why Can't I See The Prices?</b></p>
                            <p>Rest assured, we do sell worldwide! There are two reasons you may not be able to see prices:</p>
                            <p>1. If we do not sell in USD to your region, we do not show the prices. Examples of regions where we sell only in local currencies are:</p>
                            <ul>
                                <li>EU</li>
                                <li>UK</li>
                                <li>India</li>
                                <li>Japan</li>
                                <li>South Korea</li>
                            </ul>
                            <br></br>
                            <p>To get pricing for your region, please <a href="mailto:icscontactus@intrepidcs.com">contact us</a> to get a price quote.</p>
                            <br></br>
                            
                            <p>2. Our website may not detect your location, or your location may be incorrectly detected. To remedy this, try the following:</p>
                            <ul>
                                <li>1. Turn off VPN</li>
                                <li>2. Clear cookies and cache, then close and reopen browser and try again</li>
                                <li>3. Use a VPN but switch it to a US location</li>
                                <li>4. Clear cookies/cache and then try private/incognito mode</li>
                            </ul>
                            <br></br>
                            <p><b>Why Can't I Add Items to the Shopping Cart?</b></p>
                            <p>
                            Our website displays prices where applicable, but we only allow online orders for North America and South America at this time. We gladly accept orders worldwide, please <a href="mailto:icscontactus@intrepidcs.com">contact us</a> to get a price quote, or <a href="https://www.intrepidcs.com/worldwide/">contact one of our distributors and direct offices in your area.</a>

                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default PricesCartFaqContainer;
