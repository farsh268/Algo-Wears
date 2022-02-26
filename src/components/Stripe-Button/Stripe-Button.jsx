import React from "react";
import StripeCheckout from "react-stripe-checkout";
import img from "../../assets/logo.png";
import axios from "axios";

const StripeCheckoutButton = ({ price }) => {
  const priceforStripe = price * 100;
  const publishKey =
    "pk_test_51Jemj7JuNvlr0BgnBVfb6INJGWdxbSLLtu4kDpPkP9aabRggE7hBbsT6hBTvXI2KFJhwHfwR74DKwSGC6J5SNK3q00zhNL38wz";
  const onToken = (token) => {
    axios({
      url: "https://flx-stripe-api.herokuapp.com/payment",
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: {
        amount: priceforStripe,
        token,
      },
    })
      .then((response) => {
        console.log(response);
        alert("Payment Successful");
      })
      .catch((err) => {
        console.log("Payment error:", JSON.parse(err));
        alert(
          "There was an issue with your payment, please make sure you use the provided credit card"
        );
      });
  };
  return (
    <StripeCheckout
      label="Pay With Card"
      name="AlgoWears"
      billingAddress
      shppingAddress
      image={img}
      description={`Your Total is $${price}`}
      amount={priceforStripe}
      panelLabel="Pay With Card"
      token={onToken}
      stripeKey={publishKey}
    />
  );
};

export default StripeCheckoutButton;
