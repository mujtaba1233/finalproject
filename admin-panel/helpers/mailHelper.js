'use strict';
var nodemailer = require('nodemailer');
var utility = require('../helpers/utilities');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
// create reusable transporter object using the default SMTP transport
// setup email data with unicode symbols
var transporter = nodemailer.createTransport({
    host: 'codeverx.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "noreply@greyloops.com", // generated ethereal user
        pass: "Admin125!@%"// generated ethereal password
    }, tls: {
        rejectUnauthorized: false
    }
});

var orderItemDetails = function (orderList, CurrencyCode) {
    let list = "";
    orderList.map((obj,index) => {
        let keys = []
        let options = {}
        console.log(index,obj.Options);
        if (obj.Options) {
            options = JSON.parse(obj.Options)
            keys = Object.keys(options)
        }
        list += `<tr>
        <td valign="top">${obj.ProductCode}</td>
        <td valign="top">${obj.ProductName}<br>${keys.length > 0 ? keys.map(key => { return ' <strong>' + options[key].type + '</strong>: ' + options[key].name }) : ''}</td>
        <td valign="top" style="text-align: right">${obj.Quantity}</td>
        <td valign="top" style="text-align: right">${CurrencyCode}${obj.ProductPrice}</td>
        <td valign="top" style="text-align: right">${CurrencyCode}${obj.TotalPrice}</td>
        </tr>`;
    });
    return list;
}
var QuoteItemDetails = function (orderList, CurrencyCode) {
    let list = "";
    let total = 0
    orderList.map((obj,index) => {
        let keys = []
        let options = {}
        console.log(index,obj.Options);
        if (obj.Options) {
            options = JSON.parse(obj.Options)
            keys = Object.keys(options)
        }
        
        list +=`<tr><td colspan="5"><hr></hr></td></tr><tr>`
        if(obj.parentName !== ""){
            list+=` <td valign="top"><strong>${obj.ProductCode}</strong></td>`
        }
        else{
            list+=`<td valign="top">&nbsp;&nbsp;${obj.ProductCode}</td>`
        }
        list+=`<td valign="top">${obj.ProductName}<br>${keys.length > 0 ? keys.map(key => { return ' <strong>' + options[key].type + '</strong>: ' + options[key].name }) : ''}</td>
        <td valign="top" style="text-align: right">${obj.Qty}</td>
        <td valign="top" style="text-align: right">${CurrencyCode}${obj.Price}</td>
        <td valign="top" style="text-align: right">${CurrencyCode}${obj.Price * obj.Qty}</td>
        </tr>`;
        total += (obj.Price * obj.Qty)
    });
    list += `<tr><td colspan="3"></td><td  valign="top" style="text-align: right">Total:</td><td   valign="top" style="text-align: right">${CurrencyCode}${total}</td></tr>`
    return list;
}
var send = function (mailOptions, callback) {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            if (callback) {
                console.log(error, "This is the errror")
                callback({ status: false, msg: "Email not send, Try again!" });
            }
            return error;
        }
        if (callback) {
            console.log("Message Sent")
            callback({ status: true, msg: "Email sent to your provided Email Address" });
        }

        // Preview only available when sending through an Ethereal account
        // console.log(new Date(), 'Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
}
exports.send = send
// send mail with defined transport object
exports.sendMail = function (mailObj) {
    var mailOptions = {
        from: '"Intrepidcs" <no-reply@intrepidcs.com>', // sender address
        to: mailObj.to, // list of receivers
        subject: mailObj.subject || 'E-mail confirmation for Intrepidcs registration', // Subject line
        // text: 'This text will never show up there!!', // plain text body
        html: mailObj.userType === "external" ? mailObj.html || '<b>Dear ' + mailObj.lname + ', ' + mailObj.fname + '</b>' +
            '<br><br><p>You are invited to join <a href="' + mailObj.siteLink + '">Intrepidcs</a>, ' +
            'click this below link to set your password.' +
            '<br>' + mailObj.link + '<br>Thank you.' : mailObj.html || '<b>Dear ' + mailObj.lname + ', ' + mailObj.fname + '</b>' +
            '<br><br><p>You are invited to join <a href="' + mailObj.siteLink + '">Intrepidcs</a>, ' +
            'click this below link to confirm your email.' +
            '<br>' + mailObj.link + '<br>Thank you.',
        attachments: mailObj.attachments || []
    };
    send(mailOptions)
}
//Send mail to customer on changing order status
exports.sendOrderStatusMail = function (mailObj) {
    // var mailOptions = {
    //     from: '"Intrepidcs" <no-reply@intrepidcs.com>', // sender address
    //     to: mailObj.to, // list of receivers
    //     subject: mailObj.subject || 'Order Status Updated', // Subject line
    //     text: 'This text will never show up there!!', // plain text body
    //     html: mailObj.html || '<b>Dear ' + mailObj.lname + ', ' + mailObj.fname + '</b>' +
    //         '<br><br><p>Your Order # ' + mailObj.orderId + ' Status has been changed to ' + mailObj.newOrderStatus +
    //         '<br>Thank you.',
    //     attachments: mailObj.attachments || []
    // };
    // send(mailOptions)
    var mailOptions = {
        from: '"Intrepidcs" <no-reply@intrepidcs.com>', // sender address
        to: mailObj.EmailAddress, // list of receivers
        replyTo: process.env.ORDER_CONFIRM_EMAIL,
        subject: `Order number # ${mailObj.OrderID} ${mailObj.OrderStatus}`, // Subject line
        // text: 'This text will never show up there!!', // plain text body
        html: `<div>
		<table width="650" border="1" cellspacing="0" cellpadding="20" bgcolor="#FFFFFF" align="center">
		 <tbody><tr>
		  <td>
		   <table width="100%" border="0" cellspacing="1" cellpadding="5">
			<tbody><tr valign="top"> 
			 <td><a href="https://store.intrepidcs.com/Default.asp" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://store.intrepidcs.com/Default.asp&amp;source=gmail&amp;ust=1573323479255000&amp;usg=AFQjCNF3S7UK1OzY0-obcv-KSi-oREnDUA"><img src="https://ci3.googleusercontent.com/proxy/0kHJ2_p1LretdJOm9658aUAlemAZGifhlsmdexRJlg9NjnR078mU17y8MQhBTngzZBzOUJiA0_nxLZFRh9tJqgCuFhq0INwFZVR8T_HLPTeXuCsTVCaWJdYxbDZ20o9yY3ClGFJVjJxB=s0-d-e1-ft#https://store.intrepidcs.com/v/vspfiles/templates/ics-zen-2016/images/company/logo.png" border="0" class="CToWUd"></a></td>
				 <td align="right">CustomerID# ${mailObj.CustomerID}</td>
				</tr>
			 </tbody></table>
			 <br>
		   <br>
		   Your order # ${mailObj.OrderID} status has been changed to ${mailObj.OrderStatus}. <br>
		   <br>
		   <table width="100%" border="0" cellspacing="1" cellpadding="5">
			<tbody><tr valign="top"> 
			 <td><b>Bill To:</b><br> <br>
              ${mailObj.BillingCompanyName}<br> ${mailObj.BillingFirstName}&nbsp;${mailObj.BillingLastName}<br>
			  ${mailObj.BillingAddress1}<br>
              ${mailObj.BillingCity}, ${mailObj.BillingState}&nbsp;${mailObj.BillingPostalCode} 
			  <br>
			  ${mailObj.BillingCountry} <br>
			  ${mailObj.BillingPhoneNumber}<br>
					<a href="mailto:${mailObj.EmailAddress}" target="_blank">${mailObj.EmailAddress}</a><br>
					<br></td>
			 <td><b>Ship To:</b><br> <br>
              ${mailObj.ShipCompanyName}<br> ${mailObj.ShipFirstName}&nbsp;${mailObj.ShipLastName}<br>
			  ${mailObj.ShipAddress1}<br>
              ${mailObj.ShipCity}, ${mailObj.ShipState}&nbsp;${mailObj.ShipPostalCode} 
			  <br>
			  ${mailObj.ShipCountry} <br>
			  ${mailObj.ShipPhoneNumber} <br> </td>
            </tr>
            <tr valign="top"> 
			 <td><b>Payment Info:</b> <br> <br>
			  <b>Credit Card</b>:&nbsp;<br>XXXXXXX${mailObj.CC_Last4}<br><br> <br> </td>
			 <td><b>Shipping Method:</b><br> <br>
			  ${mailObj.Service}<br> </td>
			</tr>
			<tr valign="top"> 
			 <td colspan="2"><b>Order Details:</b><br> <br>
              <table width="100%" bgcolor="#EEEEEE">
              <tbody>
              <tr>
                <td style="width: 18%"><b>Code</b></td>
                <td style="width: 52%"><b>Item / Options </b></td>
                <td style="text-align: right; width: 5%"><b>Qty</b></td>
                <td style="text-align: right; width: 10%"><b>Price</b></td>
                <td style="text-align: right; width: 15%"><b>Grand Total</b></td>
              </tr>
              `+ orderItemDetails(mailObj.OrderDetails, mailObj.CurrencyCode)
            + `<tr><td colspan="5">&nbsp;</td></tr>
              <tr>
                <td  colspan="4" style="text-align: right"> Subtotal: </td>
                <td style="text-align: right">${mailObj.CurrencyCode}${mailObj.Affiliate_Commissionable_Value}</td>
              </tr>
              <tr>
                <td colspan="4" style="text-align: right"> State Tax: </td>
                <td style="text-align: right">${mailObj.CurrencyCode}${mailObj.SalesTax1}</td>
              </tr>
              <tr>
                <td colspan="4" style="text-align: right"> Shipping Cost: </td>
                <td style="text-align: right">${mailObj.CurrencyCode}${mailObj.TotalShippingCost}</td>
              </tr>
              <tr>
                <td colspan="4" style="text-align: right"> Grand Total: </td>
                <td style="text-align: right">${mailObj.CurrencyCode}${mailObj.Total_Payment_Authorized}</td>
              </tr>
              </tbody>
              </table> 
              <br> 
              </td>
			</tr>
		   </tbody></table>
		
		
		<table cellspacing="0" cellpadding="0" border="0">
        <tbody>
        <!--<tr><td>Your Carrier Acct #:</td><td></td></tr>-->
		</tbody></table>
		
		   <br>
		   Thank you for shopping at <a href="http://store.intrepidcs.com" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://store.intrepidcs.com&amp;source=gmail&amp;ust=1573323479255000&amp;usg=AFQjCNHCEzNOygIPlZDboAJ_AdbqnGZrcA">store.intrepidcs.com</a>!<br>
		   Visit us again at <a href="http://store.intrepidcs.com/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://store.intrepidcs.com/&amp;source=gmail&amp;ust=1573323479255000&amp;usg=AFQjCNHTDhtYYs0dWu5Ax9Gzwes80gO50Q">http://store.intrepidcs.com/</a></td>
		 </tr>
		</tbody></table><div class="yj6qo"></div>
		<div class="adL"> </div>
	</div>`,
        attachments: mailObj.attachments || []
    };
    // email to customer
    send(mailOptions)
}
exports.sendResetPasswordMail = function (mailObj, callback) {
    var mailOptions = {
        from: '"Intrepidcs" <no-reply@intrepidcs.com>', // sender address
        to: mailObj.to, // list of receivers
        subject: mailObj.subject || 'E-mail confirmation for Intrepidcs registration', // Subject line


        // text: 'This text will never show up there!!', // plain text body
        html: '<b>Dear ' + mailObj.lname + ', ' + mailObj.fname + '</b>' +
            '<br><br><p>You are requested to reset your password to sign on to <a href="' + mailObj.siteLink + '">Intrepidcs</a>, ' +
            'Click the below link to set your new password.' +
            '<br>' + mailObj.link + '<br>Thank you.',
        attachments: mailObj.attachments || []
    };
    send(mailOptions, callback)
}
exports.sendLockAccountMail = function (mailObj, callback) {
    var mailOptions = {
        from: '"Intrepidcs" <no-reply@intrepidcs.com>', // sender address
        to: mailObj.to, // list of receivers
        subject: mailObj.subject || 'E-mail confirmation for Intrepidcs registration', // Subject line
        // text: 'This text will never show up there!!', // plain text body
        html: '<b>Dear ' + mailObj.lname + ', ' + mailObj.fname + '</b>' +
            '<br><br><p>Your account has been blocked due max no of attempts with wrong password. Click on the link below to reset you password or contact system administrator.' +
            '<br>' + mailObj.link + '<br>Thank you.',
        attachments: mailObj.attachments || []
    };
    send(mailOptions, callback)
}
exports.errorReport = function (mailObj) {
    var mailOptions = {
        from: '"Intrepidcs" <icscontactus@intrepidcs.com>', // sender address
        to: process.env.REPORT_TO || "awaisayub149@gmail.com", // list of receivers
        subject: mailObj.subject || 'Some Error Occured In Blue Sky', // Subject line
        // text: 'This text will never show up there!!', // plain text body
        html: '<b> Status:</b><p>' + mailObj.error + '</p>' || '<p> Unknown error cccured on bluesky </p>',
        attachments: mailObj.attachments || []
    };
    send(mailOptions)
}
exports.sendMailToCustomer = function (mailObj) {
    var mailOptions = {
        from: '"Intrepidcs" <no-reply@intrepidcs.com>', // sender address
        to: mailObj.to,
        subject: mailObj.subject || 'E-mail Confirmation for IntrepidCS Registration', // Subject line
        // text: 'This text will never show up there!!', // plain text body
        html: `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f5f8fa; min-width: 350px; font-size: 1px; line-height: normal;">
        <tr>
            <td align="center" valign="top">
                <table cellpadding="0" cellspacing="0" border="0" width="750" class="table750" style="width: 100%; max-width: 750px; min-width: 350px; background: #f5f8fa;">
                    <tr>
                        <td class="mob_pad" width="25" style="width: 25px; max-width: 25px; min-width: 25px;">&nbsp;</td>
                        <td align="center" valign="top" style="background: #ffffff;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100% !important; min-width: 100%; max-width: 100%; background: #f5f8fa;">
                                <tr>
                                    <td align="right" valign="top">
                                        <div class="top_pad" style="height: 25px; line-height: 25px; font-size: 23px;">&nbsp;</div>
                                    </td>
                                </tr>
                            </table>
                            <table cellpadding="0" cellspacing="0" border="0" width="88%" style="width: 88% !important; min-width: 88%; max-width: 88%;">
                                <tr>
                                    <td align="left" valign="top">
                                        <div style="height: 40px; line-height: 40px; font-size: 38px;">&nbsp;</div>
                                        <a href="https://www.intrepidcs.com" style="display: block">
                                        <img src="https://www.yourbluefuture.com/bs-files/1590064703056-ICS-logo-2019_FINAL-VERSION_05032019-No-URL.png"
                                        alt="ICS" height="85%" border="0" style="display: block; />
                                        </a>
                                        <div class="top_pad2" style="height: 48px; line-height: 48px; font-size: 46px;">&nbsp;</div>
                                    </td>
                                </tr>
                            </table>
                            <table cellpadding="0" cellspacing="0" border="0" width="88%" style="width: 88% !important; min-width: 88%; max-width: 88%;">
                                <tr>
                                    <td align="left" valign="top" style="margin-top:50px;">
                                        <font face="'Source Sans Pro', sans-serif" color="#1a1a1a" style="font-size: 52px; line-height: 54px; font-weight: 300; letter-spacing: -1.5px;">
                                            <span style="margin-top: 30px; display: block; font-family: 'Source Sans Pro', Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 52px; line-height: 54px; font-weight: 300; letter-spacing: -1.5px;">Confirm
                                                Your Email</span>
                                        </font>
    
                                        <div style="height: 21px; line-height: 21px; font-size: 19px;">&nbsp;</div>
                                        <font face="'Source Sans Pro', sans-serif" color="#000000" style="font-size: 20px; line-height: 28px;">
                                            <span style="font-family: 'Source Sans Pro', Arial, Tahoma, Geneva, sans-serif; color: #000000; font-size: 20px; line-height: 28px;">
                                                Hello `+ mailObj.firstName + ` ` + mailObj.lastName + `,
                                            </span>
                                        </font>
    
                                        <div style="height: 6px; line-height: 6px; font-size: 4px;">&nbsp;</div>
                                        <font face="'Source Sans Pro', sans-serif" color="#000000" style="font-size: 20px; line-height: 28px;">
                                            <span style="font-family: 'Source Sans Pro', Arial, Tahoma, Geneva, sans-serif; color: #000000; font-size: 20px; line-height: 28px;">
                                                We recevied a sign-up request from `+ mailObj.to + `.
                                                If this is correct, please confirm by clicking the button below.
                                            </span>
                                        </font>
    
                                        <div style="height: 30px; line-height: 30px; font-size: 28px;">&nbsp;</div>
                                        <table class="mob_btn" cellpadding="0" cellspacing="0" border="0" style="background: #6070E9; border-radius: 4px;">
                                            <tr>
                                                <td align="center" valign="top">
                                                    <a href="` + mailObj.link + `" target="_blank" style="display: block; border: 1px solid #6070E9; border-radius: 4px; padding: 19px 27px; font-family: 'Source Sans Pro', Arial, Verdana, Tahoma, Geneva, sans-serif; color: #ffffff; font-size: 26px; line-height: 30px; text-decoration: none; white-space: nowrap; font-weight: 600;">
                                                        <font face="'Source Sans Pro', sans-serif" color="#ffffff" style="font-size: 26px; line-height: 30px; text-decoration: none; white-space: nowrap; font-weight: 600;">
                                                            <span style="font-family: 'Source Sans Pro', Arial, Verdana, Tahoma, Geneva, sans-serif; color: #ffffff; font-size: 26px; line-height: 30px; text-decoration: none; white-space: nowrap; font-weight: 600;">Confirm
                                                                Email</span>
                                                        </font>
    
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        <div style="height: 90px; line-height: 90px; font-size: 88px;">&nbsp;</div>
                                    </td>
                                </tr>
                            </table>
                            <table cellpadding="0" cellspacing="0" border="0" width="90%" style="width: 90% !important; min-width: 90%; max-width: 90%; border-width: 1px; border-style: solid; border-color: #e8e8e8; border-bottom: none; border-left: none; border-right: none;">
                                <tr>
                                    <td align="left" valign="top">
                                        <div style="height: 28px; line-height: 28px; font-size: 26px;">&nbsp;</div>
                                    </td>
                                </tr>
                            </table>
                            <table cellpadding="0" cellspacing="0" border="0" width="88%" style="width: 88% !important; min-width: 88%; max-width: 88%;">
                                <tr>
                                    <td align="left" valign="top">
                                        <font face="'Source Sans Pro', sans-serif" color="#7f7f7f" style="font-size: 17px; line-height: 23px;">
                                            <span style="font-family: 'Source Sans Pro', Arial, Tahoma, Geneva, sans-serif; color: #7f7f7f; font-size: 17px; line-height: 23px;">Once
                                                you confirm, all future E-Mails about your ICS account will be sent
                                                to `+ mailObj.to + `.</span>
                                        </font>
    
                                        <div style="height: 30px; line-height: 30px; font-size: 28px;">&nbsp;</div>
                                    </td>
                                </tr>
                            </table>
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100% !important; min-width: 100%; max-width: 100%; background: #f5f8fa;">
                                <tbody>
                                    <tr>
                                        <td align="center" valign="top">
                                            <table cellpadding="0" cellspacing="0" border="0" width="88%" style="width: 88% !important; min-width: 88%; max-width: 88%;">
                                                <tbody>
                                                    <tr>
                                                        <td align="center" valign="top">
                                                            <div style="height: 34px; line-height: 34px; font-size: 32px;">&nbsp;</div>
                                                            <font face="'Source Sans Pro', sans-serif" color="#868686"
                                                                style="font-size: 15px; line-height: 20px;">
                                                                <span style="font-family: 'Source Sans Pro', Arial, Tahoma, Geneva, sans-serif; color: #868686; font-size: 15px; line-height: 20px;">PHONE: +1-800-859-6265
                                                                </span>
                                                            </font>
                                                        </td>
                                                        <td align="center" valign="top">
                                                            <div style="height: 34px; line-height: 34px; font-size: 32px;">&nbsp;</div>
                                                            <font face="'Source Sans Pro', sans-serif" color="#868686"
                                                                style="font-size: 15px; line-height: 20px;">
                                                                <span style="font-family: 'Source Sans Pro', Arial, Tahoma, Geneva, sans-serif; color: #868686; font-size: 15px; line-height: 20px;">FAX: +1 (586) 731-2274
                                                                </span>
                                                            </font>
                                                        </td>
                                                        <td align="center" valign="top">
                                                            <div style="height: 34px; line-height: 34px; font-size: 32px;">&nbsp;</div>
                                                            <font face="'Source Sans Pro', sans-serif" color="#868686"
                                                                style="font-size: 15px; line-height: 20px;">
                                                                <span style="font-family: 'Source Sans Pro', Arial, Tahoma, Geneva, sans-serif; color: #868686; font-size: 15px; line-height: 20px;">
                                                                    <a className="txt-white" href="mailto:moreinfo@intrepidcs.com?Subject=Customer%20Query" target="_top">E-Mail: moreinfo@intrepidcs.com</a>
                                                                </span>
                                                            </font>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div style="height: 34px; line-height: 34px; font-size: 32px;">&nbsp;</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`,
        attachments: mailObj.attachments || []
    };
    send(mailOptions)
}
exports.sendMailToConfirmPassword = function (mailObj) {
    var mailOptions = {
        from: '"Intrepidcs" <no-reply@intrepidcs.com>', // sender address
        to: mailObj.to, // list of receivers
        replyTo: process.env.ORDER_CONFIRM_EMAIL,
        subject: mailObj.subject || 'Reset Password Request', // Subject line
        // text: 'This text will never show up there!!', // plain text body
        html: `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f5f8fa; min-width: 350px; font-size: 1px; line-height: normal;">
        <tr>
            <td align="center" valign="top">
                <table cellpadding="0" cellspacing="0" border="0" width="750" class="table750" style="width: 100%; max-width: 750px; min-width: 350px; background: #f5f8fa;">
                    <tr>
                        <td class="mob_pad" width="25" style="width: 25px; max-width: 25px; min-width: 25px;">&nbsp;</td>
                        <td align="center" valign="top" style="background: #ffffff;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100% !important; min-width: 100%; max-width: 100%; background: #f5f8fa;">
                                <tr>
                                    <td align="right" valign="top">
                                        <div class="top_pad" style="height: 25px; line-height: 25px; font-size: 23px;">&nbsp;</div>
                                    </td>
                                </tr>
                            </table>
                            <table cellpadding="0" cellspacing="0" border="0" width="88%" style="width: 88% !important; min-width: 88%; max-width: 88%;">
                                <tr>
                                    <td align="left" valign="top">
                                        <div style="height: 40px; line-height: 40px; font-size: 38px;">&nbsp;</div>
                                        <a href="https://www.intrepidcs.com" style="display: block">
                                        <img src="https://www.yourbluefuture.com/bs-files/1590064703056-ICS-logo-2019_FINAL-VERSION_05032019-No-URL.png"
                                        alt="ICS" height="85%" border="0" style="display: block; />
                                        </a>
                                        <div class="top_pad2" style="height: 48px; line-height: 48px; font-size: 46px;">&nbsp;</div>
                                    </td>
                                </tr>
                            </table>
                            <table cellpadding="0" cellspacing="0" border="0" width="88%" style="width: 88% !important; min-width: 88%; max-width: 88%;">
                                <tr>
                                    <td align="left" valign="top">
                                        <font align="center" face="'Source Sans Pro', sans-serif" color="#1a1a1a" style="font-size: 52px; line-height: 54px; font-weight: 300; letter-spacing: -1.5px;">
                                            <span align="center" style="font-family: 'Source Sans Pro', Arial, Tahoma, Geneva, sans-serif; color: #1a1a1a; font-size: 28px; line-height: 54px; font-weight: 300; letter-spacing: -1.5px;">Reset Password Request</span>
                                        </font>
    
                                        <div style="height: 21px; line-height: 21px; font-size: 19px;">&nbsp;</div>
                                        <font face="'Source Sans Pro', sans-serif" color="#000000" style="font-size: 20px; line-height: 28px;">
                                            <span style="font-family: 'Source Sans Pro', Arial, Tahoma, Geneva, sans-serif; color: #000000; font-size: 20px; line-height: 28px;">
                                                Hi, 
                                            </span>
                                        </font>
                                        <div style="height: 6px; line-height: 6px; font-size: 4px;">&nbsp;</div>
                                        <font face="'Source Sans Pro', sans-serif" color="#000000" style="font-size: 20px; line-height: 28px;">
                                            <span style="font-family: 'Source Sans Pro', Arial, Tahoma, Geneva, sans-serif; color: #000000; font-size: 20px; line-height: 28px;">
                                                We recevied a reset password request from `+ mailObj.to + `.
                                                If this is correct, please reset your password by clicking the button below.
                                            </span>
                                        </font>
    
                                        <div style="height: 30px; line-height: 30px; font-size: 28px;">&nbsp;</div>
                                        <table class="mob_btn" cellpadding="0" cellspacing="0" border="0" style="background: #6070E9; border-radius: 4px;">
                                            <tr>
                                                <td align="center" valign="top">
                                                    <a href="` + mailObj.link + `" target="_blank" style="display: block; border: 1px solid #6070E9; border-radius: 4px; padding: 19px 27px; font-family: 'Source Sans Pro', Arial, Verdana, Tahoma, Geneva, sans-serif; color: #ffffff; font-size: 26px; line-height: 30px; text-decoration: none; white-space: nowrap; font-weight: 600;">
                                                        <font face="'Source Sans Pro', sans-serif" color="#ffffff" style="font-size: 26px; line-height: 30px; text-decoration: none; white-space: nowrap; font-weight: 600;">
                                                            <span style="font-family: 'Source Sans Pro', Arial, Verdana, Tahoma, Geneva, sans-serif; color: #ffffff; font-size: 26px; line-height: 30px; text-decoration: none; white-space: nowrap; font-weight: 600;">Reset Password</span>
                                                        </font>
    
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        <div style="height: 90px; line-height: 90px; font-size: 88px;">&nbsp;</div>
                                    </td>
                                </tr>
                            </table>
                            <table cellpadding="0" cellspacing="0" border="0" width="90%" style="width: 90% !important; min-width: 90%; max-width: 90%; border-width: 1px; border-style: solid; border-color: #e8e8e8; border-bottom: none; border-left: none; border-right: none;">
                                <tr>
                                    <td align="left" valign="top">
                                        <div style="height: 28px; line-height: 28px; font-size: 26px;">&nbsp;</div>
                                    </td>
                                </tr>
                            </table>
                            <table cellpadding="0" cellspacing="0" border="0" width="88%" style="width: 88% !important; min-width: 88%; max-width: 88%;">
                                <tr>
                                    <td align="left" valign="top">

    
                                        <div style="height: 30px; line-height: 30px; font-size: 28px;">&nbsp;</div>
                                    </td>
                                </tr>
                            </table>
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100% !important; min-width: 100%; max-width: 100%; background: #f5f8fa;">
                                <tbody>
                                    <tr>
                                        <td align="center" valign="top">
                                            <table cellpadding="0" cellspacing="0" border="0" width="88%" style="width: 88% !important; min-width: 88%; max-width: 88%;">
                                                <tbody>
                                                    <tr>
                                                        <td align="center" valign="top">
                                                            <div style="height: 34px; line-height: 34px; font-size: 32px;">&nbsp;</div>
                                                            <font face="'Source Sans Pro', sans-serif" color="#868686"
                                                                style="font-size: 15px; line-height: 20px;">
                                                                <span style="font-family: 'Source Sans Pro', Arial, Tahoma, Geneva, sans-serif; color: #868686; font-size: 15px; line-height: 20px;">PHONE: +1-800-859-6265
                                                                </span>
                                                            </font>
                                                        </td>
                                                        <td align="center" valign="top">
                                                            <div style="height: 34px; line-height: 34px; font-size: 32px;">&nbsp;</div>
                                                            <font face="'Source Sans Pro', sans-serif" color="#868686"
                                                                style="font-size: 15px; line-height: 20px;">
                                                                <span style="font-family: 'Source Sans Pro', Arial, Tahoma, Geneva, sans-serif; color: #868686; font-size: 15px; line-height: 20px;">FAX: +1 (586) 731-2274
                                                                </span>
                                                            </font>
                                                        </td>
                                                        <td align="center" valign="top">
                                                            <div style="height: 34px; line-height: 34px; font-size: 32px;">&nbsp;</div>
                                                            <font face="'Source Sans Pro', sans-serif" color="#868686"
                                                                style="font-size: 15px; line-height: 20px;">
                                                                <span style="font-family: 'Source Sans Pro', Arial, Tahoma, Geneva, sans-serif; color: #868686; font-size: 15px; line-height: 20px;">
                                                                    <a className="txt-white" href="mailto:moreinfo@intrepidcs.com?Subject=Customer%20Query" target="_top">E-Mail: moreinfo@intrepidcs.com</a>
                                                                </span>
                                                            </font>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div style="height: 34px; line-height: 34px; font-size: 32px;">&nbsp;</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`,
        attachments: mailObj.attachments || []
    };
    send(mailOptions)
}
exports.sendMailToCustomerOnOrderPlace = function (mailObj) {
    var mailOptions = {
        from: '"Intrepidcs" <no-reply@intrepidcs.com>', // sender address
        to: mailObj.EmailAddress, // list of receivers
        replyTo: process.env.ORDER_CONFIRM_EMAIL,
        subject: `Order number ${mailObj.OrderID} received`, // Subject line
        // text: 'This text will never show up there!!', // plain text body
        html: `<div>
		<table width="650" border="1" cellspacing="0" cellpadding="20" bgcolor="#FFFFFF" align="center">
		 <tbody><tr>
		  <td>
		   <table width="100%" border="0" cellspacing="1" cellpadding="5">
			<tbody><tr valign="top"> 
			 <td><a href="https://store.intrepidcs.com/Default.asp" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://store.intrepidcs.com/Default.asp&amp;source=gmail&amp;ust=1573323479255000&amp;usg=AFQjCNF3S7UK1OzY0-obcv-KSi-oREnDUA"><img src="https://ci3.googleusercontent.com/proxy/0kHJ2_p1LretdJOm9658aUAlemAZGifhlsmdexRJlg9NjnR078mU17y8MQhBTngzZBzOUJiA0_nxLZFRh9tJqgCuFhq0INwFZVR8T_HLPTeXuCsTVCaWJdYxbDZ20o9yY3ClGFJVjJxB=s0-d-e1-ft#https://store.intrepidcs.com/v/vspfiles/templates/ics-zen-2016/images/company/logo.png" border="0" class="CToWUd"></a></td>
				 <td align="right">CustomerID# ${mailObj.CustomerID}</td>
				</tr>
			 </tbody></table>
			 <br>
		   <br>
		   Thank you for your order. Your order number is ${mailObj.OrderID}, placed ${utility.orderDateFormat(mailObj.OrderDate)}. <br>
		   <br>
		   <table width="100%" border="0" cellspacing="1" cellpadding="5">
			<tbody><tr valign="top"> 
			 <td><b>Bill To:</b><br> <br>
              ${mailObj.BillingCompanyName}<br> ${mailObj.BillingFirstName}&nbsp;${mailObj.BillingLastName}<br>
			  ${mailObj.BillingAddress1}<br>
              ${mailObj.BillingCity}, ${mailObj.BillingState}&nbsp;${mailObj.BillingPostalCode} 
			  <br>
			  ${mailObj.BillingCountry} <br>
			  ${mailObj.BillingPhoneNumber}<br>
					<a href="mailto:${mailObj.EmailAddress}" target="_blank">${mailObj.EmailAddress}</a><br>
					<br></td>
			 <td><b>Ship To:</b><br> <br>
              ${mailObj.ShipCompanyName}<br> ${mailObj.ShipFirstName}&nbsp;${mailObj.ShipLastName}<br>
			  ${mailObj.ShipAddress1}<br>
              ${mailObj.ShipCity}, ${mailObj.ShipState}&nbsp;${mailObj.ShipPostalCode} 
			  <br>
			  ${mailObj.ShipCountry} <br>
			  ${mailObj.ShipPhoneNumber} <br> </td>
			</tr>
			<tr valign="top"> 
			 <td><b>Payment Info:</b> <br> <br>
			  <b>Credit Card</b>:&nbsp;<span>${mailObj.CardType}</span><br>XXXXXXX${mailObj.CC_Last4}<br><br> <br> </td>
			 <td><b>Shipping Method:</b><br> <br>
			  ${mailObj.IsFreeOrder?'Free Shipping':mailObj.ShippingDetails.service}<br> </td>
			</tr>
			<tr valign="top"> 
			 <td colspan="2"><b>Order Details:</b><br> <br>
              <table width="100%" bgcolor="#EEEEEE">
              <tbody>
              <tr>
                <td style="width: 18%"><b>Code</b></td>
                <td style="width: 52%"><b>Item / Options </b></td>
                <td style="text-align: right; width: 5%"><b>Qty</b></td>
                <td style="text-align: right; width: 10%"><b>Price</b></td>
                <td style="text-align: right; width: 15%"><b>Grand Total</b></td>
              </tr>
              `+ orderItemDetails(mailObj.OrderDetails, mailObj.CurrencyCode)
            + `<tr><td colspan="5">&nbsp;</td></tr>
              <tr>
                <td  colspan="4" style="text-align: right"> Subtotal: </td>
                <td style="text-align: right">${mailObj.CurrencyCode}${mailObj.Affiliate_Commissionable_Value}</td>
              </tr>
              <tr>
                <td colspan="4" style="text-align: right"> State Tax: </td>
                <td style="text-align: right">${mailObj.CurrencyCode}${mailObj.SalesTax1}</td>
              </tr>
              <tr>
                <td colspan="4" style="text-align: right"> Shipping Cost: </td>
                <td style="text-align: right">${mailObj.CurrencyCode}${mailObj.TotalShippingCost}</td>
              </tr>
              <tr>
                <td colspan="4" style="text-align: right"> Grand Total: </td>
                <td style="text-align: right">${mailObj.CurrencyCode}${mailObj.Total_Payment_Authorized}</td>
              </tr>
              </tbody>
              </table> 
              <br> 
              </td>
			</tr>
		   </tbody></table>
		
		
		<table cellspacing="0" cellpadding="0" border="0">
        <tbody>
        <!--<tr><td>Your Carrier Acct #:</td><td></td></tr>-->
		</tbody></table>
		
		   <br>
		   Thank you for shopping at <a href="http://store.intrepidcs.com" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://store.intrepidcs.com&amp;source=gmail&amp;ust=1573323479255000&amp;usg=AFQjCNHCEzNOygIPlZDboAJ_AdbqnGZrcA">store.intrepidcs.com</a>!<br>
		   Visit us again at <a href="http://store.intrepidcs.com/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://store.intrepidcs.com/&amp;source=gmail&amp;ust=1573323479255000&amp;usg=AFQjCNHTDhtYYs0dWu5Ax9Gzwes80gO50Q">http://store.intrepidcs.com/</a></td>
		 </tr>
		</tbody></table><div class="yj6qo"></div>
		<div class="adL"> </div>
	</div>`,
        attachments: mailObj.attachments || []
    };
    // email to customer
    send(mailOptions)
    mailOptions.subject = `Order number ${mailObj.OrderID} received`
    if (!process.env.DEV_MODE && process.env.ENV_MODE === 'PRODUCTION') {
        //email to CSR team to process an order
        mailOptions.to = process.env.ORDER_CONFIRM_EMAIL
        send(mailOptions)
    } else {
        console.log('On dev env email will not sent to CSR team');
    }

}

