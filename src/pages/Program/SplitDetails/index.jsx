import { View } from "react-native";
import { PageWrapper, Panel, Text,  H1, H3, H2, TextButton, DataWrapper, List } from "@components";
import { useTheme } from "@theme/useTheme";
import { useSplit } from "@hooks/useSplit";
import { usePersonal } from "@hooks/usePersonal";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useMemo } from "react";
import ExerciseTile from "./ExerciseTile";

export default function SplitDetails({ route }) {
  const id = route.params?.id ?? "—";
  const { split } = useSplit(id);
  const { colors } = useTheme();
  const { userProfile } = usePersonal();
  const navigation = useNavigation();

  const Item = useCallback(
    ({ item }) => (
      <ExerciseTile item={item} />
    ),
    []
  );

  const EmptyState = useMemo(
    () => (
      <View>
        <Text style={[{ color: colors.text }]}>No Programs yet</Text>
        <Text style={[{ color: colors.muted }]}>
          Tap the + button to create your first program.
        </Text>
      </View>
    ),
    [colors]
  );

  return (
    <PageWrapper
      title={"Split Details"}
      scroll={false}
      onRefresh={split.refetch}
      refreshing={split.isFetching}
    >
      <DataWrapper query={split} errorMessage="Failed to load workout.">
        {(data) => (
          <List
            data={data.exercises}
            Item={Item}
            EmptyState={EmptyState}
            ListHeaderComponent={
              <>
                <H1>{data.name}</H1>
                <H3>{data.description}</H3>
              </>
            }
            source={split}
          />
        )
        }
      </DataWrapper>
    </PageWrapper>
  );
}
