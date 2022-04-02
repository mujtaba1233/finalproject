import React, { Component } from 'react';
import SideBar from '../../components/side-bar';
import { Link } from 'react-router-dom'
import Scroll from 'react-scroll'
class ShippingContainer extends Component {
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
                            <p><b>Shipping Options</b></p>

                            <p>Shipping within the USA:</p>


                            <p>We prefer UPS! We charge a standard $20.00 flat rate for UPS ground shipping and handling within the continental USA. We can also expedite shipping at an additional charge. We can ship on your courier's account number, but check with us before placing your order.</p>                        
                            
                            <p>Shipping outside the USA:</p>  

                            <p>We use UPS International shipping unless otherwise required. UPS has proven to be the easiest and most reliable way of shipping internationally for us.  We charge the prevailing UPS international rates for shipping. Tariffs, import taxes and fees are the responsibility of the receiver.</p>                        
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default ShippingContainer;
