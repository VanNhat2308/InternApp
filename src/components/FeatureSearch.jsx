import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import * as Popover from "@radix-ui/react-popover";




function FeatureSearch() {
  const [search, setSearch] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const navigate = useNavigate();
  const maSV = localStorage.getItem('maSV');
  const role = localStorage.getItem('role');

const adminFeatures = [
  { label: 'Thêm sinh viên', path: '/admin/list/add-student' },
  { label: 'Danh sách sinh viên', path: '/admin/list/student-list' },
  { label: 'Xem lịch thực tập', path: '/admin/schedule/schedule-list' },
  { label: 'Yêu cầu đổi lịch', path: '/admin/schedule/schedule-list' },
  { label: 'Duyệt hồ sơ', path: '/admin/approval/approval-list' },
  { label: 'Điểm danh', path: '/admin/attendance/attendance-list' },
  { label: 'Phản hồi', path: '/admin/feedback/feedback-list' },
  { label: 'Báo cáo', path: '/admin/report/report-list' },
  { label: 'Giao nhiệm vụ', path: '/admin/task/task-list' },
  { label: 'Thêm trường, vị trí', path: '/admin/addInfo/add' },
  { label: 'Cài đặt', path: '/admin/settings/AdminSetting' }
];

const studentFeatures = [
  { label: 'Nhật ký thực tập', path: '/student/diary/diary-list' },
  { label: 'Xem lịch thực tập', path: `/student/schedule/schedule-list/${maSV}` },
  { label: 'Phản hồi', path: '/student/feedback/feedback-list' },
  { label: 'Xem nhiệm vụ', path: '/student/task/task-list' },
  { label: 'Xem điểm danh', path: `/student/attendance/attendance-details/${maSV}` },
  { label: 'Cài đặt', path: '/student/settings' }
];

const features = role === 'Admin' ? adminFeatures : studentFeatures;

  const filtered = features.filter((feature) =>
    feature.label.toLowerCase().includes(search.toLowerCase())
  );

  const showContent = search.length > 0 && filtered.length > 0 && !isComposing;

  return (
    <Popover.Root open>
      <Popover.Trigger asChild>
        <div className="relative w-8 sm:w-20 md:w-64 h-full">
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            className="w-full border h-full border-gray-300 pl-8 pr-4 py-1 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
          />
          <FiSearch className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </Popover.Trigger>

      <Popover.Content
        side="bottom"
        align="start"
        className="bg-white shadow-md rounded-md w-64  mt-1 z-50"
      >
        {showContent && (
          <div>
            {filtered.map((item, idx) => (
              <div
                key={idx}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  navigate(item.path);
                  setSearch("");
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        )}
      </Popover.Content>
    </Popover.Root>
  );
}
export default FeatureSearch