import { H3, WeightInputSheet, Panel, H2, Small, Button } from '@components'
import { formatDate } from '@utils/formatDate'
import { View } from 'react-native'
import { useRef } from 'react'

const Weight = ({ latestWeight, preferredUnits }) => {
    const weightSheetRef = useRef(null);
    return (
        <Panel>
            <H2>Weight</H2>
                <H3>
                    {latestWeight?.weight
                        ? `${Number(latestWeight.weight).toFixed(2)} ${preferredUnits === "imperial" ? "lb" : "kg"}`
                        : "—"}
                </H3>
                <Small >
                    {latestWeight?.created_at ? `Recorded ${formatDate(latestWeight.created_at)}` : ""}
                </Small>
            <View flexDirection={"row"} marginLeft={"auto"}>

                <Button title="Add Weight" onPress={() => weightSheetRef.current?.open()} />
            </View>
            <WeightInputSheet ref={weightSheetRef} />
        </Panel>
    )
}

export default Weight