import { Button, H2, Panel } from "@components";
import { useTheme } from "@theme/useTheme";
import SetRow from './SetRow';

const ExerciseGroup = ({ log, completeExercise }) => {
  const { colors, components } = useTheme();

    const c = components.logControls

  const allLocked = log.sets?.every(set => set.locked === true);


  const cb = (i) => {
    console.log(i)
  }

  return (
    <Panel
      key={log.exercise.id}
      style={{
        marginBottom: 20,
        padding: 12,
        borderRadius: 12,
        backgroundColor: colors.surface,
        gap: c.spacing
      }}
    >
      <H2 style={{ marginBottom: 4 }}>{log.exercise.name}</H2>

      {log?.sets?.map((row, i) => (
        <SetRow key={i} row={row} onChange={cb} />
      ))}
      {allLocked ||

        <Button
          onPress={() => completeExercise(log.exercise.id)}
          title={"Complete Set"}
        />
      }
    </Panel>
  )
}

export default ExerciseGroup