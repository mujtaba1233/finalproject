import React, { Component } from 'react';
import SideBar from '../../components/side-bar';
import { Link } from 'react-router-dom'
import Scroll from 'react-scroll'
class PrivacyPolicyContainer extends Component {
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
                            <h3 className="uppercase h4 title-padding">Privacy Policy</h3><br></br>
                            
                            <p>Legal</p>
                            <strong><h3 style={{textAlign:"center"}}>Intrepid Control Systems Customer Privacy Policy </h3></strong>
                            <p>Intrepid is committed to your privacy. Please read our customer Privacy Policy for a clear explanation of how we collect, use, disclose, transfer, and store your information.</p>
                            <p>Updated: March 18th, 2021</p>
                            <p>California Privacy Disclosures </p>
                            <p>California consumers have a right to knowledge, access, and deletion of their personal information under the California Consumer Privacy Act.</p>
                            <p></p>
                            <p>GDPR Privacy Notice</p>
                            <p>1. Introduction</p>
                            <p>Intrepid Control Systems, Inc. (hereafter identified as “Intrepid”) is a company headquartered in the State of Michigan in the United States. Intrepid provides vehicle network hardware and software tools, some of which are based on a Software as a Service (SaaS) model. At Intrepid, the privacy and security of our customers is important. Intrepid is committed to protecting the data you share with us. This privacy policy explains how Intrepid processes information that can be used to directly or indirectly identify an individual (“Personal Data”) collected through the course of business, or the use of its websites, such as intrepidcs.com, wirelessneovi.com, and related platforms.
For the purposes of this policy, Intrepid defines the term “User” as an entity with which Intrepid has a business relationship, and the term “Visitor” as an individual that visits our front-end website (for example www.intrepidcs.com), provides personal info to Intrepid at a trade show or exhibit, registers or attends an event sponsored or held by Intrepid, or otherwise contacts Intrepid via any medium.
Any information stored by Intrepid is treated as confidential. All information is stored securely and is accessed by authorized personnel only. Intrepid implements and maintains appropriate technical, security and organizational measures to protect Personal Data against unauthorized or unlawful processing and use, and against accidental loss, destruction, damage, theft or disclosure.</p>
                    
                            <p>2. Collection and Use</p>
                            <p>2.1 General</p>
                            <p>The following sections cover the specifics of each of the two groups from which data is collected: Visitors, and Users.</p>
                            
                            <p>2.2 Visitors</p>
                            <p>If you are a Visitor to any of Intrepid’s websites, or otherwise contact Intrepid, then this section is relevant for you.
By contacting Intrepid or visiting any of Intrepid’s websites, you consent to the collection and use of your Personal Data as described herein. If you do not agree with the terms set out herein, please do not visit Intrepid’s websites, and do not disclose your personal data. If required by applicable law, we will seek your explicit consent to process Personal Data collected on this website or volunteered by you. Please note that any consent will be entirely voluntary. However, if you do not grant the requested consent to the processing of your Personal Data, the use of Intrepid’s websites, or conducting business with you may not be possible.
Intrepid may collect, record and analyze information of Visitors to its websites. We may record your IP address and use cookies. Intrepid may add information collected by way of pageview activity. Furthermore, Intrepid may collect and process any Personal Data that you volunteer to us in our website’s forms, such as when you register for events or sign up for information and newsletters. If you provide Intrepid with your social media details, Intrepid may retrieve publicly available information about you from social media.
Such Personal Data may comprise your IP address, first and last name, your postal and email address, your telephone number, your job title, data for social networks, your areas of interest, interest in Intrepid products, interest in competitive products, and certain information about the company you are working for (company name and address), as well as information as to the type of relationship that exists between Intrepid and yourself.
Intrepid gathers data about visits to the website, including numbers of Visitors and visits, geolocation data, length of time spent on the site, pages clicked on, or where Visitors have come from.</p>
                            
                            
                            <p>2.2.1 Purpose of Processing Personal Data</p>
                            <p>Intrepid uses the collected data to communicate with Visitors, to understand relationships between Visitors and other Visitors or Users, customize content for Visitors, to show ads on other websites to Visitors, and to improve its website by analyzing how Visitors navigate its website.</p>
                            
