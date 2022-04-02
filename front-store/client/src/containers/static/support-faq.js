import React, { Component } from 'react';
import SideBar from '../../components/side-bar';
import { Link } from 'react-router-dom'
import Scroll from 'react-scroll'
import { TO_ABOUTUS } from '../../helpers/routesConstants';
class SupportFaqContainer extends Component {
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
                        <h3 className="uppercase h4 title-padding">Additional Support</h3>
                            
                            
                            <p><b>How do I contact you?</b></p>
                            <p>Please <Link to={TO_ABOUTUS}>click here</Link> for our company contact information.</p>
                    
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default SupportFaqContainer;
