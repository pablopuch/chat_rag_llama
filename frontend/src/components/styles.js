const sharedInputStyles = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "15px",
    outline: "none",
    transition: "border-color 0.3s ease",
    fontSize: "1em",
    boxSizing: "border-box",
};

const styles = {
    container: {
        maxWidth: "400px",
        margin: "20px auto",
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    title: {
        fontSize: "1.5em",
        marginBottom: "15px",
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
    },
    select: {
        ...sharedInputStyles,
    },
    input: {
        ...sharedInputStyles,
    },
    button: {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        backgroundColor: "#007bff",
        color: "#ffffff",
        border: "none",
        cursor: "pointer",
        fontSize: "1em",
        transition: "background-color 0.3s ease",
    },
    buttonHover: {
        backgroundColor: "#0056b3",
    },
    buttonDisabled: {
        backgroundColor: "#cccccc",
        cursor: "not-allowed",
    },
    alert: {
        marginTop: '20px',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '1rem',
    },
    alertSuccess: {
        backgroundColor: "#d4edda",
        color: "#155724",
        border: "1px solid #c3e6cb",
    },
    alertError: {
        backgroundColor: "#FFFF00",
        color: "#721c24",
        border: "1px solid #f5c6cb",
    },
};

export default styles;