                            <p>2.2.2 Sharing Personal Data</p>
                            <p>Intrepid may also share such information with service vendors or contractors in order to provide a requested service or transaction or in order to analyze the Visitor behavior on its website.</p>
                            
                            
                            <p>2.2.3 Cookies</p>
                            <p>Cookies are small pieces of information sent by a website to a Visitor’s computing device. By continuing to visit the website, you agree to the placement of cookies on your device. If you choose not to accept our cookies, we cannot guarantee that your experience will be satisfactory, or provide complete information on Intrepid products. We may also place cookies from third parties for functional and marketing purposes.</p>
                            
                            
                            <p>2.2.4 Links to Other Sites</p>
                            <p>Please be aware that while visiting our site, Visitors can follow links to other sites that are beyond our direction or control. Intrepid is not responsible for the content or privacy policy of these other sites.</p>
                            
                            
                            <p>2.3 Users<br></br>2.3.1 General</p>
                            <p>In order to provide services to its Users, Intrepid collects certain types of data from them. This section will describe how this data are collected and used by Intrepid.</p>
                            
                            
                            <p>2.3.2 Collection of User Data</p>
                            <p>During a User’s registration on an Intrepid website, or during the process of starting or conducting a business relationship, the User may provide information such as name, company name, email, address, telephone, credit card number and other relevant data. This information is used by Intrepid to identify the User and provide them with support, services, mailings, sales and marketing actions, billing and to meet contractual and legal obligations.</p>
                            <p>Intrepid Users can at any time access and edit, update or delete their contact details by logging in with their username and password to Intrepid’s platforms. Intrepid will not retain User data longer than is necessary to fulfill the purposes for which it was collected or as required by applicable laws or regulations.</p>
                            
                            
                            <p>3. Geolocation</p>
                            <p>Intrepid’s servers and offices are located in the United States. Personal Data of Visitors and Users will be transferred to, and processed in, the United States. We have taken appropriate safeguards to require that your information will remain protected in accordance with this Privacy Policy.</p>
                            
                            
                            <p>3.1 WirelessneoVI.com</p>
                            <p>The location of WirelessneoVI.com servers is dependent upon the entity which has contracted the server.</p>
                            <p>3.1.1 Contracts for the EEA</p>
                            <p>In the case of WirelessneoVI.com contracts or trials with entities located in EEA, the WirelessneoVI.com servers are located in the EEA.</p>
                            <p>3.1.2 Contracts for Other Countries</p>
                            <p>In the case of WirelessneoVI.com contracts or trials with entities located in countries other than the EEA, the WirelessneoVI.com servers are located in United States.</p>
                            
                            
                            <p>4. Retention and Deletion</p>
                            <p>Intrepid will not retain data longer than is necessary to fulfill the purposes for which it was collected or as required by applicable laws or regulations. When a User’s or Visitor’s account is terminated or expired, all Personal Data collected through the platform will be deleted, as required by applicable law. Requests for deletion of Personal Data may be submitted by sending a request to gdpr@intrepidcs.com.</p>
                            
                            
                            <p>5. Acceptance of These Conditions</p>
                            <p>We assume that all Visitors, and Users of Intrepid’s platforms have carefully read this document and agree to its contents. If someone does not agree with this privacy policy, they should refrain from using our website, attending or registering our events, and platforms. We reserve the right to change our privacy policy as necessity dictates. Continued use of Intrepid website and platforms after having been informed of any such changes to these conditions implies acceptance of the revised Privacy Notice. This Privacy Notice is an integral part of Intrepid’s terms of use.</p>
                            
                            
                            <p>6. Our Legal Obligation to Disclose Personal Information</p>
                            <p>We will reveal a user’s personal information without his/her prior permission only when we have reason to believe that the disclosure of this information is required to establish the identity of, to contact or to initiate legal proceedings against a person or persons who are suspected of infringing rights or property belonging to Intrepid or to others who could be harmed by the user’s activities or of persons who could (deliberately or otherwise) transgress upon these rights and property. We are permitted to disclose personal information when we have good reason to believe that this is legally required.</p>
                            
                            
                            <p>7. Intrepid’s Data Protection Officer</p>
                            <p>Intrepid has a “Data Protection Officer” who is responsible for matters relating to privacy and data protection. This Data Protection Officer can be reached at the following address:</p>
                            
                            <p>Intrepid Control Systems, Inc.</p>
                            <p>Attn: Data Protection Officer</p>
                            <p>1850 Research Dr,</p>
                            <p>Troy, MI 48083</p>
                            <p>USA<br></br>gdpr@intrepidcs.com</p>

                            <p>8. Additional Information and Requests</p>
                            <p>If you have any further questions regarding the data Intrepid collects, or how we use it, then please feel free to contact us:</p>
                        
                            <p>Intrepid Control Systems, Inc.</p>
                            <p>Attn: Data Protection Officer</p>
                            <p>1850 Research Dr, </p>
                            <p>Troy, MI 48083</p>
                            <p>USA<br></br>gdpr@intrepidcs.com</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default PrivacyPolicyContainer;
