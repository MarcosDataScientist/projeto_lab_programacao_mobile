import { View, Text, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const windowWidth = Dimensions.get("window").width;

const DimensionsExample = () => (
  <View>
    <Text>{width}</Text>
    <Text>{height}</Text>
    <Text>{windowWidth}</Text>
  </View>
);

export default DimensionsExample;
