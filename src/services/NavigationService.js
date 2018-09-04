import {NavigationActions} from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      type: NavigationActions.NAVIGATE,
      routeName,
      params,
    })
  );
}

function resetTo(routeName) {
  _navigator.dispatch(
    NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: routeName})]
    })
  );
}

export default {
  navigate,
  resetTo,
  setTopLevelNavigator,
};