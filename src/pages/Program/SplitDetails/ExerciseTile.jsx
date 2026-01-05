import { Panel, Small, Text } from "@components";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@theme/useTheme";
import { View } from "react-native";

const ExerciseTile = ({ item }) => {
  const { colors } = useTheme();

  console.log(item)

  return (
    <Panel>
      <View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View>
                        <Ionicons
              name={"grid-outline"}
              size={20}
              color={"grey"}
              style={{padding: 12, marginRight: 5 }}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 4 }}>
                {item.name}
            </Text>

            <Text style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
                {item.description}
            </Text>
          </View>
          <View style={{ gap: 4 }}>


            <View style={{ padding: 2, width: 60, backgroundColor: "grey" }}>
              <Small>{item.reps} Reps</Small>
            </View>
            <View style={{ padding: 2, width: 60, backgroundColor: "grey" }}>
              <Small>{item.sets} Sets</Small>
            </View>
          </View>
        </View>
      </View>
    </Panel>
  )
}

export default ExerciseTile