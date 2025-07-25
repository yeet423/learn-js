// Dashboard specific functionality for Mumbai Drainage Monitoring System

// Sensor data
const sensorData = {
    waterLevel: 82,
    rainfall: 35,
    flowSpeed: 0.6,
    waterHistory: [20, 30, 50, 65, 70, 82],
    timeStamps: ['12:00', '12:10', '12:20', '12:30', '12:40', '12:50'],
    trends: {
        waterLevel: 'up',
        rainfall: 'down',
        flowSpeed: 'stable'
    }
};

// Chart instances
let waterChart, barChart, pieChart, donutChart;
let map;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    initializeCharts();
    initializeMap();
    initializeForecast();
    startRealTimeUpdates();
});

function initializeDashboard() {
    // Update sensor readings
    updateSensorReadings();
    
    // Check for alerts
    checkAlerts();
    
    // Initialize export functionality
    initializeExportButtons();
}

function updateSensorReadings() {
    // Update main dashboard values
    const waterLevelEl = document.getElementById('waterLevel');
    const rainfallEl = document.getElementById('rainfall');
    const flowSpeedEl = document.getElementById('flowSpeed');
    
    if (waterLevelEl) waterLevelEl.textContent = `${sensorData.waterLevel} cm`;
    if (rainfallEl) rainfallEl.textContent = `${sensorData.rainfall} mm/hr`;
    if (flowSpeedEl) flowSpeedEl.textContent = `${sensorData.flowSpeed} m/s`;
    
    // Update trend indicators
    updateTrendIndicators();
}

function updateTrendIndicators() {
    const waterTrendEl = document.getElementById('waterLevelTrend');
    const rainfallTrendEl = document.getElementById('rainfallTrend');
    const flowTrendEl = document.getElementById('flowSpeedTrend');
    
    if (waterTrendEl) {
        waterTrendEl.innerHTML = getTrendIcon(sensorData.trends.waterLevel) + ' ' + getTrendText(sensorData.trends.waterLevel);
        waterTrendEl.className = `text-sm ${getTrendColor(sensorData.trends.waterLevel)}`;
    }
    
    if (rainfallTrendEl) {
        rainfallTrendEl.innerHTML = getTrendIcon(sensorData.trends.rainfall) + ' ' + getTrendText(sensorData.trends.rainfall);
        rainfallTrendEl.className = `text-sm ${getTrendColor(sensorData.trends.rainfall)}`;
    }
    
    if (flowTrendEl) {
        flowTrendEl.innerHTML = getTrendIcon(sensorData.trends.flowSpeed) + ' ' + getTrendText(sensorData.trends.flowSpeed);
        flowTrendEl.className = `text-sm ${getTrendColor(sensorData.trends.flowSpeed)}`;
    }
}

function getTrendIcon(trend) {
    switch (trend) {
        case 'up': return '<i class="fas fa-arrow-up"></i>';
        case 'down': return '<i class="fas fa-arrow-down"></i>';
        case 'stable': return '<i class="fas fa-minus"></i>';
        default: return '<i class="fas fa-question"></i>';
    }
}

function getTrendText(trend) {
    switch (trend) {
        case 'up': return 'Rising';
        case 'down': return 'Falling';
        case 'stable': return 'Stable';
        default: return 'Unknown';
    }
}

function getTrendColor(trend) {
    switch (trend) {
        case 'up': return 'trend-up';
        case 'down': return 'trend-down';
        case 'stable': return 'trend-stable';
        default: return 'text-gray-500';
    }
}

function checkAlerts() {
    const alertBox = document.getElementById('alertBox');
    
    if (sensorData.waterLevel > 80 || sensorData.flowSpeed > 0.7) {
        if (alertBox) {
            alertBox.classList.remove('hidden');
            alertBox.classList.add('alert-banner');
        }
        
        // Add to notifications
        const alertNotification = {
            id: Date.now(),
            type: 'critical',
            title: 'Critical Water Level',
            message: `Water level at ${sensorData.waterLevel}cm detected`,
            time: new Date(),
            read: false
        };
        
        if (typeof notifications !== 'undefined') {
            notifications.unshift(alertNotification);
            updateNotificationBadge();
        }
    }
}

