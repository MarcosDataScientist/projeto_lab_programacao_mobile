import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AddCity from "./src/AddCity";
import CitiesNavScreen from "./src/CitiesNavScreen";

const Tab = createBottomTabNavigator();

export default class App extends Component {
  state = {
    cities: [],
  };

  addCity = (city) => {
    const cities = this.state.cities;
    cities.push(city);
    this.setState({ cities });
    console.log("estado do app.js: ", this.state);
  };

  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="List Cities" component={CitiesNavScreen} />
          <Tab.Screen name="Add City">
            {() => <AddCity addCity={this.addCity} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
