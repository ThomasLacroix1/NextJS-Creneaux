import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function fetchIntervenants() {
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

export async function loadIntervenantsFromJson() {
    try {
        const filePath = path.join(process.cwd(), '/data.json');
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const dataToInsert = [];

        for (const [name, schedules] of Object.entries(jsonData)) {
            for (const [key, value] of Object.entries(schedules)) {
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