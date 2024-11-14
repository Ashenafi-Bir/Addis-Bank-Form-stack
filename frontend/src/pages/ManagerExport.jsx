import React, { useState } from 'react';
import axios from 'axios';
import './ManagerExport.css';

const ManagerExport = () => {
    const [formId, setFormId] = useState('');
    const [csvData, setCsvData] = useState([]);
    const [formDetails, setFormDetails] = useState(null);
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);

    // Fetch Form Details and Preview CSV Data
    const fetchFormDetails = async () => {
        if (!formId) {
            alert("Please enter a Form ID.");
            return;
        }

        try {
            const formDetailsResponse = await axios.get(`http://localhost:5000/api/forms/${formId}`);
            setFormDetails(formDetailsResponse.data);

            const response = await axios.get(`http://localhost:5000/api/responses/export/${formId}`, {
                responseType: 'blob'
            });

            const reader = new FileReader();
            reader.onload = function(event) {
                const textDecoder = new TextDecoder('utf-8');
                const csv = textDecoder.decode(event.target.result);
                const rows = csv.split('\n').map(row => row.split(','));
                setCsvData(rows);
            };
            reader.readAsArrayBuffer(response.data);

            setIsDetailsVisible(true);
        } catch (error) {
            alert("Failed to fetch form details. Please try again.");
            console.error("Error fetching form details:", error);
        }
    };

    // Handle Export Action
    const handleExport = async () => {
        if (!formId) {
            alert("Please enter a Form ID.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/api/responses/export/${formId}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `form_${formId}_responses.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert("Error exporting data.");
            console.error("Error exporting data:", error);
        }
    };

    return (
        <div className="manager-export">
            <h2>Export Form Responses</h2>
            <div className="input-container">
                <label htmlFor="formId">Form ID</label>
                <input
                    type="text"
                    id="formId"
                    placeholder="Enter Form ID"
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                />
            </div>

            <button onClick={fetchFormDetails}>View Form Details</button>

            {isDetailsVisible && formDetails && (
                <div className="form-details">
                    <h3>Form Details</h3>
                    <p><strong>Title:</strong> {formDetails.title}</p>
                    <p><strong>Number of Questions:</strong> {formDetails.questions.length}</p>
                    <p><strong>Created At:</strong> {new Date(formDetails.createdAt).toLocaleDateString()}</p>
                </div>
            )}

            {csvData.length > 0 && isDetailsVisible && (
                <div className="csv-table-container">
                    <h3>CSV Data Preview</h3>
                    <table className="csv-table">
                        <thead>
                            <tr>
                                {csvData[0].map((col, idx) => (
                                    <th key={idx}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {csvData.slice(1).map((row, idx) => (
                                <tr key={idx}>
                                    {row.map((col, colIdx) => (
                                        <td key={colIdx}>{col}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isDetailsVisible && <button onClick={handleExport}>Export CSV</button>}
        </div>
    );
};

export default ManagerExport;
