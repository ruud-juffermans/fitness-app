import {
  useGetQuery,
  usePostMutation,
  useDeleteMutation,
} from "@utils/apiHooks";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "./useSnackbar";

const LIST_KEY = ["workouts"];
const SINGLE_KEY = (id) => ["workout", id];
const PROFILE_KEY = ["profile"];

export const useWorkouts = () => {
  const { setInfo, setError } = useSnackbar();

  const workouts = useGetQuery(LIST_KEY, "/workout");

  const mutCreateWorkout = usePostMutation(
    ["workout", "create"],
    "/workout/create",
    {
      onMutate: async (qc, { }) => {
        const prevList = qc.getQueryData(LIST_KEY) || [];

        const tempId = `temp-${Date.now()}`;
        const tempItem = {
          id: tempId,
          __optimistic: true,
        };

        qc.setQueryData(LIST_KEY, [tempItem, ...prevList]);

        return {
          tempId,
          prevList,
          qc,
          rollback: () => qc.setQueryData(LIST_KEY, prevList)
        };
      },

      onSuccess: (data, _vars, ctx) => {
        if (!ctx) return;

        ctx.qc.setQueryData(LIST_KEY, (current = []) =>
          current.map((item) =>
            item.id === ctx.tempId ? data : item
          )
        );

        ctx.qc.removeQueries({ queryKey: SINGLE_KEY(ctx.tempId), exact: true });

        if (data?.id) {
          ctx.qc.setQueryData(SINGLE_KEY(data.id), data);
        }

        ctx.qc.invalidateQueries({ queryKey: PROFILE_KEY });
        setInfo("Workout added");
      },

      onError: (err, _vars, ctx) => {
        qc.removeQueries({ queryKey: SINGLE_KEY(ctx?.tempId), exact: true });

        setError(
          err?.response?.data?.error ?? "Failed to add workout"
        );
      },
      invalidations: [],
    }
  );

  const mutDeleteWorkout = useDeleteMutation(
    ["workout", "delete"],
    ({ id }) => `/workout/${id}`,
    {
      onMutate: (qc, { id }) => {

        const prevList = qc.getQueryData(LIST_KEY) || [];
        const prevSingle = qc.getQueryData(SINGLE_KEY(id));

        qc.setQueryData(
          LIST_KEY,
          prevList.filter((w) => w.id !== id)
        );

        qc.removeQueries({ queryKey: SINGLE_KEY(id), exact: true });

        return {
          rollback: () => {
            qc.setQueryData(LIST_KEY, prevList);
            if (prevSingle) qc.setQueryData(SINGLE_KEY(id), prevSingle);
          }
        };
      },
      onSuccess: () => {
        setInfo("Workout deleted!");
      },
      onError: (_err, _vars, _ctx) => {
        setError("Failed to delete workout.");
      },
      invalidations: [LIST_KEY, PROFILE_KEY],
    }
  );

  const createWorkout = (id) =>
    mutCreateWorkout({ splitId: id });

  const deleteWorkout = (id) =>
    mutDeleteWorkout({ id });

  return {
    workouts,
    createWorkout,
    deleteWorkout,
  };
};
