import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../containers/notFound";
// import AppliedRoute from "./AppliedRoute";
import FrontStore from "../containers/front-store";
import ProductDetailContainer from "../containers/product-detail";
import CartContainer from "../containers/cart";
import CategoryContainer from "../containers/category-view";
import CheckoutShippingAddressContainer from "../containers/checkout/checkout-shipping-address";
import CheckoutBillingAddressContainer from "../containers/checkout/checkout-billing-address";
import CheckoutShippingContainer from "../containers/checkout/checkout-shipping-method";
import CheckoutPaymentContainer from "../containers/checkout/checkout-payment-method";
import CheckoutFinalContainer from "../containers/checkout/checkout-final";
import CustomerRegisterContainer from "../containers/customer/customer-register";
import CustomerLoginContainer from "../containers/customer/customer-login";
import ResetPasswordContainer from "../containers/customer/customer-reset-password";
import CustomerAccountContainer from "../containers/customer/customer-account";
import CustomerOrderContainer from "../containers/customer/customer-orders";
import CustomerOrderViewContainer from "../containers/customer/customer-orders-view";
import CustomerChangePassWordContainer from "../containers/customer/customer-change-password";
import EmailConfirmContainer from "../containers/customer/customer-email-confirm";
import CustomerLogout from "../containers/customer/customer-logout";
import ReturnContainer from "../containers/static/return";
import ShippingContainer from "../containers/static/shipping";
import AboutUsContainer from "../containers/static/about-us";
import FaqContainer from "../containers/static/faq";
import OrderFaqContainer from "../containers/static/order-faq";
import ShipFaqContainer from "../containers/static/ship-faq";
import GuarenteeFaqContainer from "../containers/static/guarentee-faq";
import SupportFaqContainer from "../containers/static/support-faq";
import GuideFaqContainer from "../containers/static/guide-faq";
import PbFaqContainer from "../containers/static/pb-faq";
import AccountFaqContainer from "../containers/static/account-faq";
import ForgetPasswordContainer from "../containers/customer/customer-password-confirm";
import RequestAQuoteContainer from "../containers/static/request-a-quote"
import { TO_REGISTER, TO_STORE,TO_GET_A_QUOTE, TO_RESET_PASSWORD,TO_PASSWORD_CONFIRM, TO_CART, TO_CHECKOUT_USER_DETAIL, TO_CHECKOUT_SHIPPING, TO_CHECKOUT_PAYMENT, TO_CHECKOUT_CONFIRM, TO_PRODUCT, TO_CATEGORY, TO_CUSTOMER_ACCOUNT, TO_CUSTOMER_ORDERS, TO_HOME, TO_LOGIN, TO_CONFIRM, TO_EXPIRE, TO_LOGOUT, TO_CHANGE_PASSWORD, TO_CUSTOMER_ORDER_VIEW, TO_RETURN, TO_SHIPPING, TO_ABOUTUS, TO_FAQ, TO_ORDER_FAQ_ANSWERS, TO_SHIP_FAQ_ANSWERS, TO_ACCOUNT_FAQ_ANSWERS, TO_GUARENTEE_FAQ_ANSWERS, TO_PB_FAQ_ANSWERS, TO_GUIDE_FAQ_ANSWERS, TO_SUPPORT_FAQ_ANSWERS, TO_TERM_AND_CONDITION, TO_PRICES_CART_FAQ_ANSWER, TO_PRIVACY_POLICY, TO_CHECKOUT_BILLING_ADDRESS } from "../helpers/routesConstants"
import TermConditionsContainer from "../containers/static/term-and-conditions";
import PricesCartFaqContainer from "../containers/static/prices-cart-faq";
import PrivacyPolicyContainer from "../containers/static/privacy-policy";

