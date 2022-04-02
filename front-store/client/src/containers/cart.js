import React, { Component } from 'react';
import { connect } from 'react-redux';
// import SideBar from '../components/side-bar';
import CartDetail from '../components/cart-detail';
import Scroll from 'react-scroll';
import { cartTotal, totalShipping, totalTax } from '../actions/globalActions';
import store from '../store';
class CartContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            allProducts : [],
            products : [],
            filterProductsFunction : '',
            viewAbleProducts : [],
            pageLimit : 9,
            offset: 0,
            pageCount: 1,
        }
    }
    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.pageLimit);
        this.setState({offset: offset},function(){
            this.setState({viewAbleProducts: this.state.products.slice(this.state.offset,this.state.pageLimit * (selected+1))});
        })
    };
    componentWillMount(){
        var thisObj = this
        this.setState({filterProductsFunction: function(catId){
                thisObj.setState({
                    products: thisObj.state.allProducts.filter(item => item.CategoryIDs.indexOf(catId) !== -1 )
                },function(){
                    thisObj.setState({pageCount: Math.ceil(thisObj.state.products.length / thisObj.state.pageLimit)});
                    thisObj.setState({offset:0},function(){
                        thisObj.setState({viewAbleProducts: thisObj.state.products.slice(this.state.offset,this.state.pageLimit)});
                        Scroll.animateScroll.scrollToTop();
                    })
                });
                // console.log('products in cate',thisObj.state.products.length);
            }
        })
        this.setState({productId:this.props.match.params.id},function() {
            // console.log('after id set',this.state.allProducts);
        });
    }
    componentDidUpdate(prevProps,prevState){
        // console.log('cart update',prevProps,this.props);
        
        if(prevProps.cartItems != this.props.cartItems && prevProps.cartItems.length === 0){
            this.setState({ cartItems: this.props.cartItems },function(){
                // console.log('after all product set',this.state.allProducts);
            });
        }
    }
    componentDidMount(){
        store.dispatch(cartTotal(0));
        store.dispatch(totalTax(0));
        store.dispatch(totalShipping(0));
    }
    componentWillReceiveProps(props){
        this.props = props;
        // console.log('props recived cart container',this.props);
        
    }
    render() {
        return (
            <div id="content">
                <div className="container">
                    {/* <div className="row bar"> */}
                        {/* <SideBar /> */}
                        <CartDetail containerRef={this} finalOrderView={false} />
                    {/* </div> */}
                </div>
            </div>
        );
    }
}

const stateMapCart = (state) => {
    return {
        cartItems: state.cart,
    };
};

export default connect(stateMapCart)(CartContainer);
