import { Text, Panel, H1, H2, H3, Small, Button } from "@components";
import { useTheme } from "@theme/useTheme";
import SetRow from './SetRow';

const ExerciseGroup = ({ log, completeExercise }) => {
  const { colors } = useTheme();

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
      }}
    >
      <H2 style={{ marginBottom: 4 }}>{log.exercise.name}</H2>

      <Panel>
        <Small>Last time you did 60kg sx 6 reps</Small>
      </Panel>


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