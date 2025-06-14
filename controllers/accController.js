const bcrypt = require("bcryptjs")
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account", {
    title: "Account",
    nav,
    accountData: res.locals.accountData,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  const grid = await utilities.buildRegister()
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    grid,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  const grid = await utilities.buildRegister()
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      grid,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      grid,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        grid,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function editAccount (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/account-edit", {
    title: "Edit Account",
    nav,
    errors: null,
    accountData : res.locals.accountData,   
  })
}

/* ***************************
 *  Update Account Data
 * ************************** */
async function updateAccount (req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResult) {
    req.flash("notice", `The ${account_email} account was successfully updated.`)
    res.redirect("/")
  } else {
    let nav = await utilities.getNav()
  res.render("./account/account-edit", {
    title: "Edit Account",
    nav,
    errors: null,
    accountData : res.locals.accountData,   
  })
  }
}

async function updatePassword (req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_passord } = req.body
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password update.')
    res.status(500).render("account/edit", {
      title: "Registration",
      nav,
      errors: null,
      accountData : res.locals.accountData,  
    })
  }
  
  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  )

  if (updateResult) {
    req.flash("notice", `The ${account_email} password was successfully updated.`)
    res.redirect("/")
  } else {
    let nav = await utilities.getNav()
  res.render("./account/account-edit", {
    title: "Edit Account",
    nav,
    errors: null,
    accountData : res.locals.accountData,   
  })
  }
}

async function logout (req, res, next) {
  res.clearCookie(jwt);
let nav = await utilities.getNav()
  res.render("./account/logout", {
    title: "Logged Out",
    nav,
  })
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccount, editAccount, updateAccount, updatePassword, logout }