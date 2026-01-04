import { Caption, H2, P, Small, Panel, Button, PageWrapper } from "@components";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useTheme } from "@theme/useTheme";
import { usePersonal } from "@hooks/usePersonal";
import { useWorkouts } from "@hooks/useWorkouts";
import { usePrograms } from "@hooks/usePrograms";
import { useSnackbar } from "../../hooks/useSnackbar";

export default function Home() {
  const colors = useTheme().colors;
  const navigation = useNavigation();
  const { userProfile: { data: userProfile } } = usePersonal();
  const { workouts: { data: workouts } } = useWorkouts();
  const { programs: { data: programs } } = usePrograms();

  const { setInfo } = useSnackbar()

  const workoutInProgress = userProfile?.active_workout
  const activeWorkout = workouts?.filter((i) => i.id == userProfile?.active_workout)[0]
  const activeProgram = programs?.filter((i) => i.id == userProfile?.active_program)[0]

  console.log(workoutInProgress)

  const onDoWorkout = useCallback(
    (program) => {
      setInfo("heey!")
      navigation.navigate("SingleWorkout", { id: workoutInProgress });
    },
    [navigation, workoutInProgress]
  );

  return (
    <PageWrapper onRefresh={() => { console.log("refresh") }} pageHeading={"Home"}>
      {/* <Caption>Hello!</Caption> */}
      {/* <P>Bottom tab navigator for React Navigation following iOS design guidelines.
        Installation instructions and documentation can be found</P> */}
      {workoutInProgress != null && (
        <Panel gradientColors={["#1e3c72", "#2a5298"]} onPress={onDoWorkout}>
          <Small>There is a workout still active!</Small>
        </Panel>
      )}
      <Panel>
        <View flexDirection={"row"}>
          <View>
            <Caption>active program:</Caption>
            <H2>{activeProgram?.name}</H2>
          </View>
        </View>

        {/* <Panel>
          <Small></Small>
        </Panel>
        <Panel>
          <Small></Small>
        </Panel>
        <Panel>
          <Small></Small>
        </Panel> */}
      </Panel>
      <Button size="sm" style={{ marginLeft: "auto" }} title="Create new workout" onPress={() => navigation.navigate("Create New Workout")} />
      <Button size="sm" style={{ marginLeft: "auto" }} title="Go To Exercises" onPress={() => navigation.navigate("Exercises")} />
      <Button size="sm" style={{ marginLeft: "auto" }} title="Go To Weight History" onPress={() => navigation.navigate("WeightHistory")} />
    </PageWrapper>
  );
}
