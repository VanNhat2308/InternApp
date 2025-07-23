import { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import { useFilter } from "../context/filteContext";
import { useDanhSachTruong } from "../hooks/useDanhSachTruong";
import { useDanhSachViTri } from "../hooks/useDanhSachViTri";
import "react-datepicker/dist/react-datepicker.css";

function Filter() {
  const { isDate,setShowFilter, setFilterValues, filterValues } = useFilter();
  const { data: truongs = [], isLoading: loadingTruongs } = useDanhSachTruong();
  const { data: viTris = [], isLoading: loadingViTris } = useDanhSachViTri();
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [selectedUniversities, setSelectedUniversities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

useEffect(() => {
  if (!truongs.length || !viTris.length) return;

  const mappedPositions = viTris
    .filter((i) => filterValues.positions?.[i.tenViTri])
    .map((i) => ({ value: i.tenViTri, label: i.tenViTri }));

  const mappedUniversities = truongs
    .filter((i) => filterValues.universities?.[i.tenTruong])
    .map((i) => ({ value: i.tenTruong, label: i.maTruong }));

  setSelectedPositions(mappedPositions);
  setSelectedUniversities(mappedUniversities);
  setSelectedDate(filterValues.date || null);
}, [truongs, viTris]);

  const handleApply = () => {
    const positions = Object.fromEntries(
      selectedPositions.map((i) => [i.value, true])
    );
    const universities = Object.fromEntries(
      selectedUniversities.map((i) => [i.value, true])
    );
    setFilterValues({ positions, universities, date: selectedDate });
    setShowFilter(false);
  };

  const handleCancel = () => {
    setShowFilter(false);
  };

  const handleClear = () => {
    setSelectedPositions([]);
    setSelectedUniversities([]);
    setSelectedDate(null);
  };

  const isLoading = loadingTruongs || loadingViTris;

  const customStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? '#86efac' : '#d1d5db', // xanh nhạt khi focus, xám khi bình thường
    boxShadow: state.isFocused ? '0 0 0 2px rgba(34,197,94,0.3)' : 'none',
    borderRadius: '0.5rem', // rounded-lg
    padding: '0.25rem 0.5rem',
    minHeight: '2.5rem', // h-10
    '&:hover': {
      borderColor: '#86efac',
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#f3f4f6' : 'white', // hover:bg-gray-100
    color: 'black',
    cursor: 'pointer',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '0.5rem',
    marginTop: '0.25rem',
    zIndex: 100, // giống như Tippy
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#d1fae5', // bg-green-100
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#065f46', // text-green-800
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#065f46',
    ':hover': {
      backgroundColor: '#6ee7b7', // hover:bg-green-300
      color: 'white',
    },
  }),
};
  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(5px)",
      }}
      className="absolute top-0 left-0 w-full h-full z-1000 flex justify-center"
    >
      <div className="w-[350px] h-fit bg-white rounded-3xl shadow-xl p-5 space-y-4 mt-20">
        <h2 className="text-center font-semibold border-b pb-3 border-gray-200 text-xl">
          Bộ Lọc
        </h2>

        {isLoading ? (
          <div className="text-center py-6 text-gray-500">Đang tải dữ liệu...</div>
        ) : (
          <>
            <div>
              <label className="font-medium">Vị trí</label>
              <Select
                isMulti
                value={selectedPositions}
                onChange={setSelectedPositions}
                options={viTris.map((i) => ({
                  value: i.tenViTri,
                  label: i.tenViTri,
                }))}
                styles={customStyles}
              />
            </div>

            <div>
              <label className="font-medium">Trường Đại học</label>
              <Select
              className="focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
                isMulti
                value={selectedUniversities}
                onChange={setSelectedUniversities}
                options={truongs.map((i) => ({
                  value: i.tenTruong,
                  label: i.maTruong,
                }))}
                styles={customStyles}
              />
            </div>

            {(!isDate? "":<div className="flex flex-col">
              <label className="font-medium">Chọn ngày</label>
              <input
  type="date"
  value={selectedDate || ''}
  onChange={(e) => setSelectedDate(e.target.value)}
  className="
    w-full
    rounded-lg
    border
  border-gray-300
    px-3
    py-3
    focus:outline-none
    focus:ring-2
    focus:ring-green-200
    focus:border-green-300
    focus:shadow-md
    transition
    duration-150
    text-gray-700
    placeholder-gray-400
  "
  placeholder="Chọn ngày"
/>

            </div>)}

            <button
              className="bg-gray-100 text-red-500 px-4 py-2 rounded-xl w-full"
              onClick={handleClear}
            >
              Xóa bộ lọc
            </button>
            <div className="flex gap-2">
              <button
                className="border border-gray-300 px-4 py-2 rounded-xl flex-1"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-xl flex-1"
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Filter;
