import { TOGGLE_DARK_THEME } from "./toggle-types";

const INITIAL_STATE = {
  darkTheme: localStorage.getItem("mode") === "light" ? false : true,
};

export const toggleReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_DARK_THEME:
      if (!state.darkTheme) {
        localStorage.setItem("mode", "dark");
        return {
          ...state,
          darkTheme: !state.darkTheme,
        };
      } else {
        localStorage.setItem("mode", "light");
        return {
          ...state,
          darkTheme: !state.darkTheme,
        };
      }

    default:
      return state;
  }
};
