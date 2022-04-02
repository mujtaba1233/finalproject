import React, { Component } from 'react';
import SideBar from '../../components/side-bar';
import { Link } from 'react-router-dom';
import Scroll from 'react-scroll';
import { WWW_LINK } from '../../helpers/routesConstants';
class AboutUsContainer extends Component {
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
                            <h3 className="uppercase h4 title-padding">INTREPID CONTROL SYSTEMS, INC.</h3>
                            <p><b>Intrepid Control Systems (ICS)</b> is a privately-held company located in suburban <a href={WWW_LINK} target="_blank">Detroit, Michigan</a>. Intrepid focuses on providing high technology computer software and hardware services and products.</p>

                            <p>Intrepid was founded on July 8, 1994 and legally incorporated in the State of Michigan on June 18, 1996. Over the last two decades, the company has completed many engineering projects. It has also developed and successfully marketed numerous products, adding to its portfolio of offerings annually.</p>

                            <p>Intrepid has developed an impressive <a href="https://www.intrepidcs.com/customers/" target="_blank">list of clients</a>, ranging from Fortune 100 companies to individual hobbyists. A truly international business, Intrepid has sold its software and hardware products to customers around the globe.</p>                        

                            <p>Intrepid's service business is highly automotive-oriented. The company participates in many industry trade shows and seminars, and has contributed automotive-related technical articles to them. This includes Detroit's most prestigious and largest trade show, the SAE (Society of Automotive Engineers) International Congress.</p>                        
                            
                            <p>Proximity to customers has allowed Intrepid to provide excellent customer service. With offices in <a href={WWW_LINK} target="_blank">China, Germany, India, Japan and Korea</a> supplementing our US headquarters, Intrepid provides unparalleled support to its clients worldwide.</p>                        


                            <p><b>Contact Us:</b></p>

                            <p>Intrepid Control Systems, Inc.</p>
                            <p>1850 Research Drive</p>
                            <p>Troy, MI 48083</p>
                            <p>USA</p>

                                <br></br>
                                <br></br>
                            <p>US/Canada: (800) 859-6265</p>
                            <p>Phone: (586) 731-7950</p>
                            <p>Fax: (586) 731-2274</p>
                            <p>Email: <a href="mailto:icscontactus@intrepidcs.com">Email ICS</a></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default AboutUsContainer;
