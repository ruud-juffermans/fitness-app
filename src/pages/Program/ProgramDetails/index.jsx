import { Alert, FlatList, View } from "react-native";
import { Text, PageWrapper, List, DataWrapper } from "@components";
import { useTheme } from "@theme/useTheme";
import { useProgram } from "@hooks/useProgram";
import { usePersonal } from "@hooks/usePersonal";
import { useCallback, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import SplitTile from "./SplitTile";

export default function ProgramDetails({ route }) {
  const id = route.params?.id ?? "—";
  const { program } = useProgram(id);
  const { colors } = useTheme();
  const { userProfile } = usePersonal();
  const navigation = useNavigation();

  const handleAdd = useCallback(() => {
    navigation.navigate("Create New Program");
  }, [navigation]);

  const onPress = useCallback(
    (item) => {
      console.log(item)
      navigation.navigate("SplitDetails", { id: item.id });
    },
    [navigation]
  );

  const onLongpress = useCallback(
    (item) => {
      Alert.alert(
        "Delete split",
        `Are you sure you want to delete “${item.name ?? "this split"}”?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                console.log(item.id);
              } catch (e) {
              }
            },
          },
        ]
      );
    },
    []
  );

  const Item = useCallback(
    ({ item }) => (
      <SplitTile item={item} onLongPress={onLongpress} onPress={onPress} />
    ),
    [onPress, onLongpress]
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

  const headerRightAction = useCallback(() => handleAdd(), [handleAdd]);

  return (
    <PageWrapper
      title={"Program"}
      scroll={false}
      headerRightIcon={"add-outline"}
      headerRightAction={headerRightAction}
    >
      <DataWrapper query={program} errorMessage="Failed to load program.">
        {(data) => (
            <List
              data={data.splits}
              Item={Item}
              EmptyState={EmptyState}
              title={program.data?.name}
              source={program}
            />
        )}
      </DataWrapper>
    </PageWrapper>
  );
}
