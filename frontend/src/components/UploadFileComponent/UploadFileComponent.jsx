import React, { useState } from "react";

// Estilos en línea mejorados para el componente
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "25px",
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        maxWidth: "500px",
        margin: "auto",
        backgroundColor: "#ffffff",
    },
    title: {
        fontSize: "26px",
        fontWeight: "600",
        marginBottom: "25px",
        color: "#333",
    },
    input: {
        marginBottom: "20px",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        width: "100%",
        fontSize: "16px",
        boxSizing: "border-box",
        outline: "none",
        transition: "border-color 0.3s",
    },
    inputFocus: {
        borderColor: "#007bff",
    },
    button: {
        padding: "12px 25px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#007bff",
        color: "white",
        fontSize: "18px",
        fontWeight: "500",
        cursor: "pointer",
        transition: "background-color 0.3s, transform 0.3s",
        width: "100%",
        textAlign: "center",
        boxSizing: "border-box",
    },
    buttonHover: {
        backgroundColor: "#0056b3",
        transform: "scale(1.02)",
    },
    buttonDisabled: {
        backgroundColor: "#cccccc",
        cursor: "not-allowed",
    },
    alert: {
        marginTop: "20px",
        padding: "15px",
        borderRadius: "8px",
        border: "1px solid",
        opacity: "0",
        transform: "translateY(-10px)",
        transition: "opacity 0.3s, transform 0.3s",
        width: "100%",
        boxSizing: "border-box",
    },
    alertVisible: {
        opacity: "1",
        transform: "translateY(0)",
    },
    alertSuccess: {
        backgroundColor: "#d4edda",
        color: "#155724",
        borderColor: "#c3e6cb",
    },
    alertError: {
        backgroundColor: "#f8d7da",
        color: "#721c24",
        borderColor: "#f5c6cb",
    }
};

function UploadFileComponent() {
    const [files, setFiles] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState(""); // "success" or "error"
    const [inputFocus, setInputFocus] = useState(false);

    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };

    const handleUpload = async () => {
        if (!files) return;

        setLoading(true);
        setAlertMessage("Uploading files...");
        setAlertType(""); // Clear previous alert type

        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append("files", file);
        });

        try {
            const response = await fetch("http://localhost:8000/upload-docs/", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setAlertMessage(data.message);
            setAlertType("success");
        } catch (error) {
            console.error("Error uploading files:", error);
            setAlertMessage("Failed to upload files.");
            setAlertType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.title}>Upload Your Documents</div>
            <input
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ ...styles.input, ...(inputFocus ? styles.inputFocus : {}) }}
                onFocus={() => setInputFocus(true)}
                onBlur={() => setInputFocus(false)}
            />
            <button
                onClick={handleUpload}
                style={{
                    ...styles.button,
                    ...(loading ? styles.buttonDisabled : styles.buttonHover),
                }}
                disabled={loading}
            >
                {loading ? "Uploading..." : "Upload"}
            </button>
            <div
                style={{
                    ...styles.alert,
                    ...(alertType ? styles.alertVisible : {}),
                    ...(alertType === "success" ? styles.alertSuccess : {}),
                    ...(alertType === "error" ? styles.alertError : {}),
                }}
            >
                {alertMessage}
            </div>
        </div>
    );
}

export default UploadFileComponent;
