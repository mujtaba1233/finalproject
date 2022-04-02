import React, { Component } from 'react';
import { connect } from 'react-redux';
import Product from '../components/product';
import SideBar from '../components/side-bar';
import ReactPaginate from 'react-paginate';
import Scroll from 'react-scroll';
import Select from 'react-validation/build/select';
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
class CategoryView extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handlePageItems = this.handlePageItems.bind(this);
        this.state = {
            allProducts: [],
            products: [],
            searchProducts: [],
            categoryProducts: [],
            filterProductsFunction: '',
            searchTimeOut: '',
            viewAbleProducts: [],
            pageLimit: 9,
            offset: 0,
            pageCount: 1,
            value:''
        }
    }

    handleChange(event) {
        var searchedProducts = [];
        var pName = event.target.value.toLowerCase();
        var eventThis = this;
        clearTimeout(eventThis.state.searchTimeOut);
        this.setState({value:event.target.value.toLowerCase()})
        this.setState({
            offset: 0, searchTimeOut: setTimeout(function () {
                if (pName === '') {
                    searchedProducts = eventThis.state.categoryProducts;
                } else {
                    eventThis.state.allProducts.forEach(prod => {
                        if ((prod.ProductName.toLowerCase().indexOf(pName) !== -1 || prod.ProductCode.toLowerCase().indexOf(pName) !== -1) && prod.HideProduct !== 'Y') {
                            searchedProducts.push(prod);
                        }
                    });
                    // eventThis.props.products.forEach(prod => {
                    //     if (prod.ProductName.toLowerCase().indexOf(pName) !== -1 || prod.ProductCode.toLowerCase().indexOf(pName) !== -1) {
                    //         searchedProducts.push(prod);
                    //     }
                    // });
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
                eventThis.setState({ pageCount: Math.ceil(eventThis.state.categoryProducts.length / eventThis.state.pageLimit) });
                eventThis.setState({ viewAbleProducts: eventThis.state.categoryProducts.slice(eventThis.state.offset, eventThis.state.pageLimit) });
            }, 800)
        });
    }
  
    handlePageClick = (data) => {

        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.pageLimit);
        // console.log('offset', offset);
        this.setState({ offset: offset }, function () {
            this.setState({ viewAbleProducts: this.state.categoryProducts.slice(this.state.offset, this.state.pageLimit * (selected + 1)) });
        })
        Scroll.animateScroll.scrollToTop();
    };
    componentDidMount() {
        document.title = Store_Title
        var thisObj = this;
        this.setState({ allProducts: this.props.products }, function () {
            thisObj.displayProducts(thisObj)
        });
    }
    displayProducts(thisObj) {
        var categoryId = this.props.match.params.id;
        thisObj.setState({
            products: thisObj.state.allProducts.filter(item => item.CategoryIDs && item.HideProduct !== 'Y' && item.CategoryIDs.indexOf(categoryId) !== -1),
            categoryProducts: thisObj.state.allProducts.filter(item => item.CategoryIDs && item.HideProduct !== 'Y' && item.CategoryIDs.indexOf(categoryId) !== -1)
        }, function () {
            thisObj.setState({ pageCount: Math.ceil(thisObj.state.products.length / thisObj.state.pageLimit) });
            thisObj.setState({ offset: 0 }, function () {
                thisObj.setState({ viewAbleProducts: thisObj.state.products.slice(this.state.offset, this.state.pageLimit) });
                // console.log(thisObj.state.viewAbleProducts)
                Scroll.animateScroll.scrollToTop();
            })
        });
    }
    componentWillReceiveProps(props) {
        this.props = props;
        var thisObj = this;
        this.setState({ allProducts: this.props.products }, function () {
            thisObj.displayProducts(thisObj)
        });
    }
    componentDidUpdate(prevProps) {
        if(prevProps.match.params.id !== this.props.match.params.id){
            this.setState({
                value:''
            })
        }
            // var categoryId = this.props.match.params.id;
        // console.log(this.props.products);
        // if (prevProps.categories !== this.props.categories && categoryId !== this.props.match.params.id) {
        //     console.log(prevProps.categories);
        //     console.log(this.props.categories);
        //     let currentCategory = this.props.categories.filter(category => {
        //             return category.id == categoryId
        //         })
        //     document.title = currentCategory[0].name
        // }
    }
    render() {
        return (
            <div id="content">
                <div className="container">
                    <div className="row bar">
                        <SideBar key={this.props.match.params.id} />
                        <div id="pagination" className="col-md-9">
                            <div className="row">
                                <div className="row mrTop18 w-100">
                                    <div className="col-sm-5">
                                        <Search className="m-0"value={this.state.value}  onChangeHandler={this.handleChange} />
                                    </div>
                                    <div className="col d-flex mt-4 justify-content-end align-items-center">
                                        <div className="form-group m-0">
                                            <select className="form-control p-2" id="items" onChange={this.handlePageItems}>
                                                <option value="9">Items Per Page</option>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option value="40">40</option>
                                                <option value="60">60</option>
                                                <option value="100">100</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12 mt-4">
                                    <Product products={this.state.viewAbleProducts} />
                                    {/* {(this.state.viewAbleProducts.length == 0 && <p>No Product found</p>)} */}
                                </div>
                                <div className="col-lg-6">
                                    <div className="pull-right">
                                        <ReactPaginate previousLabel={"«"}
                                            nextLabel={"»"}
                                            breakLabel={<a href="" className="page-link">...</a>}
                                            breakClassName={"break-me"}
                                            pageCount={this.state.pageCount}
                                            marginPagesDisplayed={1}
                                            pageRangeDisplayed={4}
                                            onPageChange={this.handlePageClick}
                                            containerClassName={"pagination col-lg-12"}
                                            previousLinkClassName={"page-link"}
                                            nextLinkClassName={"page-link"}
                                            pageClassName={"page-item"}
                                            pageLinkClassName={"page-link"}
                                            forcePage={(this.state.offset / this.state.pageLimit)}
                                            activeClassName={"active"} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const stateMapCategoryView = (state) => {
    return {
        categories: state.category.categories,
        products: state.product.products,
    };
};

export default connect(stateMapCategoryView)(CategoryView);
