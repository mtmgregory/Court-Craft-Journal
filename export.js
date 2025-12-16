// Export Module
import { getAllEntriesFromFirestore, getEntryFromFirestore } from './firestore-service.js';
import { showToast } from './ui-helpers.js';

// Export to CSV
export async function exportToCSV() {
    try {
        const entries = await getAllEntriesFromFirestore();
        
        if (!entries || entries.length === 0) {
            showToast('No entries to export', 'error');
            return;
        }

        entries.sort((a, b) => new Date(a.date) - new Date(b.date));

        const headers = [
            'Date', 'Weather', 'Temperature (°C)', 'Surface', 'Pre-Workout Meal', 
            'Hydration (L)', 'Sleep (hrs)', 'Session Type', 'Rating', 
            'Opponent Name', 'Opponent Level', 'Your Level', 'Game Scores',
            'Performance - Length and Width', 'Performance - Height and Pace', 
            'Performance - Control and T Position', 'Performance - Movement', 
            'Performance - Attack', 'Performance - Hitting to Space',
            'Opponent - Strengths', 'Opponent - Weaknesses', 
            'Summary and Comments', 'One Thing to Work On',
            'Session Details', 'Notes' 
        ];
        
        const csvRows = [headers.join(',')];
        const escape = (text) => `"${(text || '').toString().replace(/"/g, '""')}"`;
        
        entries.forEach(entry => {
            const row = [
                entry.date,
                entry.weather,
                entry.temperature,
                escape(entry.surface),
                escape(entry.preWorkoutMeal),
                entry.hydration,
                entry.sleep,
                escape(entry.sessionType),
                entry.rating,
                escape(entry.opponentName),
                escape(entry.opponentLevel),
                escape(entry.yourLevel),
                escape(entry.gameScores),
                escape(entry.perfLengthWidth),
                escape(entry.perfHeightPace),
                escape(entry.perfControlT),
                escape(entry.perfMovement),
                escape(entry.perfAttack),
                escape(entry.perfHittingToSpace),
                escape(entry.oppStrengths),
                escape(entry.oppWeaknesses),
                escape(entry.matchSummary),
                escape(entry.oneThingToWorkOn),
                escape(entry.sessionDetails),
                escape(entry.notes)
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sports-journal-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showToast('📊 CSV exported successfully!', 'success');
    } catch (error) {
        showToast('Error exporting CSV', 'error');
        console.error(error);
    }
}

window.exportToCSV = exportToCSV;

window.exportToCSV = exportToCSV;