import { useTheme } from "@theme/useTheme";
import { useRef } from 'react';
import { View } from 'react-native';

import { BottomSheet, DropDownSelect, KeyValuePair, Text } from '@components';

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