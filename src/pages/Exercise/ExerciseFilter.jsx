import { View, Pressable, Modal, FlatList } from "react-native";
import { Text, Small } from "@components";
import { useTheme } from "@theme/useTheme";
import { useState } from "react";

import {
  MuscleGroup,
  EquipmentType,
  ExerciseType,
} from "@constants/enums";

const Chip = ({ label, selected, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 2,
        backgroundColor: selected ? "#fff" : "#333",
        marginRight: 6,
      }}
    >
      <Small style={{ color: selected ? "#000" : "#fff" }}>
        {label}
      </Small>
    </Pressable>
  );
};

export default function Filter({ filters, onChange, hasFilters, resetFilter }) {
  const [open, setOpen] = useState(null); 
  // "equipment" | "muscle" | "exercise" | null

  const setFilter = (key, value) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const config = {
    equipment: {
      title: "Equipment Type",
      key: "equipment_type",
      options: EquipmentType,
    },
    muscle: {
      title: "Muscle Group",
      key: "muscle_group",
      options: MuscleGroup,
    },
    exercise: {
      title: "Exercise Type",
      key: "exercise_type",
      options: ExerciseType,
    },
  };

  const current = open ? config[open] : null;

  return (
    <>
      <View style={{ flexDirection: "row", paddingBottom: 8 }}>
        
        <Chip
          label={filters.equipment_type ?? "Equipment Type"}
          selected={!!filters.equipment_type}
          onPress={() => setOpen("equipment")}
        />

        <Chip
          label={filters.muscle_group ?? "Muscle Group"}
          selected={!!filters.muscle_group}
          onPress={() => setOpen("muscle")}
        />

        <Chip
          label={filters.exercise_type ?? "Exercise Type"}
          selected={!!filters.exercise_type}
          onPress={() => setOpen("exercise")}
        />
              {hasFilters && (
        <Chip
          label={"Reset Filter"}
          onPress={() => resetFilter()}
        />
      )}
      </View>

      {/* Modal */}
      <Modal transparent animationType="fade" visible={!!open}>
        <Pressable
          onPress={() => setOpen(null)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#111",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#333",
              maxHeight: "60%",
            }}
          >
            <Text style={{ padding: 12, fontWeight: "600" }}>
              {current?.title}
            </Text>

            <FlatList
              data={current?.options ?? []}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const selected = filters[current.key] === item;

                return (
                  <Pressable
                    onPress={() => {
                      setFilter(
                        current.key,
                        selected ? null : item
                      );
                      setOpen(null);
                    }}
                    style={{
                      padding: 12,
                      backgroundColor: selected ? "#fff" : "transparent",
                    }}
                  >
                    <Text style={{ color: selected ? "#000" : "#fff" }}>
                      {item}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
