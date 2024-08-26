export const styles = {
    chatWidget: {
        position: "fixed",
        bottom: "30px", // Aumentado para mayor distancia desde el borde inferior
        right: "30px",  // Aumentado para mayor distancia desde el borde derecho
        width: "120px", // Ampliado para mayor espacio en el botón
        height: "50px", // Ampliado para mayor visibilidad
        backgroundColor: "#28a745", // Color verde para un aspecto más fresco
        borderRadius: "25px", // Bordes más redondeados
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.2)", // Añadida sombra para darle profundidad
        transition: "background-color 0.3s ease", // Transición suave al hacer hover
    },
    chatWidgetText: {
        marginLeft: "10px",
        fontWeight: "600", // Font-weight un poco menor para equilibrio visual
        color: "white",
        fontSize: "14px", // Tamaño de texto un poco mayor
    },
    modalWindow: {
        position: "fixed",
        bottom: "90px", // Ajustado para mayor separación con el widget
        right: "30px",
        width: "350px", // Ampliado para mejor legibilidad
        height: "450px", // Altura mayor para más contenido
        backgroundColor: "#ffffff",
        borderRadius: "15px", // Bordes más redondeados para un aspecto moderno
        boxShadow: "0px 6px 20px rgba(0,0,0,0.3)", // Sombra más profunda para darle más presencia
        padding: "20px", // Padding ampliado para mayor espacio interior
        transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out", // Añadida transición en el movimiento para un efecto suave
        opacity: "0",
        transform: "scale(0.95)", // Escalado para suavizar la aparición de la ventana
    },
    modalWindowVisible: {
        opacity: "1",
        transform: "scale(1)", // Escalado a tamaño normal cuando es visible
    },
};
