import { useDialog } from "../context/dialogContext";
import DialogPortal from "../dialogPortal";

function CustomDialog() {
  const { dialog, hideDialog } = useDialog();

  if (!dialog) return null;

  const {
    title,
    icon,          
    content,
    customContent,
    confirmText,
    confirmTextV2,
    confirmPrintText,
    onDownload,
    onPrint,
    cancelText,
    onConfirm,
    onConfirmV2,
    onCancel,


  } = dialog;

 const handleConfirm = () => {
  onConfirm?.();
  hideDialog();
};
 const handleConfirmPrint = () => {
  onPrint?.();
  hideDialog();
};
 const handleConfirmDownload = () => {
  onDownload?.();
  hideDialog();
};

const handleConfirmV2 = () => {
  onConfirmV2?.();
  hideDialog();
};

  const handleCancel = () => {
    onCancel?.();
    hideDialog();
  };

  return (
    <DialogPortal>
      <div 
      style={{
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(5px)'
}}
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-[1000] flex justify-center items-center">
        <div className="bg-white p-6 rounded-2xl w-140 shadow-lg flex flex-col items-center">
          
          {icon && (
            <div className="bg-[#34a853] mb-5 rounded-2xl w-30 aspect-square flex items-center justify-center">
              <div className="text-3xl text-white">{icon}</div>
            </div>
          )}

          <h1 className="text-2xl font-bold mb-4 text-center">{title}</h1>

          {content && <p className="text-gray-700 mb-4 text-center">{content}</p>}

          {customContent && <div className="mb-4 w-full">{customContent}</div>}

          {confirmPrintText&&
          <div className="flex justify-center gap-3 mt-4">
            <button onClick={handleConfirmPrint} className="cursor-pointer text-white py-2 px-9 rounded-xl bg-[#34a853]">In</button>
            <button onClick={handleConfirmDownload} className="cursor-pointer text-white py-2 px-5 rounded-xl bg-[#34a853]">Tải PDF</button>
            <button onClick={handleCancel} className="border border-gray-300 cursor-pointer py-2 px-5 rounded-xl">Hủy bỏ</button>

          </div>
          }
          <div className="flex flex-col justify-end gap-2 w-full">
               {confirmText && <button
              className="px-4 py-2 bg-green-600 text-white rounded-3xl w-full cursor-pointer"
              onClick={handleConfirm}
            >
              {confirmText}
            </button>}
          {confirmTextV2 && (
  <button
    className="px-4 py-2 bg-green-600 text-white rounded-3xl w-full cursor-pointer"
    onClick={handleConfirmV2}
  >
    {confirmTextV2}
  </button>
)}
            {cancelText && (
              <button
                className="px-4 py-2 border border-gray-300 rounded-3xl w-full cursor-pointer"
                onClick={handleCancel}
              >
                {cancelText}
              </button>
            )}
         
          </div>
        </div>
      </div>
    </DialogPortal>
  );
}

export default CustomDialog;
