import { usePutMutation, useDeleteMutation, useGetQuery } from "@utils/apiHooks";
import { useSnackbar } from "./useSnackbar";

const pick = (obj, keys) =>
  keys.reduce((acc, k) => (k in (obj || {}) ? ((acc[k] = obj[k]), acc) : acc), {});

const LIST_KEY = ["programs"];
const SINGLE_KEY = (id) => ["program", id];
const PROFILE_KEY = ["profile"];

export const useProgramSplit = (id) => {
  if (!id) {
    throw new Error("useProgram requires a programId to be provided.");
  }

  const {setInfo} = useSnackbar();

  const program = useGetQuery(SINGLE_KEY(id), `/program/${id}`);

  const mutateProgram = usePutMutation(
    ["program", "update"],
    () => `/program/${id}`,
    {
      onMutate: (qc, { payload }) => {
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
      onSuccess: () => setSuccess("Program updated"),
      onError: (_err, _vars, _ctx) => {
        setError("Failed to update exercise");
      },
    }
  );

  const mutateDeleteProgram = useDeleteMutation(
    ["program", "delete"],
    () => `/program/${id}`,
    {
      onMutate: (qc) => {
        const prevList = qc.getQueryData(LIST_KEY);
        const prevSingle = qc.getQueryData(SINGLE_KEY(id));

        if (prevList) {
          qc.setQueryData(
            LIST_KEY,
            prevList.filter((w) => w.id !== id)
          );
        }
        qc.removeQueries(SINGLE_KEY(id));

        return {
          rollback: () => {
            if (prevList) qc.setQueryData(LIST_KEY, prevList);
            if (prevSingle) qc.setQueryData(SINGLE_KEY(id), prevSingle);
          },
        };
      },
      invalidations: [LIST_KEY, PROFILE_KEY],
      onSuccess: () => {
        setSuccess("Program deleted")
      },
      onError: (_err, _vars, ctx) => {
        setError("Failed to delete program");
      },
    }
  );

  const updateProgram = async (payload) => mutateProgram({payload})
  const deleteProgram = async () => mutateDeleteProgram({})


  return {program, updateProgram, deleteProgram}
};
