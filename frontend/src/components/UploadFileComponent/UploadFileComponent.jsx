import React, { useState } from "react";
import styles from "../styles";

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
            const response = await fetch("http://192.168.1.140:8000/upload-docs/", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                const data = await response.json();
                setAlertMessage(data.message);
                setAlertType("success");
            } else {
                throw new Error("Server responded with an error");
            }
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