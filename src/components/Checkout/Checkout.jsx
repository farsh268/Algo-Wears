import React, { useState } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import {
  selectCartTotal,
  selectCartItems,
} from "../../redux/cart/cart-selectors";

import StripeCheckoutButton from "../Stripe-Button/Stripe-Button";
import CheckoutItem from "../Checkout-Item/Checkout-Item";
import "./Checkout.scss";

import styled from "styled-components";
import AlgoModal from "../Algo-Payment-Modal/AlgoModal";
import Modal from "../Payment-Modal/Modal";

const Button = styled.button`
  min-width: 100px;
  padding: 16px 32px;
  border-radius: 4px;
  border: none;
  background: var(--form-press);
  color: var(--coin);
  border : solid 1px lightblue;
  text-transform: uppercase;
  cursor: pointer;
`;
const Checkout = ({ cartItems, total }) => {
//dropdown menu

const [showAlgoModal, setShowAlgoModal] = useState(false);
console.log(showAlgoModal)

const openAlgoModal = () => {
  setShowAlgoModal((prev) => !prev);
};

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <div className="header-block">
          <span> Product </span>
        </div>
        <div className="header-block">
          <span> Description </span>
        </div>
        <div className="header-block">
          <span> Quantity </span>
        </div>
        <div className="header-block">
          <span> Price</span>
        </div>
        <div className="header-block">
          <span> Remove </span>
        </div>
      </div>
      {cartItems.map((cartItem) => (
        <CheckoutItem key={cartItem.id} cartItem={cartItem} />
      ))}
      <div className="total">
        <span> TOTAL: ${total}</span>
      </div>
      <div className="test-warning">
        *Please use the following test credit card for payments*
        <br />
        4242 4242 4242 4242 - Exp: 03/22 -CVV : 123
      </div>
      <div className="payment">
        <StripeCheckoutButton price={total} />


        <Button onClick={openAlgoModal}> Pay with Algo</Button>
        <AlgoModal
          showAlgoModal={showAlgoModal}
          setShowAlgoModal={setShowAlgoModal}
          price={total}
        />

        <Button onClick={openModal}>Pay with Choice Coin</Button>
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          price={total}
        />
      </div>
    </div>
  );
};
const mapStateToProps = createStructuredSelector({
  cartItems: selectCartItems,
  total: selectCartTotal,
});

export default connect(mapStateToProps)(Checkout);
