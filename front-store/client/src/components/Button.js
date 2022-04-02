import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { TO_GET_A_QUOTE } from '../helpers/routesConstants';

export default class Button extends Component {
  
  render() {
    return (
      <Fragment>
        {
          this.props.disabled ? 
            <Link title="Get A quote" to={TO_GET_A_QUOTE}> <button type="button" className="btn btn-template-outlined cart-button">Get a quote</button></Link>
          :
            <button disabled={this.props.disabled} type="button" className="btn btn-template-outlined cart-button" onClick={this.props.onClick}><i className="fa fa-shopping-cart"></i> Add to cart</button>
        }
      </Fragment>
      
    )
  }
}
