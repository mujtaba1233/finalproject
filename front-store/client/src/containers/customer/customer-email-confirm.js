import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'react-router-dom/Link';
import { TO_LOGIN } from '../../helpers/routesConstants';

class CustomerAccountContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valid: false
        }
    }
    componentWillMount() {
        if (this.props.match.params.token.length === 64) {
            this.setState({ valid: true })
        }
    }
    componentDidUpdate(prevProps) {
        
    }
    render() {
        return (
            <div id="content">
                <div className="container">
                    <div className="row bar">
                        {this.state.valid && (
                            <div id="customer-account" className="col-lg-12 clearfix">
                                <p className="lead">Your email has been confirmed successfully.</p>
                                <p className="text-muted">You may proceed to login? <Link to={TO_LOGIN}> Log in Here</Link></p>
                            </div>
                        )}
                        {!this.state.valid && (
                            <div id="customer-account" className="col-lg-12 clearfix">
                                <p className="lead">Invalid URL or email has been confirmed already.</p>
                                <p className="text-muted">You may proceed to login? <Link to={TO_LOGIN}> Log in Here</Link></p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const stateMap = (state) => {
    return {
        products: state.product.products,
    };
};

export default connect(stateMap)(CustomerAccountContainer);
