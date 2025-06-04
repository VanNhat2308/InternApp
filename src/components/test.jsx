import React, { useEffect, useState } from 'react';
import axiosClient from '../service/axiosClient';

function Test() {
  const [data, setData] = useState([]);

useEffect(() => {
    axiosClient.get('/sinhviens/danh-sach-diem-danh')
      .then(res =>{ setData(res.data) 
        console.log(res.data);
             
      })
      .catch(err => console.error(err));
  }, []);


  return (
   <>
   {data.map((item)=>{
     return <h1> {item.maSV} </h1>
   })}
   </>
  );
}

export default Test;
