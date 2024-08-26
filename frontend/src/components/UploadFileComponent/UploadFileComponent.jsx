import React, { useState } from "react";

// Estilos en línea para el componente
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        maxWidth: "500px",
        margin: "auto",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
    },
    input: {
        marginBottom: "20px",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        width: "100%",
    },
    button: {
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        backgroundColor: "#007bff",
        color: "white",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
    buttonHover: {
        backgroundColor: "#0056b3",
    },
    alert: {
        marginTop: "20px",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid",
        display: "none",
    },
    alertSuccess: {
        backgroundColor: "#d4edda",
        color: "#155724",
        borderColor: "#c3e6cb",
        display: "block",
    },
    alertError: {
        backgroundColor: "#f8d7da",
        color: "#721c24",
        borderColor: "#f5c6cb",
        display: "block",
    }
};

function UploadFileComponent() {
    const [files, setFiles] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState(""); // "success" or "error"

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
                style={styles.input}
            />
            <button
                onClick={handleUpload}
                style={{ ...styles.button, ...(loading ? styles.buttonHover : {}) }}
                disabled={loading}
            >
                {loading ? "Uploading..." : "Upload"}
            </button>
            <div
                style={{
                    ...styles.alert,
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
