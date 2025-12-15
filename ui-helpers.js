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
    const matchBadge = isMatch ? `<div class="match-header">🎾 Match Day</div>` : '';
    
    // Quick info for collapsed view
    let quickInfo = `<div class="entry-quick-info">`;
    quickInfo += `<div class="entry-quick-info-item"><strong>${entry.sessionType || 'Session'}</strong></div>`;
    if (entry.sleep) {
        quickInfo += `<div class="entry-quick-info-item">😴 <strong>${entry.sleep}h</strong> sleep</div>`;
    }
    if (entry.hydration) {
        quickInfo += `<div class="entry-quick-info-item">💧 <strong>${entry.hydration}L</strong></div>`;
    }
    if (isMatch && entry.opponentName) {
        quickInfo += `<div class="entry-quick-info-item">vs <strong>${entry.opponentName}</strong></div>`;
    }
    quickInfo += `</div>`;
    
    const matchDetails = isMatch && entry.opponentName ? `
        <div class="detail-item">
            <div class="detail-label">Opponent</div>
            <div class="detail-value">${entry.opponentName || 'N/A'}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Scores</div>
            <div class="detail-value">${entry.gameScores || 'N/A'}</div>
        </div>
        ${entry.opponentLevel ? `
        <div class="detail-item">
            <div class="detail-label">Opponent Level</div>
            <div class="detail-value">${entry.opponentLevel}</div>
        </div>` : ''}
        ${entry.yourLevel ? `
        <div class="detail-item">
            <div class="detail-label">Your Level</div>
            <div class="detail-value">${entry.yourLevel}</div>
        </div>` : ''}
    ` : '';
    
    return `
        <div class="entry-card" data-entry-key="${entry.key}">
            <div class="entry-card-header" onclick="toggleEntryExpand('${entry.key}')">
                <div class="entry-card-summary">
                    <div>
                        <div class="entry-date">${formattedDate}</div>
                        ${matchBadge}
                    </div>
                    <div class="rating">${stars}</div>
                    ${quickInfo}
                </div>
                <div class="expand-toggle"></div>
            </div>
            
            <div class="entry-card-body">
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
                ${entry.perfLengthWidth ? `
                    <div class="detail-item" style="margin-bottom: 10px;">
                        <div class="detail-label">Length and Width</div>
                        <div class="detail-value">${entry.perfLengthWidth}</div>
                    </div>
                ` : ''}
                ${entry.perfHeightPace ? `
                    <div class="detail-item" style="margin-bottom: 10px;">
                        <div class="detail-label">Height and Pace</div>
                        <div class="detail-value">${entry.perfHeightPace}</div>
                    </div>
                ` : ''}
                ${entry.perfControlT ? `
                    <div class="detail-item" style="margin-bottom: 10px;">
                        <div class="detail-label">Control and T Position</div>
                        <div class="detail-value">${entry.perfControlT}</div>
                    </div>
                ` : ''}
                ${entry.perfMovement ? `
                    <div class="detail-item" style="margin-bottom: 10px;">
                        <div class="detail-label">Movement</div>
                        <div class="detail-value">${entry.perfMovement}</div>
                    </div>
                ` : ''}
                ${entry.perfAttack ? `
                    <div class="detail-item" style="margin-bottom: 10px;">
                        <div class="detail-label">Attack</div>
                        <div class="detail-value">${entry.perfAttack}</div>
                    </div>
                ` : ''}
                ${entry.perfHittingToSpace ? `
                    <div class="detail-item" style="margin-bottom: 10px;">
                        <div class="detail-label">Hitting to Space</div>
                        <div class="detail-value">${entry.perfHittingToSpace}</div>
                    </div>
                ` : ''}
                ${entry.oppStrengths ? `
                    <div class="detail-item" style="margin-bottom: 10px;">
                        <div class="detail-label">Opponent's Strengths</div>
                        <div class="detail-value">${entry.oppStrengths}</div>
                    </div>
                ` : ''}
                ${entry.oppWeaknesses ? `
                    <div class="detail-item" style="margin-bottom: 10px;">
                        <div class="detail-label">Opponent's Weaknesses</div>
                        <div class="detail-value">${entry.oppWeaknesses}</div>
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
        </div>
    `;
}

// Toggle entry expansion
window.toggleEntryExpand = function(key) {
    const card = document.querySelector(`[data-entry-key="${key}"]`);
    if (card) {
        card.classList.toggle('expanded');
    }
};

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