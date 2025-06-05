const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const invModel = require("../models/inventory-model")
  const validate = {}

  validate.addClassRules = () => {
    return [
      body("classification_name")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the new classification a name.")
        .custom(async (classification_name) => {
        const classExists = await invModel.checkExistingClassName(classification_name)
            if (classExists){
              throw new Error("Classification exists. Please use a different name.")
            }
          }),
    ]}

  validate.addItemRules = () => {
    return [
      body("inv_make")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the make."),

      body("inv_model")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the model."),
      
      body("inv_year")
        .trim()
        .notEmpty()
        .isLength({ max: 4 })
        .withMessage("Please provide the year."),
     
      body("inv_description")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the description."),
     
      body("inv_image")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the image."),

      body("inv_thumbnail")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the image."),

      body("inv_price")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the price."),

      body("inv_miles")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the miles."),

        body("inv_color")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the color.")     
    ]}

validate.checkAddData = async (req, res, next) => {
  const classification_name = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

validate.checkUpdateData = async (req, res, next) => {
  const classification_name = req.body
  const inv_id = parseInt(req.params.inv_id)
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit",
      nav,
      classification_name,
      inv_id,
    })
    return
  }
  next()
}

module.exports = validate