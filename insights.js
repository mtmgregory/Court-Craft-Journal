// Enhanced Insights Module - WITH COMPREHENSIVE PERFORMANCE ANALYSIS
import { getAllEntriesFromFirestore } from './firestore-service.js';

// Load insights with comprehensive analysis
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

        // Generate comprehensive statistics
        const stats = calculateStatistics(entries);
        
        // Render stats grid
        statsGrid.innerHTML = renderStatsGrid(stats);
        
        // Generate insights sections
        const insights = generateInsights(entries, stats);
        insightsContainer.innerHTML = insights;
        
    } catch (error) {
        insightsContainer.innerHTML = '<div class="no-entries">❌ Error loading insights.</div>';
        console.error(error);
    }
}

// Calculate comprehensive statistics
function calculateStatistics(entries) {
    const stats = {
        totalSessions: entries.length,
        matchSessions: entries.filter(e => e.sessionType === 'Match Day').length,
        trainingSessions: entries.filter(e => e.sessionType === 'Training').length,
        recoverySessions: entries.filter(e => e.sessionType === 'Recovery').length,
    };
    
    // Rating statistics
    const ratings = entries.map(e => parseInt(e.rating)).filter(r => !isNaN(r));
    stats.avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0;
    stats.highRatingSessions = entries.filter(e => parseInt(e.rating) >= 4).length;
    stats.lowRatingSessions = entries.filter(e => parseInt(e.rating) <= 2).length;
    
    // Sleep statistics
    const sleepData = entries.filter(e => e.sleep).map(e => parseFloat(e.sleep));
    stats.avgSleep = sleepData.length > 0 ? (sleepData.reduce((a, b) => a + b, 0) / sleepData.length).toFixed(1) : 'N/A';
    stats.optimalSleepSessions = sleepData.filter(s => s >= 7.5).length;
    
    // Hydration statistics
    const hydrationData = entries.filter(e => e.hydration).map(e => parseFloat(e.hydration));
    stats.avgHydration = hydrationData.length > 0 ? (hydrationData.reduce((a, b) => a + b, 0) / hydrationData.length).toFixed(1) : 'N/A';
    
    // Recent trend (last 7 entries vs previous 7)
    if (entries.length >= 14) {
        const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
        const recent = sorted.slice(0, 7).map(e => parseInt(e.rating));
        const previous = sorted.slice(7, 14).map(e => parseInt(e.rating));
        const recentAvg = recent.reduce((a, b) => a + b, 0) / 7;
        const previousAvg = previous.reduce((a, b) => a + b, 0) / 7;
        stats.trend = recentAvg > previousAvg ? 'improving' : recentAvg < previousAvg ? 'declining' : 'stable';
        stats.trendDiff = (recentAvg - previousAvg).toFixed(1);
    } else {
        stats.trend = 'insufficient_data';
    }
    
    return stats;
}

// Render statistics grid
function renderStatsGrid(stats) {
    const trendIcon = stats.trend === 'improving' ? '📈' : stats.trend === 'declining' ? '📉' : '➡️';
    const trendClass = stats.trend === 'improving' ? 'success' : stats.trend === 'declining' ? 'danger' : 'info';
    
    return `
        <div class="stat-card">
            <div class="stat-value">${stats.totalSessions}</div>
            <div class="stat-label">Total Sessions</div>
        </div>
        <div class="stat-card ${trendClass}">
            <div class="stat-value">${stats.avgRating}</div>
            <div class="stat-label">Avg Rating ${trendIcon}</div>
        </div>
        <div class="stat-card warning">
            <div class="stat-value">${stats.avgSleep}</div>
            <div class="stat-label">Avg Sleep (hrs)</div>
        </div>
        <div class="stat-card info">
            <div class="stat-value">${stats.matchSessions}</div>
            <div class="stat-label">Match Sessions</div>
        </div>
    `;
}

