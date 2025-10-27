// Sensors page functionality

// Sample sensor data
const sensorsData = [
    { id: 1, name: "Sensor #1", location: "Dadar Station", lat: 19.0760, lng: 72.8777, status: "normal", waterLevel: 32, lastUpdate: "2 min ago", battery: 85, signal: "Strong" },
    { id: 2, name: "Sensor #2", location: "Bandra West", lat: 19.0915, lng: 72.8567, status: "warning", waterLevel: 68, lastUpdate: "1 min ago", battery: 92, signal: "Good" },
    { id: 3, name: "Sensor #3", location: "Andheri East", lat: 19.0180, lng: 72.8580, status: "critical", waterLevel: 85, lastUpdate: "30 sec ago", battery: 78, signal: "Excellent" },
    { id: 4, name: "Sensor #4", location: "Kurla Complex", lat: 19.0728, lng: 72.8826, status: "normal", waterLevel: 25, lastUpdate: "3 min ago", battery: 89, signal: "Good" },
    { id: 5, name: "Sensor #5", location: "Powai Lake", lat: 19.1197, lng: 72.9056, status: "normal", waterLevel: 41, lastUpdate: "1 min ago", battery: 95, signal: "Excellent" },
    { id: 6, name: "Sensor #6", location: "Juhu Beach", lat: 19.0990, lng: 72.8265, status: "warning", waterLevel: 72, lastUpdate: "2 min ago", battery: 67, signal: "Fair" }
];

let sensorMap;

// Initialize sensors page
document.addEventListener('DOMContentLoaded', function() {
    initializeSensorMap();
    populateSensorTable();
    initializePerformanceCharts();
    initializeModal();
});

