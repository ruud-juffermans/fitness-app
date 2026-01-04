import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { H1, PageWrapper, DataWrapper, Button } from "@components";
import { useTheme } from "@theme/useTheme";
import { usePersonal } from "@hooks/usePersonal";
import Account from "./Account";
import Weight from "./Weight";
import Activity from "./Activity";
import Preferences from "./Preferences";

export default function Profile() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const { userProfile, setTheme, setSubscription, setPreferredUnits, setNewWeight } = usePersonal();
  return (
    <PageWrapper
      onRefresh={userProfile.refetch}
      refreshing={userProfile.isFetching}
    >
      <DataWrapper query={userProfile} errorMessage="Failed to load workouts.">
        {(data) => (
          <View>
            <H1>Profile</H1>
            <View style={{gap: 12}}>

            <Account userProfile={data} />
            <Preferences theme={data.theme} setTheme={setTheme} preferredUnits={data.preferred_units} setPreferredUnits={setPreferredUnits} subscribed={data.newsletter_subscribed} setSubscription={setSubscription} />
            <Activity activeProgram={data.active_program} activeWorkout={data.active_workout} />
            <Weight preferredUnits={data.preferred_units} latestWeight={data.latest_weight} setWeight={setNewWeight} />
            </View>
          </View>
        )}
      </DataWrapper>
    </PageWrapper>
  );
}







{/* Activity / current */ }


{/* Weight card */ }
