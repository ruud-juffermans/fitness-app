import { useTheme } from "@theme/useTheme";
import { TouchableOpacity, View } from "react-native";

const Panel = ({ children ,onLongPress, onPress, style }) => {
  const { components } = useTheme();
  const c = components.panel;

  const hasActions = onLongPress || onPress;

  // const baseStyle = {
  //         backgroundColor: c.backgroundColor,
  //         padding: c.padding,
  //         borderRadius: c.borderRadius,
  //         borderWidth: c.borderWidth,
  //         borderColor: c.borderColor,
  //       }

  const combinedStyle = [c, style];

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