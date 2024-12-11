'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, notFound } from 'next/navigation';
import { getIntervenantByKey } from '@/lib/data';

export default function Availability() {
    const [intervenant, setIntervenant] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // État de chargement
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchIntervenant = async () => {
            const key = searchParams.get('key');
            if (key) {
                const intervenant = await getIntervenantByKey(key);
                setIntervenant(intervenant);
            }
            setIsLoading(false); // Fin du chargement
        };
        fetchIntervenant();
    }, [searchParams]);

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    if (!intervenant) {
        return notFound();
    }

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">
                Bonjour {intervenant.firstname} {intervenant.lastname}
            </h1>
        </div>
    );
}
