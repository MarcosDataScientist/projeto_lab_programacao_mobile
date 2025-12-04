import { Component } from "react";
import { AppState, View, Text } from "react-native"; // A

export default class AppStateExample extends Component {
  componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChange);
  }

  handleAppStateChange(currentAppState) {
    console.log("currentAppState:", currentAppState);
  }

  render() {
    return (
      <View>
        <Text>Testing App State</Text>
      </View>
    );
  }
}
