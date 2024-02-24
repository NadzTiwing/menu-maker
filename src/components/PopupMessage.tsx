import { Snackbar } from "@mui/material";
import { IPopupMessage } from "../types";

const PopupMessage: React.FC<IPopupMessage> = ({
  isOpen,
  handleShow,
  message,
}: IPopupMessage) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={isOpen}
      autoHideDuration={3000}
      onClose={() => handleShow()}
      message={message}
    />
  );
};

export default PopupMessage;
