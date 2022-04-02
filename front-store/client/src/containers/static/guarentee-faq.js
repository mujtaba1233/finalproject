import React, { Component } from 'react';
import SideBar from '../../components/side-bar';
import { Link } from 'react-router-dom'
import Scroll from 'react-scroll'
import { TO_CUSTOMER_ACCOUNT, TO_CUSTOMER_ORDERS, WWW_LINK, TO_PRIVACY_POLICY } from '../../helpers/routesConstants';
class GuarenteeFaqContainer extends Component {
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
                            <h3 className="uppercase h4 title-padding">Guarantees</h3>
                            
                            
                            <p><b>Privacy Policy</b></p>
                            <p>We value your privacy. Please view our <Link to={TO_PRIVACY_POLICY} >Privacy Policy</Link> for complete details on how we use the information we collect.</p>
                    
                            <p><b>Security</b></p>
                            <p>This website is protected with SSL (secure socket layer) encryption, the highest standard in Internet security.  Click on our SSL icon to verify our Security Certificate.</p>
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default GuarenteeFaqContainer;
