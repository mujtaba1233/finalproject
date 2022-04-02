import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { TO_GET_A_QUOTE, TO_PRIVACY_POLICY, TO_TERM_AND_CONDITION } from '../helpers/routesConstants';

export class Footer extends Component {
    render() {
        return (
            <footer className="main-footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <h4 className="h6">About Us</h4>
                            <p>Intrepid Control Systems is a privately-held company located in suburban Detroit, Michigan. Intrepid focuses on providing high technology computer software and hardware services and products.</p>
                            <p>Intrepid was founded on July 8, 1994 and legally incorporated in the State of Michigan on June 18, 1996. Over the last two decades, the company has completed many engineering projects. It has also developed and successfully marketed numerous products, adding to its portfolio of offerings annually.</p>
                            <hr />
                            {/* <h4 className="h6">Join Our Monthly Newsletter</h4> */}
                            {/* <form>
                                <div className="input-group">
                                    <input type="text" className="form-control" />
                                    <div className="input-group-append">
                                        <button type="button" className="btn btn-secondary"><i className="fa fa-send"></i></button>
                                    </div>
                                </div>
                            </form> */}
                            <hr className="d-block d-lg-none" />
                        </div>
                        {/* <div className="col-lg-3">
                            <h4 className="h6">Blog</h4>
                            <ul className="list-unstyled footer-blog-list">
                                <li className="d-flex align-items-center">
                                    <div className="image"><img src="/assets/img/detailsquare.jpg" alt="..." className="img-fluid" /></div>
                                    <div className="text">
                                        <h5 className="mb-0"> <a href="post.html">Blog post name</a></h5>
                                    </div>
                                </li>
                                <li className="d-flex align-items-center">
                                    <div className="image"><img src="/assets/img/detailsquare.jpg" alt="..." className="img-fluid" /></div>
                                    <div className="text">
                                        <h5 className="mb-0"> <a href="post.html">Blog post name</a></h5>
                                    </div>
                                </li>
                                <li className="d-flex align-items-center">
                                    <div className="image"><img src="/assets/img/detailsquare.jpg" alt="..." className="img-fluid" /></div>
                                    <div className="text">
                                        <h5 className="mb-0"> <a href="post.html">Very very long blog post name</a></h5>
                                    </div>
                                </li>
                            </ul>
                            
                            <hr className="d-block d-lg-none" />
                        </div> */}
                        <div className="col-lg-6 text-right">
                            <h4 className="h6">Contact</h4>
                            <p className="text-uppercase"><strong>INTREPID CONTROL SYSTEMS, INC.</strong><br />1850 RESEARCH DRIVE<br />TROY, MI 48083<br/><strong>USA</strong><br/><Link title="Terms And Conditions" to={TO_TERM_AND_CONDITION}><strong>Terms and Conditions</strong></Link><br/><Link title="Terms And Conditions" to={TO_PRIVACY_POLICY}><strong>Privacy Policy</strong></Link></p><Link title="Get A quote" to={TO_GET_A_QUOTE}><strong>Get a quote</strong></Link>
                            <hr className="d-block d-lg-none" />
                        </div>
                        {/* <div className="col-lg-3">
                            <ul className="list-inline photo-stream">
                                <li className="list-inline-item"><a href="javascript:void(0)"><img src="/assets/img/detailsquare.jpg" alt="..." className="img-fluid" /></a></li>
                                <li className="list-inline-item"><a href="javascript:void(0)"><img src="/assets/img/detailsquare2.jpg" alt="..." className="img-fluid" /></a></li>
                                <li className="list-inline-item"><a href="javascript:void(0)"><img src="/assets/img/detailsquare3.jpg" alt="..." className="img-fluid" /></a></li>
                                <li className="list-inline-item"><a href="javascript:void(0)"><img src="/assets/img/detailsquare3.jpg" alt="..." className="img-fluid" /></a></li>
                                <li className="list-inline-item"><a href="javascript:void(0)"><img src="/assets/img/detailsquare2.jpg" alt="..." className="img-fluid" /></a></li>
                                <li className="list-inline-item"><a href="javascript:void(0)"><img src="/assets/img/detailsquare.jpg" alt="..." className="img-fluid" /></a></li>
                            </ul>
                        </div> */}
                    </div>
                </div>
                <div className="copyrights">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4 text-center-md">
                                <p>Copyright &copy; 2005-{new Date().getFullYear()} | Intrepid Control Systems, Inc.</p>
                            </div>
                            <div className="col-lg-8 text-right text-center-md">
                                <p>Design by <a href="https://www.intrepidcs.com">Intrepid Control Systems </a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
