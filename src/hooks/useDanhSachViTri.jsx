import { useQuery } from "@tanstack/react-query";
import axiosClient from "../service/axiosClient";

export const useDanhSachViTri = () => {
  return useQuery({
    queryKey: ["danhSachViTri"],
    queryFn: async () => {
      const res = await axiosClient.get("/vi-tris");
      return res.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};
