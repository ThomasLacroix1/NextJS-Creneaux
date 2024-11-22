'use server';

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { Intervenant } from '@/lib/definitions';

const prisma = new PrismaClient();

export async function fetchIntervenants(): Promise<Intervenant[]> {
    try {
        const intervenants = await prisma.intervenant.findMany();
        return intervenants;
    } catch (error) {
        console.error('Error fetching intervenants:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

export async function loadIntervenantsFromJson(): Promise<any> {
    try {
        const filePath = path.join(process.cwd(), '/data.json');
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const dataToInsert = [];

        for (const [name, schedules] of Object.entries(jsonData)) {
            for (const [key, value] of Object.entries(schedules as Record<string, unknown>)) {
                dataToInsert.push({
                    name,
                    scheduleType: key,
                    json: value
                });
            }
        }

        const result = await prisma.intervenants.createMany({
            data: dataToInsert,
            skipDuplicates: true
        });

        return result;
    } catch (error) {
        console.error('Error loading intervenants from JSON:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}