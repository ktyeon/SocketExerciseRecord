// appleWatchApp.js

document.addEventListener("DOMContentLoaded", function() {
    const socket = io('http://localhost:3000'); // Update with your server address
  
    socket.on('notification', function(data) {
      alert(`Notification: ${data.message}`);
      const viewGraph = confirm("View iPhone user's circle graph?");
      if (viewGraph) {
        // Request iPhone user's circle graph from server
        socket.emit('requestGraph', { username: 'iPhoneUser' });
      }
    });
  
    // Listen for response to requestGraph event
    socket.on('graphData', function(data) {
      // Update Apple Watch's circle graph
      const ctx = document.getElementById('progressCircle').getContext('2d');
      const progressCircle = new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [data.exerciseRecord, 100 - data.exerciseRecord],
            backgroundColor: ['#007bff', '#f0f0f0'],
            borderWidth: 0
          }]
        },
        options: {
          cutout: '80%',
          responsive: false,
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          tooltips: {
            enabled: false
          }
        }
      });
    });
  });
  