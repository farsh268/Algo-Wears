import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectCartHidden } from "../../redux/cart/cart-selectors";
import { selectCurrentUser } from "../../redux/user/user-selectors";
import { clearCart } from "../../redux/cart/cart-action";
import { selectMobileMedia } from "../../redux/media-query/query-selectors";

import "./Header.scss";
import { auth } from "../../firebase/firebase";
import { Link } from "react-router-dom";
import CartIcon from "../Cart-Icon/Cart-Icon";
import CartDropdown from "../Cart-Dropdown/Cart-Dropdown";
import img from "../../assets/logo.png";
import img2 from "../../assets/logo2.png";
import { toggleDarkMode } from "../../redux/toggleTheme/toggle-action";

const Header = ({
  darkTheme,
  currentUser,
  toggleMode,
  hidden,
  clearCart,
  mobileMedia,
}) => {
  return (
    <div className="header">
      <Link className="logo-container" to="/">
        {darkTheme ? (
          <img src={img2} alt="logo" />
        ) : (
          <img src={img} alt="logo" />
        )}
      </Link>
      <div className="options" >
        <div  onClick={toggleMode}  className=" option mode">
          <span>
          M
          {darkTheme ? (
            <i className="uil uil-brightness-low"></i>
          ) : (
            <i className="uil uil-moon"></i>
          )}
          DE
          </span>
        
        </div>
        <div>
          <Link className="option" to="/shop">
            SHOP
          </Link>
        </div>
        {currentUser ? (
          <Link
            to="/"
            className="option"
            onClick={() => {
              auth.signOut();
              clearCart();
            }}
          >
            SIGN OUT
          </Link>
        ) : mobileMedia ? (
          <div className="sign-in-options">
            <Link className="option ul" to="/signin">
              SIGN IN
            </Link>
            <Link className="option" to="/register">
              REGISTER
            </Link>
          </div>
        ) : (
          <Link className="option" to="/signin">
            SIGN IN
          </Link>
        )}
        <CartIcon />
      </div>
      {hidden ? null : <CartDropdown />}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  clearCart: (clear) => dispatch(clearCart(clear)),
  toggleMode: () => dispatch(toggleDarkMode()),
});

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  hidden: selectCartHidden,
  mobileMedia: selectMobileMedia,
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