// Generate comprehensive insights
function generateInsights(entries, stats) {
    let html = '';
    
    // Performance Trend Analysis
    if (stats.trend !== 'insufficient_data') {
        html += `<div class="insight-section">
            <h3>📊 Performance Trend</h3>
            <ul class="insight-list">`;
        
        if (stats.trend === 'improving') {
            html += `<li>🎉 <strong>Great news!</strong> Your performance is improving! Your recent sessions are averaging <strong>${stats.trendDiff}</strong> points higher than before.</li>`;
        } else if (stats.trend === 'declining') {
            html += `<li>⚠️ Your recent performance has dipped by <strong>${Math.abs(stats.trendDiff)}</strong> points. Review your recovery and preparation.</li>`;
        } else {
            html += `<li>➡️ Your performance has been <strong>consistent</strong> lately. Consider pushing yourself with new challenges.</li>`;
        }
        
        html += `</ul></div>`;
    }
    
    // ENHANCED: Detailed Performance Analysis (NEW)
    const matchEntries = entries.filter(e => e.sessionType === 'Match Day');
    if (matchEntries.length >= 2) {
        html += analyzePerformanceCategories(matchEntries);
    }
    
    // Optimal Conditions Analysis
    html += analyzeOptimalConditions(entries);
    
    // Recovery & Preparation Insights
    html += analyzeRecoveryFactors(entries, stats);
    
    // Match Performance Analysis (Basic)
    if (matchEntries.length >= 3) {
        html += analyzeMatchPerformance(matchEntries);
    }
    
    // Areas for Improvement
    html += identifyImprovementAreas(entries);
    
    // Actionable Recommendations
    html += generateRecommendations(entries, stats);
    
    return html;
}

