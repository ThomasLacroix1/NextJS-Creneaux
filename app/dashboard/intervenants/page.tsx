"use client";

import { useState, useEffect } from "react";
import {
  fetchIntervenants,
  countIntervenants,
  deleteIntervenant,
  createIntervenantNewKey,
  regenerateKeysForIntervenants
} from "@/lib/data";
import Link from "next/link"; // Importer le composant Link de Next.js
import Button from "@/ui/button";

interface Intervenant {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  key: string;
  creationdate: Date;
  enddate: Date;
}

const ITEMS_PER_PAGE = 8; // Nombre d'intervenants par page

export default function Intervenants() {
  const [intervenants, setIntervenants] = useState<Intervenant[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

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
    try {
      await deleteIntervenant(id);
      setIntervenants((prevIntervenants) =>
        prevIntervenants.filter((intervenant) => intervenant.id !== id)
      );
      setTotalItems((prevTotal) => prevTotal - 1);
    } catch (error) {
      console.error("Failed to delete intervenant:", error);
    }
  };

  const handleRegenerate = async () => {
    try {
      await regenerateKeysForIntervenants();
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      const data = await fetchIntervenants(offset, ITEMS_PER_PAGE);
      setIntervenants(data);
    } catch (error) {
      console.error("Failed to regenerate keys:", error);
    }
  }

  const handleRegenerateOne = async (id) => {
    try {
      await createIntervenantNewKey(id);
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      const data = await fetchIntervenants(offset, ITEMS_PER_PAGE);
      setIntervenants(data);
    } catch (error) {
      console.error("Failed to regenerate the intervenant key:", error)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Intervenants</h1>
        <div className="flex flex-row gap-2">
          <Button variant="gray" onClick={handleRegenerate}>Regénérer les clés</Button>
          <Link
            href="/dashboard/intervenants/add"
          >
            <Button variant="red">Ajouter un intervenant</Button>
          </Link>
        </div>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
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
              <td className="px-6 py-4 whitespace-nowrap text-sm flex flex-row gap-1">
                <Link
                  href={'/dashboard/intervenants/' + intervenant.id}
                  className="fill-gray-700 hover:fill-gray-900"
                  title="Edit"
                >
                  <svg className="size-6" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24">
                    <path d="M 19.171875 2 C 18.448125 2 17.724375 2.275625 17.171875 2.828125 L 16 4 L 20 8 L 21.171875 6.828125 C 22.275875 5.724125 22.275875 3.933125 21.171875 2.828125 C 20.619375 2.275625 19.895625 2 19.171875 2 z M 14.5 5.5 L 3 17 L 3 21 L 7 21 L 18.5 9.5 L 14.5 5.5 z"></path>
                  </svg>
                </Link>
                <button
                  className="fill-gray-700 hover:fill-gray-900"
                  onClick={() => handleRegenerateOne(intervenant.id)}
                  title="Regenerate Key"
                >
                  <svg className="size-6" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                    <path d="M30.5,5C23.596,5,18,10.596,18,17.5c0,1.149,0.168,2.257,0.458,3.314L5.439,33.833C5.158,34.114,5,34.496,5,34.894V41.5	C5,42.328,5.671,43,6.5,43h7c0.829,0,1.5-0.672,1.5-1.5V39h3.5c0.829,0,1.5-0.672,1.5-1.5V34h3.5c0.829,0,1.5-0.672,1.5-1.5v-3.788	C26.661,29.529,28.524,30,30.5,30C37.404,30,43,24.404,43,17.5S37.404,5,30.5,5z M32,19c-1.657,0-3-1.343-3-3s1.343-3,3-3	s3,1.343,3,3S33.657,19,32,19z"></path>
                  </svg>
                </button>
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
