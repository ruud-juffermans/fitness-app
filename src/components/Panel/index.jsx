import { TouchableOpacity, View } from "react-native";

const Panel = ({ children ,onLongPress, onPress, style }) => {

  const hasActions = onLongPress || onPress;

  const baseStyle = {
          backgroundColor: "#101214",
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#333",
          gap: 4,
        }

  const combinedStyle = [baseStyle, style];

  if (!hasActions) {
    return (
      <View style={combinedStyle}>
        {children}
      </View>
    );
  }

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      onPress={onPress}
      style={combinedStyle}
      activeOpacity={0.9}
    >
      {children}
    </TouchableOpacity>
  );
};


export default Panel