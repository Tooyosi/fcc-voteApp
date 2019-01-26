// This is to make the page mobile responsive
//  document.addEventListener('DOMContentLoaded', function() {
//   var elems = document.querySelectorAll('.sidenav');
//   var instances = M.Sidenav.init(elems, options);
// });
const form = document.getElementById('form');
  // form submit event
  if (form){
   
  form.addEventListener('submit', (e) => {

    var pollsName = document.getElementById('poll-name').value;
    var pollOptions = document.getElementById('poll-options').value;
    
    if (!pollsName || !pollOptions){
      e.preventDefault();
      alert('Sorry, please ensure the form isn\'t empty. Thanks');
    }
  });
}

const login = document.getElementById('login');
  // form submit event
  if (login){
   
  login.addEventListener('submit', (e) => {
    
    e.preventDefault();
    var name = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm-password').value;
  
    if (password !== confirmPassword){
      alert('Sorry passwords do not match');
    } else{
      console.log(`${name}, ${password}, ${confirmPassword}`);
    }
    
  });
}

var showPolls = document.getElementById('show-polls');

if (showPolls) {
  fetch('http://localhost:8080/seeall')
    .then(res => res.json())
    .then( data => {
      return data.map( x => {
        showPolls.innerHTML += `<div class="container">`;
        showPolls.innerHTML += `<h6 class="center my-3"><a href='/api/poll/${x.uniqueId}'>${x.voteName}</a><h6>`;
        showPolls.innerHTML == `</div>`;
      });
    })
    .catch(err => console.log(err));
}

var pollsDisplay = document.getElementById('polls-display');

if (pollsDisplay) {
  console.log(window.location.href);
  // this will be the url eventually, but then we want to get the ip address of the requester eventually
  fetch('http://localhost:8080/seemine')
    .then(res => res.json())
    .then( data => {
      console.log(data);
      if (data.length == 0) {
        pollsDisplay.innerHTML += `<h6 class="center pt-5">Sorry your polls are empty. You can make a new poll <a href='newpoll.html'>here</a><h7>`
      } else {
        data.map( x => {
          pollsDisplay.innerHTML += `<div class="container">`;
          pollsDisplay.innerHTML += `<h6 class="center my-3 pt-3"><a href='/api/poll/${x.uniqueId}'>${x.voteName}</a><a class="px-3 confirmation" href="api/del/${x.uniqueId}">x</a><h6>`;
          pollsDisplay.innerHTML == `</div>`;
        });
      }
      return $(document).ready(() => {
        $('.confirmation').on('click', () => {
            return confirm('Are you sure?');
        });
      });
    })
    .catch(err => console.log(err));
}

