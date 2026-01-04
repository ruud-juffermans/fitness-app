import { KeyValuePair, Panel, H2 } from '@components'

const Activity = ({ activeProgram, activeWorkout }) => {

    return (
        <Panel>
            <H2>Activity</H2>
            <KeyValuePair label="Active program" value={activeProgram ?? "—"} />
            <KeyValuePair label="Active workout" value={activeWorkout ?? "—"} />
        </Panel>
    )
}

export default Activity