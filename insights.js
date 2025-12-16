// Insights Module
import { getAllEntriesFromFirestore } from './firestore-service.js';

// Load insights
export async function loadInsights() {
    const statsGrid = document.getElementById('statsGrid');
    const insightsContainer = document.getElementById('insightsContainer');

    if (!statsGrid || !insightsContainer) return;

    try {
        const entries = await getAllEntriesFromFirestore();
        
        if (!entries || entries.length === 0) {
            insightsContainer.innerHTML = '<div class="no-entries">📊 No data yet. Add some entries to see insights!</div>';
            statsGrid.innerHTML = '';
            return;
        }

        const avgRating = (entries.reduce((sum, e) => sum + parseInt(e.rating), 0) / entries.length).toFixed(1);
        const entriesWithSleep = entries.filter(e => e.sleep);
        const avgSleep = entriesWithSleep.length > 0 
            ? (entriesWithSleep.reduce((sum, e) => sum + parseFloat(e.sleep), 0) / entriesWithSleep.length).toFixed(1)
            : 'N/A';
        
        const entriesWithHydration = entries.filter(e => e.hydration);
        const avgHydration = entriesWithHydration.length > 0
            ? (entriesWithHydration.reduce((sum, e) => sum + parseFloat(e.hydration), 0) / entriesWithHydration.length).toFixed(1)
            : 'N/A';
        
        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${entries.length}</div>
                <div class="stat-label">Total Sessions</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${avgRating}</div>
                <div class="stat-label">Average Rating</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${avgSleep}</div>
                <div class="stat-label">Avg Sleep (hrs)</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${avgHydration}</div>
                <div class="stat-label">Avg Hydration (L)</div>
            </div>
        `;

        const goodSessions = entries.filter(e => parseInt(e.rating) >= 4);
        const poorSessions = entries.filter(e => parseInt(e.rating) <= 2);

        let insights = '<div class="insight-section"><h3>🌟 What Makes Great Sessions</h3><ul class="insight-list">';
        
        if (goodSessions.length > 0) {
            const goodWithSleep = goodSessions.filter(e => e.sleep);
            const goodWithHydration = goodSessions.filter(e => e.hydration);
            
            const avgGoodSleep = goodWithSleep.length > 0
                ? goodWithSleep.reduce((sum, e) => sum + parseFloat(e.sleep), 0) / goodWithSleep.length
                : 0;
            
            const avgGoodHydration = goodWithHydration.length > 0
                ? goodWithHydration.reduce((sum, e) => sum + parseFloat(e.hydration), 0) / goodWithHydration.length
                : 0;
  
            if (!isNaN(avgGoodSleep) && avgGoodSleep > 0) {
                insights += `<li>⭐ Your best sessions averaged <strong>${avgGoodSleep.toFixed(1)} hours</strong> of sleep</li>`;
            }
            
            if (!isNaN(avgGoodHydration) && avgGoodHydration > 0) {
                insights += `<li>💧 Top performers drank about <strong>${avgGoodHydration.toFixed(1)}L</strong> of water</li>`;
            }
            
            const goodWeather = {};
            goodSessions.forEach(e => {
                if (e.weather) {
                    goodWeather[e.weather] = (goodWeather[e.weather] || 0) + 1;
                }
            });
            
            if (Object.keys(goodWeather).length > 0) {
                const topWeather = Object.keys(goodWeather).sort((a, b) => goodWeather[b] - goodWeather[a])[0];
                insights += `<li>☀️ You performed best in <strong>${topWeather}</strong> conditions</li>`;
            }
        } else {
            insights += '<li>Keep logging sessions to discover patterns!</li>';
        }
        
        insights += '</ul></div>';

        insights += '<div class="insight-section"><h3>⚠️ Factors in Poor Sessions</h3><ul class="insight-list">';
        
        if (poorSessions.length > 0) {
            const poorWithSleep = poorSessions.filter(e => e.sleep);
            const poorWithHydration = poorSessions.filter(e => e.hydration);
            const goodWithSleep = goodSessions.filter(e => e.sleep);
            
            const avgPoorSleep = poorWithSleep.length > 0
                ? poorWithSleep.reduce((sum, e) => sum + parseFloat(e.sleep), 0) / poorWithSleep.length
                : 0;
            
            const avgPoorHydration = poorWithHydration.length > 0
                ? poorWithHydration.reduce((sum, e) => sum + parseFloat(e.hydration), 0) / poorWithHydration.length
                : 0;
            
            const avgGoodSleep = goodWithSleep.length > 0
                ? goodWithSleep.reduce((sum, e) => sum + parseFloat(e.sleep), 0) / goodWithSleep.length
                : 0;
            
            if (!isNaN(avgPoorSleep) && avgPoorSleep > 0) {
                insights += `<li>😴 Poor sessions averaged only <strong>${avgPoorSleep.toFixed(1)} hours</strong> of sleep</li>`;
            }
            
            if (!isNaN(avgPoorHydration) && avgPoorHydration > 0) {
                insights += `<li>💧 Low performers drank about <strong>${avgPoorHydration.toFixed(1)}L</strong> of water</li>`;
            }
            
            if (!isNaN(avgGoodSleep) && !isNaN(avgPoorSleep) && avgGoodSleep > 0 && avgPoorSleep > 0 && avgGoodSleep - avgPoorSleep > 1) {
                insights += `<li>🎯 <strong>Key Finding:</strong> ${(avgGoodSleep - avgPoorSleep).toFixed(1)} more hours of sleep is linked to better performance!</li>`;
            }
        } else {
            insights += '<li>Great job! No poor sessions recorded yet.</li>';
        }
        
        insights += '</ul></div>';

        insightsContainer.innerHTML = insights;
    } catch (error) {
        insightsContainer.innerHTML = '<div class="no-entries">❌ Error loading insights.</div>';
        console.error(error);
    }
}

window.loadInsights = loadInsights;