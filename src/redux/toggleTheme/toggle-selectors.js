import { createSelector } from "reselect";

const selectMode = (state) => state.darkMode;

export const selectDarkMode = createSelector(
  [selectMode],
  (darkMode) => darkMode.darkTheme
);
