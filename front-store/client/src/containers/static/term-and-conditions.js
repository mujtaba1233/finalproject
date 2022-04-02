import React, { Component } from 'react';
import SideBar from '../../components/side-bar';
import { Link } from 'react-router-dom'
import Scroll from 'react-scroll'
import { TO_CUSTOMER_ACCOUNT, TO_CUSTOMER_ORDERS } from '../../helpers/routesConstants';
class TermConditionsContainer extends Component {
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
                            <h2><b>Terms and Conditions</b></h2><br></br>
                            
                            
                            <p><b>PLEASE READ THE FOLLOWING TERMS AND CONDITIONS OF USE CAREFULLY BEFORE USING THIS WEBSITE.</b></p>
                            <p>All users of this site agree that access to and use of this site are subject to the following terms and conditions and other applicable law. If you do not agree to these terms and conditions, please do not use this site.</p>
                            
                            <p><b>Copyright</b></p>
                            <p>The entire content included in this site, including but not limited to text, graphics or code is copyrighted as a collective work under the United States and other copyright laws, and is the property of Intrepid Control Systems, Inc.. The collective work includes works that are licensed to Intrepid Control Systems, Inc.. Copyright 1996-2013, Intrepid Control Systems, Inc. ALL RIGHTS RESERVED. Permission is granted to electronically copy and print hard copy portions of this site for the sole purpose of placing an order with Intrepid Control Systems, Inc. or purchasing Intrepid Control Systems, Inc. products. You may display and, subject to any expressly stated restrictions or limitations relating to specific material, download or print portions of the material from the different areas of the site solely for your own non-commercial use, or to place an order with Intrepid Control Systems, Inc. or to purchase Intrepid Control Systems, Inc. products. Any other use, including but not limited to the reproduction, distribution, display or transmission of the content of this site is strictly prohibited, unless authorized by Intrepid Control Systems, Inc.. You further agree not to change or delete any proprietary notices from materials downloaded from the site.</p>
                            
                            <p><b>Trademarks</b></p>
                            <p>All trademarks, service marks and trade names of Intrepid Control Systems, Inc. used in the site are trademarks or registered trademarks of Intrepid Control Systems, Inc.</p>
                            
                            <p><b>Warranty Disclaimer</b></p>
                            <p>This site and the materials and products on this site are provided "as is" and without warranties of any kind, whether express or implied. To the fullest extent permissible pursuant to applicable law, Intrepid Control Systems, Inc. disclaims all warranties, express or implied, including, but not limited to, implied warranties of merchantability and fitness for a particular purpose and non-infringement. Intrepid Control Systems, Inc. does not represent or warrant that the functions contained in the site will be uninterrupted or error-free, that the defects will be corrected, or that this site or the server that makes the site available are free of viruses or other harmful components. Intrepid Control Systems, Inc. does not make any warranties or representations regarding the use of the materials in this site in terms of their correctness, accuracy, adequacy, usefulness, timeliness, reliability or otherwise. Some states do not permit limitations or exclusions on warranties, so the above limitations may not apply to you.</p>
                            
                            <p><b>Limitation of Liability</b></p>
                            <p>Intrepid Control Systems, Inc. shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this site or the performance of the products, even if Intrepid Control Systems, Inc. has been advised of the possibility of such damages. Applicable law may not allow the limitation of exclusion of liability or incidental or consequential damages, so the above limitation or exclusion may not apply to you.</p>
                            
                            <p><b>Typographical Errors</b></p>
                            <p>In the event that a Intrepid Control Systems, Inc. product is mistakenly listed at an incorrect price, Intrepid Control Systems, Inc. reserves the right to refuse or cancel any orders placed for product listed at the incorrect price. Intrepid Control Systems, Inc. reserves the right to refuse or cancel any such orders whether or not the order has been confirmed and your credit card charged. If your credit card has already been charged for the purchase and your order is cancelled, Intrepid Control Systems, Inc. shall issue a credit to your credit card account in the amount of the incorrect price.</p>
                     
