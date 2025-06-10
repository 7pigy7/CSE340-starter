// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const regValidate = require('../utilities/account-validation')
const accController = require("../controllers/accController")

// Route to build inventory by classification view
router.get("/", utilities.checkLogin, utilities.handleErrors(accController.buildAccount))
router.get("/edit", utilities.handleErrors(accController.editAccount))
router.get("/login", utilities.handleErrors(accController.buildLogin));
router.get("/register", utilities.handleErrors(accController.buildRegister));
router.get("/logout", utilities.handleErrors(accController.logout));

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accController.registerAccount)
);
// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accController.accountLogin)
);

router.post(
  "/edit",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accController.updateAccount)
);

router.post(
  "/edit",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accController.updatePassword)
);

module.exports = router;