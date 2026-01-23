
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LOG_FILE_PATH = path.join(process.cwd(), 'data', 'logs.json');

// Helper to ensure data directory exists and read logs
const getLogs = () => {
    try {
        if (!fs.existsSync(LOG_FILE_PATH)) {
            return [];
        }
        const fileContent = fs.readFileSync(LOG_FILE_PATH, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading logs:', error);
        return [];
    }
};

export async function GET() {
    const logs = getLogs();
    return NextResponse.json(logs);
}

export async function POST(request) {
    try {
        const body = await request.json();
        const logs = getLogs();

        const newLog = {
            ...body,
            timestamp: new Date().toISOString(),
            id: Date.now().toString()
        };

        logs.unshift(newLog); // Add new log to the beginning

        // Ensure directory exists
        const dir = path.dirname(LOG_FILE_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logs, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving log:', error);
        return NextResponse.json({ success: false, error: 'Failed to save log' }, { status: 500 });
    }
}
