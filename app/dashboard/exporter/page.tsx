'use client';

import { useState } from 'react';
import { getIntervenantsForExport } from '@/lib/data';

export default function ExportAvailability() {
    const [error, setError] = useState(null);
    const [exportedData, setExportedData] = useState(null);

    const handleExport = async () => {
        setError(null);

        try {
            const intervenants = await getIntervenantsForExport();
            const formattedData = formatIntervenantsData(intervenants);
            setExportedData(formattedData);
        } catch (err) {
            setError('Une erreur est survenue lors de l’exportation. Veuillez réessayer.');
            console.error(err);
        }
    };

    const formatIntervenantsData = (data) => {
        const result = {};

        data.forEach((intervenant) => {
            result[`${intervenant.firstname} ${intervenant.lastname}`] = intervenant.availability;
        });
        return result;
    };

    const downloadJSON = (content, filename) => {
        const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="mx-auto p-6 bg-gray-50">
            <h1 className="text-center text-3xl font-bold mb-6 text-gray-700">Exporter les Disponibilités</h1>

            <div className="text-center">
                <button
                    onClick={handleExport}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    Exporter les Disponibilités
                </button>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>

            {exportedData && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Données exportées :</h2>
                    <pre className="bg-gray-400 p-4 rounded-lg text-sm overflow-auto max-h-96">{JSON.stringify(exportedData, null, 2)}</pre>
                    <button
                        onClick={() => downloadJSON(exportedData, 'disponibilites_intervenants.json')}
                        className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                        Télécharger le JSON
                    </button>
                </div>
            )}
        </div>
    );
}