// NEW: Comprehensive Performance Analysis Section
function analyzePerformanceCategories(matchEntries) {
    if (matchEntries.length < 2) {
        return '<div class="insight-section"><h3>🎯 Performance Analysis</h3><ul class="insight-list"><li>Record at least 2 matches with performance ratings to see detailed analysis!</li></ul></div>';
    }
    
    let html = '<div class="insight-section"><h3>🎯 Detailed Performance Analysis</h3><ul class="insight-list">';
    
    const performanceCategories = [
        { field: 'perfLengthWidth', ratingField: 'perfLengthWidthRating', name: 'Length and Width', icon: '📏' },
        { field: 'perfHeightPace', ratingField: 'perfHeightPaceRating', name: 'Height and Pace', icon: '⬆️' },
        { field: 'perfControlT', ratingField: 'perfControlTRating', name: 'Court Control & T Position', icon: '🎯' },
        { field: 'perfMovement', ratingField: 'perfMovementRating', name: 'Movement', icon: '🏃' },
        { field: 'perfAttack', ratingField: 'perfAttackRating', name: 'Attack', icon: '⚡' },
        { field: 'perfHittingToSpace', ratingField: 'perfHittingToSpaceRating', name: 'Hitting to Space', icon: '🎲' },
    ];
    
    // Calculate detailed stats for each category
    const categoryStats = [];
    performanceCategories.forEach(cat => {
        const ratingsForCategory = matchEntries
            .filter(e => e[cat.ratingField] && !isNaN(parseInt(e[cat.ratingField])))
            .map(e => ({
                rating: parseInt(e[cat.ratingField]),
                date: new Date(e.date)
            }));
        
        if (ratingsForCategory.length >= 2) {
            const ratings = ratingsForCategory.map(r => r.rating);
            const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
            const max = Math.max(...ratings);
            const min = Math.min(...ratings);
            const variance = calculateVariance(ratings);
            
            // Calculate trend (recent vs older)
            const sortedByDate = ratingsForCategory.sort((a, b) => b.date - a.date);
            const halfPoint = Math.floor(sortedByDate.length / 2);
            const recentHalf = sortedByDate.slice(0, halfPoint).map(r => r.rating);
            const olderHalf = sortedByDate.slice(halfPoint).map(r => r.rating);
            
            const recentAvg = recentHalf.reduce((a, b) => a + b, 0) / recentHalf.length;
            const olderAvg = olderHalf.reduce((a, b) => a + b, 0) / olderHalf.length;
            const trend = recentAvg - olderAvg;
            
            categoryStats.push({
                ...cat,
                avg,
                max,
                min,
                variance,
                trend,
                count: ratingsForCategory.length,
                consistency: variance < 1.5 ? 'high' : variance < 2.5 ? 'moderate' : 'low'
            });
        }
    });
    
    if (categoryStats.length === 0) {
        html += '<li>📊 Start rating your performance categories to unlock detailed insights!</li>';
        html += '</ul></div>';
        return html;
    }
    
    // Sort by average (highest to lowest)
    categoryStats.sort((a, b) => b.avg - a.avg);
    
    // 1. OVERALL PERFORMANCE SUMMARY
    const overallAvg = categoryStats.reduce((sum, cat) => sum + cat.avg, 0) / categoryStats.length;
    let performanceLevel = '';
    if (overallAvg >= 8) performanceLevel = 'Elite level! 🏆';
    else if (overallAvg >= 7) performanceLevel = 'Advanced level 💪';
    else if (overallAvg >= 6) performanceLevel = 'Solid intermediate level 👍';
    else if (overallAvg >= 5) performanceLevel = 'Developing well 📈';
    else performanceLevel = 'Building foundations 🔨';
    
    html += `<li><strong>Overall Performance:</strong> ${overallAvg.toFixed(1)}/10 - ${performanceLevel}</li>`;
    
    // 2. STRONGEST AREAS (Top 2)
    const topAreas = categoryStats.slice(0, Math.min(2, categoryStats.length));
    html += `<li>${topAreas[0].icon} <strong>Your Strength:</strong> ${topAreas[0].name} (${topAreas[0].avg.toFixed(1)}/10 avg)`;
    if (topAreas[0].consistency === 'high') {
        html += ` - Consistently excellent! 🎯`;
    }
    html += `</li>`;
    
    if (topAreas.length > 1) {
        html += `<li>${topAreas[1].icon} <strong>Secondary Strength:</strong> ${topAreas[1].name} (${topAreas[1].avg.toFixed(1)}/10 avg)</li>`;
    }
    
    // 3. AREAS NEEDING ATTENTION (Bottom 2)
    const weakAreas = categoryStats.slice(-Math.min(2, categoryStats.length)).reverse();
    if (weakAreas[0].avg < 6) {
        html += `<li>⚠️ <strong>Priority Focus Area:</strong> ${weakAreas[0].name} (${weakAreas[0].avg.toFixed(1)}/10 avg)`;
        if (weakAreas[0].consistency === 'low') {
            html += ` - Inconsistent performance, needs structured practice`;
        } else {
            html += ` - Consistently below target, consider technical coaching`;
        }
        html += `</li>`;
    }
    
    if (weakAreas.length > 1 && weakAreas[1].avg < 7) {
        html += `<li>🎯 <strong>Secondary Focus:</strong> ${weakAreas[1].name} (${weakAreas[1].avg.toFixed(1)}/10 avg)</li>`;
    }
    
    // 4. BIGGEST IMPROVEMENTS
    const improving = categoryStats.filter(cat => cat.trend > 0.5).sort((a, b) => b.trend - a.trend);
    if (improving.length > 0) {
        html += `<li>📈 <strong>Most Improved:</strong> ${improving[0].name} (+${improving[0].trend.toFixed(1)} points recently!) - Keep up the great work! 🎉</li>`;
    }
    
    // 5. DECLINING AREAS (needs attention)
    const declining = categoryStats.filter(cat => cat.trend < -0.5).sort((a, b) => a.trend - b.trend);
    if (declining.length > 0) {
        html += `<li>📉 <strong>Needs Attention:</strong> ${declining[0].name} (${declining[0].trend.toFixed(1)} points decline) - Review recent matches to identify what changed</li>`;
    }
    
    // 6. CONSISTENCY ANALYSIS
    const inconsistent = categoryStats.filter(cat => cat.consistency === 'low');
    if (inconsistent.length > 0) {
        html += `<li>🎲 <strong>Inconsistency Alert:</strong> ${inconsistent.map(c => c.name).join(', ')} show high variance. Focus on building reliable patterns in these areas.</li>`;
    }
    
    const veryConsistent = categoryStats.filter(cat => cat.consistency === 'high' && cat.avg >= 7);
    if (veryConsistent.length > 0) {
        html += `<li>✅ <strong>Rock Solid:</strong> ${veryConsistent.map(c => c.name).join(', ')} - Consistently strong performance! 💎</li>`;
    }
    
    // 7. PERFORMANCE GAPS (largest difference between best and worst)
    const performanceGap = categoryStats[0].avg - categoryStats[categoryStats.length - 1].avg;
    if (performanceGap > 3) {
        html += `<li>⚖️ <strong>Performance Gap:</strong> ${performanceGap.toFixed(1)} points between your best and weakest areas. Balancing your game will unlock the next level.</li>`;
    } else if (performanceGap < 2) {
        html += `<li>🎯 <strong>Well-Rounded Game:</strong> Your skills are balanced across all areas (${performanceGap.toFixed(1)} point range). This is a huge advantage!</li>`;
    }
    
    // 8. SPECIFIC RECOMMENDATIONS based on data
    html += generatePerformanceRecommendations(categoryStats);
    
    html += '</ul></div>';
    return html;
}

