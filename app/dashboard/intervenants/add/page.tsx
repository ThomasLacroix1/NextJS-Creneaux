"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createIntervenant } from "@/lib/data";

export default function AddIntervenant() {
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

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
      await createIntervenant(formData);
      router.push("/dashboard/intervenants");
    } catch (error) {
      setError("Erreur lors de la création de l'intervenant");
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-3xl font-bold mb-6">Ajouter un Nouvel Intervenant</h1>
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
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Ajouter Intervenant
          </button>
        </div>
      </form>
    </div>
  );
}