import { useRef, useState } from 'react'
import { View } from 'react-native'
import { KeyValuePair, BottomSheet, DropDownSelect, Text } from '@components'
import { UnitsOptions } from '@constants/enums'

const UnitSettings = ({preferredUnits, setPreferredUnits}) => {

  const unitSheetRef = useRef(null);

  const onChangeUnits = async (newValue) => {
    setPreferredUnits({value: newValue})
  };

  return (
    <>
      <KeyValuePair label="Units" value={preferredUnits ?? "metric"} onPress={() => unitSheetRef.current?.open()} />
      <BottomSheet
        ref={unitSheetRef}
        modalHeight={380}
        modalStyle={{
          backgroundColor: "#101214",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
        contentContainerStyle={{ gap: 12 }}
        HeaderComponent={
          <View style={{ padding: 25, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "300" }}>
              Select Unit Type
            </Text>
            <Text
              onPress={async () => {
                unitSheetRef.current?.close();
              }}
              style={{ color: "#479cecff", fontSize: 14, fontWeight: "600" }}
            >
              Done
            </Text>
          </View>
        }
        >
        <DropDownSelect
          items={UnitsOptions}
          value={preferredUnits}
          onChange={onChangeUnits}
          placeholder="Select preferred units"

        />
      </BottomSheet>
    </>
  )
}

export default UnitSettings