// Generate specific recommendations based on performance data
function generatePerformanceRecommendations(categoryStats) {
    let html = '';
    
    // Find the weakest and most inconsistent areas
    const weakest = categoryStats[categoryStats.length - 1];
    const mostInconsistent = [...categoryStats].sort((a, b) => b.variance - a.variance)[0];
    
    // Recommendation 1: Focus on weakest area
    if (weakest.avg < 6) {
        html += `<li>💡 <strong>Action Plan:</strong> Dedicate 15-20 minutes each training session specifically to ${weakest.name}. `;
        
        // Specific drills based on category
        if (weakest.name.includes('Length and Width')) {
            html += 'Practice target hitting drills to the back corners and work on straight drives.';
        } else if (weakest.name.includes('Height and Pace')) {
            html += 'Focus on lob drills and varying shot pace during solo practice.';
        } else if (weakest.name.includes('Control')) {
            html += 'Work on T-position recovery after every shot and practice ghosting drills.';
        } else if (weakest.name.includes('Movement')) {
            html += 'Incorporate footwork ladders and court sprints into your warmup.';
        } else if (weakest.name.includes('Attack')) {
            html += 'Practice volley drills and work on recognizing attacking opportunities.';
        } else if (weakest.name.includes('Space')) {
            html += 'Play conditioned games focusing on hitting away from opponent position.';
        }
        html += '</li>';
    }
    
    // Recommendation 2: Build consistency in inconsistent areas
    if (mostInconsistent.consistency === 'low') {
        html += `<li>🎯 <strong>Consistency Goal:</strong> ${mostInconsistent.name} shows high variability. Set a goal to rate this 7+ in your next 3 matches by focusing on fundamentals over flashy play.</li>`;
    }
    
    // Recommendation 3: Leverage strengths
    const topStrength = categoryStats[0];
    if (topStrength.avg >= 7.5) {
        html += `<li>💪 <strong>Leverage Your Strength:</strong> Your ${topStrength.name} is excellent. Build your match tactics around this strength while opponents adjust.</li>`;
    }
    
    return html;
}

