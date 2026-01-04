import { useGetQuery, usePostMutation, usePutMutation, useDeleteMutation } from "@utils/apiHooks";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "./useSnackbar";

const LIST_KEY = ["programs"];
const SINGLE_KEY = (id) => ["program", id];
const PROFILE_KEY = ["profile"];

export const usePrograms = () => {
  const { setInfo, setError } = useSnackbar();

  const programs = useGetQuery(LIST_KEY, "/program");

  const mutCreateProgram = usePostMutation(
    ["program", "create"],
    "/program/create",
    {
      onMutate: (qc, { payload }) => {
        const prevList = qc.getQueryData(LIST_KEY) || [];

        const tempId = `temp-${Date.now()}`;
        const tempItem = { id: tempId, ...payload };

        qc.setQueryData(LIST_KEY, [tempItem, ...prevList]);

        return {
          tempId,
          prevList,
          qc,
          rollback: () => qc.setQueryData(LIST_KEY, prevList),
        };
      },
      onSuccess: (data, ctx) => {
        const current = ctx.qc.getQueryData(LIST_KEY) || [];
        const replaced = current.map((ex) => (ex.id === ctx?.tempId ? data : ex));
        ctx.qc.setQueryData(LIST_KEY, replaced);
        if (data?.id) ctx.qc.setQueryData(SINGLE_KEY(data.id), data);
        setInfo("Program added");
      },
      invalidations: [LIST_KEY],
      onError: (_err, _vars, _ctx) => {
        setError("Failed to add program");
      },
    }
  );

  const mutActivateProgram = usePutMutation(
    ["program", "activate"],
    ({ id }) => `/program/${id}/activate`,
    {
      onMutate: (qc, { id }) => {

        const prevProfile = qc.getQueryData(PROFILE_KEY);
        if (prevProfile) {
          qc.setQueryData(PROFILE_KEY, {
            ...prevProfile,
            active_program: id,
          });
        }

        return {
          rollback: () => {
            if (prevProfile !== undefined) qc.setQueryData(PROFILE_KEY, prevProfile);
          },
        };
      },
      invalidations: [PROFILE_KEY],
      onSuccess: (data, _vars, _ctx) => {
        setInfo("Program activated");
      },
      onError: (err, _vars, _ctx) => {
        setError(
          err?.response?.data?.error ?? "Failed to activate program"
        );
      },
    }
  )

  const mutDeleteProgram = useDeleteMutation(
    ["program", "delete"],
    ({ id }) => `/program/${id}`,
    {
      onMutate: (qc, { id }) => {

        const prevList = qc.getQueryData(LIST_KEY);
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
          },
        };
      },
      onSuccess: (_data, _vars, _ctx) => {
        setInfo("Program deleted!");
      },
      onError: (_err, _vars, _ctx) => {
        setError("Failed to delete program.");
      },
      invalidations: [LIST_KEY],
    }
  );

  const createProgram = async (id) => mutCreateProgram({ id });
  const deleteProgram = async (id) => mutDeleteProgram({ id });
  const activateProgram = async (id) => mutActivateProgram({ id });

  return { programs, createProgram, deleteProgram, activateProgram };
};
