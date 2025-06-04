import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosClient from '../service/axiosClient';

function Test() {
  const [data, setData] = useState([]);

  useEffect(() => {
   axiosClient.get('/sinhviens/countSV')
  .then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h1>Danh sách bài viết</h1>
     {data.total_sv}
    </div>
  );
}

export default Test;
