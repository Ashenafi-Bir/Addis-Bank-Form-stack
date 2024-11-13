// components/ManagerExport.js

import React, { useState } from 'react';
import { fetchFormDetails, fetchCsvData, exportCsv } from '../services/formExportService'; // Import service functions
import './ManagerExport.css';

const ManagerExport = () => {
    const [formId, setFormId] = useState('');
    const [csvData, setCsvData] = useState([]);
    const [formDetails, setFormDetails] = useState(null);
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);

    // Fetch Form Details and Preview CSV Data
    const fetchDetails = async () => {
        if (!formId) {
            alert('Please enter a Form ID.');
            return;
        }

        // Fetch form details
        const formDetailsResult = await fetchFormDetails(formId);
        if (formDetailsResult.success) {
            setFormDetails(formDetailsResult.formDetails);

            // Fetch CSV data
            const csvResult = await fetchCsvData(formId);
            if (csvResult.success) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const textDecoder = new TextDecoder('utf-8');
                    const csv = textDecoder.decode(event.target.result);
                    const rows = csv.split('\n').map((row) => row.split(','));
                    setCsvData(rows);
                };
                reader.readAsArrayBuffer(csvResult.data);
                setIsDetailsVisible(true);
            } else {
                alert(csvResult.message);
            }
        } else {
            alert(formDetailsResult.message);
        }
    };

    // Handle Export Action
    const handleExport = async () => {
        if (!formId) {
            alert('Please enter a Form ID.');
            return;
        }

        const exportResult = await exportCsv(formId);
        if (exportResult.success) {
            const url = window.URL.createObjectURL(new Blob([exportResult.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `form_${formId}_responses.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } else {
            alert(exportResult.message || 'Error exporting data.');
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

            {/* View Details Button */}
            <button onClick={fetchDetails}>View Form Details</button>

            {isDetailsVisible && formDetails && (
                <div className="form-details">
                    <h3>Form Details</h3>
                    <p className="strong">
                        <strong>Title:</strong> {formDetails.title}
                    </p>
                    <p>
                        <strong>Number of Questions:</strong> {formDetails.questions.length}
                    </p>
                    <p>
                        <strong>Created At:</strong> {new Date(formDetails.createdAt).toLocaleDateString()}
                    </p>
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

            {/* Export Button */}
            {isDetailsVisible && <button onClick={handleExport}>Export CSV</button>}
        </div>
    );
};

export default ManagerExport;
