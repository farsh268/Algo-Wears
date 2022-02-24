import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import { MdClose } from "react-icons/md";
import "./Modal.scss";
import { selectDarkMode } from "../../redux/toggleTheme/toggle-selectors";
import { createStructuredSelector } from "reselect";
import Payment from "../Payment/Payment";
import { connect } from "react-redux";

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  top: 0;
  left: 0;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalWrapper = styled.div`
  width: 400px;
  height: 500px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: var(--background);
  color: var(--color);
  position: relative;
  z-index: 10;
  border-radius: 10px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.8;
  color: var(--color);
  p {
    margin-bottom: 1rem;
  }
  button {
    padding: 10px 24px;
    background: #141414;
    color: var(--color);
    border: none;
    cursor: pointer;
  }
`;

const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`;

const Modal = ({ showModal, setShowModal, price, darkTheme }) => {
  const [choice_price, setChoice_price] = useState("");

  useEffect(() => {
    getChoicePrice();
  }, []);

  // getting choice price from liveCoinWatch API
  const getChoicePrice = () => {
    fetch("https://api.livecoinwatch.com/coins/single", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": "3ce573cf-4d1f-4ef7-8c3a-879848cebebb",
      },
      body: JSON.stringify({
        currency: "USD",
        code: "CHOICE",
        meta: true,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const choiceprice = data.rate.toFixed(8);
        setChoice_price(choiceprice);
      });
  };
  price = Math.floor(price / choice_price);

  const isWalletConnected =
    localStorage.getItem("wallet-type") === null ? false : true;
  const dispatch = useDispatch();

  const LogOut = () => {
    localStorage.removeItem("address");
    localStorage.removeItem("addresses");
    localStorage.removeItem("wallet-type");
    localStorage.removeItem("walletconnect");
    setShowModal(false);
    console.log("data");
  };

  const modalRef = useRef();
  const addresses = localStorage.getItem("addresses")?.split(",");

  const animation = useSpring({
    config: {
      duration: 250,
    },
    opacity: showModal ? 1 : 0,
    transform: showModal ? `translateY(0%)` : `translateY(-100%)`,
  });

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
        console.log("I pressed");
      }
    },
    [setShowModal, showModal]
  );

  const myAlgoConnect = async () => {
    const myAlgoWallet = new MyAlgoConnect({ shouldSelectOneAccount: false });
    try {
      const accounts = await myAlgoWallet.connect({
        shouldSelectOneAccount: true,
      });
      const addresses = accounts.map((item) => item?.address);
      const address = accounts[0].address;
      // close modal.
      localStorage.setItem("wallet-type", "my-algo");
      localStorage.setItem("address", address);
      localStorage.setItem("addresses", addresses);
      setShowModal(false);
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = () => {
    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: QRCodeModal,
    });

    if (!connector.connected) {
      connector.createSession();
    }

    connector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }

      const { accounts } = payload.params[0];

      const addresses = accounts.map((item) => item);
      const address = accounts[0];

      localStorage.setItem("wallet-type", "walletconnect");
      localStorage.setItem("address", address);
      localStorage.setItem("addresses", addresses);
      setShowModal(false);
      // window.location.reload();
    });

    connector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }

      const { accounts } = payload.params[0];

      const addresses = accounts.map((item) => item);
      const address = accounts[0];

      localStorage.setItem("wallet-type", "walletconnect");
      localStorage.setItem("address", address);
      localStorage.setItem("addresses", addresses);

      // window.location.reload();
    });

    connector.on("disconnect", (error, payload) => {
      if (error) {
        console.log(error);
      }
    });
  };

  const algoSignerConnect = async () => {
    try {
      if (typeof window.AlgoSigner === "undefined") {
        window.open(
          "https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm",
          "_blank"
        );
      } else {
        await window.AlgoSigner.connect({
          ledger: "TestNet",
        });
        const accounts = await window.AlgoSigner.accounts({
          ledger: "TestNet",
        });

        const addresses = accounts.map((item) => item?.address);
        const address = accounts[0].address;

        // close modal.
        localStorage.setItem("wallet-type", "algosigner");
        localStorage.setItem("address", address);
        localStorage.setItem("addresses", addresses);
        setShowModal(false);
        // window.location.reload();
      }
    } catch (error) {
      dispatch({
        type: "alert_modal",
        alertContent: "AlgoSigner not set up yet!",
      });
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  return (
    <div className={`${darkTheme ? "dark_theme" : "light_theme"}`}>
      {showModal ? (
        <Background onClick={closeModal} ref={modalRef}>
          <animated.div style={animation}>
            <ModalWrapper showModal={showModal}>
              <ModalContent>
                <div>
                  {!!isWalletConnected ? (
                    <div>
                      <div className="addrDisplay">
                        <div className="dropDownConnect_items">
                          <div className="dropDownConnect_item">
                            <p className="dropDownConnect_item_txt">
                              {addresses[0]}
                            </p>
                            <button
                              className="dropDownConnect_item_list"
                              style={{
                                listStyle: "none",
                                cursor: "pointer",
                                marginLeft: "0",
                                marginTop: "-5px",
                                color: "white",
                                // padding: "0",
                              }}
                              onClick={LogOut}
                            >
                              Disconnect Wallet
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="dropDownConnect">
                      <div className="dropDownConnect_button">
                        <button
                          className="connect_wallet_button"
                          style={{ marginLeft: "0px", color: "white" }}
                        >
                          <p>
                            Connect Wallet
                            <i
                              className="uil uil-angle-down"
                              style={{ fontSize: "18px" }}
                            />
                          </p>
                        </button>
                      </div>

                      <div className="dropDownConnect_items">
                        <div
                          className="dropDownConnect_item"
                          onClick={myAlgoConnect}
                        >
                          <div className="dropDownConnect_img">
                            <img
                              src="https://i.postimg.cc/76r9kXSr/My-Algo-Logo-4c21daa4.png"
                              alt=""
                            />
                          </div>
                          <p className="dropDownConnect_item_txt">
                            My Algo Wallet
                          </p>
                        </div>
                        <div
                          className="dropDownConnect_item"
                          onClick={algoSignerConnect}
                        >
                          <div className="dropDownConnect_img">
                            <img
                              src="https://i.postimg.cc/L4JB4JwT/Algo-Signer-2ec35000.png"
                              alt=""
                            />
                          </div>
                          <p className="dropDownConnect_item_txt">
                            {typeof window.AlgoSigner === undefined
                              ? "Install AlgoSigner"
                              : "AlgoSigner"}
                          </p>
                        </div>{" "}
                        <div
                          className="dropDownConnect_item"
                          onClick={connectWallet}
                        >
                          <div className="dropDownConnect_img">
                            <img
                              src="https://i.postimg.cc/J7JZ4cFb/icon-37675b59-1.png"
                              alt=""
                            />
                          </div>
                          <p className="dropDownConnect_item_txt">
                            Algorand Mobile Wallet
                          </p>
                        </div>{" "}
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className="displayAmount"
                  style={{
                    marginTop: "40px",
                    textTransform: "uppercase",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ margin: "0px" }}>Your Total is</h3>
                  <h1 style={{ margin: "0px" }}>*{price} $Choice*</h1>
                </div>

                <p
                  style={{
                    color: "red",
                    textAlign: "center",
                    fontSize: "14px",
                  }}
                >
                  *The above amount will be deducted from your wallet. Ensure
                  you have enough funds in your wallet and You have Opted in
                  ChoiceCoin ASA in your Algorand Wallet*
                </p>
                <Payment price={price} />
              </ModalContent>
              <CloseModalButton
                aria-label="Close modal"
                onClick={() => setShowModal((prev) => !prev)}
              />
            </ModalWrapper>
          </animated.div>
        </Background>
      ) : null}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  darkTheme: selectDarkMode,
});

export default connect(mapStateToProps)(Modal);
