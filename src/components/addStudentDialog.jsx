function AddStudentDialog() {
    return ( 
    <div 
style={{
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(5px)'
}}
className="absolute top-0 left-0 w-full h-full z-1000 flex items-center justify-center">
<div className="w-150 h-100 flex flex-col items-center bg-white shadow-xl rounded-2xl">
    <h1>Xác nhận thêm sinh viên</h1>
    <p>Sau khi bạn thêm sinh viên, sinh viên thực tập mới sẽ được thêm vào danh sách sinh viên. Vui lòng kiểm tra ky thông tin. 
</p>

<button className="bg-green-700 p-4 rounded-2xl mb-4">
    Có, thêm sinh viên
</button>
<button className="p-4 rounded-2xl mb-4 border border-gray-300">
    Không, tôi muốn kiểm trả lại
</button>

</div>


    </div> 
    );
}

export default AddStudentDialog;