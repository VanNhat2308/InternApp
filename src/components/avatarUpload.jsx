import React, { useState } from "react";
import { IoCamera } from "react-icons/io5";

export default function AvatarUpload() {
  const [avatar, setAvatar] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file)); // Hiển thị ảnh
      // TODO: Bạn có thể upload `file` lên server tại đây
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label htmlFor="avatar-upload" className="cursor-pointer relative">
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-24 h-24 rounded-xl object-cover border border-gray-300 shadow"
          />
        ) : (
          <div className="w-24 h-24 rounded-xl bg-green-100 border border-green-300 flex items-center justify-center">
            <IoCamera  className="text-2xl"/>
          </div>
        )}
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </label>

    </div>
  );
}
