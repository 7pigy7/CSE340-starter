const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="fullList">'
    data.forEach(vehicle => { 
      grid += '<li class="inv-display">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildInventroyGrid = async function(data){
  let grid
  if(data.length = 1){
    grid = '<ul id="item-display">'
    grid += '<div class="carPicture">'
    grid += '<img src="' + data.inv_image 
      +'" alt="Image of '+ data.inv_make + ' ' + data.inv_model 
      +' on CSE Motors" />'
    grid += '</div>'
    grid += '<div class="itemDetails>"'
    grid += '<p>$' 
      + new Intl.NumberFormat('en-US').format(data.inv_price) + '</p>'
    grid += '<p>Year: ' + data.inv_year + '</p>'
    grid += '<p>Color: ' + data.inv_color + '</p>'
    grid += '<p>Miles: ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</p>'
    grid += '<p>'+ data.inv_description + '</p>'
    grid += '</div>'
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid
}

Util.buildLogin = async function(){
  let grid
 grid = '<form name="login" action="/account/login" method="post">'
    grid += '<fieldset>'
        grid += '<label>Email:</label>'
        grid += '<input type="email" placeholder="sample@example.com" required>'
        grid += '<label>Password:</label>'
        grid += '<input type="password" required>'
        grid += '<div class="loginButton">'
        grid += '<input type="submit" value="Login">'
        grid += '</div>'
        grid += '<div class="createAccount">'
            grid += '<a href="register">Sign-up Now</a>'
        grid += '</div>'
    grid += '</fieldset>'
grid += '</form>'
  return grid
}



Util.buildRegister = async function(){
  let grid
 grid = '<form action="/account/register" method="post">'
    grid += '<fieldset>'
     grid += '<label>Fisrt Name:</label>'
        grid += '<input name="account_firstname" type="text" required value="<%= locals.account_firstname %>">'
        grid += '<label>Last Name:</label>'
        grid += '<input name="account_lastname"  type="text" required value="<%= locals.account_lastname %>">'
        grid += '<label>Email:</label>'
        grid += '<input name="account_email" type="email" placeholder="sample@example.com" required value="<%= locals.account_email %>">'
        grid += '<label>Password:</label>'
        grid += '<input name="account_password" type="text" minlength="12" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required>'
        grid += '<span>Passwords must be at least 12 characters and contain at least 1 number, 1 capital letter and 1 special character</span>' 
        grid += '<div class="registerButton">'
        grid += '<input type="submit" value="Register">'
        grid += '</div>'
    grid += '</fieldset>'
grid += '</form>'
  return grid
}

Util.buildManagement = async function(classificationList){
  let grid
  grid = '<ul>'
    grid += '<li><a href="/inv/add-classification">Add new classification</a></li>'
    grid += '<li><a href="/inv/add-inventory">Add new inventory</a></li>'
    grid += '</ul>'
    grid += '<h2>Manage Inventory</h2>'
    grid += '<p>Select a classification form the list to see the items in that classification.</p>'
    grid += classificationList
    gird += '<table id="inventoryDisplay"></table>'
    grid += '<noscript>JavaScript must be enabled to use this page.</noscript>'
    grid += '<script src="../../js/inventory.js"></script>' //line might be moved
  return grid
}

Util.buildAddClassification = async function(){
  let grid
  grid = '<form name="add-classification" action="/inv/add-classification" method="post">'
    grid += '<fieldset>'
       grid += '<label>Classification Name</label>'
        grid += '<input name="classification_name" type="text" pattern="[a-zA-Z]+" required>'
        grid += '<span>Name must be alphabetic characters only</span>'
       grid += '<div class="addButton">'
        grid += '<input type="submit" value="Add Classification">'
       grid += '</div>'
    grid += '</fieldset>'
grid += '</form>'
  return grid
}


Util.buildNewItem = async function(classificationList){
  let grid
 grid = '<form action="/inv/add-inventory" method="post">'
    grid += '<fieldset>'
    grid += '<label>Classification:</label>'
        grid += classificationList
     grid += '<label>Make:</label>'
        grid += '<input name="inv_make" type="text" required value="<%= locals.inv_make %>">'
        grid += '<label>Model:</label>'
        grid += '<input name="inv_model"  type="text" required value="<%= locals.inv_model %>">'
        grid += '<label>Year:</label>'
        grid += '<input name="inv_year" type="text" required value="<%= locals.inv_year %>">'
        grid += '<label>Description:</label>'
        grid += '<textarea name="inv_description" type="text"  required> </textarea>'
       grid += '<label>Image:</label>'
        grid += '<input name="inv_image" type="text" required value="/images/vechicles/no-image.png">'
        grid += '<label>Thumbnail:</label>'
        grid += '<input name="inv_thumbnail"  type="text" required value="/images/vechicles/no-image-tn.png">'
        grid += '<label>Price:</label>'
        grid += '<input name="inv_price" type="text" required value="<%= locals.inv_price %>">'
        grid += '<label>Miles:</label>'
        grid += '<input name="inv_miles" type="text" required value="<%= locals.inv_miles %>">' 
        grid += '<label>Color:</label>'
        grid += '<input name="inv_color" type="text" required value="<%= locals.inv_color %>">' 
        grid += '<div class="AddItemButton">'
        grid += '<input type="submit" value="Add Item">'
        grid += '</div>'
    grid += '</fieldset>'
grid += '</form>'
  return grid
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

Util.editAccount = async function(){
  let grid
 grid = '<form action="/account/update" method="post">'
    grid += '<fieldset>'
     grid += '<label>Fisrt Name:</label>'
        grid += '<input name="account_firstname" type="text" required value="<%= account_firstname %>">'
        grid += '<label>Last Name:</label>'
        grid += '<input name="account_lastname"  type="text" required value="<%= account_lastname %>">'
        grid += '<label>Email:</label>'
        grid += '<input name="account_email" type="email" placeholder="sample@example.com" required value="<%= account_email %>">'
        grid += '<input type="submit" value="Update">'
        grid += '</fieldset>'
        grid += '</form>'
        grid += '<form action="/account/change-password" method="post">'
        grid += '<fieldset>'
        grid += '<label>Password:</label>'
        grid += '<input name="account_password" type="text" minlength="12" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required>'
        grid += '<span>Passwords must be at least 12 characters and contain at least 1 number, 1 capital letter and 1 special character</span>' 
        grid += '<div class="registerButton">'
        grid += '<input type="submit" value="Change Password">'
        grid += '<input type="hidden" name="account_id" <% if(locals.account_id) { %> value="<%= locals.account_id %>" <% } %>>'
        grid += '</div>'
    grid += '</fieldset>'
grid += '</form>'
  return grid
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util