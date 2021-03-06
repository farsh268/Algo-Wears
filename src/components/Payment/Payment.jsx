import algosdk from "algosdk";
import WalletConnect from "@walletconnect/client";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import { useDispatch } from "react-redux";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import AlertModal from "../Payment-Modal/AlertModal";

const Payment = ({ price }) => {
  const ASSET_ID = 21364625;
  const dispatch = useDispatch();

  const algodClient = new algosdk.Algodv2(
    "",
    "https://api.algoexplorer.io",
    ""
  );
  const walletType = localStorage.getItem("wallet-type");
  const isThereAddress = localStorage.getItem("address");
  const walletAddress =
    "CPR3F57KFKNW7M2CLIOFKHGTFP4D27HJHRMN7OAT4CGN3MW544DDWON4YM";
  const myAlgoWallet = new MyAlgoConnect();

  const myAlgoConnect = async (Data) => {
    try {
      const myAccountInfo = await algodClient
        .accountInformation(isThereAddress)
        .do();

      // check if the voter address has Choice
      const containsChoice = myAccountInfo.assets
        ? myAccountInfo.assets.some(
            (element) => element["asset-id"] === ASSET_ID
          )
        : false;

      // if the address has no ASAs
      if (myAccountInfo.assets.length === 0) {
        dispatch({
          type: "alert_modal",
          alertContent:
            "You need to opt-in to Choice Coin in your Algorand Wallet.",
        });
        return;
      }

      if (!containsChoice) {
        dispatch({
          type: "alert_modal",
          alertContent:
            "You need to opt-in to Choice Coin in your Algorand Wallet.",
        });
        return;
      }
      //   get balance of the voter
      const balance = myAccountInfo.assets
        ? myAccountInfo.assets.find(
            (element) => element["asset-id"] === ASSET_ID
          ).amount / 100
        : 0;
      if (Data.amount > balance) {
        dispatch({
          type: "alert_modal",
          alertContent:
            "You do not have sufficient balance to make this transaction.",
        });
        return;
      }

      const suggestedParams = await algodClient.getTransactionParams().do();
      const amountToSend = Data.amount * 100;

      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: isThereAddress,
        to: Data.address,
        amount: amountToSend,
        assetIndex: ASSET_ID,
        suggestedParams,
      });

      const signedTxn = await myAlgoWallet.signTransaction(txn.toByte());
      await algodClient.sendRawTransaction(signedTxn.blob).do();

      // alert success
      dispatch({
        type: "alert_modal",
        alertContent: "Payment Successful...",
      });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      if (error.message === "Can not open popup window - blocked") {
        dispatch({
          type: "alert_modal",
          alertContent:
            "Pop Up windows blocked by your browser. Enable pop ups to continue.",
        });
      } else {
        dispatch({
          type: "alert_modal",
          alertContent: "An error occured the during transaction process",
        });
      }
    }
  };

  const algoSignerConnect = async (Data) => {
    try {
      const myAccountInfo = await algodClient
        .accountInformation(isThereAddress)
        .do();
      console.log(myAccountInfo);

      // check if the payer address has Choice
      const containsChoice = myAccountInfo.assets
        ? myAccountInfo.assets.some(
            (element) => element["asset-id"] === ASSET_ID
          )
        : false;
      console.log(containsChoice);

      // if the address has no ASAs
      if (myAccountInfo.assets.length === 0) {
        dispatch({
          type: "alert_modal",
          alertContent:
            "You need to opt-in to Choice Coin in your Algorand Wallet.",
        });
        return;
      }

      if (!containsChoice) {
        dispatch({
          type: "alert_modal",
          alertContent:
            "You need to opt-in to Choice Coin in your Algorand Wallet.",
        });
        return;
      }
      // get balance of the voter
      const balance = myAccountInfo.assets
        ? myAccountInfo.assets.find(
            (element) => element["asset-id"] === ASSET_ID
          ).amount / 100
        : 0;

      if (Data.amount > balance) {
        console.log(balance);
        console.log(Data.amount);
        dispatch({
          type: "alert_modal",
          alertContent:
            "You do not have sufficient balance to make this transaction.",
        });
        return;
      }

      const suggestedParams = await algodClient.getTransactionParams().do();
      const amountToSend = Data.amount * 100;

      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: isThereAddress,
        to: Data.address,
        amount: amountToSend,
        assetIndex: ASSET_ID,
        suggestedParams,
      });

      const signedTxn = await window.AlgoSigner.signTxn([
        { txn: window.AlgoSigner.encoding.msgpackToBase64(txn.toByte()) },
      ]);
      await algodClient
        .sendRawTransaction(
          window.AlgoSigner.encoding.base64ToMsgpack(signedTxn[0].blob)
        )
        .do();

      // alert success
      dispatch({
        type: "alert_modal",
        alertContent: "Payment Successful...",
      });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      if (error.message === "Can not open popup window - blocked") {
        dispatch({
          type: "alert_modal",
          alertContent:
            "Pop Up windows blocked by your browser. Enable pop ups to continue.",
        });
      } else {
        dispatch({
          type: "alert_modal",
          alertContent: "An error occured the during transaction process",
        });
      }
    }
  };

  const algoMobileConnect = async (Data) => {
    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: QRCodeModal,
    });

    try {
      const address = !!isThereAddress ? isThereAddress : "";

      const myAccountInfo = await algodClient.accountInformation(address).do();

      const containsChoice = myAccountInfo.assets
        ? myAccountInfo.assets.some(
            (element) => element["asset-id"] === ASSET_ID
          )
        : false;

      if (myAccountInfo.assets.length === 0) {
        alert("You need to opt-in to Choice Coin in your Algorand Wallet.");
        return;
      }

      if (!containsChoice) {
        alert("You need to opt-in to Choice Coin in your Algorand Wallet.");
        return;
      }
      // get balance of the voter
      const balance = myAccountInfo.assets
        ? myAccountInfo.assets.find(
            (element) => element["asset-id"] === ASSET_ID
          ).amount / 100
        : 0;
      if (Data.amount > balance) {
        alert("You do not have sufficient balance to make this transaction.");
        return;
      }

      const suggestedParams = await algodClient.getTransactionParams().do();
      const amountToSend = Data.amount * 100;

      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: address,
        to: Data.address,
        amount: amountToSend,
        assetIndex: ASSET_ID,
        suggestedParams,
      });

      const txnsToSign = [
        {
          txn: Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString(
            "base64"
          ),
          message: "Transaction using Mobile Wallet",
        },
      ];

      const requestParams = [txnsToSign];

      const request = formatJsonRpcRequest("algo_signTxn", requestParams);
      const result = await connector.sendCustomRequest(request);

      const decodedResult = result.map((element) => {
        return element ? new Uint8Array(Buffer.from(element, "base64")) : null;
      });

      console.log(decodedResult);
      await algodClient.sendRawTransaction(decodedResult).do();
      // alert success
      dispatch({
        type: "alert_modal",
        alertContent: "Payment Successful...",
      });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      if (error.message === "Can not open popup window - blocked") {
        dispatch({
          type: "alert_modal",
          alertContent:
            "Pop Up windows blocked by your browser. Enable pop ups to continue.",
        });
      } else {
        dispatch({
          type: "alert_modal",
          alertContent: "An error occured during the transaction process",
        });
      }
    }
  };

  const MakePayment = (address, amount) => {
    if (!walletType) {
      dispatch({
        type: "alert_modal",
        alertContent: "Kindly connect your wallet to make payment! ",
      });
    } else if (walletType === "my-algo") {
      myAlgoConnect({ address, amount });
    } else if (walletType === "algosigner") {
      algoSignerConnect({ address, amount });
    } else if (walletType === "walletconnect") {
      algoMobileConnect({ address, amount });
    }
  };

  return (
    <div className="card_cont">
      <div className="card_cand">
        <div className="vote_collap">
          <div className="rec_vote_cont">
            <button
              style={{ marginLeft: "0", color: "white" }}
              className="record_vote"
              onClick={() => {
                MakePayment(walletAddress, price);
              }}
            >
              Make Payment
            </button>
            <AlertModal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
