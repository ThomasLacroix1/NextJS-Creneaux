"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateIntervenant, getIntervenantById } from "@/lib/data";

export default function EditIntervenant({ params }) {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        email: "",
        firstname: "",
        lastname: "",
        enddate: "",
    });
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (id) {
            const fetchIntervenant = async () => {
                try {
                    const intervenant = await getIntervenantById(id);
                    setFormData({
                        email: intervenant.email,
                        firstname: intervenant.firstname,
                        lastname: intervenant.lastname,
                        enddate: new Date(intervenant.enddate).toISOString().split("T")[0],
                    });
                } catch (error) {
                    setError("Les données de l'intervenant n'ont pas pu être récupérées.");
                }
            };
            fetchIntervenant();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateIntervenant(id, formData);
            router.push("/dashboard/intervenants");
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError("Cet e-mail est déjà utilisé. Veuillez utiliser un autre e-mail.");
            } else {
                setError("Une erreur inattendue s'est produite. Veuillez réessayer plus tard.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center mt-8">
            <h1 className="text-3xl font-bold mb-6">Modifier l'Intervenant</h1>
            <form className="w-full max-w-md" onSubmit={handleSubmit}>
                {error && (
                    <div className="mb-4 text-red-500 text-sm font-bold">
                        {error}
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstname">
                        Prénom
                    </label>
                    <input
                        type="text"
                        name="firstname"
                        id="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">
                        Nom
                    </label>
                    <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="enddate">
                        Date de Validité
                    </label>
                    <input
                        type="date"
                        name="enddate"
                        id="enddate"
                        value={formData.enddate}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Mettre à jour l'Intervenant
                    </button>
                </div>
            </form>
        </div>
    );
}
