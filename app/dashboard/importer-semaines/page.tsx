use client';
import { useState } from 'react';
import { saveWorkweeks } from '@/lib/data';

export default function ImportWorkweeks() {
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [importedData, setImportedData] = useState(null);
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event: ProgressEvent<FileReader>) => {
            try {
                const result = event.target?.result as string;
                const parsedData = JSON.parse(result);
                if (!Array.isArray(parsedData)) {
                    throw new Error("Le fichier doit contenir un tableau.");
                }
                // Validate structure
                const isValid = parsedData.every(
                    (item) =>
                        item.intervenant &&
                        Array.isArray(item.workweek) &&
                        item.workweek.every(
                            (week) => typeof week.week === "number" && typeof week.hours === "number"
                        )
                );
                if (!isValid) {
                    throw new Error("Le format des données est invalide.");
                }
                setImportedData(parsedData);
                setError(null);
            } catch (err) {
                setError("Le fichier importé est invalide ou corrompu.");
                console.error(err);
            }
        };
        reader.readAsText(file);
    };
    const handleImport = async () => {
        if (!importedData) {
            setError("Aucune donnée à importer.");
            return;
        }
        try {
            await saveWorkweeks(importedData); // Sauvegarde via une API ou fonction backend.
            setSuccessMessage("Importation réussie !");
            setError(null);
            setImportedData(null);
        } catch (err) {
            setError("Une erreur est survenue lors de l'importation.");
            console.error(err);
        }
    };
    return (
        <div className="mx-auto p-6 bg-gray-50">
            <h1 className="text-center text-3xl font-bold mb-6 text-gray-700">Importer les Semaines de Travail</h1>
            <div className="text-center">
                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="block mx-auto mb-4"
                />
                {importedData && (
                    <button
                        onClick={handleImport}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                        Importer les Données
                    </button>
                )}
                {error && <p className="text-red-500 mt-4">{error}</p>}
                {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
            </div>
            {importedData && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Données importées :</h2>
                    <pre className="bg-gray-400 p-4 rounded-lg text-sm overflow-auto max-h-96">
                        {JSON.stringify(importedData, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}