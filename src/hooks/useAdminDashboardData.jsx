// hooks/useAdminDashboardData.js
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../service/axiosClient";

export const useAdminDashboardData = () => {
  return useQuery({
    queryKey: ['admin-dashboard-data'],
    queryFn: async () => {
      const [
        studentsRes,
        hoSoRes,
        taskRes,
        totalRes
      ] = await Promise.all([
        axiosClient.get('/diem-danh/danh-sach-hom-nay?page=1'),
        axiosClient.get('/hoso/counths'),
        axiosClient.get('/student/tasks/countTask'),
        axiosClient.get('/sinhviens/countSV'),
      ]);

      return {
        students: studentsRes.data.data.data,
        totalDiemDanh: studentsRes.data.data.total,
        hoSo: hoSoRes.data.total_hs,
        task: taskRes.data.total_task,
        totalSV: totalRes.data.total_sv,
      };
    }
  });
};
