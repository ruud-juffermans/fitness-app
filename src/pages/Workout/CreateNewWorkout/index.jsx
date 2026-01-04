import { DataWrapper, PageWrapper, Button } from "@components";
import { View } from "react-native";
import { usePrograms } from "@hooks/usePrograms";
import { useWorkouts } from "@hooks/useWorkouts";
import { useEffect, useState } from "react";
import SelectProgram from "./SelectProgram";
import SelectSplit from "./SelectSplit";

export default function CreateNewWorkout() {
  const { programs } = usePrograms();
  const { createWorkout } = useWorkouts();

  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [selectedSplitId, setSelectedSplitId] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (programs.isFetching) {
      setSelectedProgramId(null);
      setSelectedSplitId(null);
    }
  }, [programs.isFetching]);


  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await createWorkout(selectedSplitId);
      console.log("333" , res)
    } catch (e) {
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <PageWrapper
      pageHeading="Create New Workout"
      onRefresh={programs.refetch}
      refreshing={programs.isFetching}
    >
      <DataWrapper query={programs} errorMessage="Failed to load programs.">
        {(data) => (
          <View>
            <SelectProgram
              data={data}
              selectedProgramId={selectedProgramId}
              setSelectedProgramId={setSelectedProgramId}
            />

            {selectedProgramId && (
              <SelectSplit
                programId={selectedProgramId}
                selectedSplitId={selectedSplitId}
                setSelectedSplitId={setSelectedSplitId}
              />
            )}

            {selectedProgramId && selectedSplitId && (
              <Button
                title={submitting ? "Submitting..." : "Submit"}
                disabled={submitting}
                onPress={handleSubmit}
              />
            )}
          </View>
        )}
      </DataWrapper>
    </PageWrapper>
  );
}
