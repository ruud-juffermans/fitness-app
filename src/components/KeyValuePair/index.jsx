import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View } from "react-native";
import { P } from "@components";
import { useTheme } from "@theme/useTheme";

const KeyValuePair = ({ label, value, onPress }) => {
    const { colors } = useTheme();

    const isPressable = typeof onPress === "function"

    const baseStyle = {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 8,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomColor: colors.base?.[700] || "white",
        borderBottomWidth: 1,
    };

    // The inner content
    const Content = (
        <>
            <P>{label}</P>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                {typeof value === "string" || typeof value === "number" ? (
                    <P style={{ }}>{String(value)}</P>
                ) : (
                    value
                )}
                {isPressable &&
                    <Ionicons
                        name={"arrow-forward-outline"}
                        color={colors.text}
                        size={20}
                        style={{ marginLeft: 6 }}
                    />
                }
            </View>
        </>
    );

    if (isPressable) {
        return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    baseStyle,
                    {
                        opacity: pressed ? 0.9 : 1,
                    },
                ]}
            >
                {Content}
            </Pressable>
        );
    }

    return <View style={baseStyle}>{Content}</View>;
};

export default KeyValuePair;
