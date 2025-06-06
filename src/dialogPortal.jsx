import ReactDOM from "react-dom";

function DialogPortal({ children }) {
  return ReactDOM.createPortal(
    children,
    document.getElementById("dialog-root") 
  );
}

export default DialogPortal;
