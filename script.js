let cart = [];

function debitMultiple(){
  var debitMultiple = document.getElementById('debitMultiple');
  var debit = document.getElementById('debit');
  var clearSelection = document.getElementById('clearSelection');
  var timeNDate = document.getElementById('selectTimenDate');
  
  clearSelection.style.display = '';
  debit.style.display = '';
  debitMultiple.style.display = 'none';
  timeNDate.style.display = 'inline-block';
  
  document.querySelectorAll('tbody tr').forEach( e => e.addEventListener('click', worker));
  document.querySelectorAll('span').forEach( e => e.addEventListener('click', removeFromCart));
}

function removeFromCart(name) {
  for (var i = 0; i < cart.length; i++){
    var firstName = cart[i].getElementsByTagName('td')[0].innerHTML;
    if (name === firstName){
      cart.splice(i,1);
    }
  }
  //displayCart(cart)
}

function worker(){
  var person = this.getElementsByTagName('td')[0].innerHTML;
  var names = cart.map( user => user.getElementsByTagName('td')[0].innerHTML);
  // console.log(person,names);
  if (names.includes(person)){
    return console.log('Nothing here');
  } else {
    cart.push(this);
    console.log(cart);
  }
  displayCart(cart);
}

function displayCart(cart){
  var div = document.getElementById('debtors');
  debtors.style.display = '';
  div.innerHTML = '';
  
  for (var i = 0; i < cart.length; i++){
    var span = document.createElement('span');
    span.classList = 'debtor';
    var firstName = cart[i].getElementsByTagName('td')[0].innerHTML;
    span.innerHTML = firstName;
    div.appendChild(span);
  }
}
function debit(){
  var time = document.getElementById('selectTime').value;
  var day = document.getElementById('selectDate').value;
  
  if (!time || !day) {
    alert('Please set a Time and Day');
    return
  }
  
  console.log(`Thanks, about to debit for this time and date`)
  var cart = getCart();
  if (!cart.length){
    return console.log('Not doing anything');
  } else {
    console.log('Will loop through cart to debit users now')
  }

}

function clearSelection(){
  var sure = confirm('This will cancel the current selection');
  if (sure){
    var debitMultiple = document.getElementById('debitMultiple');
    var debit = document.getElementById('debit');
    var clearSelection = document.getElementById('clearSelection');
    var timeNDate = document.getElementById('selectTimenDate');
    
    clearSelection.style.display = 'none'
    debit.style.display = 'none'
    debitMultiple.style.display = ''
    timeNDate.style.display = 'none'
  }
}

function search(){
  var input = document.getElementById('search');
  var filter = input.value.toLowerCase();
  var tableRow = document.querySelectorAll('tbody tr');
  
  for (var i = 0; i < tableRow.length; i++){
    var firstName = tableRow[i].getElementsByTagName('td')[0].innerHTML.toLowerCase();
    if (firstName.includes(filter)){
      tableRow[i].style.display = '';
    } else {
      tableRow[i].style.display = 'none';
    }
  }
}