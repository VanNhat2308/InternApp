
function formatDate(date) {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng từ 0-11 nên +1
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export default function UpdatedDate() {
  const today = new Date();

  return (
    <p className="text-sm text-gray-400 mt-1 border-t border-t-gray-300 px-4 py-2">
      Cập nhật: {formatDate(today)}
    </p>
  );
}
