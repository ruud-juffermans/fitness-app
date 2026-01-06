import { useTheme } from "@theme/useTheme";
import { View } from "react-native";
import { Text } from "../Typography";

const MessagBanner = ({ message, type }) => {
  const { colors } = useTheme();


  const combinedStyle = [{
    borderRadius: 4,
    borderWidth: 2,
    padding: 2,
    backgroundColor: "#47864f25",
    borderColor:"#15e42a09",
  }];

  return (
    <View style={combinedStyle}>
      <Text>

      {message}
      </Text>
    </View>
  );

};


export default MessagBanner