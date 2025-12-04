import { createStackNavigator } from "@react-navigation/stack";
import City from "./City";
import Cities from "./Cities";

const CitiesNav = createStackNavigator();

const CitiesNavScreen = ({ cities, addLocation }) => (
  <CitiesNav.Navigator>
    <CitiesNav.Screen name="Cities">
      {(props) => <Cities {...props} cities={cities} />}
    </CitiesNav.Screen>
    <CitiesNav.Screen name="City" component={City} />
  </CitiesNav.Navigator>
);

export default CitiesNavScreen;
