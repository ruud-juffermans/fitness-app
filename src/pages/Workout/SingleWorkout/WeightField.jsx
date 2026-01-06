import { Text } from "@components";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSteppedNumber } from "@hooks/useSteppedNumber"; // adjust path
import { useTheme } from "@theme/useTheme";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Pressable, View } from "react-native";
import WeightPickerModal from "./WeightPickerModal";

const WeightField = forwardRef(
  (
    {
      value,
      defaultValue,
      onChange,
      locked,
      step = 2.5,
      min = 0,
      max = 500,
      label,
      placeholder = "0.0 kg",
      disabled = false,
      modalTitle = "Select weight (kg)",
      triggerStyle,
      listItemHeight = 44,
    },
    ref
  ) => {
    const { components } = useTheme();
    const [open, setOpen] = useState(false);

    const c = components.logControls
    const {
      precision,
      current: currentKg,
      display,
      options,
      snapToStep,
      setValue: setKg,
      increment,
      decrement,
    } = useSteppedNumber({
      value,
      defaultValue,
      onChange,
      step,
      min,
      max,
      placeholder,
    });

    useImperativeHandle(ref, () => ({
      getKg: () => currentKg,
      setKg: (kg) => setKg(kg),
      open: () => setOpen(true),
      close: () => setOpen(false),
    }));

    const textColor = "#111";

    return (
      <View style={{ flex: 1 }}>
        <Pressable
          disabled={disabled}
          onPress={() => setOpen(true)}
          style={[
            {
              height: c.height,
              borderRadius: c.borderRadius,
              borderWidth: c.borderWidth,
              borderColor: c.borderColor,
              backgroundColor: c.backgroundColor,
              paddingHorizontal: 6,
              opacity: disabled ? 0.6 : 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            },
            triggerStyle,
          ]}
        >
          <Text style={{ color: c.color, paddingHorizontal: 4 }}>
            {display} kg
          </Text>
          <Ionicons name="chevron-down" size={18} color={c.color} />
        </Pressable>

        <WeightPickerModal
          open={open}
          onClose={() => setOpen(false)}
          modalTitle={modalTitle}
          onIncrement={increment}
          onDecrement={decrement}
          options={options}
          currentKg={snapToStep(currentKg)}
          precision={precision}
          listItemHeight={listItemHeight}
          onSelect={(kg) => {
            setKg(kg);
            setOpen(false);
          }}
          textColor={textColor}
        />
      </View>
    );
  }
);

export default WeightField;
