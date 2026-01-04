import { View } from "react-native";
import { Caption, H3, P, Text, Panel } from "@components";
import { useTheme } from "@theme/useTheme";

const SplitPanel = ({ item, onPress, onLongPress }) => {
  const { colors } = useTheme();

  return (
    <Panel
      onLongPress={() => onLongPress?.(item)}
      onPress={() => onPress(item)}
      style={[
        // { borderColor: "white" },
      ]}
    >
      <View >
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 4 }}>
          {item.name}
        </Text>

        <Text style={{ fontSize: 15, opacity: 0.8, marginBottom: 6 }}>
          {item.description}
        </Text>
      </View>
    </Panel>
  )
}

export default SplitPanel