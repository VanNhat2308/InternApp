// hooks/useDashboardData.js
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../service/axiosClient';

export const useDashboardData = (maSV) => {
  return useQuery({
    queryKey: ['dashboard-data', maSV],
    queryFn: async () => {
      const [
        resTotal,
        resLevel,
        resTask,
        resDiemDanh,
        resChartData,
        resTodayStatus, // <== Thêm API điểm danh hôm nay
      ] = await Promise.all([
        axiosClient.get(`/diem-danh/tong-gio-thuc-tap/${maSV}`),
        axiosClient.get(`/diem-danh/thong-ke-chuyen-can/${maSV}`),
        axiosClient.get(`/student/tasks/tong-task-sv/${maSV}`),
        axiosClient.get(`/diem-danh/sinh-vien/${maSV}`, {
          params: {
            date: null,
            page: 1,
            per_page: 10,
          },
        }),
        axiosClient.get(`/diem-danh/thong-ke-tuan-sv/${maSV}`),
        axiosClient.post(`/diem-danh/check-today`, { maSV }) // <== gọi POST
      ]);

      const tongBuoi = resLevel.data.tong_so_buoi || 1;
      const buoiDungGio = resLevel.data.so_buoi_dung_gio || 0;

      return {
        internStats: {
          totalTime: resTotal.data.tong_gio_thuc_tap,
          level: `${buoiDungGio}/${tongBuoi}`,
          numTasks: resTask.data.tong_so_task,
          score: Math.round((buoiDungGio / tongBuoi) * 10),
        },
        diemDanh: resDiemDanh.data.data.data,
        chartData: resChartData.data,
        todayCheck: resTodayStatus.data // <== thêm phần này
      };
    },
    enabled: !!maSV,
  });
};
