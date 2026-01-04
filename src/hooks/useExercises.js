import { useGetQuery, usePostMutation, usePutMutation, useDeleteMutation } from "@utils/apiHooks";
import { useSnackbar } from "./useSnackbar";

const LIST_KEY = ["exercises"];
const SINGLE_KEY = (id) => ["exercise", id];

export const useExercises = () => {
  const {setError, setSuccess} = useSnackbar();

  const exercises = useGetQuery(LIST_KEY, "/exercise");

  const mutCreateExercise = usePostMutation(
    ["exercise", "create"],
    "/exercise",
    {
      onMutate: (qc, { payload }) => {
        const prevList = qc.getQueryData(LIST_KEY) || [];

        const tempId = `temp-${Date.now()}`;
        const tempItem = { id: tempId, ...payload };

        client.setQueryData(LIST_KEY, [tempItem, ...prevList]);

        return {
          tempId,
          prevList,
          qc,
          rollback: () => qc.setQueryData(LIST_KEY, prevList),
        };
      },
      onSuccess: (data, _vars, ctx) => {
        const current = ctx.qc.getQueryData(LIST_KEY) || [];
        const replaced = current.map((ex) => (ex.id === ctx?.tempId ? data : ex));
        ctx.qc.setQueryData(LIST_KEY, replaced);
        if (data?.id) ctx.qc.setQueryData(SINGLE_KEY(data.id), data);
        setSuccess("Exercise added");
      },
      // Fallback: always ensure fresh data
      invalidations: [LIST_KEY],
      onError: (_err, _vars, _ctx) => {
        setError("Failed to add exercise");
      },
    }
  );

  const mutUpdateExercise = usePutMutation(
    ["exercise", "update"],
    ({ id }) => `/exercise/${id}`,
    {
      onMutate: (qc, { id, payload }) => {
        const prevSingle = qc.getQueryData(SINGLE_KEY(id));
        const prevList = qc.getQueryData(LIST_KEY);

        if (prevSingle) qc.setQueryData(SINGLE_KEY(id), { ...prevSingle, ...payload });
        if (prevList) {
          qc.setQueryData(
            LIST_KEY,
            prevList.map((ex) => (ex.id === id ? { ...ex, ...payload } : ex))
          );
        }

        return {
          rollback: () => {
            if (prevSingle) qc.setQueryData(SINGLE_KEY(id), prevSingle);
            if (prevList) qc.setQueryData(LIST_KEY, prevList);
          },
        };
      },
      invalidations: [LIST_KEY],
      onSuccess: () => setSuccess("Exercise updated"),
      onError: (err, _vars, _ctx) => {
        setError(err?.response?.data?.error ?? "Failed to update exercise");
      },
    }
  );

  const mutDeleteExercise = useDeleteMutation(
    ["exercise", "delete"],
    ({ id }) => `/exercise/${id}`,
    {
      onMutate: (qc, { id }) => {
        const prevList = qc.getQueryData(LIST_KEY) || [];
        const prevSingle = qc.getQueryData(SINGLE_KEY(id));

        qc.setQueryData(LIST_KEY, prevList.filter((ex) => ex.id !== id));
        qc.removeQueries({ queryKey: SINGLE_KEY(id), exact: true });

        return {
          rollback: () => {
            qc.setQueryData(LIST_KEY, prevList);
            if (prevSingle) qc.setQueryData(SINGLE_KEY(id), prevSingle);
          },
        };
      },
      invalidations: [LIST_KEY],
      onSuccess: (_data, _vars, _ctx) => setSuccess("Exercise deleted"),
      onError: (_err, _vars, _ctx) => {
        setError("Failed to delete exercise");
      },
    }
  );

  const updateExercise = async (id, payload) => mutUpdateExercise({ id, payload });
  const createExercise = async (payload) => mutCreateExercise(payload);
  const deleteExercise = async (id) => mutDeleteExercise({ id });

  return { exercises, createExercise, updateExercise, deleteExercise };
};
