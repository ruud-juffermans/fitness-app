import { Button, Caption, H2, P, PageWrapper, Panel, Small } from "@components";
import { usePersonal } from "@hooks/usePersonal";
import { usePrograms } from "@hooks/usePrograms";
import { useSnackbar } from "@hooks/useSnackbar";
import { useWorkouts } from "@hooks/useWorkouts";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/useTheme";
import { useCallback } from "react";
import { View } from "react-native";

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



  console.log(activeWorkout)

  const onDoWorkout = useCallback(
    (program) => {
      setInfo("heey!")
      navigation.navigate("SingleWorkout", { id: workoutInProgress });
    },
    [navigation, workoutInProgress]
  );

  return (
    <PageWrapper onRefresh={() => { console.log("refresh") }} pageHeading={"Home"}>
      <Caption>Hello!</Caption> 
      <P>Bottom tab navigator for React Navigation following iOS design guidelines.
        Installation instructions and documentation can be found</P>
      <Panel>
        <View>
            <Caption>active program:</Caption>
            <H2>{activeProgram?.name}</H2>
          </View>
      </Panel>
            {workoutInProgress != null && (
        <Panel gradientColors={["#1e3c72", "#2a5298"]} onPress={onDoWorkout}>
          <Small>There is a workout still active!</Small>
        </Panel>
      )}
      <Panel>
        <View>
            <Caption>active workout:</Caption>
            <H2>{activeWorkout?.split}</H2>
        </View>
      </Panel>
      <Button variant={"outline"} size="sm" style={{ marginLeft: "auto" }} title="Create new workout" onPress={() => navigation.navigate("Create New Workout")} />
      <Button size="md" style={{ marginLeft: "auto" }} title="Go To Exercises" onPress={() => navigation.navigate("Exercises")} />
      <Button size="lg" style={{ marginLeft: "auto" }} title="Go To Weight History" onPress={() => navigation.navigate("WeightHistory")} />
    </PageWrapper>
  );
}
