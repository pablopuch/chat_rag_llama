import React, { useState } from 'react';
import FileListComponent from '../components/FileListComponent/FileListComponent';
import ChatWidget from '../components/ChatWidget';

function HomePage() {
    const [selectedDocument, setSelectedDocument] = useState(null);

    const handleDocumentSelect = (document) => {
        setSelectedDocument(document);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '2rem', color: '#4CAF50', textAlign: 'center', flex: 1 }}>Bienvenido a la Página Principal</h1>
            </header>

            <div style={{
                padding: '15px',
                border: '1px solid #4CAF50',
                borderRadius: '8px',
                marginBottom: '20px',
                backgroundColor: '#f0f8f7',
                color: '#2f4f4f',
                textAlign: 'left',
            }}>
                <ol>
                    <li>Primero, selecciona una pregunta de la lista desplegable que aparece en el componente "Selecciona un tema". Esta acción también seleccionará automáticamente el archivo relacionado con la pregunta.</li>
                    <li>Una vez que hayas seleccionado la pregunta, el archivo asociado será mostrado y podrás procesarlo haciendo clic en el botón "Seleccionar".</li>
                    <li>Después de procesar el archivo, se habilitará un chat en la esquina inferior derecha de la página.</li>
                    <li>Puedes interactuar con el chat para discutir sobre el documento seleccionado.</li>
                    <li>Si deseas seleccionar otro archivo, simplemente selecciona otra pregunta de la lista desplegable.</li>
                </ol>
            </div>

            <FileListComponent onSelectDocument={handleDocumentSelect} />

            {selectedDocument && <ChatWidget document={selectedDocument} />}
        </div>
    );
}

export default HomePage;
