import React, { Component, Fragment } from 'react';
import renderHTML from 'react-render-html';
import Button from './Button';
import QuantityBar from './QuantityBar';
import { connect } from 'react-redux';
import { addToCart } from './../actions/cartActions';
import { fetchProductOptions } from './../actions/productAction';
import { syncQuantity } from './../actions/catalogActions';
import NumberFormat from 'react-number-format';
import store from './../store';
import { parseFreeAccessories, parseFreeAccessoriesForView, limitChar } from '../helpers/utility';
import { IMAGE_BASE_URL } from '../helpers/constants';
import { TO_PRODUCT, TO_HOME, TO_CATEGORY } from '../helpers/routesConstants';
import { Link } from 'react-router-dom';
import Loader from "./Loader";
import Dropdown from "./dropdown";
import { FETCH_PRODUCT_OPTIONS } from '../helpers/actionConstants';
import DocumentMeta from 'react-document-meta';
// import { Link } from 'react-router-dom'


const FreeAccessories = ({ freeAccessories }) => (
    <div className="row margin-top-14">
        <div className="col-sm-12">
            <h6>The following items are included with this product:</h6>
            <ul className="nav nav-pills flex-column text-sm category-menu side-bar-ul">
                {freeAccessories.map(accessory => (
                    <li key={accessory.id} className="nav-item">
                        {accessory.Quantity} of <Link title={accessory.ProductName} target="_blank" to={TO_PRODUCT + accessory.ProductCode.toLowerCase()}>{limitChar(accessory.ProductName, 50)}</Link>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productOptions: [],
            products: [],
            options: [],
            selectedOptions: {},
            freeAccessories: [],
            meta:{}
        }
    }
    _quantityUpdate = (updatedQuantity) => {
        var product = this.state.product;
        product.Quantity = updatedQuantity;
        this.setState({ product: product });
        this.setState({
            Quantity: updatedQuantity
        })
    }
    _addToCart = (product) => {
        product.Quantity = 1;
        product.Childs = parseFreeAccessories(product, this.props.products);
        product.SelectedOptions = this.state.selectedOptions
        const itemDetails = product;
        this.setState({
            Quantity: 1
        })

        const syncCatalog = {
            ProductCode: product.ProductCode,
            Quantity: product.Quantity
        }
        store.dispatch(addToCart(itemDetails));
        var items = JSON.parse(localStorage.getItem('cartStatePersist')) || []
        items.push(itemDetails)
        localStorage.setItem('cartStatePersist', JSON.stringify(items))
        store.dispatch(syncQuantity(syncCatalog));
    };
    getSelectedOptions(selectedOptions) {
        this.setState({ selectedOptions }, () => {
            // console.log(this.state.selectedOptions);
        })
    }
    componentDidMount() {
        
        this.setState({ productCode: this.props.productCode.indexOf('.htm') > -1 ? this.props.productCode.split('.')[0] : this.props.productCode });
        this.setState({ options: this.props.options });
        
        window.check = true;
    }
    componentDidUpdate(prevProps) {
        if (prevProps.ip !== store.getState().customer.ip) {
            //store.dispatch(checkAccess(store.getState().customer.ip));
        }
        if (prevProps.products.length === 0 && this.props.products.length > 0) {
            this.props.products.forEach(item => {
                if (item.ProductCode && item.ProductCode.toLowerCase() === this.state.productCode.toLowerCase()) {
                    let meta = this.state.meta
                    meta = {
                        title: item.ProductName,
                        description: item.METATAG_Description,
                        meta: {
                        charset: 'utf-8',
                        name: {
                            keywords: item.METATAG_Keywords
                        }
                        }
                    };
                    this.setState({meta, freeAccessories: parseFreeAccessoriesForView(item, this.props.products) });
                    store.dispatch({
                        type: FETCH_PRODUCT_OPTIONS,
                        payload: []
                    });
                    this.setState({ product: item }, () => {
                        document.title = this.state.product.ProductName
                        store.dispatch(fetchProductOptions(this.state.product.OptionIDs));
                    });
                }
            })
        } else if (prevProps.products.length > 0 && this.props.products.length > 0) {
            this.props.products.forEach((item, index) => {
                if (item.ProductCode && item.ProductCode.toLowerCase() === this.state.productCode.toLowerCase()) {
                    if (prevProps.products[index].Quantity !== item.Quantity) {
                        let meta = this.state.meta
                        meta = {
                            title: item.ProductName,
                            description: item.METATAG_Description,
                            meta: {
                            charset: 'utf-8',
                            name: {
                                keywords: item.METATAG_Keywords
                            }
                            }
                        };
                        store.dispatch({
                            type: FETCH_PRODUCT_OPTIONS,
                            payload: []
                        });
                        this.setState({ meta, product: item }, () => {
                            document.title = this.state.product.ProductName
                            store.dispatch(fetchProductOptions(this.state.product.OptionIDs));
                        });
                       
                        this.setState({ freeAccessories: parseFreeAccessoriesForView(item, this.props.products) });
                    }
                }
            })
        }
        if (this.state.product === undefined && this.props.products.length > 0) {
            this.props.products.forEach(elem => {
                if (elem.ProductCode && elem.ProductCode.toLowerCase() === this.props.productCode.toLowerCase()) {
                    store.dispatch({
                        type: FETCH_PRODUCT_OPTIONS,
                        payload: []
                    });
                    this.setState({ product: elem }, () => {
                        document.title = this.state.product.ProductName
                        store.dispatch(fetchProductOptions(this.state.product.OptionIDs));
                    });
                    this.setState({ freeAccessories: parseFreeAccessoriesForView(elem, this.props.products) });
                }
            });
        }
        let productIndex = this.props.products.findIndex(i => i.ProductCode.toLowerCase() === this.state.productCode.toLowerCase());
        if (this.state.product !== undefined && this.props.products.length > 0 && this.state.product.Quantity !== this.props.products[productIndex].Quantity) {
            store.dispatch({
                type: FETCH_PRODUCT_OPTIONS,
                payload: []
            });
            this.setState({ product: this.props.product }, () => {
                document.title = this.state.product.ProductName
                store.dispatch(fetchProductOptions(this.state.product.OptionIDs));
            });
        }
        if (JSON.stringify(prevProps.options) !== JSON.stringify(this.props.options)) {
            this.setState({ options: this.props.options });
        }
        // fetchProductOptions(this.state.product.ProductID);

    }
    render() {
        var product = this.state.product ? this.state.product : { ProductImages: [] };
        var ProductCategories = product.CategoryIDs ? product.CategoryIDs.split(',') : [];
        let selectedCategories = ProductCategories.map(elem => {
            return this.props.categories.filter(category => {
                return category.id == elem
            })
        })
        selectedCategories = [].concat.apply([], selectedCategories);
        // console.log(selectedCategories)
        let finalCategories = selectedCategories.filter(selectedCategory => {
            return selectedCategory.id !== 1829
        })

        // console.log(product)
        var cartAccess = this.props.global.cartAccess;
        product.TechSpecs = product.TechSpecs ? product.TechSpecs.replace(/â€¢/g, '•').replace(/<table/g, '<div class="table-responsive"><table').replace(/<\/table>/g, '</table></div>') : undefined;
        product.ProductDescription = product.ProductDescription ? product.ProductDescription.replace(/<table/g, '<div class="table-responsive"><table').replace(/<\/table>/g, '</table></div>') : undefined;
        var productPrice = product.ProductPrice - ((product.ProductPrice / 100) * product.Discount);


        return (
            <DocumentMeta {...this.state.meta}>
            <div className={`col-lg-9 product-detail ${product.ProductCode}`}>
                {(!product.ProductCode && <Loader />)}
                {/* <p className="goToDescription"><a href="#details" className="scroll-to text-uppercase">Scroll to product details, specification & manuals</a></p> */}
                {(product.ProductCode &&
                    <div >
                        <div id="productMain" className="row">
                            <Link to={TO_HOME}>
                                <h3 className="txt-blue product-map-home">Home</h3>
                            </Link>
                            {(finalCategories && finalCategories.length > 0 &&(
                            <div>
                                <h3 className="product-map-arrow"> {'> '}<Link to={TO_CATEGORY + finalCategories[0].id}> <span className="txt-blue product-map-ProductName">{finalCategories[0].name}</span> </Link></h3>
                            </div>
                            ))}
                            <div className="col-sm-12  panel-heading">
                                <h3 className="uppercase h4 top-product-name">{product.ProductName}</h3>
                            </div>
                            <div className="col-sm-6">
                                <div data-slider-id="1" className="owl-carousel shop-detail-carousel">
                                    {product.ProductImages !== undefined && product.ProductImages.map(image => {
                                        // if (image.IsThumb === 0)
                                        return <img key={image.ID} src={`${IMAGE_BASE_URL}${image.ImageURL}.${image.ext}`} onError={(e) => { console.log(e); e.target.onerror = null; e.target.src = "/assets/img/no-image.gif" }} alt="Product Image" className="img-fluid"></img>
                                    })}
                                </div>

                                <div data-slider-id="1" className="owl-thumbs">
                                    {product.ProductImages.map(image => {
                                        // if (image.IsThumb === 1)
                                        return <button key={image.ID} className="owl-thumb-item"><img src={`${IMAGE_BASE_URL}${image.ImageURL}.${image.ext}`} onError={(e) => { e.target.onerror = null; e.target.src = "/assets/img/no-image.gif" }} alt="" className="img-fluid slider-thumb img-thumb"></img></button>
                                    })}
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="box">
                                    {(product.CategoryIDs && (productPrice !== 0 || product.IsFreeProduct !== 0)) ?
                                        <Fragment>
                                            {/* <h6> </h6> */}
                                            {/* <p className="lighter-note"><strong>Availability: </strong>{renderHTML(product.Availability || '')}</p> */}
                                            <div className="above-pricing">
                                                {/* <p className="lighter-note">{renderHTML(product.ProductDescription_AbovePricing || '')}</p> */}
                                            </div>
                                        </Fragment> : ''}
                                    {product.CategoryIDs && product.HideProduct !== 'Y' && cartAccess && productPrice !== 0 ? (
                                        <p className="price">
                                            <NumberFormat isNumericString={true} decimalScale={2} value={product.ProductPrice - ((product.ProductPrice / 100) * product.Discount)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                        </p>) : ''
                                    }
                                    <p className="lighter-note">
                                        Product Code: {product.ProductCode}
                                    </p>
                                    {/* {product.CategoryIDs && product.HideProduct !== 'Y' && productPrice !== 0 ?
                                        (<div>
                                            {(product.Quantity === 0 || product.Quantity === undefined) ? (cartAccess === true ? (<Button onClick={() => { this._addToCart(product) }} />) : (<Button disabled="true" />)) : <QuantityBar callback={this._quantityUpdate} product={product} />}
                                        </div>) : ''
                                    }
                                    { this.props.options.length > 0  && <p className="lighter-note">Chose your options before add to cart</p>} */}
                                    {(this.state.freeAccessories.length > 0 && <FreeAccessories freeAccessories={this.state.freeAccessories} />)}
                                    {this.props.options.length > 0 && <Dropdown options={this.props.options} detailRef={this} />}
                                    {/* { this.props.options.length > 0  && <strong className="lighter-note text-danger">*Chose your options before add to cart</strong>} */}
                                    {(product.CategoryIDs && product.HideProduct !== 'Y' && (productPrice !== 0 || product.IsFreeProduct !== 0)) ?
                                        (<div>
                                            {(product.Quantity == 0 || product.Quantity === undefined || product.Quantity === null || product.Quantity === '') ? (cartAccess === true ? (<Button onClick={() => { this._addToCart(product) }} />) : (<Button disabled="true" />)) : <QuantityBar callback={this._quantityUpdate} product={product} />}
                                        </div>) : ''
                                    }
                                </div>
                            </div>
                        </div>
                        <p id="details" className="lead short-description pt-3">{renderHTML(product.ProductDescriptionShort || '')}</p>
                        <div className="pills-head">
                            <ul id="pills-tab" role="tablist" className="nav nav-pills nav-justified">
                                <li className="nav-item">
                                    <a id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true" className="nav-link active"> Description</a>
                                </li>
                                <li className="nav-item">
                                    <a id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false" className="nav-link"> Specifications</a>
                                </li>
                                <li className="nav-item">
                                    <a id="pills-contact-tab" data-toggle="pill" href="#pills-contact" role="tab" aria-controls="pills-contact" aria-selected="false" className="nav-link"> Manuals</a>
                                </li>
                                <li className="nav-item">
                                    <a id="pills-export-tab" data-toggle="pill" href="#pills-export" role="tab" aria-controls="pills-export" aria-selected="false" className="nav-link"> Compliance </a>
                                </li>
                            </ul>
                            <div id="pills-tabContent" className="tab-content">
                                <div id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" className="tab-pane fade show active product-description">{renderHTML(product.ProductDescription || 'No Description Provided')}</div>
                                <div id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" className="tab-pane fade tech-spec">{renderHTML(product.TechSpecs || 'No Specification Provided')}</div>
                                <div id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" className="tab-pane fade detail-url">{renderHTML(product.ProductDetailURL || 'No Manuals Provided')}</div>
                                <div id="pills-export" role="tabpanel" aria-labelledby="pills-export-tab" className="tab-pane fade export-url" >
                                {product.HarmonizedCode && product.HarmonizedCode !== "undefined" && product.HarmonizedCode !== null &&
                                <div>
                                <b> Harmonized Code</b>: {product.HarmonizedCode}
                                </div>
                                }
                                {product.ExportControlClassificationNumber && product.ExportControlClassificationNumber!=="undefined" && product.ExportControlClassificationNumber!==null &&
                                <div>
                                <b> ECCN</b>: {product.ExportControlClassificationNumber}
                                </div>
                                }
                                {product.UnitOfMeasure && product.UnitOfMeasure!=="undefined" && product.UnitOfMeasure!== null &&
                                <div>
                                <b> Unit Of Measure</b>: {product.UnitOfMeasure} 
                                </div>
                                }
                                {product.CountryOfOrigin && product.CountryOfOrigin!=="undefined" && product.CountryOfOrigin!==null && 
                                <div>
                                <b> Country of Origin</b>: {product.CountryOfOrigin} 
                                </div>
                                }
                                    
                            </div>
                        </div>
                    </div>
                    </div>
        )
    }
            </div>
            </DocumentMeta>
        );
    }
}
const stateMapProductDetail = (state) => {
    return {
        products: state.product.products,
        options: state.product.options,
        cartItems: state.cart,
        global: state.global,
        categories: state.category.categories,
        ip: state.customer.ip
    };
};

export default connect(stateMapProductDetail)(ProductDetail);
