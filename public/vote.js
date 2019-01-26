$(document).ready(() => {
      
      let form = document.getElementById('vote-form');
      if (form){
      form.addEventListener('submit',(e) => {
        console.log('Default prevented - form will not submit now');
        const option = document.querySelector('input[name=option]:checked').value;
        const data = {option: option};
        fetch('/api/vote', {
          method: "post",
          body: JSON.stringify(data),
          headers: {
                "Content-Type": "application/json"
            }
          })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            const options = data.voteOptions;
            const optionsArray = [];
            
            for (var x in options){
              optionsArray.push({y: options[x], label: x});
            }
            if (chartContainer){
            var chart = new CanvasJS.Chart("chartContainer", {
              	animationEnabled: true,
              	title:{
              		text: "Votes for " + data.voteName,
              		horizontalAlign: "center"
              	},
              	data: [{
              		type: "doughnut",
              		startAngle: 60,
              		innerRadius: 80,
              		indexLabelFontSize: 15,
              		indexLabel: "{label} - #percent%",
              		toolTipContent: "<b>{label}:</b> {y} votes (#percent%)",
              		dataPoints: optionsArray
              	}]
              });
              chart.render();
            }
          })
          .catch(err => console.log(err));
        e.preventDefault();
      });
       
      }
       
      var poll = document.getElementById('poll');
      var pollHead = document.getElementById('poll-goes-here');
     
      let chartContainer = $('#chartContaier');

      if (poll) {
        const wind = window.location.href;
        const id = wind.slice(wind.lastIndexOf('/') + 1);
        fetch('/api/' + id)
          .then( res => res.json())
          .then(data => {
            pollHead.innerHTML = data.voteName;
            const options = data.voteOptions;
            const optionsArray = [];
            
            for (var x in options){
              optionsArray.push({y: options[x], label: x});
              form.innerHTML += `<p>
                                <input type="radio" name="option" id="${x}" value="${x}">
                                <label for="${x}">${x[0].toUpperCase()}${x.slice(1)}</label>
                                </p>
            `;
            }
            form.innerHTML += `<input type="submit" value="Vote" class="btn">`;
            if (chartContainer){
            var chart = new CanvasJS.Chart("chartContainer", {
              	animationEnabled: true,
              	title:{
              		text: "Votes for " + data.voteName,
              		horizontalAlign: "center"
              	},
              	data: [{
              		type: "doughnut",
              		startAngle: 60,
              		innerRadius: 80,
              		indexLabelFontSize: 15,
              		indexLabel: "{label} - #percent%",
              		toolTipContent: "<b>{label}:</b> {y} votes (#percent%)",
              		dataPoints: optionsArray
              	}]
              });
              chart.render();
            }
          })
          .catch(err => console.log(err));
      }
   
})