                            <p><b>Term; Termination</b></p>
                            <p>These terms and conditions are applicable to you upon your accessing the site and/or completing the registration or shopping process. These terms and conditions, or any part of them, may be terminated by Intrepid Control Systems, Inc. without notice at any time, for any reason. The provisions relating to Copyrights, Trademark, Disclaimer, Limitation of Liability, Indemnification and Miscellaneous, shall survive any termination.</p>
                    
                     
                            <p><b>Notice</b></p>
                            <p>Intrepid Control Systems, Inc. may deliver notice to you by means of e-mail, a general notice on the site, or by other reliable method to the address you have provided to Intrepid Control Systems, Inc.</p>
                    
                     
                            <p><b>Miscellaneous</b></p>
                            <p>Your use of this site shall be governed in all respects by the laws of the state of California, U.S.A., without regard to choice of law provisions, and not by the 1980 U.N. Convention on contracts for the international sale of goods. You agree that jurisdiction over and venue in any legal proceeding directly or indirectly arising out of or relating to this site (including but not limited to the purchase of Intrepid Control Systems, Inc. products) shall be in the state or federal courts located in Los Angeles County, California. Any cause of action or claim you may have with respect to the site (including but not limited to the purchase of Intrepid Control Systems, Inc. products) must be commenced within one (1) year after the claim or cause of action arises. Intrepid Control Systems, Inc.'s failure to insist upon or enforce strict performance of any provision of these terms and conditions shall not be construed as a waiver of any provision or right. Neither the course of conduct between the parties nor trade practice shall act to modify any of these terms and conditions. Intrepid Control Systems, Inc. may assign its rights and duties under this Agreement to any party at any time without notice to you.</p>
                    
                     
                            <p><b>Use of Site</b></p>
                            <p>Harassment in any manner or form on the site, including via e-mail, chat, or by use of obscene or abusive language, is strictly forbidden. Impersonation of others, including a Intrepid Control Systems, Inc. or other licensed employee, host, or representative, as well as other members or visitors on the site is prohibited. You may not upload to, distribute, or otherwise publish through the site any content which is libelous, defamatory, obscene, threatening, invasive of privacy or publicity rights, abusive, illegal, or otherwise objectionable which may constitute or encourage a criminal offense, violate the rights of any party or which may otherwise give rise to liability or violate any law. You may not upload commercial content on the site or use the site to solicit others to join or become members of any other commercial online service or other organization.</p>
                    
                     
                            <p><b>Participation Disclaimer</b></p>
                            <p>Intrepid Control Systems, Inc. does not and cannot review all communications and materials posted to or created by users accessing the site, and is not in any manner responsible for the content of these communications and materials. You acknowledge that by providing you with the ability to view and distribute user-generated content on the site, Intrepid Control Systems, Inc. is merely acting as a passive conduit for such distribution and is not undertaking any obligation or liability relating to any contents or activities on the site. However, Intrepid Control Systems, Inc. reserves the right to block or remove communications or materials that it determines to be (a) abusive, defamatory, or obscene, (b) fraudulent, deceptive, or misleading, (c) in violation of a copyright, trademark or; other intellectual property right of another or (d) offensive or otherwise unacceptable to Intrepid Control Systems, Inc. in its sole discretion.</p>
                    
                     
                            <p><b>Indemnification</b></p>
                            <p>You agree to indemnify, defend, and hold harmless Intrepid Control Systems, Inc., its officers, directors, employees, agents, licensors and suppliers (collectively the "Service Providers") from and against all losses, expenses, damages and costs, including reasonable attorneys' fees, resulting from any violation of these terms and conditions or any activity related to your account (including negligent or wrongful conduct) by you or any other person accessing the site using your Internet account.</p>
                    
                     
                            <p><b>Third-Party Links</b></p>
                            <p>In an attempt to provide increased value to our visitors, Intrepid Control Systems, Inc. may link to sites operated by third parties. However, even if the third party is affiliated with Intrepid Control Systems, Inc., Intrepid Control Systems, Inc. has no control over these linked sites, all of which have separate privacy and data collection practices, independent of Intrepid Control Systems, Inc.. These linked sites are only for your convenience and therefore you access them at your own risk. Nonetheless, Intrepid Control Systems, Inc. seeks to protect the integrity of its web site and the links placed upon it and therefore requests any feedback on not only its own site, but for sites it links to as well (including if a specific link does not work).</p>
                    

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default TermConditionsContainer;
