import Panel from "@components/Panel";
import { ColorLabel, Text } from "@components";
import { View } from "react-native";
import { useTheme } from "@theme/useTheme";
import { useNavigation } from "@react-navigation/native";

const ExerciseTile = ({ item, onPress, onLongPress }) => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    return (
        <Panel 
            onLongPress={() => onLongPress?.(item)}
            onPress={() => onPress(item)}
        >
                <View
                    style={{
                        paddingVertical: 1,
                        borderTopWidth: 1,
                        borderTopColor: colors.base[200],
                    }}
                >
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 4 }}>
                {item.name}
            </Text>

                                {item.description ? (
        <Text style={{ fontSize: 15, opacity: 0.8, marginBottom: 6 }}>
          {item.description}
        </Text>
                    ) : null}
                    <View style={{display: "flex", flexDirection: "row", gap: 6}}>

                    <ColorLabel text={item.muscle_group} color={"#540000ff"} />
                    <ColorLabel text={item.exercise_type} color={"#6e6700ff"} />
                    <ColorLabel text={item.equipment_type} color={"#013b7eff"} />
                    </View>

                </View>
            </Panel>
    )
}

export default ExerciseTile