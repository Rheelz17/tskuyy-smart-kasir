
// SALES CHART
const ctx = document.getElementById('salesChart').getContext('2d');
new Chart(ctx, {
type: 'line',
data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
    data: [120, 200, 150, 280, 220, 400, 580],
    borderColor: '#e07b2a',
    backgroundColor: 'rgba(224,123,42,0.08)',
    borderWidth: 2.5,
    pointBackgroundColor: '#e07b2a',
    pointRadius: 4,
    pointHoverRadius: 6,
    tension: 0.4,
    fill: true
    }]
},
options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11, family: 'Plus Jakarta Sans' }, color: '#94a3b8' } },
    y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 11, family: 'Plus Jakarta Sans' }, color: '#94a3b8' }, beginAtZero: true }
    }
}
});

// MOOD DONUT CHART
const mctx = document.getElementById('moodChart').getContext('2d');
new Chart(mctx, {
type: 'doughnut',
data: {
    labels: ['Happy', 'Naga', 'Penasaran', 'Terserah', 'Hangdong'],
    datasets: [{
    data: [30, 30, 15, 10, 15],
    backgroundColor: ['#e07b2a', '#3b82f6', '#10b981', '#8b5cf6', '#facc15'],
    borderWidth: 0,
    hoverOffset: 6
    }]
},
options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: { legend: { display: false } }
}
});

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
});
});