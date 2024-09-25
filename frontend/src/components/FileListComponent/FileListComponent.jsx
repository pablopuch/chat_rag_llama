import React, { useEffect, useState } from "react";
import styles from "../styles"; // Importa los estilos

function FileListComponent({ onSelectDocument }) {
    const [files, setFiles] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ message: "", type: "" });
    const [selectedFile, setSelectedFile] = useState("");

    const fetchData = async (url, setter, errorMessage) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(errorMessage);
            const data = await response.json();
            setter(data.documents || data.questions || []);
        } catch (error) {
            setAlert({ message: errorMessage, type: "error" });
        }
    };

    useEffect(() => {
        fetchData("http://192.168.1.140:8000/list-docs/", setFiles, "Error al obtener los archivos");
        fetchData("http://192.168.1.140:8000/list-questions/", setQuestions, "Error al obtener las preguntas");
    }, []);

    const handleQuestionChange = (e) => {
        const selected = questions.find(q => q.question === e.target.value);
        setSelectedQuestion(e.target.value);
        setSelectedFile(selected?.file || "");

        if (selected?.file) {
            onSelectDocument(selected.file);
        }
    };

    const handleProcessFile = async () => {
        if (!selectedFile) return;

        setLoading(true);
        setAlert({ message: "Procesando el archivo seleccionado...", type: "" });

        try {
            const response = await fetch("http://192.168.1.140:8000/process-doc/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename: selectedFile }),
            });
            if (!response.ok) throw new Error("El servidor respondió con un error");
            setAlert({ message: "Ya puedes empezar a usar el chat", type: "success" });
        } catch (error) {
            setAlert({ message: "Error al procesar el archivo.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.title}>Selecciona un tema</div>
            <select style={styles.select} value={selectedQuestion} onChange={handleQuestionChange}>
                <option value="">Selecciona un tema...</option>
                {questions.length > 0 ? (
                    questions.map(({ question }) => (
                        <option key={question} value={question}>
                            {question}
                        </option>
                    ))
                ) : (
                    <option value="">No hay preguntas disponibles</option>
                )}
            </select>
            <button
                onClick={handleProcessFile}
                style={{
                    ...styles.button,
                    ...(loading || !selectedFile ? styles.buttonDisabled : styles.buttonHover),
                }}
                disabled={loading || !selectedFile}
            >
                {loading ? "Procesando..." : "Seleccionar"}
            </button>
            {alert.message && (
                <div
                    style={{
                        ...styles.alert,
                        ...(alert.type === "success" ? styles.alertSuccess : styles.alertError),
                        display: "block", // Asegura que la alerta esté visible
                    }}
                >
                    {alert.message}
                </div>
            )}
        </div>
    );
}

export default FileListComponent;
