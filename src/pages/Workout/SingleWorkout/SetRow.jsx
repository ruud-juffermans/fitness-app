import { useTheme } from "@theme/useTheme";
import { useCallback } from "react";
import { View } from "react-native";
import RepField from "./RepField";
import WeightField from "./WeightField";

const SetRow = ({ row, onChange }) => {
    const { components } = useTheme();

    const c = components.logControls
  const isLocked = row?.locked
  const onKgChange = useCallback((i) => onChange({id: row.id, "weight_used":i}));
  const onRepsChange = useCallback((i) => onChange({id: row.id, "reps":i}));
  
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: c.spacing }}>

      <WeightField
        defaultValue={row.weight_used != null ? parseFloat(row.weight_used) : undefined}
        onChange={onKgChange}
        disabled={isLocked}
        step={row.kgStep ?? 2.5}
        min={row.kgMin ?? 0}
        max={row.kgMax ?? 300}
      />

      <RepField
        value={row.performed_reps}
        onChangeNumber={onRepsChange}
        min={1}
        disabled={isLocked}
        required
        clearable={false}
        unitLabel="reps"
        placeholder="0"
      />

    </View>
  );
};

export default SetRow