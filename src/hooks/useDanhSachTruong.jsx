import { useQuery } from "@tanstack/react-query";
import axiosClient from "../service/axiosClient";

export const useDanhSachTruong = () => {
  return useQuery({
    queryKey: ["danhSachTruong"],
    queryFn: async () => {
      const res = await axiosClient.get("/truongs");
      return res.data || [];
    },
    staleTime: 5 * 60 * 1000, // cache 5 phút
  });
};
