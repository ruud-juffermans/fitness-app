import { useCallback, useMemo } from "react";
import { View, Alert } from "react-native";
import { Text, PageWrapper, DataWrapper, List } from "@components";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/useTheme";
import { usePersonal } from "@hooks/usePersonal";
import { useWorkouts } from "@hooks/useWorkouts";
import WorkoutTile from "./WorkoutTile";
import { useSnackbar } from "@hooks/useSnackbar";

function sortByCreatedAt(items, direction = "desc") {
    if (!Array.isArray(items)) return [];

    return [...items].sort((a, b) => {
        const ta = new Date(a.created_at).getTime();
        const tb = new Date(b.created_at).getTime();

        return direction === "asc" ? ta - tb : tb - ta;
    });
}

export default function Workouts() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const { setInfo } = useSnackbar();


    const { workouts, deleteWorkout } = useWorkouts();
    const { userProfile: { data: userProfile } } = usePersonal();

    const activeWorkout = userProfile?.active_workout;

    const onPress = useCallback(
        (item) => {
            navigation.navigate("SingleWorkout", { id: item.id });
        },
        [navigation]
    );

    const confirmDelete = useCallback(
        (item) => {
            Alert.alert(
                "Delete workout",
                `Are you sure you want to delete “${item.name ?? "this workout"}”?`,
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                            try {
                                const res = await deleteWorkout(item.id);
                                console.log(res)
                            } catch (e) {
                            }
                        },
                    },
                ]
            );
        },
        [deleteWorkout]
    );

    const Item = useCallback(
        ({ item }) => (
            <WorkoutTile item={item} onLongPress={confirmDelete} onPress={onPress} active={item.id == activeWorkout} />
        ),
        [confirmDelete]
    );

    const EmptyState = useMemo(
        () => (
            <View >
                <Text style={[{}, { color: colors.text }]}>No workouts yet</Text>
                <Text style={[{}, { color: colors.muted }]}>
                    Tap the + button to create your first workout.
                </Text>
            </View>
        ),
        [colors]
    );

    const headerRightAction = useCallback(() => activeWorkout ? setInfo("You still have a active workout") : navigation.navigate("Create New Workout"), [navigation, activeWorkout]);

    return (
        <PageWrapper
            scroll={false}
            headerRightIcon={"add-outline"}
            headerRightAction={headerRightAction}
            onRefresh={workouts.refetch}
            refreshing={workouts.isFetching}
        >
            <DataWrapper query={workouts} errorMessage="Failed to load workouts.">
                {(data) => {
                    const sortedData = sortByCreatedAt(data);
                    return (
                        <List
                            data={sortedData}
                            Item={Item}
                            EmptyState={EmptyState}
                            title={"Workouts"}
                            source={workouts}
                        />
                    )
                }}
            </DataWrapper>
        </PageWrapper>
    );
}
