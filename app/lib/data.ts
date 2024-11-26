export async function fetchIntervenants() {
    const response = await fetch('/api/intervenants');
    if (!response.ok) {
        throw new Error('Failed to fetch intervenants');
    }
    const data = await response.json();
    return data;
}