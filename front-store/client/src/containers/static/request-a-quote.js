import React, { Component } from 'react';
class RequestAQuoteContainer extends Component {
    constructor(){
        super()
        this.state = {
            iframe: 'https://webforms.pipedrive.com/f/2XhLT8rh8zexlMYaK9rJPxJVCurAQbkqX3hmDYkecwTin76WD7p6r2DeEjcWGI7sf'
        }
    }
    render() {
        return (
            <div id="content">
                <div className="container">
                    <div className="row bar">
                        <div className="col-md-12">
                            <div className='d-flex justify-content-center'>
                                <iframe src={this.state.iframe} sandbox='allow-scripts' allowFullScreen={true} scrolling="no" style={{ "width": "100%", "height": "1000px",  "overFlow": "hidden"}} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default RequestAQuoteContainer;
