import React, { Component } from 'react';
import { connect } from 'react-redux';
import Product from '../components/product';
import SideBar from '../components/side-bar';
import ReactPaginate from 'react-paginate';
import Scroll from 'react-scroll';
import Loader from "../components/Loader";
import Search from "../components/search";
import {Store_Title} from "../helpers/constants";
// var initialProducts = [
//     'ETHERNET-GUIDE',
//     '2RSM-VSPY',
//     'VCAN4-2C',
//     'NEOVI-FIRE2',
//     'NEOVI-ION',
//     'WIRELESS-NEOVI',
// ]
class FrontStore extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handlePageItems = this.handlePageItems.bind(this);
        this.state = {
            allProducts: [],
            products: [],
            searchProducts: [],
            featuredProducts: [],
            searchTimeOut: '',
            filterProductsFunction: '',
            viewAbleProducts: [],
            pageLimit: 9,
            offset: 0,
            pageCount: 1,
        }
    }
    handleChange(event) {
        var searchedProducts = [];
        var pName = event.target.value.toLowerCase();
        var eventThis = this;
        clearTimeout(this.state.searchTimeOut);
        this.setState({
            offset: 0, searchTimeOut: setTimeout(function () {
                if (pName === '') {
                    searchedProducts = eventThis.state.featuredProducts;
                }
                else {
                    eventThis.props.products.forEach(prod => {
                        if ((prod.ProductName.toLowerCase().indexOf(pName) !== -1 || prod.ProductCode.toLowerCase().indexOf(pName) !== -1) && prod.HideProduct !== 'Y') {
                            searchedProducts.push(prod);
                        }
                    });
                }
                eventThis.setState({ pageCount: Math.ceil(searchedProducts.length / eventThis.state.pageLimit) });
                eventThis.setState({ viewAbleProducts: searchedProducts.slice(eventThis.state.offset, eventThis.state.pageLimit) });
                eventThis.setState({ searchProducts: searchedProducts });
            }, 800)
        });
    }
    handlePageItems(event) {
        var item = event.target.value;
        // console.log(item);
        var eventThis = this;
        clearTimeout(this.state.searchTimeOut);
        this.setState({
            offset: 0, searchTimeOut: setTimeout(function () {
                eventThis.setState({ pageLimit: item });
                eventThis.setState({ pageCount: Math.ceil(eventThis.state.viewAbleProducts.length / eventThis.state.pageLimit) });
                eventThis.setState({ viewAbleProducts: eventThis.state.featuredProducts.slice(eventThis.state.offset, eventThis.state.pageLimit) });
            }, 800)
        });
    }
    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.pageLimit);
        this.setState({ offset: offset }, function () {
            this.setState({ viewAbleProducts: this.state.searchProducts.slice(this.state.offset, this.state.pageLimit * (selected + 1)) });
        })
        Scroll.animateScroll.scrollToTop();
    };
    componentDidMount() {
        // console.log(window.location.href)
        Scroll.animateScroll.scrollToTop();
        document.title = Store_Title
    }
    componentWillMount() {
        var selectedProducts = [];
        var thisObj = this
        this.props.products.forEach(prod => {
            if (prod.IsFeatured) {
                selectedProducts.push(prod)
            }
        })
        this.setState({ allProducts: this.props.products });
        this.setState({ viewAbleProducts: selectedProducts });
        this.setState({ featuredProducts: selectedProducts });
        this.setState({
            filterProductsFunction: function (catId) {
                thisObj.setState({
                    products: thisObj.state.allProducts.filter(item => item.CategoryIDs && item.HideProduct !== 'Y' && item.CategoryIDs.indexOf(catId) !== -1)
                }, function () {
                    thisObj.setState({ pageCount: Math.ceil(thisObj.state.products.length / thisObj.state.pageLimit) });
                    thisObj.setState({ offset: 0 }, function () {
                        thisObj.setState({ viewAbleProducts: thisObj.state.products.slice(this.state.offset, this.state.pageLimit) });
                        Scroll.animateScroll.scrollToTop();
                    })
                });
            }
        })
    }
    componentDidUpdate() {
        // console.log(func,'akldjlakdj',this.state.filterProductsFunction);
    }
    componentWillReceiveProps(props) {
        this.props = props;
        var selectedProducts = [];
        this.props.products.length && this.props.products.forEach(prod => {
            if (prod.IsFeatured) {
                selectedProducts.push(prod)
            }
        })
       

        this.setState({ allProducts: this.props.products });
        this.setState({ viewAbleProducts: selectedProducts });
        this.setState({ featuredProducts: selectedProducts });
        var thisObj = this
        this.setState({
            filterProductsFunction: function (catId) {
                thisObj.setState({
                    products: thisObj.state.allProducts.filter(item => item.CategoryIDs && item.HideProduct !== 'Y' && item.CategoryIDs.indexOf(catId) !== -1)
                }, function () {
                    thisObj.setState({ pageCount: Math.ceil(thisObj.state.products.length / thisObj.state.pageLimit) });
                    thisObj.setState({ offset: 0 }, function () {
                        thisObj.setState({ viewAbleProducts: thisObj.state.products.slice(this.state.offset, this.state.pageLimit) });
                        Scroll.animateScroll.scrollToTop();
                    })
                });
            }
        })
    }

    render() {
        // console.log(this.state.viewAbleProducts)
        // console.log(this.state.viewAbleProducts.length)
        return (
            <div id="content" className="content-page">
                <div className="container">
                    <div className="row bar">
                        <SideBar onClickHandler={this.state.filterProductsFunction} categories={this.props.categories} />
                        <div className="loader-page">  
                            {(!this.props.products.length && <Loader />)} 
                        </div>
                       {(this.props.products.length>0 && <div id="pagination" className="col-md-9">
                            <div className="row mrTop18 w-100">
                             <div className="col-lg-5">
                                    <Search onChangeHandler={this.handleChange} />
                                </div>
                                <div className="col d-flex mt-4 justify-content-end align-items-center">
                                    <div className="form-group m-0">
                                        <select className="p-2 form-control" id="items" onChange={this.handlePageItems}>
                                            <option value="9">Items Per Page</option>
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="40">40</option>
                                            <option value="60">60</option>
                                            <option value="100">100</option>
                                        </select>
                                    </div>
                                    </div>
                                <div className="col-lg-12 mt-4">
                                            <Product products={this.state.viewAbleProducts} />
                                        {/* {(this.state.viewAbleProducts.length && <Product products={this.state.viewAbleProducts} />)} */}
                                        {/* {(!this.state.viewAbleProducts.length && <p>No Product found</p>)} */}
                                    </div>
                                <div className="col-lg-7">
                                    <div className="pull-right">
                                        <ReactPaginate previousLabel={"«"}
                                            nextLabel={"»"}
                                            breakLabel={<a href="" className="page-link">...</a>}
                                            breakClassName={"break-me"}
                                            pageCount={this.state.pageCount}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={4}
                                            onPageChange={this.handlePageClick}
                                            containerClassName={"pagination"}
                                            previousLinkClassName={"page-link"}
                                            nextLinkClassName={"page-link"}
                                            pageClassName={"page-item"}
                                            pageLinkClassName={"page-link"}
                                            // subContainerClassName={"page-item"}
                                            activeClassName={"active"} />
                                    </div>
                                </div>
                            </div>
                        </div>)}
                    </div>
                </div>
            </div>
        );
    }
}

const stateMap = (state) => {
    return {
        products: state.product.products,
        categories: state.category.categories
    };
};

export default connect(stateMap)(FrontStore);
