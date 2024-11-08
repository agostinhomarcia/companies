import { useQuery, useMutation, useQueryClient } from "react-query";
import { partnersApi } from "../services/api";
import { Partner } from "../types";

export function usePartners() {
  const queryClient = useQueryClient();

  const { data: partners = [], isLoading } = useQuery<Partner[]>(
    "partners",
    async () => {
      const response = await partnersApi.get("/");
      return response.data;
    }
  );

  const deletePartner = useMutation(
    async (id: string) => {
      await partnersApi.delete(`/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("partners");
      },
    }
  );

  return {
    partners,
    isLoading,
    deletePartner,
  };
}
