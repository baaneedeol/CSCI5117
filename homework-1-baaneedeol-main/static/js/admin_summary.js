document.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('/api/results');
    const responses = await res.json();

    const ul = document.getElementById('response-list');
    responses.forEach(r => {
        const li = document.createElement('li');
        li.textContent = `${r.name} | Genre: ${r.genre} | Favorite: ${r.favorite} | Watching: ${r.watching} | Recommend: ${r.recommend ? 'Yes' : 'No'} | Feedback: ${r.feedback}`;
        ul.appendChild(li);
    });

    function countField(arr, field) {
        return arr.reduce((acc, obj) => {
            let key = obj[field];
            if (typeof key === 'boolean') key = key ? 'Yes' : 'No';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
    }

    function countResponsesPerDay(arr) {
        const counts = {};
        arr.forEach(r => {
            const date = new Date(r.timestamp);
            const day = date.toISOString().split('T')[0];
            counts[day] = (counts[day] || 0) + 1;
        });
        return counts;
    }

    function createChart(ctxId, counter, label, type='bar', colors=[]) {
        const ctx = document.getElementById(ctxId).getContext('2d');
        new Chart(ctx, {
            type: type,
            data: {
                labels: Object.keys(counter),
                datasets: [{
                    label: label,
                    data: Object.values(counter),
                    backgroundColor: colors.length ? colors : 'rgba(75, 192, 192, 0.6)',
                    borderColor: colors.length ? colors : 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: type === 'line' ? false : true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    createChart('genreChart', countField(responses, 'genre'), 'Responses by Genre', 'pie', [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)'
    ]);

    createChart('favoriteChart', countField(responses, 'favorite'), 'Responses by Favorite Anime', 'bar', [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(199, 199, 199, 0.6)'
    ]);

    createChart('watchingChart', countField(responses, 'watching'), 'Watching Frequency', 'polarArea', [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)'
    ]);

    createChart('recommendChart', countField(responses, 'recommend'), 'Would Recommend Anime', 'doughnut', [
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 99, 132, 0.6)'
    ]);


    const timeCounts = countResponsesPerDay(responses);
    const timeLabels = Object.keys(timeCounts).sort(); 
    const timeValues = timeLabels.map(d => timeCounts[d]);

    const ctx = document.getElementById('timeChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: '# of Responses per Day',
                data: timeValues,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Responses'
                    }
                }
            }
        }
    });
});
