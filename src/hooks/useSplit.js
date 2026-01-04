import { usePutMutation, useDeleteMutation, useGetQuery } from "@utils/apiHooks";
import { useSnackbar } from "./useSnackbar";

const LIST_KEY = ["splits"];
const SINGLE_KEY = (id) => ["split", id];

export const useSplit = (id) => {
  if (!id) {
    throw new Error("useSplit requires a splitId to be provided.");
  }

  const {setInfo} = useSnackbar();

  const split = useGetQuery(SINGLE_KEY(id), `/split/${id}`);


  return {split}
};