function initializeCharts() {
    // Main water level chart
    const ctx = document.getElementById('waterChart');
    if (ctx) {
        waterChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: sensorData.timeStamps,
                datasets: [{
                    label: 'Water Level (cm)',
                    data: sensorData.waterHistory,
                    backgroundColor: 'rgba(59,130,246,0.1)',
                    borderColor: 'rgba(59,130,246,1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(59,130,246,1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: 'rgba(59,130,246,1)',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + ' cm';
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }
            }
        });
    }

    // Bar chart
    const barCtx = document.getElementById('barChart');
    if (barCtx) {
        barChart = new Chart(barCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: sensorData.timeStamps.slice(0, 6),
                datasets: [{
                    label: 'Water Level (cm)',
                    data: sensorData.waterHistory.slice(0, 6),
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Pie chart for risk zones
    const pieCtx = document.getElementById('pieChart');
    if (pieCtx) {
        const zones = {
            low: sensorData.waterHistory.filter(v => v < 40).length,
            medium: sensorData.waterHistory.filter(v => v >= 40 && v < 70).length,
            high: sensorData.waterHistory.filter(v => v >= 70).length
        };

        pieChart = new Chart(pieCtx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Low Risk (<40cm)', 'Medium Risk (40-69cm)', 'High Risk (≥70cm)'],
                datasets: [{
                    data: [zones.low, zones.medium, zones.high],
                    backgroundColor: [
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    // Donut chart for sensor status
    const donutCtx = document.getElementById('donutChart');
    if (donutCtx) {
        donutChart = new Chart(donutCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Sensor #1', 'Sensor #2', 'Sensor #3'],
                datasets: [{
                    data: [32, 38, 30],
                    backgroundColor: [
                        '#4ade80',
                        '#60a5fa',
                        '#facc15'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
}

function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Initialize Leaflet map
    map = L.map('map').setView([19.0760, 72.8777], 12);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Sensor locations with status
    const sensors = [
        { 
            id: 1,
            name: "Sensor #1 - Dadar", 
            lat: 19.0760, 
            lng: 72.8777,
            status: 'normal',
            waterLevel: 32,
            lastUpdate: '2 min ago'
        },
        { 
            id: 2,
            name: "Sensor #2 - Bandra", 
            lat: 19.0915, 
            lng: 72.8567,
            status: 'warning',
            waterLevel: 68,
            lastUpdate: '1 min ago'
        },
        { 
            id: 3,
            name: "Sensor #3 - Andheri", 
            lat: 19.0180, 
            lng: 72.8580,
            status: 'critical',
            waterLevel: 85,
            lastUpdate: '30 sec ago'
        }
    ];

    // Add markers for each sensor
    sensors.forEach(sensor => {
        const markerColor = getMarkerColor(sensor.status);
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="w-6 h-6 rounded-full border-2 border-white shadow-lg ${markerColor} flex items-center justify-center">
                     <i class="fas fa-tint text-white text-xs"></i>
                   </div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        const marker = L.marker([sensor.lat, sensor.lng], { icon: customIcon }).addTo(map);
        
        const popupContent = `
            <div class="p-2">
                <h3 class="font-bold text-sm mb-2">${sensor.name}</h3>
                <div class="space-y-1 text-xs">
                    <div class="flex justify-between">
                        <span>Status:</span>
                        <span class="font-medium ${getStatusColor(sensor.status)}">${sensor.status.toUpperCase()}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Water Level:</span>
                        <span class="font-medium">${sensor.waterLevel} cm</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Last Update:</span>
                        <span class="text-gray-500">${sensor.lastUpdate}</span>
                    </div>
                </div>
                <button onclick="viewSensorDetails(${sensor.id})" class="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">
                    View Details
                </button>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    });
}

function getMarkerColor(status) {
    switch (status) {
        case 'normal': return 'bg-green-500';
        case 'warning': return 'bg-yellow-500';
        case 'critical': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
}

function getStatusColor(status) {
    switch (status) {
        case 'normal': return 'text-green-600';
        case 'warning': return 'text-yellow-600';
        case 'critical': return 'text-red-600';
        default: return 'text-gray-600';
    }
}

function viewSensorDetails(sensorId) {
    showToast(`Loading details for Sensor #${sensorId}...`, 'info');
    // Here you would typically navigate to a detailed sensor page
    setTimeout(() => {
        showToast(`Sensor #${sensorId} details would open in a new page`, 'success');
    }, 1000);
}

function initializeForecast() {
    const forecastBtn = document.getElementById('forecastBtn');
    if (forecastBtn) {
        forecastBtn.addEventListener('click', generateForecast);
    }
}

function generateForecast() {
    const forecastBtn = document.getElementById('forecastBtn');
    if (!forecastBtn || !waterChart) return;

    // Disable button and show loading
    forecastBtn.disabled = true;
    forecastBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Generating...';

    setTimeout(() => {
        const newTimes = generateNextTimes(sensorData.timeStamps, 3, 10);
        const lastValue = sensorData.waterHistory[sensorData.waterHistory.length - 1];

        // Generate forecast data with some realistic variation
        newTimes.forEach((time, i) => {
            const trend = sensorData.trends.waterLevel === 'up' ? 1 : 
                         sensorData.trends.waterLevel === 'down' ? -1 : 0;
            const variation = Math.random() * 8 - 4; // ±4 variation
            const trendEffect = trend * (i + 1) * 2; // Increasing trend effect
            const newVal = Math.max(0, Math.round(lastValue + variation + trendEffect));
            
            waterChart.data.labels.push(time);
            waterChart.data.datasets[0].data.push(newVal);
            sensorData.waterHistory.push(newVal);
            sensorData.timeStamps.push(time);
        });

        // Add forecast styling to new data points
        const forecastColor = 'rgba(147, 197, 253, 0.7)';
        const originalDataLength = waterChart.data.datasets[0].data.length - 3;
        
        // Update chart
        waterChart.update('active');

        // Update button
        forecastBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Forecast Added';
        forecastBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
        forecastBtn.classList.add('bg-green-600');
        
        showToast('3-point forecast generated successfully!', 'success');
    }, 1500);
}

function generateNextTimes(baseTimes, count = 3, interval = 10) {
    const last = baseTimes[baseTimes.length - 1];
    const [h, m] = last.split(':').map(Number);
    const result = [];

    for (let i = 1; i <= count; i++) {
        let total = h * 60 + m + i * interval;
        let hour = String(Math.floor(total / 60) % 24).padStart(2, '0');
        let minute = String(total % 60).padStart(2, '0');
        result.push(`${hour}:${minute}`);
    }

    return result;
}

function initializeExportButtons() {
    // Add event listeners to export buttons
    const exportButtons = document.querySelectorAll('[data-export]');
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.dataset.export || 'json';
            exportDashboardData(format);
        });
    });
}

function exportDashboardData(format = 'json') {
    const exportData = {
        timestamp: new Date().toISOString(),
        sensorData: sensorData,
        charts: {
            waterHistory: sensorData.waterHistory,
            timeStamps: sensorData.timeStamps
        },
        alerts: sensorData.waterLevel > 80 ? ['High water level detected'] : []
    };

    const filename = `mumbai-drainage-data-${new Date().toISOString().split('T')[0]}`;
    
    if (typeof exportData === 'function') {
        exportData(exportData, filename, format);
    }
    
    showToast(`Data exported as ${format.toUpperCase()}`, 'success');
}

function startRealTimeUpdates() {
    // Simulate real-time data updates every 30 seconds
    setInterval(() => {
        updateSensorData();
        updateCharts();
        checkAlerts();
        updateLastUpdateTime();
    }, 30000);
}

function updateSensorData() {
    // Simulate sensor data changes
    const waterVariation = (Math.random() - 0.5) * 4; // ±2 cm variation
    const rainfallVariation = (Math.random() - 0.5) * 10; // ±5 mm/hr variation
    const flowVariation = (Math.random() - 0.5) * 0.2; // ±0.1 m/s variation

    sensorData.waterLevel = Math.max(0, Math.round(sensorData.waterLevel + waterVariation));
    sensorData.rainfall = Math.max(0, Math.round(sensorData.rainfall + rainfallVariation));
    sensorData.flowSpeed = Math.max(0, Math.round((sensorData.flowSpeed + flowVariation) * 10) / 10);

    // Update trends
    if (waterVariation > 1) sensorData.trends.waterLevel = 'up';
    else if (waterVariation < -1) sensorData.trends.waterLevel = 'down';
    else sensorData.trends.waterLevel = 'stable';

    if (rainfallVariation > 2) sensorData.trends.rainfall = 'up';
    else if (rainfallVariation < -2) sensorData.trends.rainfall = 'down';
    else sensorData.trends.rainfall = 'stable';

    if (flowVariation > 0.05) sensorData.trends.flowSpeed = 'up';
    else if (flowVariation < -0.05) sensorData.trends.flowSpeed = 'down';
    else sensorData.trends.flowSpeed = 'stable';

    // Add new data point
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0');
    
    sensorData.waterHistory.push(sensorData.waterLevel);
    sensorData.timeStamps.push(timeString);

    // Keep only last 20 data points
    if (sensorData.waterHistory.length > 20) {
        sensorData.waterHistory.shift();
        sensorData.timeStamps.shift();
    }

    updateSensorReadings();
}

function updateCharts() {
    if (waterChart) {
        waterChart.data.labels = sensorData.timeStamps;
        waterChart.data.datasets[0].data = sensorData.waterHistory;
        waterChart.update('none');
    }

    if (barChart) {
        barChart.data.labels = sensorData.timeStamps.slice(-6);
        barChart.data.datasets[0].data = sensorData.waterHistory.slice(-6);
        barChart.update('none');
    }
}