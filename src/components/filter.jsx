import { useState, useEffect, useCallback } from "react";
import { useFilter } from "../context/filteContext";
import { useDanhSachTruong } from "../hooks/useDanhSachTruong";
import { useDanhSachViTri } from "../hooks/useDanhSachViTri";

function CheckboxGroup({ title, data = [], state = {}, groupName, onToggle }) {
  return (
    <div className="border-b border-gray-200 pb-3">
      <h3 className="font-medium mb-1">{title}</h3>
      <div className="grid grid-cols-2 gap-1">
        {data.map((item) => (
          <label key={item} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={state[item] || false}
              onChange={() => onToggle(groupName, item)}
            />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
}

function Filter() {
  const { setShowFilter, setFilterValues, filterValues } = useFilter();

  const { data: truongs = [], isLoading: loadingTruongs } = useDanhSachTruong();
  const { data: viTris = [], isLoading: loadingViTris } = useDanhSachViTri();

  const [positions, setPositions] = useState({});
  const [universities, setUniversities] = useState({});

  useEffect(() => {
    const viTriState = Object.fromEntries(
      viTris.map((item) => [item.tenViTri, filterValues.positions?.[item.tenViTri] || false])
    );
    const truongState = Object.fromEntries(
      truongs.map((item) => [item.tenTruong, filterValues.universities?.[item.tenTruong] || false])
    );

    setPositions(viTriState);
    setUniversities(truongState);
  }, [truongs, viTris, filterValues]);

  const handleCheckbox = useCallback((group, key) => {
    if (group === "position") {
      setPositions((prev) => ({ ...prev, [key]: !prev[key] }));
    } else if (group === "university") {
      setUniversities((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  }, []);

  const handleApply = () => {
    setFilterValues({ positions, universities });
    setShowFilter(false);
  };

  const handleCancel = () => {
    setShowFilter(false);
  };

  const handleClear = () => {
    setPositions({});
    setUniversities({});
  };

  const isLoading = loadingTruongs || loadingViTris;

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
            <CheckboxGroup
              title="Vị Trí"
              data={viTris.map((i) => i.tenViTri)}
              state={positions}
              groupName="position"
              onToggle={handleCheckbox}
            />
            <CheckboxGroup
              title="Trường đại học"
              data={truongs.map((i) => i.maTruong)}
              state={universities}
              groupName="university"
              onToggle={handleCheckbox}
            />
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
