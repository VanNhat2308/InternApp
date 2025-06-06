import FileUpload from './fileUpload';

function Test() {
//   const [data, setData] = useState([]);

// useEffect(() => {
//     axiosClient.get('/sinhviens/danh-sach-diem-danh')
//       .then(res =>{ setData(res.data) 
//         console.log(res.data);
             
//       })
//       .catch(err => console.error(err));
//   }, []);


  return (
   <>
  <FileUpload
  uploadPath="/upload"
  onSuccess={(res) => console.log("Tải lên thành công:", res)}
  onError={(err) => console.error("Lỗi tải lên:", err)}
/>

   </>
  );
}

export default Test;
