import React, { useState } from 'react';
import ChatWidget from '../components/ChatWidget';
import UploadFileComponent from '../components/UploadFileComponent/UploadFileComponent';
import FileListComponent from '../components/FileListComponent/FileListComponent';
import DocumentAssignmentComponent from '../components/AssignmentComponent/AssignmentComponent';

function HomePage() {
    const [selectedDocument, setSelectedDocument] = useState(null);

    const handleDocumentSelect = (document) => {
        setSelectedDocument(document);
    };
    return (
        <div>
            <UploadFileComponent />
            <DocumentAssignmentComponent />
            <FileListComponent onSelectDocument={handleDocumentSelect} />

            {selectedDocument && <ChatWidget document={selectedDocument} />}
            <ChatWidget />
        </div>
    );
}

export default HomePage;