// Analyze optimal conditions for performance
function analyzeOptimalConditions(entries) {
    const goodSessions = entries.filter(e => parseInt(e.rating) >= 4);
    
    if (goodSessions.length < 3) {
        return '<div class="insight-section"><h3>🌟 Optimal Conditions</h3><ul class="insight-list"><li>Keep logging sessions to discover your optimal conditions!</li></ul></div>';
    }
    
    let html = '<div class="insight-section"><h3>🌟 What Makes Great Sessions</h3><ul class="insight-list">';
    
    // Sleep analysis
    const goodWithSleep = goodSessions.filter(e => e.sleep);
    if (goodWithSleep.length >= 3) {
        const avgGoodSleep = goodWithSleep.reduce((sum, e) => sum + parseFloat(e.sleep), 0) / goodWithSleep.length;
        const poorWithSleep = entries.filter(e => parseInt(e.rating) <= 2 && e.sleep);
        
        if (poorWithSleep.length >= 2) {
            const avgPoorSleep = poorWithSleep.reduce((sum, e) => sum + parseFloat(e.sleep), 0) / poorWithSleep.length;
            const sleepDiff = avgGoodSleep - avgPoorSleep;
            
            if (sleepDiff > 1) {
                html += `<li>😴 <strong>Sleep is critical!</strong> Your best sessions followed <strong>${avgGoodSleep.toFixed(1)} hours</strong> of sleep (${sleepDiff.toFixed(1)} hours more than poor sessions)</li>`;
            }
        } else {
            html += `<li>⭐ Your top sessions averaged <strong>${avgGoodSleep.toFixed(1)} hours</strong> of sleep</li>`;
        }
    }
    
    // Weather patterns
    const weatherCount = {};
    goodSessions.forEach(e => {
        if (e.weather) {
            weatherCount[e.weather] = (weatherCount[e.weather] || 0) + 1;
        }
    });
    
    if (Object.keys(weatherCount).length > 0) {
        const topWeather = Object.entries(weatherCount).sort((a, b) => b[1] - a[1])[0];
        const percentage = ((topWeather[1] / goodSessions.length) * 100).toFixed(0);
        html += `<li>☀️ <strong>${percentage}%</strong> of your best sessions were in <strong>${topWeather[0]}</strong> conditions</li>`;
    }
    
    // Hydration patterns
    const goodWithHydration = goodSessions.filter(e => e.hydration);
    if (goodWithHydration.length >= 3) {
        const avgGoodHydration = goodWithHydration.reduce((sum, e) => sum + parseFloat(e.hydration), 0) / goodWithHydration.length;
        html += `<li>💧 Optimal hydration for you: <strong>${avgGoodHydration.toFixed(1)}L</strong></li>`;
    }
    
    html += '</ul></div>';
    return html;
}

// Analyze recovery factors
function analyzeRecoveryFactors(entries, stats) {
    let html = '<div class="insight-section"><h3>💪 Recovery & Preparation</h3><ul class="insight-list">';
    
    const sleepNum = parseFloat(stats.avgSleep);
    if (!isNaN(sleepNum)) {
        if (sleepNum < 7) {
            html += `<li>⚠️ <strong>Action needed:</strong> You're averaging only ${stats.avgSleep} hours of sleep. Aim for 7.5-9 hours for optimal recovery.</li>`;
        } else if (sleepNum >= 7.5) {
            html += `<li>✅ <strong>Excellent!</strong> You're getting solid sleep (${stats.avgSleep} hrs average). Keep it up!</li>`;
        } else {
            html += `<li>👍 Your sleep is decent (${stats.avgSleep} hrs), but there's room for improvement. Try for 7.5+ hours.</li>`;
        }
    }
    
    const hydrationNum = parseFloat(stats.avgHydration);
    if (!isNaN(hydrationNum)) {
        if (hydrationNum < 2) {
            html += `<li>💧 <strong>Hydration alert:</strong> You're only averaging ${stats.avgHydration}L. Target 2.5-3L daily for optimal performance.</li>`;
        } else if (hydrationNum >= 2.5) {
            html += `<li>✅ <strong>Great hydration!</strong> You're hitting ${stats.avgHydration}L on average.</li>`;
        }
    }
    
    html += '</ul></div>';
    return html;
}

// Analyze match performance (basic overview)
function analyzeMatchPerformance(matchEntries) {
    let html = '<div class="insight-section"><h3>🎾 Match Performance Overview</h3><ul class="insight-list">';
    
    const avgMatchRating = matchEntries.reduce((sum, e) => sum + parseInt(e.rating), 0) / matchEntries.length;
    
    html += `<li>📊 You've played <strong>${matchEntries.length} matches</strong> with an average rating of <strong>${avgMatchRating.toFixed(1)}/5</strong></li>`;
    
    // Most common opponents
    const opponents = {};
    matchEntries.forEach(e => {
        if (e.opponentName) {
            opponents[e.opponentName] = (opponents[e.opponentName] || 0) + 1;
        }
    });
    
    if (Object.keys(opponents).length > 0) {
        const topOpponent = Object.entries(opponents).sort((a, b) => b[1] - a[1])[0];
        if (topOpponent[1] > 1) {
            html += `<li>👤 Most frequent opponent: <strong>${topOpponent[0]}</strong> (${topOpponent[1]} matches)</li>`;
        }
    }
    
    html += '</ul></div>';
    return html;
}

