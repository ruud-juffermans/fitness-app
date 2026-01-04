import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, View } from "react-native";
import { Text, PageWrapper, ErrorStatePanel, Refresher, DataWrapper, H1, List } from "@components";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/useTheme";
import { usePrograms } from "@hooks/usePrograms";
import { usePersonal } from "@hooks/usePersonal";
import ProgramTile from "./ProgramTile";

export default function Program() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const { programs, addProgram, deleteProgram, activateProgram } = usePrograms();
  const { userProfile: { data: userProfile } } = usePersonal();

  const handleAdd = useCallback(() => {
    navigation.navigate("Create New Program");
  }, [navigation]);

  const onSelect = useCallback(
    (item) => {
      navigation.navigate("ProgramDetails", { id: item.id });
    },
    [navigation]
  );

  const handleLongpress = useCallback(
    (item) => {
      Alert.alert(
        "Set active program",
        `Are you sure you want this program to active?`,
        [
          {
            text: "Set Active",
            style: "default",
            onPress: async () => {
              try {
                await activateProgram(item.id);
              } catch (e) {
              }
            },
          },
          { text: "Cancel" }
        ]
      );
    },
    [deleteProgram]
  );

  const Item = useCallback(
    ({ item }) => (
      <ProgramTile item={item} onLongPress={handleLongpress} onPress={onSelect} isActive={item.id === userProfile?.active_program} />
    ),
    [colors, handleLongpress]
  );

  const keyExtractor = useCallback((item) => String(item.id), []);

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

  const headerRightAction = useCallback(() => handleAdd(), [handleAdd]);

  return (
    <PageWrapper
      scroll={false}
      title={"Program"}
      headerRightIcon={"add-outline"}
      headerRightAction={headerRightAction}
    >
      <DataWrapper query={programs} errorMessage="Failed to load program.">
        {(data) => (
          <List
            data={data}
            Item={Item}
            EmptyState={EmptyState}
            title={"Programs"}
            source={programs}
          />
        )}
      </DataWrapper>
    </PageWrapper>
  );
}
