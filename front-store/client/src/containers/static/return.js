import React, { Component } from 'react';
import SideBar from '../../components/side-bar';
import Scroll from 'react-scroll';
import { Link } from 'react-router-dom';
class ReturnContainer extends Component {
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
                            <p><b>How do I return an item?</b></p>
                            <p><b>To return defective equipment:</b></p>

                            <p>You must first get a Return Material Authorization (RMA) Number from our support department. You can start the process in two ways:</p>


                            <p>1. Email <a href="mailto:icsreturns@intrepidcs.com">ICS Returns</a> . Make sure to include your hardware serial number in the body of your email, and an explanation of what's wrong. Feel free to include pictures and attachments to help us understand the issue.</p>                        
                            <p>2. Call ICS Support at +1 (800) 859-6265 (toll free in US/Canada), or +1 586-731-7950, extension 1.  Support is open from 8AM-5PM (08:00-17:00) Eastern Standard Time (GMT -5).</p>                        
                            <p>Be prepared to assist our Support in performing some checks on your equipment. This usually requires powering your neoVI and running our Vehicle Spy software.</p>                        
                            <p>We will issue a RMA Number which you will need to include on the box and on the shipping documents for tracking during exchange/repair.</p>                        
                            <p>To return for any other reason:</p>                        
                            <p>You can start the process in two ways:</p>                        
                            <p>1. Send email to <a href="mailto:icsreturns@intrepidcs.com">ICS Returns</a> . Make sure to include your hardware serial number in the body of your email, and an explanation of what's wrong. Feel free to include pictures and attachments to help us understand the issue.</p>                        
                            <p>2. Call ICS at +1 (800) 859-6265 (toll free in US/Canada), or +1 586-731-7950, extension 0.  We open from 8AM-5PM (08:00-17:00) Eastern Standard Time (GMT -5).</p>                        
                            <p>Returns are subject to a restocking fee in most cases.  We will issue a RMA Number which you will need to include on the box and on the shipping documents.</p>                        
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default ReturnContainer;