function initializeSensorMap() {
    const mapElement = document.getElementById('sensorMap');
    if (!mapElement) return;

    sensorMap = L.map('sensorMap').setView([19.0760, 72.8777], 11);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(sensorMap);

    // Add sensor markers
    sensorsData.forEach(sensor => {
        const markerColor = getStatusColor(sensor.status);
        const customIcon = L.divIcon({
            className: 'custom-sensor-marker',
            html: `<div class="w-8 h-8 rounded-full border-2 border-white shadow-lg ${markerColor} flex items-center justify-center">
                     <i class="fas fa-tint text-white text-sm"></i>
                   </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        const marker = L.marker([sensor.lat, sensor.lng], { icon: customIcon }).addTo(sensorMap);
        
        const popupContent = createSensorPopup(sensor);
        marker.bindPopup(popupContent);
    });
}

function getStatusColor(status) {
    switch (status) {
        case 'normal': return 'bg-green-500';
        case 'warning': return 'bg-yellow-500';
        case 'critical': return 'bg-red-500';
        case 'offline': return 'bg-gray-500';
        default: return 'bg-gray-500';
    }
}

function createSensorPopup(sensor) {
    return `
        <div class="p-3 min-w-48">
            <h3 class="font-bold text-lg mb-2">${sensor.name}</h3>
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span>Location:</span>
                    <span class="font-medium">${sensor.location}</span>
                </div>
                <div class="flex justify-between">
                    <span>Status:</span>
                    <span class="font-medium ${getStatusTextColor(sensor.status)}">${sensor.status.toUpperCase()}</span>
                </div>
                <div class="flex justify-between">
                    <span>Water Level:</span>
                    <span class="font-medium">${sensor.waterLevel} cm</span>
                </div>
                <div class="flex justify-between">
                    <span>Battery:</span>
                    <span class="font-medium">${sensor.battery}%</span>
                </div>
                <div class="flex justify-between">
                    <span>Last Update:</span>
                    <span class="text-gray-500">${sensor.lastUpdate}</span>
                </div>
            </div>
            <button onclick="openSensorModal(${sensor.id})" class="mt-3 bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 w-full">
                View Details
            </button>
        </div>
    `;
}

function getStatusTextColor(status) {
    switch (status) {
        case 'normal': return 'text-green-600';
        case 'warning': return 'text-yellow-600';
        case 'critical': return 'text-red-600';
        case 'offline': return 'text-gray-600';
        default: return 'text-gray-600';
    }
}

function populateSensorTable() {
    const tbody = document.getElementById('sensorTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    sensorsData.forEach(sensor => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 cursor-pointer';
        row.onclick = () => openSensorModal(sensor.id);
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full ${getStatusColor(sensor.status)} mr-3"></div>
                    <div class="text-sm font-medium text-gray-900">${sensor.name}</div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${sensor.location}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(sensor.status)}">
                    ${sensor.status.toUpperCase()}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sensor.waterLevel} cm</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${sensor.lastUpdate}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="event.stopPropagation(); openSensorModal(${sensor.id})" class="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                <button onclick="event.stopPropagation(); editSensor(${sensor.id})" class="text-green-600 hover:text-green-900 mr-3">Edit</button>
                <button onclick="event.stopPropagation(); resetSensor(${sensor.id})" class="text-yellow-600 hover:text-yellow-900">Reset</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function getStatusBadgeColor(status) {
    switch (status) {
        case 'normal': return 'bg-green-100 text-green-800';
        case 'warning': return 'bg-yellow-100 text-yellow-800';
        case 'critical': return 'bg-red-100 text-red-800';
        case 'offline': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function initializePerformanceCharts() {
    // Response Time Chart
    const responseCtx = document.getElementById('responseChart');
    if (responseCtx) {
        new Chart(responseCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Average Response Time (ms)',
                    data: [120, 110, 95, 105, 115, 100],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
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
                        title: {
                            display: true,
                            text: 'Response Time (ms)'
                        }
                    }
                }
            }
        });
    }

    // Accuracy Chart
    const accuracyCtx = document.getElementById('accuracyChart');
    if (accuracyCtx) {
        new Chart(accuracyCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Accurate', 'Minor Variance', 'Major Variance'],
                datasets: [{
                    data: [85, 12, 3],
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
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

function initializeModal() {
    const modal = document.getElementById('sensorModal');
    const closeBtn = document.getElementById('closeModal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSensorModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeSensorModal();
            }
        });
    }
}

function openSensorModal(sensorId) {
    const sensor = sensorsData.find(s => s.id === sensorId);
    if (!sensor) return;

    const modal = document.getElementById('sensorModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalTitle || !modalContent) return;

    modalTitle.textContent = `${sensor.name} - ${sensor.location}`;
    modalContent.innerHTML = createModalContent(sensor);
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeSensorModal() {
    const modal = document.getElementById('sensorModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function createModalContent(sensor) {
    return `
        <div class="space-y-6">
            <!-- Status Overview -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold ${getStatusTextColor(sensor.status)}">${sensor.status.toUpperCase()}</div>
                    <div class="text-sm text-gray-500">Current Status</div>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-blue-600">${sensor.waterLevel} cm</div>
                    <div class="text-sm text-gray-500">Water Level</div>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-green-600">${sensor.battery}%</div>
                    <div class="text-sm text-gray-500">Battery</div>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-purple-600">${sensor.signal}</div>
                    <div class="text-sm text-gray-500">Signal</div>
                </div>
            </div>

            <!-- Sensor Information -->
            <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-3">Sensor Information</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="text-gray-500">Sensor ID:</span>
                        <span class="font-medium ml-2">${sensor.id}</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Location:</span>
                        <span class="font-medium ml-2">${sensor.location}</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Coordinates:</span>
                        <span class="font-medium ml-2">${sensor.lat.toFixed(4)}, ${sensor.lng.toFixed(4)}</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Last Update:</span>
                        <span class="font-medium ml-2">${sensor.lastUpdate}</span>
                    </div>
                </div>
            </div>

            <!-- Historical Data Chart -->
            <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-3">24-Hour Water Level Trend</h4>
                <canvas id="sensorHistoryChart" class="w-full h-48"></canvas>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-3">
                <button onclick="calibrateSensor(${sensor.id})" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex-1">
                    <i class="fas fa-cog mr-2"></i>Calibrate
                </button>
                <button onclick="resetSensor(${sensor.id})" class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded flex-1">
                    <i class="fas fa-redo mr-2"></i>Reset
                </button>
                <button onclick="downloadSensorData(${sensor.id})" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex-1">
                    <i class="fas fa-download mr-2"></i>Export Data
                </button>
            </div>
        </div>
    `;
}

// Sensor action functions
function editSensor(sensorId) {
    showToast(`Opening edit interface for Sensor #${sensorId}`, 'info');
    // Implementation would open an edit form
}

function resetSensor(sensorId) {
    if (confirm(`Are you sure you want to reset Sensor #${sensorId}? This will restart the sensor and may cause a brief interruption in data collection.`)) {
        showToast(`Sensor #${sensorId} is being reset...`, 'info');
        setTimeout(() => {
            showToast(`Sensor #${sensorId} has been successfully reset`, 'success');
        }, 2000);
    }
}

function calibrateSensor(sensorId) {
    showToast(`Starting calibration for Sensor #${sensorId}...`, 'info');
    setTimeout(() => {
        showToast(`Sensor #${sensorId} calibration completed`, 'success');
    }, 3000);
}

function downloadSensorData(sensorId) {
    const sensor = sensorsData.find(s => s.id === sensorId);
    if (!sensor) return;

    const data = {
        sensorId: sensor.id,
        name: sensor.name,
        location: sensor.location,
        exportTime: new Date().toISOString(),
        data: {
            currentReading: sensor.waterLevel,
            status: sensor.status,
            battery: sensor.battery,
            signal: sensor.signal,
            lastUpdate: sensor.lastUpdate
        }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensor-${sensorId}-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast(`Data exported for Sensor #${sensorId}`, 'success');
}