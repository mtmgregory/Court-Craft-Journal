// UI Helpers Module

// Show toast notification
export function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    if (type === 'error') {
        toast.style.background = '#dc3545';
    } else if (type === 'warning') {
        toast.style.background = '#ffc107';
        toast.style.color = '#000';
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

window.showToast = showToast;

// Create entry card HTML
export function createEntryCard(entry) {
    const date = new Date(entry.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    const stars = '⭐'.repeat(parseInt(entry.rating));
    const weatherEmoji = {
        'sunny': '☀️',
        'cloudy': '☁️',
        'rainy': '🌧️',
        'snowy': '❄️',
        'indoor': '🏢'
    };
    
    const isMatch = entry.sessionType === 'Match Day';
    const matchHeader = isMatch ? `<div class="match-header">🎾 Match Day</div>` : '';
    
    const matchDetails = isMatch && entry.opponentName ? `
        <div class="detail-item">
            <div class="detail-label">Opponent</div>
            <div class="detail-value">${entry.opponentName || 'N/A'}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Scores</div>
            <div class="detail-value">${entry.gameScores || 'N/A'}</div>
        </div>
    ` : '';
    
    return `
        <div class="entry-card">
            ${matchHeader}
            <div class="entry-header">
                <div class="entry-date">${formattedDate}</div>
                <div class="rating">${stars}</div>
            </div>
            <div class="entry-details">
                <div class="detail-item">
                    <div class="detail-label">Session Type</div>
                    <div class="detail-value">${entry.sessionType || 'N/A'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Weather</div>
                    <div class="detail-value">${weatherEmoji[entry.weather] || ''} ${entry.weather || 'N/A'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Temperature</div>
                    <div class="detail-value">${entry.temperature ? entry.temperature + '°C' : 'N/A'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Sleep</div>
                    <div class="detail-value">${entry.sleep ? entry.sleep + ' hrs' : 'N/A'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Hydration</div>
                    <div class="detail-value">${entry.hydration ? entry.hydration + 'L' : 'N/A'}</div>
                </div>
                ${matchDetails}
            </div>
            ${entry.sessionDetails ? `
                <div class="detail-item" style="margin-bottom: 10px;">
                    <div class="detail-label">Session Details</div>
                    <div class="detail-value">${entry.sessionDetails}</div>
                </div>
            ` : ''}
            ${entry.notes ? `
                <div class="detail-item" style="margin-bottom: 10px;">
                    <div class="detail-label">Notes</div>
                    <div class="detail-value">${entry.notes}</div>
                </div>
            ` : ''}
            ${entry.matchSummary ? `
                <div class="detail-item" style="margin-bottom: 10px;">
                    <div class="detail-label">Match Summary</div>
                    <div class="detail-value">${entry.matchSummary}</div>
                </div>
            ` : ''}
            ${entry.oneThingToWorkOn ? `
                <div class="detail-item" style="margin-bottom: 10px;">
                    <div class="detail-label">One Thing to Work On</div>
                    <div class="detail-value">${entry.oneThingToWorkOn}</div>
                </div>
            ` : ''}
            <div class="btn-group" style="margin-top: 15px;">
                <button class="edit-btn" onclick="editEntry('${entry.key}')">✏️ Edit</button>
                <button class="delete-btn" onclick="deleteEntry('${entry.key}')">🗑️ Delete</button>
            </div>
        </div>
    `;
}

// Initialize dark mode
export function initializeDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
}

// Toggle dark mode
window.toggleDarkMode = function() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
};