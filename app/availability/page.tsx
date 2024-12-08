'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, notFound } from 'next/navigation';
import { getIntervenantByKey } from '@/lib/data';

export default function Availability() {
    const [intervenant, setIntervenant] = useState(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchIntervenant = async () => {
            const key = searchParams.get('key');
            if (key) {
                intervenant = await getIntervenantByKey(key);
                setIntervenant(intervenant);
            }
        };
        fetchIntervenant();
    }, [searchParams]);

    return (
        <div className="flex flex-col gap-2">
            {intervenant ? (
                console.log(intervenant),
                <h1 className="text-3xl font-bold">
                    Bonjour {intervenant.firstname} {intervenant.lastname}
                </h1>
            ) : notFound()
            }
        </div>
    );
}