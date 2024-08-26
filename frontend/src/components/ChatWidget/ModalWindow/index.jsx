// importing external style
import { styles } from "./../styles";
//for displaying the model view/Window
function ModalWindow({ visible, children }) {
    return (
        <div
            style={{
                ...styles.modalWindow,
                opacity: visible ? "1" : "0",
                pointerEvents: visible ? "auto" : "none",
            }}
        >
            {children}
        </div>
    );
}

export default ModalWindow;