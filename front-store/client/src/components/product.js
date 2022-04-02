import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { TO_PRODUCT } from '../helpers/routesConstants';
import {limitChar,strip} from '../helpers/utility'
import { IMAGE_BASE_URL } from '../helpers/constants';
const ProductTemp = ({ products }) => (
    
    <div>
        <div className="row products products-big">
            {products.map(product => (
                product.CategoryIDs && product.HideProduct !== 'Y' && <div title={product.ProductName} key={product.ProductID} className="w-100">
                    <div className="product  row w-100">
                        <div className="image col-lg-3 col-md-3 col-sm-12 col-xs-12"><Link to={TO_PRODUCT + product.ProductCode.toLowerCase()}><img src={IMAGE_BASE_URL + product.ProductPhotoURL} onError={(e)=>{e.target.onerror = null; e.target.src="/assets/img/no-image.gif"}} alt="" className="img-fluid image1" id="check2"/></Link></div>
                        <div className="text product-min-height text-left col-lg-9 col-md-9 col-sm-12 col-xs-12">
                            <h3 className="h5"><Link to={TO_PRODUCT + product.ProductCode.toLowerCase()}>
                                {/* <Truncate lines="2" ellipsis={<span> ...</span>}> */}
                                { limitChar(product.ProductName,100)}
                                {/* </Truncate> */}
                                </Link>
                            </h3>
                            {/* <p className="price">
                                {product.Discount > 0 && (
                                    <del>
                                        <NumberFormat decimalScale={2} value={product.ProductPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                    </del>
                                )}
                                <NumberFormat decimalScale={2} value={product.ProductPrice - ((product.ProductPrice / 100) * product.Discount)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                            </p> */}
                            <div className="description">
                                <p title={strip(product.ProductDescriptionShort || '')}>
                                {limitChar(strip(product.ProductDescriptionShort || ''),500)}
                                 </p>
                            </div>
                        </div>
                        {product.Discount > 0 && (
                            <div className="ribbon-holder">
                                <div className="ribbon sale">{product.Discount}% OFF</div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

class Product extends Component {
    render() {
        return (
            <div>
                <ProductTemp products={this.props.products} />
            </div>
        );
    }
}


export default Product;
