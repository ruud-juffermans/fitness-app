import { View } from "react-native";
import { PageWrapper, Panel, Text, H2, H3, Small, DataWrapper, Button } from "@components";
import { useTheme } from "@theme/useTheme";
import { useWorkout } from "@hooks/useWorkout";
import ExerciseGroup from "./ExerciseGroup";

export default function SingleWorkout({ route }) {
  const id = route.params?.id ?? "—";
  const { workout, completeExercise, completeWorkout } = useWorkout(id);
  const { colors } = useTheme();

  return (
    <PageWrapper
      title={"Workout"}
    >
      <DataWrapper query={workout} errorMessage="Failed to load workout.">
        {(data) => (
          <View>
            <View style={{ marginBottom: 16 }}>
              <H2>{data.split}</H2>
              <H3>{data.program}</H3>
              <Small>Created: {data.created_at}</Small>
              <Small>
                Status: {data.workout_state}
              </Small>
            </View>

            {data.notes && (
              <Panel>
                <Text marginBottom={6}>{data.notes}</Text>
              </Panel>
            )}

            {data.logs?.map((log, i) => (
              <ExerciseGroup key={i} log={log} completeExercise={completeExercise} />
            ))}
            {data.workout_state !== "Completed" &&
              <Button
                title="Mark as Complete"
                onPress={() => completeWorkout()}
              />
            }
          </View>

        )}
      </DataWrapper>
    </PageWrapper>
  );
}
