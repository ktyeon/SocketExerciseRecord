// iphoneApp.js

document.addEventListener("DOMContentLoaded", function() {
    // Initialize the chart
    var ctx = document.getElementById('progressCircle').getContext('2d');
    var progressCircle = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [0, 100], // Initial progress
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
  
    // Simulate progress update
    setInterval(() => {
      const progress = Math.floor(Math.random() * 100);
      updateProgress(progress);
    }, 2000);
  
    // Update progress function
    function updateProgress(progress) {
      progressCircle.data.datasets[0].data = [progress, 100 - progress];
      progressCircle.update();
    }
  
    // Listen for click on Enter Record button
    document.getElementById('enterRecordBtn').addEventListener('click', function() {
      const exerciseRecord = prompt("Enter your exercise record:");
      if (exerciseRecord !== null && !isNaN(exerciseRecord)) {
        // Send exercise record to server
        socket.emit('exerciseRecord', { username: 'iPhoneUser', exerciseRecord: parseFloat(exerciseRecord) });
      }
    });
  });
  