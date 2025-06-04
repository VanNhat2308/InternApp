import { useState } from "react";
import { useFilter } from "../context/filteContext";

function Filter() {
  const {setShowFilter} = useFilter()
  const [positions, setPositions] = useState({
    Design: true,
    HR: false,
    "Front-end": false,
    "Business Analyst": false,
    "Back-end": true,
    Java: true,
    Python: true,
    "React JS": false,
    Tester: false,
    "Node JS": false,
  });

  const [universities, setUniversities] = useState({
    VLU: true,
    UEF: false,
    HSU: false,
    UEH: true,
    UEL: true,
  });

  const [term, setTerm] = useState("Tất cả");

  const handleCheckbox = (group, key) => {
    if (group === "position") {
      setPositions({ ...positions, [key]: !positions[key] });
    } else if (group === "university") {
      setUniversities({ ...universities, [key]: !universities[key] });
    }
  };

  const handleApply = () => {
    console.log("Positions:", positions);
    console.log("Universities:", universities);
    console.log("Term:", term);
  };
  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(5px)",
      }}
      className="absolute top-0 left-0 w-full h-[100%] z-1000 flex justify-center"
    >
       <div className="w-[350px] h-fit bg-white rounded-3xl shadow-xl p-5 space-y-4 mt-20">
      <h2 className="text-center font-semibold border-b pb-3 border-gray-200 text-xl">Bộ Lọc</h2>

      <div className="border-b border-gray-200 pb-3">
        <h3 className="font-medium mb-1">Vị Trí</h3>
        <div className="grid grid-cols-2 gap-1">
          {Object.keys(positions).map((key) => (
            <label key={key} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={positions[key]}
                onChange={() => handleCheckbox("position", key)}
              />
              {key}
            </label>
          ))}
        </div>
      </div>

      <div className="border-b border-gray-200 pb-3">
        <h3 className="font-medium mb-1">Trường đại học</h3>
        <div className="grid grid-cols-2 gap-1">
          {Object.keys(universities).map((key) => (
            <label key={key} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={universities[key]}
                onChange={() => handleCheckbox("university", key)}
              />
              {key}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-1">Kỳ thực tập</h3>
        <div className="flex gap-4">
          {["Tất cả", "Kỳ 1", "Kỳ 2", "Kỳ 3"].map((item) => (
            <label key={item} className="flex items-center gap-1">
              <input
                type="radio"
                name="term"
                value={item}
                checked={term === item}
                onChange={() => setTerm(item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="border border-gray-300 px-4 py-2 rounded-xl flex-1"
          onClick={() => {
            // Reset all filters
            setShowFilter(false)
            setPositions({});
            setUniversities({});
            setTerm("Tất cả");
          }}
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
    </div>


    </div>
  );
}

export default Filter;
