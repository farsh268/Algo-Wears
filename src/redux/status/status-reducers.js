export const statusReducer = (
  state = {
    addressNum: 0,
    address: null,
    alertModal: { openModal: false, modalContent: "" },
  },
  action
) => {
  switch (action.type) {
    case "setAlgoAddress":
      localStorage.setItem("address", `${action?.addr}`);
      return { ...state, addressNum: action.addressIndex };
    case "alert_modal":
      return {
        ...state,
        alertModal: { openModal: true, modalContent: action.alertContent },
      };
    case "close_modal":
      return { ...state, alertModal: { openModal: false, modalContent: "" } };
    default:
      return state;
  }
};
