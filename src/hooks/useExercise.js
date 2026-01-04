import { useGetQuery, usePostMutation, usePutMutation, useDeleteMutation } from "@utils/apiHooks";
import { useSnackbar } from "./useSnackbar";

const LIST_KEY = ["exercises"];
const SINGLE_KEY = (id) => ["exercise", id];

export const useExercise = (id) => {
  if (!id) {
    throw new Error("useExercise requires a id to be provided.");
  }

  const { setInfo, setError, setSuccess } = useSnackbar()

  const exercise = useGetQuery(SINGLE_KEY(id), `/exercise/${id}`);

  const mutUpdateExercise = usePutMutation(
    ["exercise", "update"],
    `/exercise/${id}`,
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
      onSuccess: () => {
        setSuccess("Exercise updated")
      },
      onError: (_err, _vars, _ctx) => {
        setError("Failed to update exercise");
      },
    }
  );

  const updateExercise = async (id, payload) => mutUpdateExercise({ id, payload });

  return { exercise, updateExercise };
};


