import { useRef, useState } from 'react'
import { View } from 'react-native'
import { KeyValuePair, Text, BottomSheet, DropDownSelect } from '@components'
import { ThemeOptions } from '@constants/enums'

const ThemeSettings = ({ theme, setTheme }) => {
  const themeSheetRef = useRef(null);

  const onChangeTheme = async (newValue) => {
    setTheme({value: newValue})
  };

  return (
    <>
      <KeyValuePair label="Theme" value={theme ?? "system"} onPress={() => themeSheetRef.current?.open()} />
      <BottomSheet
        ref={themeSheetRef}
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
              Select Theme Color
            </Text>
            <Text
              onPress={async () => {
                themeSheetRef.current?.close();
              }}
              style={{ color: "#479cecff", fontSize: 14, fontWeight: "600" }}
            >
              Done
            </Text>
          </View>
        }
      >
        <DropDownSelect
          items={ThemeOptions}
          value={theme}
          onChange={onChangeTheme}
          placeholder="Select a theme"

        />
      </BottomSheet>
    </>
  )
}

export default ThemeSettings