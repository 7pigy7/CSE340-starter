buildAccount = async function(){
  let data = res.locals.accountData
  let display = document.getElementById("accDisplay")
  let grid
  grid = '<h2>Welcome' + data.first_name +'</h2>'
if (res.locals.loggedin && data.account_type === 'Admin' || data.account_type === 'Employee')
  grid += '<div id="noClients">'
  grid += '<h3>Inventory Management</h3>'
  grid += '<a href="/inv/">Click here</a>'
  grid += '</div>'
display.innerHTML = grid;
}

buildAccount(); 


  