export default ({ childProps }) =>
  // <Switch>
  //   <AppliedRoute path="/" exact component={FrontStore} props={childProps} />    
  //   <AppliedRoute path="/product/:id" exact component={ProductDetail} props={childProps} />
  // </Switch>;

  <Switch>
    <Route exact path={TO_HOME} component={FrontStore} />
    <Route exact path={TO_STORE} component={FrontStore} />
    <Route authed={false} path={TO_CART} component={CartContainer} />
    <Route exact path={TO_CHECKOUT_USER_DETAIL} component={CheckoutShippingAddressContainer} />
    <Route exact path={TO_GET_A_QUOTE} component={RequestAQuoteContainer} />
    <Route exact path={TO_CHECKOUT_BILLING_ADDRESS} component={CheckoutBillingAddressContainer} />
    <Route exact path={TO_CHECKOUT_SHIPPING} component={CheckoutShippingContainer} />
    <Route exact path={TO_CHECKOUT_PAYMENT} component={CheckoutPaymentContainer} />
    <Route exact path={TO_RESET_PASSWORD} component={ResetPasswordContainer} />
    <Route exact path={TO_CHECKOUT_CONFIRM} component={CheckoutFinalContainer} />
    <Route exact path={TO_REGISTER} component={CustomerRegisterContainer} />
    <Route exact path={TO_LOGIN} component={CustomerLoginContainer} />
    <Route exact path={TO_LOGOUT} component={CustomerLogout} />
    {/* <Route exact path={TO_CUSTOMER} component={ CustomerAccountContainer }/> */}
    <Route exact path={TO_CUSTOMER_ACCOUNT} component={CustomerAccountContainer} />
    <Route exact path={TO_CHANGE_PASSWORD} component={CustomerChangePassWordContainer} />
    <Route exact path={TO_CUSTOMER_ORDERS} component={CustomerOrderContainer} />
    <Route exact path={TO_CUSTOMER_ORDER_VIEW + ':id'} component={CustomerOrderViewContainer} />
    <Route exact path={TO_PRODUCT + ':code'} component={ProductDetailContainer} />
    <Route exact path={'/:codeP' + '/:code'} component={ProductDetailContainer} />
    <Route exact path={TO_CATEGORY + ':id'} component={CategoryContainer} />
    <Route exact path={TO_CONFIRM + ':token'} component={EmailConfirmContainer} />
    <Route exact path={TO_EXPIRE + ':token'} component={EmailConfirmContainer} />
    <Route exact path={TO_PASSWORD_CONFIRM  + ':token'} component={ForgetPasswordContainer} />

    {/* static route exacts */}
    <Route exact path={TO_RETURN} component={ReturnContainer} />
    <Route exact path={TO_SHIPPING} component={ShippingContainer} />
    <Route exact path={TO_ABOUTUS} component={AboutUsContainer} />
    <Route exact path={TO_FAQ} component={FaqContainer} />
    <Route exact path={TO_ORDER_FAQ_ANSWERS} component={OrderFaqContainer} />
    <Route exact path={TO_SHIP_FAQ_ANSWERS} component={ShipFaqContainer} />
    <Route exact path={TO_ACCOUNT_FAQ_ANSWERS} component={AccountFaqContainer} />
    <Route exact path={TO_GUARENTEE_FAQ_ANSWERS} component={GuarenteeFaqContainer} />
    <Route exact path={TO_PB_FAQ_ANSWERS} component={PbFaqContainer} />
    <Route exact path={TO_GUIDE_FAQ_ANSWERS} component={GuideFaqContainer} />
    <Route exact path={TO_SUPPORT_FAQ_ANSWERS} component={SupportFaqContainer} />
    <Route exact path={TO_TERM_AND_CONDITION} component={TermConditionsContainer} />
    <Route exact path={TO_PRICES_CART_FAQ_ANSWER} component={PricesCartFaqContainer} />
    <Route exact path={TO_PRIVACY_POLICY} component={PrivacyPolicyContainer} />
    <Route exact component={NotFound} />
    {/* <Route path="/about" component={About} />
    <Route path="/signout" component={Signout} />
    <Route path="/signup" component={Signup} />
    <Route path="/thanks" component={Thanks} />
    <Route path="/tasks" component={ requireAuth(Task)  }/> */}
  </Switch>  
