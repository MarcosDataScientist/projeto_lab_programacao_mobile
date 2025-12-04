import { createStackNavigator } from "@react-navigation/stack";
import City from "./City";
import Cities from "./Cities";

const CitiesNav = createStackNavigator();

const CitiesNavScreen = ({ cities, addLocation }) => (
  <CitiesNav.Navigator>
    <CitiesNav.Screen name="Cities">
      {(props) => <Cities {...props} cities={cities} />}
    </CitiesNav.Screen>
    <CitiesNav.Screen
      name="City"
      options={({ route }) => ({ title: route.params.city.city })}
    >
      {(props) => {
        const { route } = props;
        const city = cities.find((c) => c.id === route.params.city.id); // Obtém a cidade atualizada
        return <City {...props} city={city} addLocation={addLocation} />;
      }}
    </CitiesNav.Screen>
  </CitiesNav.Navigator>
);

export default CitiesNavScreen;
