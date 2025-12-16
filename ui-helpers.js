// UI Helpers Module - FIXED EVENT HANDLERS

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

// Get rating badge HTML with color coding
function getRatingBadge(rating) {
    const ratingNum = parseInt(rating);
    let badgeClass = 'rating-badge';
    let stars = '★'.repeat(ratingNum);
    
    if (ratingNum >= 5) {
        badgeClass += ' excellent';
    } else if (ratingNum >= 4) {
        badgeClass += ' good';
    } else if (ratingNum >= 3) {
        badgeClass += ' average';
    } else {
        badgeClass += ' poor';
    }
    
    return `<span class="${badgeClass}">${stars} ${ratingNum}/5</span>`;
}

// Get session type badge with color coding
function getSessionTypeBadge(sessionType) {
    if (!sessionType) return '';
    
    let badgeClass = 'session-type-badge';
    
    if (sessionType === 'Match Day') {
        badgeClass += ' match';
    } else if (sessionType === 'Training') {
        badgeClass += ' training';
    } else if (sessionType === 'Recovery') {
        badgeClass += ' recovery';
    }
    
    return `<span class="${badgeClass}">${sessionType}</span>`;
}

// Get health indicator with color coding
function getHealthIndicator(value, type) {
    if (!value) return 'N/A';
    
    const numValue = parseFloat(value);
    let indicatorClass = 'health-indicator';
    let status = '';
    
    if (type === 'sleep') {
        if (numValue >= 7.5) {
            indicatorClass += ' good';
            status = 'Good';
        } else if (numValue >= 6) {
            indicatorClass += ' average';
            status = 'Fair';
        } else {
            indicatorClass += ' poor';
            status = 'Low';
        }
        return `<span class="${indicatorClass}">😴 ${value}h (${status})</span>`;
    } else if (type === 'hydration') {
        if (numValue >= 2.5) {
            indicatorClass += ' good';
            status = 'Good';
        } else if (numValue >= 1.5) {
            indicatorClass += ' average';
            status = 'Fair';
        } else {
            indicatorClass += ' poor';
            status = 'Low';
        }
        return `<span class="${indicatorClass}">💧 ${value}L (${status})</span>`;
    }
    
    return value;
}

// Create entry card HTML with enhanced styling - FIXED EVENT HANDLERS
export function createEntryCard(entry) {
    const date = new Date(entry.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    const weatherEmoji = {
        'sunny': '☀️',
        'cloudy': '☁️',
        'rainy': '🌧️',
        'snowy': '❄️',
        'indoor': '🏢'
    };
    
    const isMatch = entry.sessionType === 'Match Day';
    const matchBadge = isMatch ? `<div class="match-header">🎾 Match Day</div>` : '';
    
    // Enhanced quick info with color-coded badges
    let quickInfo = `<div class="entry-quick-info">`;
    quickInfo += `<div class="entry-quick-info-item">${getSessionTypeBadge(entry.sessionType)}</div>`;
    if (entry.sleep) {
        quickInfo += `<div class="entry-quick-info-item">${getHealthIndicator(entry.sleep, 'sleep')}</div>`;
    }
    if (entry.hydration) {
        quickInfo += `<div class="entry-quick-info-item">${getHealthIndicator(entry.hydration, 'hydration')}</div>`;
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
            <div class="detail-value stat">${entry.gameScores || 'N/A'}</div>
        </div>
        ${entry.opponentLevel ? `
        <div class="detail-item">
            <div class="detail-label">Opponent Level</div>
            <div class="detail-value stat">${entry.opponentLevel}</div>
        </div>` : ''}
        ${entry.yourLevel ? `
        <div class="detail-item">
            <div class="detail-label">Your Level</div>
            <div class="detail-value stat">${entry.yourLevel}</div>
        </div>` : ''}
    ` : '';
    
    return `
        <div class="entry-card" data-entry-key="${entry.key}">
            <div class="entry-card-header">
                <div class="entry-card-summary">
                    <div>
                        <div class="entry-date">${formattedDate}</div>
                        ${matchBadge}
                    </div>
                    ${getRatingBadge(entry.rating)}
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
                        <div class="detail-value stat">${entry.temperature ? entry.temperature + '°C' : 'N/A'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Sleep</div>
                        <div class="detail-value stat">${entry.sleep ? entry.sleep + ' hrs' : 'N/A'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Hydration</div>
                        <div class="detail-value stat">${entry.hydration ? entry.hydration + 'L' : 'N/A'}</div>
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
                    <button class="edit-btn">✏️ Edit</button>
                    <button class="delete-btn">🗑️ Delete</button>
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