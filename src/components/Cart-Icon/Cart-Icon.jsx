import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectCartItemsCount } from "../../redux/cart/cart-selectors";
import { toggleCartHidden } from "../../redux/cart/cart-action";
import UilShoppingBag from "@iconscout/react-unicons/icons/uil-shopping-bag";

import "./Cart-Icon.scss";

const CartIcon = ({ toggleCartHidden, itemCount }) => (
  <div
    className="cart-icon"
    onClick={toggleCartHidden}
    onMouseEnter={toggleCartHidden}
  >
    <UilShoppingBag size="30" />
    {/* <ShoppingIcon className="shopping-icon" /> */}
    {/* <i class="uil uil-shopping-bag" size="500"></i> */}
    <span className="item-count">{itemCount}</span>
  </div>
);

const mapStateToProps = createStructuredSelector({
  itemCount: selectCartItemsCount,
});
const mapDispatchToProps = (dispatch) => ({
  toggleCartHidden: () => dispatch(toggleCartHidden()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CartIcon);