// Identify areas for improvement
function identifyImprovementAreas(entries) {
    const poorSessions = entries.filter(e => parseInt(e.rating) <= 2);
    
    let html = '<div class="insight-section"><h3>🎯 Areas for Improvement</h3><ul class="insight-list">';
    
    if (poorSessions.length === 0) {
        html += '<li>🌟 <strong>Excellent!</strong> No poor sessions recorded. Keep up the great work!</li>';
    } else {
        const poorPercentage = ((poorSessions.length / entries.length) * 100).toFixed(0);
        html += `<li>📉 <strong>${poorPercentage}%</strong> of your sessions (${poorSessions.length}) were rated 2/5 or below.</li>`;
        
        // Analyze poor session patterns
        const poorWithSleep = poorSessions.filter(e => e.sleep);
        if (poorWithSleep.length >= 2) {
            const avgPoorSleep = poorWithSleep.reduce((sum, e) => sum + parseFloat(e.sleep), 0) / poorWithSleep.length;
            if (avgPoorSleep < 6.5) {
                html += `<li>😴 <strong>Key finding:</strong> Poor sessions averaged only ${avgPoorSleep.toFixed(1)} hours of sleep. Prioritize rest!</li>`;
            }
        }
    }
    
    // Check consistency
    const recentEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
    if (recentEntries.length >= 5) {
        const recentRatings = recentEntries.map(e => parseInt(e.rating));
        const variance = calculateVariance(recentRatings);
        
        if (variance > 1.5) {
            html += '<li>📊 Your recent performance has been <strong>inconsistent</strong>. Focus on establishing consistent preparation routines.</li>';
        } else {
            html += '<li>✅ Your performance has been <strong>consistent</strong> recently. Good job!</li>';
        }
    }
    
    html += '</ul></div>';
    return html;
}

// Generate actionable recommendations
function generateRecommendations(entries, stats) {
    let html = '<div class="insight-section"><h3>💡 Actionable Recommendations</h3><ul class="insight-list">';
    
    const recommendations = [];
    
    // Sleep recommendations
    const sleepNum = parseFloat(stats.avgSleep);
    if (!isNaN(sleepNum) && sleepNum < 7.5) {
        recommendations.push({
            priority: 1,
            text: `<strong>Priority #1:</strong> Increase your sleep to 7.5-8 hours. Your current ${stats.avgSleep} hours may be limiting performance.`
        });
    }
    
    // Hydration recommendations
    const hydrationNum = parseFloat(stats.avgHydration);
    if (!isNaN(hydrationNum) && hydrationNum < 2.5) {
        recommendations.push({
            priority: 2,
            text: `<strong>Hydration goal:</strong> Increase daily water intake to 2.5-3L (currently ${stats.avgHydration}L).`
        });
    }
    
    // Documentation recommendations
    const matchEntries = entries.filter(e => e.sessionType === 'Match Day');
    const matchesWithAnalysis = matchEntries.filter(e => 
        e.perfLengthWidth || e.perfMovement || e.oppStrengths
    );
    
    if (matchEntries.length > 0 && matchesWithAnalysis.length < matchEntries.length * 0.5) {
        recommendations.push({
            priority: 3,
            text: 'Document match performance analysis more consistently. This will help identify technical patterns.'
        });
    }
    
    // Consistency recommendations
    if (stats.trend === 'declining') {
        recommendations.push({
            priority: 1,
            text: `<strong>Performance dip detected:</strong> Review your last ${Math.min(entries.length, 7)} sessions to identify what changed.`
        });
    }
    
    // Sort by priority and display
    recommendations.sort((a, b) => a.priority - b.priority);
    
    if (recommendations.length === 0) {
        html += '<li>🎉 <strong>Great job!</strong> You\'re doing well across all key areas. Keep tracking and stay consistent!</li>';
    } else {
        recommendations.forEach(rec => {
            html += `<li>${rec.text}</li>`;
        });
    }
    
    html += '</ul></div>';
    return html;
}

// Calculate variance (standard deviation)
function calculateVariance(arr) {
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    const squareDiffs = arr.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / arr.length);
}

window.loadInsights = loadInsights;