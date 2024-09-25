import React, { useEffect, useState } from "react";
import styles from "../styles";

function DocumentAssignmentComponent({ onDocumentSelect }) {
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState("");
    const [theme, setTheme] = useState("");
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState(""); // "success" or "error"

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch("http://192.168.1.140:8000/list-docs/");
                if (response.ok) {
                    const data = await response.json();
                    console.log("Documents fetched:", data); // Para depuración
                    setDocuments(data.documents || []);
                } else {
                    throw new Error("Failed to fetch documents");
                }
            } catch (error) {
                console.error("Error fetching documents:", error);
                setAlertMessage("Failed to fetch documents.");
                setAlertType("error");
            }
        };

        fetchDocuments();
    }, []);

    const handleDocumentChange = (e) => {
        const doc = e.target.value;
        setSelectedDocument(doc);
        onDocumentSelect(doc); // Llama a la función para pasar el documento seleccionado
    };

    const handleThemeChange = (e) => {
        setTheme(e.target.value);
    };

    const handleAssociateQuestion = async () => {
        if (!selectedDocument || !theme) return;

        setLoading(true);
        setAlertMessage("Associating question with document...");
        setAlertType(""); // Clear previous alert type

        try {
            const response = await fetch("http://192.168.1.140:8000/associate-question/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ filename: selectedDocument, question: theme }),
            });
            if (response.ok) {
                const data = await response.json();
                setAlertMessage(data.message);
                setAlertType("success");
            } else {
                throw new Error("Server responded with an error");
            }
        } catch (error) {
            console.error("Error associating question:", error);
            setAlertMessage("Failed to associate question.");
            setAlertType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.title}>Assign Theme to Document</div>

            <select
                style={styles.select}
                value={selectedDocument}
                onChange={handleDocumentChange}
            >
                <option value="">Select a document...</option>
                {documents.length > 0 ? (
                    documents.map((doc, index) => (
                        <option key={index} value={doc}>
                            {doc}
                        </option>
                    ))
                ) : (
                    <option value="">No documents available</option>
                )}
            </select>

            <input
                placeholder="Escribe un tema"
                value={theme}
                onChange={handleThemeChange}
                style={styles.input}
            />

            <button
                onClick={handleAssociateQuestion}
                style={{
                    ...styles.button,
                    ...(loading || !selectedDocument || !theme ? styles.buttonDisabled : styles.buttonHover),
                }}
                disabled={loading || !selectedDocument || !theme}
            >
                {loading ? "Associating..." : "Associate Question"}
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

export default DocumentAssignmentComponent;
