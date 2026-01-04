import { useGetQuery, usePutMutation, usePostMutation } from "@utils/apiHooks";
import { useSnackbar } from "./useSnackbar";


export const usePersonal = () => {
  const {setInfo} = useSnackbar();
  const userProfile = useGetQuery(["profile"], "/user/profile");
  const getWeight = useGetQuery(["weight"], "/user/weight");


  const mutSetTheme = usePutMutation(
    ["profile", "setTheme"],
    "/user/set-theme",
    {
      onMutate: (qc, { value }) => {
        const key = ["profile"];
        const prev = qc.getQueryData(key);
        qc.setQueryData(key, (old) => ({ ...(old || {}), theme: value }));
        return { rollback: () => qc.setQueryData(key, prev) };
      },
      invalidations: [["profile"]],
      // onSuccess: () => setSuccess("Theme set"),
      // onError: () => setError("Failed to set theme."),
    }
  );

  const mutSetPreferredUnits = usePutMutation(
    ["profile", "setTheme"],
    "/user/set-units",
    {
      onMutate: (qc, { value }) => {
        const key = ["profile"];
        const prev = qc.getQueryData(key);
        qc.setQueryData(key, (old) => ({ ...(old || {}), preferred_units: value }));
        return { rollback: () => qc.setQueryData(key, prev) };
      },
      invalidations: [["profile"]],
      // onSuccess: () => setSuccess("Units changed"),
      // onError: () => setError("Failed to set units"),
    }
  );

  const mutSetSubscription = usePutMutation(
    ["profile", "setTheme"],
    "/user/set-subscription-newsletter",
    {
      onMutate: (qc, { value }) => {
        const key = ["profile"];
        const prev = qc.getQueryData(key);
        qc.setQueryData(key, (old) => ({ ...(old || {}), preferred_units: value }));
        return { rollback: () => qc.setQueryData(key, prev) };
      },
      invalidations: [["profile"]],
      // onSuccess: () => setSuccess("Units changed"),
      // onError: () => setError("Failed to set units"),
    }
  );

  // const mutateAddWeight = usePostMutation(
  //   ["profile", "addWeight"],
  //   "/user/weight",
  //   {
  //     onMutate: (qc, { value }) => {
  //       const key = ["profile"];
  //       const prev = qc.getQueryData(key);
  //       qc.setQueryData(key, (old) => ({ ...(old || {}), latest_weight: { weight: value, created_at: 0 } }));
  //       return { rollback: () => qc.setQueryData(key, prev) };
  //     },
  //     invalidations: [["profile"]],
  //     // onSuccess: () => setSuccess("Theme set"),
  //     // onError: () => setError("Failed to set theme."),
  //   }
  // );

  const setTheme = async (data) => {
    return await mutSetTheme(data);
  };

  const setPreferredUnits = async (data) => {
    return await mutSetPreferredUnits(data);
  };

  const setSubscription = async (data) => {
    return await mutSetSubscription(data);
  };

  // const setNewWeight = async (data) => mutateAddWeight(data);

  return {
    userProfile,
    getWeight,
    setTheme,
    setPreferredUnits,
    setSubscription,
    // setNewWeight,
  };
};
