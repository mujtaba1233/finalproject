import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux';
import { TO_CATEGORY, TO_RETURN, TO_SHIPPING, TO_FAQ, TO_ABOUTUS, TO_PRICES_CART_FAQ_ANSWER, TO_TERM_AND_CONDITION } from '../helpers/routesConstants';
import Loader from "./Loader";
const CategoryTemp = ({ categories }) => (
    <ul className="nav nav-pills flex-column text-sm category-menu side-bar-ul">
        {categories.map(category => (
            <li key={category.id} className="nav-item">
                <NavLink activeClassName='active' to={TO_CATEGORY+category.id} className="nav-link d-flex align-items-center justify-content-between">
                    <span> {category.name}  </span>
                    <span className="badge badge-light">{category.totalProducts}</span>
                </NavLink>
            </li>
        ))}
    </ul>
);

const MoreInfo = () => (
    <ul className="nav nav-pills flex-column text-sm category-menu side-bar-ul">
        <li key="1890" className="nav-item">
            <NavLink activeClassName='active' to={TO_PRICES_CART_FAQ_ANSWER} className="nav-link d-flex align-items-center justify-content-between">
                <span> Can't See Prices <br></br>or Add Items into Cart? </span>
            </NavLink>
        </li>
        <li key="1891" className="nav-item">
            <NavLink activeClassName='active' to={TO_RETURN} className="nav-link d-flex align-items-center justify-content-between">
                <span> RETURNS  </span>
            </NavLink>
        </li>
        <li key="1892" className="nav-item">
            <NavLink activeClassName='active' to={TO_SHIPPING} className="nav-link d-flex align-items-center justify-content-between">
                <span> Shipping  </span>
            </NavLink>
        </li>
        <li key="1893" className="nav-item">
            <NavLink activeClassName='active' to={TO_FAQ} className="nav-link d-flex align-items-center justify-content-between">
                <span> FAQ  </span>
            </NavLink>
        </li>
        <li key="1894" className="nav-item">
            <NavLink activeClassName='active' to={TO_TERM_AND_CONDITION} className="nav-link d-flex align-items-center justify-content-between">
                <span> Terms And Conditions  </span>
            </NavLink>
        </li>
        <li key="1895" className="nav-item">
            <NavLink activeClassName='active' to={TO_ABOUTUS} className="nav-link d-flex align-items-center justify-content-between">
                <span> About Us  </span>
            </NavLink>
        </li>
    </ul>
);

class SideBar extends Component {
    render() {
        return (
            
            <div className="col-md-3">
                {this.props.categories.length === 0 && <Loader />}

                {(this.props.categories.length > 0 && <div>
                    <div className="panel panel-default sidebar-menu">
                        <div className="panel-heading">
                            <h3 className="h4 panel-title">PRODUCTS</h3>
                        </div>
                        <div className="panel-body sidebar-border">
                            <CategoryTemp categories={this.props.categories}/>
                        </div>
                    </div>
                    <div className="panel panel-default sidebar-menu">
                        <div className="panel-heading">
                            <h3 className="h4 panel-title">MORE INFO</h3>
                        </div>
                        <div className="panel-body sidebar-border">
                            <MoreInfo />
                        </div>
                    </div>
                </div>)}
            </div>
        );
    }
}


const stateMapSideBar = (state) => {
    return {
        categories: state.category.categories,
    };
};

export default connect(stateMapSideBar)(SideBar);