exports.sendMailFromExternalApp = async function (mailObj,user) {
    var mailOptions = {
        from: '"Intrepidcs" <no-reply@intrepidcs.com>', // sender address
        // to: 'icsquote@intrepidcs.com,' + mailObj.CustomerEmail, // list of receivers
        to:  process.env.EXTERNAL_QUOTE_EMAIL + ',' +  user.email,
        replyTo: process.env.EXTERNAL_QUOTE_EMAIL,
        subject: `External quote number ${mailObj.QuoteNo} for customer ${mailObj.CustomerFName} ${mailObj.CustomerLName} at company ${mailObj.ShippingCompany} was entered by ${user.firstname} ${user.lastname}.`, // Subject line
        // text: 'This text will never show up there!!', // plain text body
        html: `<div>
		<table width="650" border="1" cellspacing="0" cellpadding="20" bgcolor="#FFFFFF" align="center">
		 <tbody><tr>
		  <td>
		   
		   <br>
		   Your Quote# is ${mailObj.QuoteNo}, created on ${utility.orderDateFormat(mailObj.createdOn)}. <br>
		   <br>
		   <table width="100%" border="0" cellspacing="1" cellpadding="5">
			<tbody><tr valign="top"> 
			 <td><b>Bill To:</b><br> <br>
              ${mailObj.BillingCompany}<br> ${mailObj.CustomerFName}&nbsp;${mailObj.CustomerLName}<br>
			  ${mailObj.BillingStreetAddress1}<br>
              ${mailObj.BillingCity1}, ${mailObj.BillingState}&nbsp;${mailObj.BillingPostalCode} 
			  <br>
			  ${mailObj.BillingCountry1} <br>
			  ${mailObj.BillingPhoneNumber}<br>
					<a href="mailto:${mailObj.CustomerEmail}" target="_blank">${mailObj.CustomerEmail}</a><br>
					<br></td>
			 <td><b>Ship To:</b><br> <br>
              ${mailObj.ShippingCompany}<br> ${mailObj.CustomerFName}&nbsp;${mailObj.CustomerLName}<br>
			  ${mailObj.ShippingAddress1}<br>
              ${mailObj.ShippingCity}, ${mailObj.ShippingState}&nbsp;${mailObj.ShippingPostalCode} 
			  <br>
			  ${mailObj.ShippingCountry} <br>
			  ${mailObj.ShippingPhoneNumber} <br> </td>
			</tr>
			<tr valign="top"> 
            <td colspan="2"><b>Quote Notes: </b> ${mailObj.notes}<br> <br>
			<tr valign="top"> 
			 <td colspan="2"><b>Quote Details:</b><br> <br>
              <table width="100%" bgcolor="#EEEEEE">
              <tbody>
              <tr>
                <td style="width: 18%"><b>Code</b></td>
                <td style="width: 52%"><b>Item / Options </b></td>
                <td style="text-align: right; width: 5%"><b>Qty</b></td>
                <td style="text-align: right; width: 10%"><b>Price</b></td>
                <td style="text-align: right; width: 15%"><b>Grand Total</b></td>
              </tr>
              `+ QuoteItemDetails(mailObj.lineItems, '$')
            + `<tr><td colspan="5">&nbsp;</td></tr>
              
              
              </tbody>
              </table> 
              <br> 
              </td>
			</tr>
		   </tbody></table>
		
		
		
	</div>`,
        attachments: mailObj.attachments || []
    };
    // email to customer
    let sent = await send(mailOptions)
    // mailOptions.subject = `Quote number ${mailObj.OrderID} received`
    // if (!process.env.DEV_MODE && process.env.ENV_MODE === 'PRODUCTION') {
    //     //email to CSR team to process an order
    //     // mailOptions.to = process.env.ORDER_CONFIRM_EMAIL
    //     // let sent = await send(mailOptions)
    // } else {
    //     console.log('On dev env email will not sent to CSR team');
    // }
    return sent
}