import React, { useCallback, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { PageWrapper, Text, H2, DataWrapper, H3, Caption, Panel } from "@components";
import { usePersonal } from "@hooks/usePersonal";
import { useExercise } from "@hooks/useExercise";
import { useTheme } from "@theme/useTheme";
import { MuscleGroupOptions, EquipmentTypeOptions, ExerciseTypeOptions } from "@constants/enums";

export default function EditExercise({ route }) {
  const id = route.params?.id ?? "—";
  const { exercise } = useExercise(id);
  const { colors } = useTheme();

  return (
    <PageWrapper
      title={"Exercise"}
    >
      <DataWrapper query={exercise} errorMessage="Failed to load exercise.">
        {(data) => (

          <Panel style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 4 }}>
              {data.name}
            </Text>
            <Text style={{ fontSize: 15, opacity: 0.8, marginBottom: 6 }}>
              {data.description}
            </Text>
            <Caption>User ID</Caption>
            <H2>{data.user_id}</H2>
            <Caption>Exercise ID</Caption>
            <Text>{data.id}</Text>
            <Caption>Equipment Typ</Caption>
            <Text>{data.equipment_type}</Text>
            <Caption>Exercise Type</Caption>
            <Text>{data.exercise_type}</Text>
            <Caption>Muscle Group</Caption>
            <Text>{data.muscle_group}</Text>

          </Panel>
        )
        }
      </DataWrapper>
    </PageWrapper>
  );
}
