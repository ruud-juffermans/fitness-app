import { Text } from "@components";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@theme/useTheme";
import { memo, useCallback, useMemo } from "react";
import { FlatList, Modal, Platform, Pressable, View } from "react-native";

const WeightOptionRow = memo(function WeightOptionRow({
  item,
  selected,
  precision,
  textColor,
  listItemHeight,
  onSelect,
}) {
  return (
    <Pressable
      onPress={() => onSelect(item)}
      style={{
        height: listItemHeight,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ color: textColor }}>{item.toFixed(precision)} kg</Text>
      {selected ? <Ionicons name="checkmark" size={18} color={textColor} /> : null}
    </Pressable>
  );
});

function getInitialIndex(options, currentKg) {
  const idx = options.findIndex((n) => n === currentKg);
  return Math.max(0, idx);
}

const WeightPickerModal = memo(function WeightPickerModal({
  open,
  onClose,
  modalTitle = "Select weight (kg)",

  // controls
  onIncrement,
  onDecrement,

  // list
  options,
  currentKg, // already snapped
  precision,
  listItemHeight = 44,
  onSelect, // (kg:number) => void

  // theming overrides if you ever want them
  textColor: textColorProp,
}) {
  const { colors } = useTheme();

  const textColor = textColorProp ?? "#111";
  const border = colors.base?.[300] ?? "#e5e5e5";

  const initialScrollIndex = useMemo(
    () => getInitialIndex(options, currentKg),
    [options, currentKg]
  );

  const keyExtractor = useCallback((n) => String(n), []);
  const getItemLayout = useCallback(
    (_, index) => ({
      length: listItemHeight,
      offset: listItemHeight * index,
      index,
    }),
    [listItemHeight]
  );

  const renderItem = useCallback(
    ({ item }) => {
      const selected = item === currentKg;
      return (
        <WeightOptionRow
          item={item}
          selected={selected}
          precision={precision}
          textColor={textColor}
          listItemHeight={listItemHeight}
          onSelect={onSelect}
        />
      );
    },
    [currentKg, precision, textColor, listItemHeight, onSelect]
  );

  const separator = useCallback(
    () => (
      <View
        style={{
          height: 1,
          backgroundColor: colors.base?.[200] ?? "#eee",
        }}
      />
    ),
    [colors.base]
  );

  return (
    <Modal
      visible={open}
      transparent
      animationType={Platform.select({ ios: "slide", android: "fade" })}
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)" }}
      />

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: "70%",
          backgroundColor: colors.base[600],
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          paddingBottom: 16,
        }}
      >
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: colors.base[200],
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable onPress={onDecrement} hitSlop={10}>
            <Ionicons
              name="remove-circle-outline"
              size={24}
              color={colors.text}
            />
          </Pressable>

          <Text style={{ fontWeight: "600", fontSize: 16, color: textColor }}>
            {modalTitle}
          </Text>

          <Pressable onPress={onIncrement} hitSlop={10}>
            <Ionicons name="add-circle-outline" size={24} color={colors.text} />
          </Pressable>
        </View>

        <FlatList
          data={options}
          keyExtractor={keyExtractor}
          initialScrollIndex={initialScrollIndex}
          getItemLayout={getItemLayout}
          renderItem={renderItem}
          ItemSeparatorComponent={separator}
        />

        <View style={{ padding: 12, alignItems: "center" }}>
          <Pressable
            onPress={onClose}
            hitSlop={10}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: border,
            }}
          >
            <Text style={{ color: textColor }}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
});

export default WeightPickerModal;
