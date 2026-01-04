import { useCallback, useMemo, useState } from "react";
import { View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { PageWrapper, Text, DataWrapper, List, H1 } from "@components";

import { useExercises } from "@hooks/useExercises";
import { usePersonal } from "@hooks/usePersonal";
import { useSnackbar } from "@hooks/useSnackbar";
import { useTheme } from "@theme/useTheme";

import ExerciseTile from "./ExerciseTile";
import ExerciseFilter from "./ExerciseFilter";

const EMPTY_FILTERS = {
  muscle_group: null,
  equipment_type: null,
  exercise_type: null,
};

export default function Exercise() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const { setInfo } = useSnackbar();

    const { exercises, deleteExercise } = useExercises();
    const { userProfile: { data: userProfile } } = usePersonal();

    const [filters, setFilters] = useState(EMPTY_FILTERS);

    const hasFilters = useMemo(
    () => Object.values(filters).some(Boolean),
    [filters]
    );

    const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    }, []);

    const onPress = useCallback(
        (item) => {
            navigation.navigate("SingleExercise", { id: item.id });
        },
        [navigation]
    );

    const confirmDelete = useCallback(
        (item) => {
            Alert.alert(
                "Delete exercise",
                `Are you sure you want to delete “${item.name ?? "this exercise"}”?`,
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                            try {
                                await deleteExercise(item.id);
                            } catch (e) {
                            }
                        },
                    },
                ]
            );
        },
        [deleteExercise]
    );

    const Item = useCallback(
        ({ item }) => (
            <ExerciseTile item={item} onLongPress={confirmDelete} onPress={onPress} />
        ),
        [confirmDelete]
    );

    const EmptyState = useMemo(
        () => (
            <View>
                <Text style={[{}, { color: colors.text }]}>No exercises yet</Text>
                <Text style={[{}, { color: colors.muted }]}>
                    Tap the + button to create your first exercise.
                </Text>
            </View>
        ),
        [colors]
    );
    const headerRightAction = useCallback(() => navigation.navigate("Create New Exercise"), [navigation]);

    return (
        <PageWrapper
            scroll={false}
            headerRightIcon={"add-outline"}
            headerRightAction={headerRightAction}
            onRefresh={exercises.refetch}
            refreshing={exercises.isFetching}å
        >
            <DataWrapper query={exercises} errorMessage="Failed to load exercises.">
                {(data) => {
                    const filteredData = useMemo(() => {
                        return data.filter((ex) => {
                            if (filters.muscle_group && ex.muscle_group !== filters.muscle_group)
                                return false;
                            if (filters.equipment_type && ex.equipment_type !== filters.equipment_type)
                                return false;
                            if (filters.exercise_type && ex.exercise_type !== filters.exercise_type)
                                return false;
                            return true;
                        });
                    }, [data, filters]);
                    return (
                        <List
                            data={filteredData}
                            Item={Item}
                            EmptyState={EmptyState}
                            ListHeaderComponent={
                                <>
                                <H1>Exercises</H1>
                                <View style={{paddingLeft:12, paddingBottom: 12}}>
                                <ExerciseFilter hasFilters={hasFilters} filters={filters} onChange={setFilters} resetFilter={resetFilters} />
                                </View>
                                </>
                            }
                            source={exercises}
                        />
                    )
                }}
            </DataWrapper>
        </PageWrapper>
    );
}



