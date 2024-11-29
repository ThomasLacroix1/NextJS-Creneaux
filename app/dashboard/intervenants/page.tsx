"use client";

import { useState, useEffect } from "react";
import {
  fetchIntervenants,
  countIntervenants,
  deleteIntervenant,
} from "@/lib/data";
import { useRouter } from "next/navigation"; // Importer le hook useRouter pour la navigation

interface Intervenant {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  key: string;
  creationdate: Date;
  enddate: Date;
}

const ITEMS_PER_PAGE = 12; // Nombre d'intervenants par page

export default function Intervenants() {
  const [intervenants, setIntervenants] = useState<Intervenant[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter(); // Utiliser useRouter pour la navigation

  useEffect(() => {
    const fetchData = async () => {
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      const data = await fetchIntervenants(offset, ITEMS_PER_PAGE);
      const total = await countIntervenants();
      setIntervenants(data);
      setTotalItems(total);
    };

    fetchData();
  }, [currentPage]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const isExpired = (endDate: Date) => {
    const today = new Date();
    return new Date(endDate) < today;
  };

  const handleDelete = async (id: number) => {
    await deleteIntervenant(id);
    setIntervenants((prevIntervenants) =>
      prevIntervenants.filter((intervenant) => intervenant.id !== id)
    );
    setTotalItems((prevTotal) => prevTotal - 1);
  };

  const handleAdd = () => {
    router.push("/dashboard/intervenants/add"); // Rediriger vers la page de création d'intervenant
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Intervenants</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Intervenant
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Firstname
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Lastname
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Key
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Creation Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              End Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {intervenants.map((intervenant) => (
            <tr
              key={intervenant.id}
              className={
                isExpired(intervenant.enddate)
                  ? "text-red-500"
                  : "text-gray-500"
              }
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {intervenant.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {intervenant.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {intervenant.firstname}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {intervenant.lastname}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {intervenant.key}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {new Date(intervenant.creationdate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {new Date(intervenant.enddate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  className="fill-red-500 hover:fill-red-700"
                  onClick={() => handleDelete(intervenant.id)}
                >
                  <svg
                    className="size-6"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 30 30"
                  >
                    <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
