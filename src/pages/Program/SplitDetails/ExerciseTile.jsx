import { View } from "react-native";
import { Caption, H3, P, Small, Panel, ColorLabel } from "@components";
import { useTheme } from "@theme/useTheme";
import { Text } from "../../../components";

const ExerciseTile = ({ item }) => {
  const { colors } = useTheme();

  console.log(item)

  return (
    <Panel>
      <View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
<Caption>Name</Caption>
            <Small>{item.name}</Small>
<Caption>Description</Caption>
            <Small>{item.description}</Small>
          </View>
          <View>
            <View>
              <Caption>Reps</Caption>
              <Small>{item.reps}</Small>
            </View>
            <View>
              <Caption>Sets</Caption>
              <Small>{item.sets}</Small>
            </View>
          </View>
        </View>
      </View>
    </Panel>
  )
}

export default ExerciseTile