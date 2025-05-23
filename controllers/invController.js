const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build Page for indivudual view
 * ************************** */
invCont.buildByInvetoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  const data = await invModel.getInventoryByInvId(inv_id)
  const grid = await utilities.buildInventroyGrid(data)
  let nav = await utilities.getNav()
  const idMake = data.inv_make
  const idModel = data.inv_model
  res.render("./inventory/item", {
    title: idMake + ' ' + idModel,
    nav,
    grid,
  })
}

module.exports = invCont