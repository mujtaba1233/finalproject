import React, { Component } from 'react';
// import { fetchProducts } from '../actions/productAction';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { TO_REGISTER, TO_STORE, TO_CART, TO_CUSTOMER_ACCOUNT, TO_HOME, TO_LOGIN, TO_FAQ, TO_PRICES_CART_FAQ_ANSWER, TO_GET_A_QUOTE } from "../helpers/routesConstants"
import LogoutButton from './logout-button';
import MetaTags from 'react-meta-tags';
class Header extends Component {
    render() {
        return (
            <div>
                <MetaTags>
                    <title>Intrepid Control Systems</title>
                    <meta name="description"  content="Intrepid Control Systems is a privately-held company located in suburban Detroit, Michigan. Intrepid focuses on providing high technology computer software and hardware services and products." />
                    <meta property="og:title" content="Intrepid Control Systems"/>
                    <meta property="og:image" content="path/to/image.jpg" />
                </MetaTags>
                {this.props.regionFaild && <div className="alert alert-danger" style={{ marginBottom: 0 }} role="alert">
                    <button type="button" className="close" data-dismiss="alert">×</button>
                    <strong>Not seeing prices?</strong> we are having trouble to get your region, try opening it with private browsing. <Link to={TO_PRICES_CART_FAQ_ANSWER}>More info</Link>
                </div>}
                <div className="top-bar">
                    <div className="container">
                        <div className="row d-flex align-items-center">
                            <div className="col-md-9 d-md-block d-none">
                                <div className="row">
                                    <div className="col-md-3 p-0"><p><a className="mainStore" href="https://www.intrepidcs.com">Return to Main Site</a></p></div>
                                    <div className="col-md-3 p-0"><p>PHONE: +1-800-859-6265</p></div>
                                    <div className="col-md-3 p-0"><p>FAX: +1 (586) 731-2274</p></div>
                                    <div className="col-md-3 p-0"><Link style={{color:"#fff"}} title="Get A quote" to={TO_GET_A_QUOTE}>Get a quote</Link></div>
                                    {/* <div className="col-md-3 p-0" style={{ marginTop: "-2.5px" }}><a className="txt-white" style={{ fontSize: "0.75rem" }} href="mailto:icscontactus@intrepidcs.com?Subject=Customer%20Query" target="_top">E-Mail: icscontactus@intrepidcs.com</a></div> */}
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="d-flex justify-content-md-end justify-content-between">
                                    <ul className="list-inline contact-info d-block d-md-none">
                                        {/* <li className="list-inline-item"><a href={'#'}><i className="fa fa-phone"></i></a></li>
                                        <li className="list-inline-item"><a href={'#'}><i className="fa fa-fax"></i></a></li>
                                        <li className="list-inline-item"><a href="mailto:icscontactus@intrepidcs.com?Subject=Customer%20Query"><i className="fa fa-envelope"></i></a></li> */}
                                    </ul>
                                    {!this.props.isLoggedIn && (
                                        <div className="login">
                                            <Link title="Sign In" to={TO_LOGIN} className="login-btn"><i className="fa fa-sign-in"></i><span className="d-none d-md-inline-block">Sign In</span></Link>
                                            <Link title="Sign Up" to={TO_REGISTER} className="signup-btn"><i className="fa fa-user"></i><span className="d-none d-md-inline-block">Sign Up</span></Link>
                                        </div>
                                    )}
                                    {this.props.isLoggedIn && (
                                        <div className="login">
                                            <Link to={TO_CUSTOMER_ACCOUNT} className="login-btn"><span className="d-none d-md-inline-block">{this.props.customer.FirstName} {this.props.customer.LastName}</span></Link>
                                            <LogoutButton history={this.props.history} className="signup-btn" text="" />
                                            {/* <Link title="Sign Out" to={TO_LOGOUT} className="signup-btn"><span className="d-none d-md-inline-block"><i className="fa fa-power-off"></i> </span></Link> */}
                                        </div>
                                    )}

                                    {/* <ul className="social-custom list-inline">
                                        <li className="list-inline-item"><a href="javascript:void(0)"><i className="fa fa-facebook"></i></a></li>
                                        <li className="list-inline-item"><a href="javascript:void(0)"><i className="fa fa-google-plus"></i></a></li>
                                        <li className="list-inline-item"><a href="javascript:void(0)"><i className="fa fa-twitter"></i></a></li>
                                        <li className="list-inline-item"><a href="javascript:void(0)"><i className="fa fa-envelope"></i></a></li>
                                    </ul> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="login-modal" tabIndex="-1" role="dialog" aria-labelledby="login-modalLabel" aria-hidden="true" className="modal fade">
                    <div role="document" className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 id="login-modalLabel" className="modal-title">Customer Login</h4>
                                <button type="button" data-dismiss="modal" aria-label="Close" className="close"><span aria-hidden="true">×</span></button>
                            </div>
                            <div className="modal-body">
                                <form action="customer-orders.html" method="get">
                                    <div className="form-group">
                                        <input id="email_modal" type="text" placeholder="email" className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <input id="password_modal" type="password" placeholder="password" className="form-control" />
                                    </div>
                                    <p className="text-center">
                                        <button className="btn btn-template-outlined"><i className="fa fa-sign-in"></i> Log in</button>
                                    </p>
                                </form>
                                <p className="text-center text-muted">Not registered yet?</p>
                                <p className="text-center text-muted"><a href="customer-register.html"><strong>Register now</strong></a>! It is easy and done in 1 minute and gives you access to special discounts and much more!</p>
                            </div>
                        </div>
                    </div>
                </div>
                <header className="nav-holder make-sticky">
                    <div id="navbar" role="navigation" className="navbar navbar-expand-lg">
                        <div className="container">
                            <div className="header-border-bottom">
                                <Link to={TO_HOME} className="navbar-brand home">
                                    <img src="/assets/img/logo2.png" alt="Intrepid logo" className="d-block d-md-inline-block logo-img" />
                                    {/* <img src="/assets/img/logo.png" alt="Intrepid logo" className="d-inline-block d-md-none logo-img" /> */}
                                    <span className="sr-only">Intrepid - go to homepage</span>
                                </Link>
                                {/* <div className="header-padding">
                                    <h1 className="h2">INTREPID CONTROL SYSTEMS <span className="txt-blue">STORE</span></h1>
                                </div> */}
                                <button type="button" data-toggle="collapse" data-target="#navigation" id="check" className="navbar-toggler btn-template-outlined"><span className="sr-only">Toggle navigation</span><i className="fa fa-align-justify"></i></button>
                                <div id="navigation" className="navbar-collapse collapse">
                                    <ul className="nav navbar-nav ml-auto" id="aligning">
                                        <li className="nav-item"><NavLink to={TO_STORE}>Store </NavLink></li>
                                        {this.props.isLoggedIn && (
                                            <li className="nav-item menu-large"><NavLink activeClassName='active' to={TO_CUSTOMER_ACCOUNT}>My Account/Orders</NavLink></li>
                                        )}
                                        <li className="nav-item menu-large"><NavLink activeClassName='active' to={TO_CART}>View Cart {this.props.cartItems.length ? `(${this.props.cartItems.length})` : ''}</NavLink></li>
                                        <li className="nav-item"><NavLink activeClassName='active' to={TO_FAQ}>HELP</NavLink></li>
                                    </ul>
                                </div>
                                <div id="search" className="collapse clearfix">
                                    <form role="search" className="navbar-form">
                                        <div className="input-group">
                                            <input type="text" placeholder="Search" className="form-control" /><span className="input-group-btn">
                                                <button type="submit" className="btn btn-template-main"><i className="fa fa-search"></i></button></span>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                {/* <div id="heading-breadcrumbs">
                    <div className="container">
                        <div className="row d-flex align-items-center flex-wrap">
                            <div className="col-md-7">
                                <h1 className="h2">INTREPID CONTROL SYSTEMS <span className="txt-blue">STORE</span></h1>
                            </div>
                            <div className="col-md-5">
                                <ul className="breadcrumb d-flex justify-content-end">
                                    <li className="breadcrumb-item"><Link to={TO_HOME}>Store </Link></li>
                                    <li className="breadcrumb-item active">INTREPID CONTROL SYSTEMS STORE</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        );
    }
}
const stateMapHeader = (state) => {
    return {
        isLoggedIn: state.global.isLoggedIn,
        regionFaild: state.global.regionFaild,
        customer: state.customer.customer.result,
        cartItems: state.cart,
    };
};

export default connect(stateMapHeader)(Header);
