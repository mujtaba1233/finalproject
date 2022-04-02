import React, { Component } from 'react';
import { connect } from 'react-redux';
import SideBar from '../components/side-bar';
import Scroll from 'react-scroll';
import ProductDetail from '../components/product-detail';
class ProductDetailContainer extends Component {
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
    componentWillMount(){
        this.setState({productCode:this.props.match.params.code},function() {
            // console.log('after id set',this.state.allProducts);
        });
    }
    componentDidMount() {
        Scroll.animateScroll.scrollToTop();
    }
    componentDidUpdate(prevProps){
        // console.log('did update',prevProps,this.props);
        if(prevProps.products.length === 0 && this.props.products.length > 0){
            this.setState({ allProducts: this.props.products });
        }
    }
    render() {
        return (
            <div id="content">
                <div className="container">
                    <div className="row bar">
                        <SideBar />
                        {/* <p className="text-muted lead">Muted text.</p> */}
                        <ProductDetail productCode={this.state.productCode}/>
                    </div>
                </div>
            </div>
        );
    }
}

const stateMap = (state) => {
    return {
        products: state.product.products,
    };
};

export default connect(stateMap)(ProductDetailContainer);
