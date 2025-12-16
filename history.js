// History Module
import { 
    getAllEntriesFromFirestore, 
    getEntryFromFirestore, 
    deleteEntryFromFirestore 
} from './firestore-service.js';
import { createEntryCard, showToast } from './ui-helpers.js';
import { toggleMatchFields } from './form-handlers.js';

let searchTimeout;
window.debouncedSearch = function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        loadHistory();
    }, 300);
};

// Load history with filters
export async function loadHistory() {
    const container = document.getElementById('entriesContainer');
    const filterRating = document.getElementById('filterRating')?.value || '';
    const dateRange = document.getElementById('dateRange')?.value || 'all';
    const sortBy = document.getElementById('sortBy')?.value || 'date-desc';
    const searchKeyword = document.getElementById('searchKeyword')?.value?.toLowerCase() || '';

    if (!container) return;

    try {
        const entries = await getAllEntriesFromFirestore();
        
        if (!entries || entries.length === 0) {
            container.innerHTML = '<div class="no-entries">📝 No entries yet. Start by creating your first journal entry!</div>';
            return;
        }

        // Filter entries
        let filtered = entries.filter(e => {
            if (filterRating && e.rating !== filterRating) return false;
            
            const entryDate = new Date(e.date);
            const now = new Date();
            
            if (dateRange === '7') {
                const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                if (entryDate < sevenDaysAgo) return false;
            } else if (dateRange === '30') {
                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                if (entryDate < thirtyDaysAgo) return false;
            } else if (dateRange === '90') {
                const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                if (entryDate < ninetyDaysAgo) return false;
            } else if (dateRange === 'month') {
                if (entryDate.getMonth() !== now.getMonth() || 
                    entryDate.getFullYear() !== now.getFullYear()) return false;
            } else if (dateRange === 'year') {
                if (entryDate.getFullYear() !== now.getFullYear()) return false;
            }
            
            if (searchKeyword) {
                const searchableText = `${e.sessionType} ${e.sessionDetails} ${e.preWorkoutMeal} ${e.notes} ${e.opponentName} ${e.matchSummary} ${e.oneThingToWorkOn}`.toLowerCase();
                if (!searchableText.includes(searchKeyword)) return false;
            }
            
            return true;
        });

        // Sort entries
        filtered.sort((a, b) => {
            if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
            if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
            if (sortBy === 'rating-desc') return parseInt(b.rating) - parseInt(a.rating);
            if (sortBy === 'rating-asc') return parseInt(a.rating) - parseInt(b.rating);
            if (sortBy === 'sleep-desc') return parseFloat(b.sleep || 0) - parseFloat(a.sleep || 0);
            if (sortBy === 'sleep-asc') return parseFloat(a.sleep || 0) - parseFloat(b.sleep || 0);
            return 0;
        });

        if (filtered.length === 0) {
            container.innerHTML = '<div class="no-entries">🔍 No entries match your filters.</div>';
            return;
        }

        container.innerHTML = filtered.map(entry => createEntryCard(entry)).join('');
    } catch (error) {
        container.innerHTML = '<div class="no-entries">❌ Error loading entries.</div>';
        console.error(error);
    }
}

window.loadHistory = loadHistory;

// Edit entry
export async function editEntry(key) {
    try {
        const data = await getEntryFromFirestore(key);
        if (!data || !data.value) {
            showToast('Entry not found', 'error');
            return;
        }
        
        const entry = JSON.parse(data.value);
        
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        
        const firstTab = document.querySelector('.tab:first-child');
        const journalView = document.getElementById('journal');
        
        if (firstTab) firstTab.classList.add('active');
        if (journalView) journalView.classList.add('active');
        
        // Populate form fields
        const fieldMap = {
            'entryDate': entry.date,
            'weatherCondition': entry.weather,
            'temperature': entry.temperature,
            'surface': entry.surface,
            'preWorkoutMeal': entry.preWorkoutMeal,
            'hydration': entry.hydration,
            'sleepHours': entry.sleep,
            'sessionType': entry.sessionType,
            'sessionTypeSelect': entry.sessionType,
            'sessionDetails': entry.sessionDetails,
            'sessionRating': entry.rating,
            'notes': entry.notes,
            'opponentName': entry.opponentName,
            'opponentLevel': entry.opponentLevel,
            'yourLevel': entry.yourLevel,
            'gameScores': entry.gameScores,
            'perfLengthWidth': entry.perfLengthWidth,
            'perfHeightPace': entry.perfHeightPace,
            'perfControlT': entry.perfControlT,
            'perfMovement': entry.perfMovement,
            'perfAttack': entry.perfAttack,
            'perfHittingToSpace': entry.perfHittingToSpace,
            'oppStrengths': entry.oppStrengths,
            'oppWeaknesses': entry.oppWeaknesses,
            'matchSummary': entry.matchSummary,
            'oneThingToWorkOn': entry.oneThingToWorkOn
        };
        
        Object.keys(fieldMap).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) field.value = fieldMap[fieldId] || '';
        });
        
        const editingKey = document.getElementById('editingKey');
        if (editingKey) editingKey.value = key;
        
        toggleMatchFields();
        
        const saveBtn = document.getElementById('saveBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        
        if (saveBtn) saveBtn.textContent = '💾 Update Entry';
        if (cancelBtn) cancelBtn.style.display = 'block';
        
        showToast('Editing entry...', 'success');
        window.scrollTo(0, 0);
    } catch (error) {
        showToast('Error loading entry', 'error');
        console.error(error);
    }
}

window.editEntry = editEntry;

// Delete entry
export async function deleteEntry(key) {
    if (confirm('Are you sure you want to delete this entry?')) {
        try {
            await deleteEntryFromFirestore(key);
            loadHistory();
            showToast('Entry deleted', 'success');
        } catch (error) {
            showToast('Error deleting entry', 'error');
            console.error(error);
        }
    }
}

window.deleteEntry = deleteEntry;