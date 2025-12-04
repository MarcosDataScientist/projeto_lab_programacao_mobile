import React from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";

import * as Random from "expo-crypto";
import { colors } from "./theme";

class AddCity extends React.Component {
  state = {
    city: "",
    country: "",
  };

  changeText = (key, value) => {
    this.setState({ [key]: value });
  };

  submit = () => {
    if (this.state.city === "" || this.state.country === "")
      alert("please complete form");
    const city = {
      city: this.state.city,
      country: this.state.country,
      id: String(Random.getRandomBytes(8)),
      locations: [],
    };
    this.props.addCity(city);
    this.setState({
      city: "",
      country: "",
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Cities</Text>
        <TextInput
          placeholder="City name"
          onChangeText={(val) => this.changeText("city", val)}
          style={styles.input}
          value={this.state.city}
        />
        <TextInput
          placeholder="Country name"
          onChangeText={(val) => this.changeText("country", val)}
          style={styles.input}
          value={this.state.country}
        />
        <Pressable onPress={this.submit}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Add City</Text>
          </View>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    backgroundColor: "#666",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  heading: {
    color: "white",
    fontSize: 40,
    marginBottom: 10,
    alignSelf: "center",
  },
  container: {
    backgroundColor: "#1976D2",
    flex: 1,
    justifyContent: "center",
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    paddingHorizontal: 8,
    height: 50,
  },
});

export default AddCity;
