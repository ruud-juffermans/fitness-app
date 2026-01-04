import { useTheme } from "@theme/useTheme";
import { useNavigation } from "@react-navigation/native";
import { Panel, Text } from "@components";
import { View } from "react-native";

const WorkoutTile = ({ item, onPress, onLongPress, active }) => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    if (!item) return null;

    const createdDate = new Date(item.created_at).toLocaleDateString();
    const completedDate = item.completed_at ? new Date(item.completed_at).toLocaleDateString() : null;

    return (
        <Panel
            onLongPress={() => onLongPress?.(item)}
            onPress={() => onPress(item)}
            style={[
                !active && { opacity: 0.6 },
                active && { borderColor: "white" },
            ]}
        >
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 4 }}>
                {item.program} - {item.split}
            </Text>

            <View style={{ display: "flex", flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                    <Text style={{ fontSize: 13 }}>
                        Created: {createdDate}
                    </Text>
                </View>
                {completedDate &&
                    <View style={{ width: "50%" }}>
                        <Text style={{ fontSize: 13 }}>
                            Completed: {completedDate}
                        </Text>
                    </View>
                }
            </View>

        </Panel>
    );
};

export default WorkoutTile;
