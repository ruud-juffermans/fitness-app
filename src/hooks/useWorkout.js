import { useDeleteMutation, useGetQuery, usePutMutation } from "@utils/apiHooks";
import { useSnackbar } from "./useSnackbar";

const LIST_KEY = ["workouts"];
const SINGLE_KEY = (id) => ["workout", Number(id)];
const PROFILE_KEY = ["profile"];

export const useWorkout = (id) => {
  if (!id) throw new Error("useWorkout requires a id to be provided.");
  const workoutId = Number(id);

  const {setInfo} = useSnackbar();

  const workout = useGetQuery(SINGLE_KEY(workoutId), `/workout/${workoutId}`);

  const patchWorkoutCompleteExercise = (workoutObj, exerciseId, patch) => {
    if (!workoutObj) return workoutObj;

    const exIdNum = Number(exerciseId);

    const patchArray = (arr) => {
      if (!Array.isArray(arr)) return arr;
      let changed = false;

      const nextArr = arr.map((row) => {
        const rowExerciseId =
          Number(row?.exercise_id ?? row?.exerciseId ?? row?.exercise?.id ?? row?.id);

        // IMPORTANT:
        // - If your rows are "logs", row.id may be logId, not exerciseId.
        // - We first try row.exercise_id / row.exercise.id; fallback to row.id.
        if (rowExerciseId !== exIdNum) return row;

        changed = true;
        return {
          ...row,
          ...patch,
          // common completion flags
          completed: patch.completed ?? row.completed ?? true,
          completed_at: patch.completed_at ?? row.completed_at ?? new Date().toISOString(),
          is_completed: patch.is_completed ?? row.is_completed ?? true,
        };
      });

      return changed ? nextArr : arr;
    };

    // Try a few common container keys
    const next = { ...workoutObj };

    if (Array.isArray(next.logs)) next.logs = patchArray(next.logs);
    if (Array.isArray(next.exercise_logs)) next.exercise_logs = patchArray(next.exercise_logs);
    if (Array.isArray(next.workout_logs)) next.workout_logs = patchArray(next.workout_logs);

    // Some APIs embed logs under exercises
    if (Array.isArray(next.exercises)) {
      next.exercises = next.exercises.map((ex) => {
        const exId = Number(ex?.id ?? ex?.exercise_id ?? ex?.exerciseId);
        if (exId !== exIdNum) return ex;

        // if exercise has a nested log object:
        if (ex.log && typeof ex.log === "object") {
          return {
            ...ex,
            log: {
              ...ex.log,
              ...patch,
              completed: patch.completed ?? ex.log.completed ?? true,
              completed_at: patch.completed_at ?? ex.log.completed_at ?? new Date().toISOString(),
              is_completed: patch.is_completed ?? ex.log.is_completed ?? true,
            },
          };
        }

        return {
          ...ex,
          ...patch,
          completed: patch.completed ?? ex.completed ?? true,
          completed_at: patch.completed_at ?? ex.completed_at ?? new Date().toISOString(),
          is_completed: patch.is_completed ?? ex.is_completed ?? true,
        };
      });
    }

    return next;
  };

  const mutateWorkout = usePutMutation(
    ["workout", "update", workoutId],
    `/workout/${workoutId}`,
    {
      onMutate: async (qc, { payload }) => {
        const prevSingle = qc.getQueryData(SINGLE_KEY(workoutId));
        const prevList = qc.getQueryData(LIST_KEY);

        if (prevSingle) qc.setQueryData(SINGLE_KEY(workoutId), { ...prevSingle, ...payload });

        if (Array.isArray(prevList)) {
          qc.setQueryData(
            LIST_KEY,
            prevList.map((w) => (Number(w?.id) === workoutId ? { ...w, ...payload } : w))
          );
        }

        return {
          rollback: () => {
            if (prevSingle) qc.setQueryData(SINGLE_KEY(workoutId), prevSingle);
            if (prevList) qc.setQueryData(LIST_KEY, prevList);
          },
        };
      },
      invalidations: [SINGLE_KEY(workoutId), LIST_KEY],
      onError: (_err, _vars, _ctx) => {
        setInfo("Error")
      }
    }
  );

  const mutateCompleteExercise = usePutMutation(
    ["workout", workoutId, "exercise", "complete"],
    ({ exerciseId }) => `/workout/${workoutId}/exercise/${exerciseId}/complete`,
    {
      onMutate: async (qc, {exerciseId}) => {

        console.log("hit")

        const prevSingle = qc.getQueryData(SINGLE_KEY(workoutId));
        const prevList = qc.getQueryData(LIST_KEY);

        const optimisticPatch = {
          completed: true,
          is_completed: true,
          completed_at: new Date().toISOString(),
        };

        if (prevSingle) {
          qc.setQueryData(
            SINGLE_KEY(workoutId),
            patchWorkoutCompleteExercise(prevSingle, exerciseId, optimisticPatch)
          );
        }

        if (Array.isArray(prevList)) {
          qc.setQueryData(
            LIST_KEY,
            prevList.map((w) =>
              Number(w?.id) === workoutId
                ? patchWorkoutCompleteExercise(w, exerciseId, optimisticPatch)
                : w
            )
          );
        }

        return {
          prevSingle,
          prevList,
          qc,
          rollback: () => {
            if (prevSingle) qc.setQueryData(SINGLE_KEY(workoutId), prevSingle);
            if (prevList) qc.setQueryData(LIST_KEY, prevList);
          },
        };
      },

      invalidations: [SINGLE_KEY(workoutId), LIST_KEY, PROFILE_KEY],

      onSuccess: (data, vars, ctx) => { 
        setInfo("Exercise marked as complete");
        console.log(data)
        console.log(vars)

        ctx.prevSingle.logs.map(({sets}) => {console.log(sets)});
        //   where exercise.id == 
        // ].sets[ set locked = true]

      },

      onError: (err, _vars, ctx) => {
        console.log(err)
        setInfo("Failed to complete exercise!!!");
      },
    }
  );

  const mutateCompleteWorkout = usePutMutation(
    ["workout", workoutId, "complete"],
    `/workout/${workoutId}/complete`,
    {
      invalidations: [SINGLE_KEY(workoutId), LIST_KEY, PROFILE_KEY],
    }
  );

  const mutateLogSet = usePutMutation(
    ["workout", workoutId, "log", "update"],
    ({ logId }) => `/workout/log/${logId}`,
    {
      invalidations: [SINGLE_KEY(workoutId), LIST_KEY],
      // onSuccess: () => setSuccess?.("Set logged"),
      // onError: () => setError?.("Failed to log set"),
    }
  );

  const mutateDeleteWorkout = useDeleteMutation(
    ["workout", workoutId, "delete"],
    `/workout/${workoutId}`,
    {
      onMutate: async (qc) => {

        const prevList = qc.getQueryData(LIST_KEY);
        const prevSingle = qc.getQueryData(SINGLE_KEY(workoutId));

        if (Array.isArray(prevList)) {
          qc.setQueryData(
            LIST_KEY,
            prevList.filter((w) => Number(w?.id) !== workoutId)
          );
        }

        qc.removeQueries({ queryKey: SINGLE_KEY(workoutId) });

        return {
          rollback: () => {
            if (prevList) qc.setQueryData(LIST_KEY, prevList);
            if (prevSingle) qc.setQueryData(SINGLE_KEY(workoutId), prevSingle);
          },
        };
      },
      invalidations: [LIST_KEY, PROFILE_KEY],
      onError: (_err, _vars, ctx) => ctx?.rollback?.(),
    }
  );

  const logSet = async (logId, payload) => mutateLogSet({ logId, payload });
  const completeWorkout = async (payload = {}) => mutateCompleteWorkout({ payload });
  const completeExercise = async (exerciseId) => mutateCompleteExercise({ exerciseId });
  const updateWorkout = async (payload) => mutateWorkout({ payload });
  const deleteWorkout = async () => mutateDeleteWorkout({});

  return { workout, updateWorkout, deleteWorkout, logSet, completeExercise, completeWorkout };
};
