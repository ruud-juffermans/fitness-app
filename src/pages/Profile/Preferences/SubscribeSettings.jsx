import { useRef, useState } from 'react'
import { View } from 'react-native'
import { useTheme } from "@theme/useTheme";

import { KeyValuePair, Text, BottomSheet, DropDownSelect } from '@components'

const SubscribeSettings = ({ subscribed, setSubscription }) => {
  const { colors } = useTheme();

  const subscriptionSheetRef = useRef(null);

  const onChangeSubscription = async (newValue) => {
    setSubscription({value: newValue});
  };
  return (
    <>
      <KeyValuePair
        label="Newsletter"
        value={subscribed ? "Subscribed" : "Not subscribed"}
        onPress={() => {
          subscriptionSheetRef.current?.open();
        }}
      />
      <BottomSheet
        ref={subscriptionSheetRef}
        modalHeight={380}
        modalStyle={{
          backgroundColor: colors.bottomSheet,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
        }}
        contentContainerStyle={{ gap: 12 }}
        HeaderComponent={
          <View style={{ padding: 25, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "300" }}>
              Set Subscription Newsletter
            </Text>
            <Text
              onPress={async () => {
                subscriptionSheetRef.current?.close();
              }}
              style={{ color: "#479cecff", fontSize: 14, fontWeight: "600" }}
            >
              Done
            </Text>
          </View>
        }
      >
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>

          <DropDownSelect
            items={[
              { label: "Subscribe", value: true },
              { label: "Unsubscribe", value: false },
            ]}
            value={subscribed}
            onChange={onChangeSubscription}
            placeholder="Set Subscription newsletter"
          />
        </View>
      </BottomSheet>
    </>
  )
}

export default SubscribeSettings