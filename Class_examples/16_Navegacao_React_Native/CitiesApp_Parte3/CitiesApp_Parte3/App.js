import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import "react-native-gesture-handler";
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

  addLocation = (location, city) => {
    console.log("location ", location);

    const index = this.state.cities.findIndex((item) => {
      return item.id === city.id;
    });

    const newCity = {
      city: this.state.cities[index].city,
      country: this.state.cities[index].country,
      id: this.state.cities[index].id,
      locations: [...this.state.cities[index].locations, location],
    };

    const cities = [
      ...this.state.cities.slice(0, index),
      newCity,
      ...this.state.cities.slice(index + 1),
    ];

    this.setState({
      cities,
    });
  };

  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="List Cities">
            {(props) => (
              <CitiesNavScreen
                {...props}
                cities={this.state.cities}
                addLocation={this.addLocation}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Add City">
            {() => <AddCity addCity={this.addCity} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
