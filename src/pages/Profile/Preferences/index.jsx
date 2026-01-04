import { Panel } from '@components'
import { usePersonal } from "@hooks/usePersonal";
import SubscribeSettings from './SubscribeSettings'
import ThemeSettings from './ThemeSettings'
import UnitSettings from './UnitSettings'
import { H2 } from '@components';

const index = ({theme, setTheme, preferredUnits, setPreferredUnits, subscribed, setSubscription}) => {
    return (
        <Panel>
            <H2>Preferences</H2>
            <ThemeSettings theme={theme} setTheme={setTheme} />
            <SubscribeSettings subscribed={subscribed} setSubscription={setSubscription} />
            <UnitSettings preferredUnits={preferredUnits} setPreferredUnits={setPreferredUnits} />
        </Panel>
    )
}

export default index