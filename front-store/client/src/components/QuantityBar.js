import React, { Component } from 'react';
import { connect } from 'react-redux';
import { parseFreeAccessoriesForView } from '../helpers/utility';

import { updateCart, removeItem } from './../actions/cartActions';
import { syncQuantity } from './../actions/catalogActions';
import store from './../store';

class QuantityBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentQuantity: 1,
        }
    }
    componentDidMount() {
        const { itemsInStore } = this.props;
        const currentItem = itemsInStore.find(this._getCurrentItemQuantity);
        this.setState({
            currentQuantity: currentItem ? currentItem.Quantity : 0
        });
    }

    _getCurrentItemQuantity = (cart) => {
        const { product } = this.props;
        return cart.ProductCode === product.ProductCode;
    }

    _updateQuantity = (change) => {
        const { itemsInStore, product, callback } = this.props;
        const currentItem = itemsInStore.find(this._getCurrentItemQuantity);
        let { Quantity } = currentItem;
        switch (change) {
            case "increment": {
                Quantity = Quantity + 1;
                callback(Quantity)
                break;
            }
            case "decrement": {
                Quantity = Quantity - 1;
                if (Quantity === 0 || Quantity === undefined) {
                    store.dispatch(removeItem(product));
                }
                callback(Quantity)
                break;
            }
            default: {
                // console.log('nither increment nor decrement');
                break;
            }
        }

        this.setState({
            currentQuantity: Quantity
        })
        if (currentItem.Childs && currentItem.Childs.length > 0) {
            const accessories = parseFreeAccessoriesForView(currentItem, this.props.products)
            currentItem.Childs.forEach(elem => {
                const accessory = accessories.find(access => access.ProductCode === elem.ProductCode)
                console.log(accessory);
                if (accessory)
                    elem.Quantity = Quantity * accessory.Quantity;
                else
                    elem.Quantity = Quantity;
            });
        }
        const updatedItemDetails = Object.assign(currentItem, { Quantity: Quantity });
        const syncCatalog = {
            ProductCode: product.ProductCode,
            Quantity: product.Quantity
        }
        store.dispatch(updateCart(updatedItemDetails));
        store.dispatch(syncQuantity(syncCatalog));
    }

    render() {
        const { currentQuantity } = this.state;
        // const { quantityAdded } = this.props;
        return (
            <div className="quantity-bar">
                <div className="btn btn-template-outlined adjust-quantity" onClick={() => { this._updateQuantity('decrement') }} >
                    <span>-</span>
                </div>
                <div className="item-quantity-meter">
                    <span>{currentQuantity} in cart</span>
                </div>
                <div className="btn btn-template-outlined  adjust-quantity" onClick={() => { this._updateQuantity('increment') }}>
                    <span>+</span>
                </div>
            </div>
        )
    }
}

const stateMapQuantityBar = (state) => {
    return {
        itemsInStore: state.cart,
        products: state.product.products,
    };
};

export default connect(stateMapQuantityBar)(QuantityBar);