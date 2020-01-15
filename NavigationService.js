// NavigationService.js

import { NavigationActions, StackActions } from "react-navigation";

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

// add other navigation functions that you need and export them

function topLevelNavigate(routeName, params) {
  _navigator.dispatch(StackActions.popToTop());
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

export default {
  navigate,
  setTopLevelNavigator,
  topLevelNavigate
};
