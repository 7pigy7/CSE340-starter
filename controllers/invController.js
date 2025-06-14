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
    errors: null,
  })
}

/* ***************************
 *  Build Page for indivudual view
 * ************************** */
invCont.buildByInvetoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  const accountData = res.locals.accountData
  const loggedin = res.locals.loggedin
  const data = await invModel.getInventoryByInvId(inv_id)
  const grid = await utilities.buildInventroyGrid(data)
  const info = await invModel.getInventoryReview(inv_id)
  const area = await utilities.buildReviewArea(info)
  let nav = await utilities.getNav()
  const idMake = data.inv_make
  const idModel = data.inv_model
  res.render("./inventory/item", {
    title: idMake + ' ' + idModel,
    nav,
    grid,
    area,
    inv_id,
    accountData,
    loggedin,
    errors: null,
  })
}

invCont.AddReview = async function (req, res, next) {
  let nav = await utilities.getNav()

  const {rating, review_text, account_id, inv_id} = req.body

  const addResult = await invModel.AddReview(rating, review_text, account_id, inv_id)

 if (addResult) {
    req.flash(
      "notice",
      `The new review has been added.`
    )
    res.status(201).render("./inventory/review", {
      title: 'Thanks',
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the new review wasn't added.")
    res.status(501).render("./inventory/review", {
      title: 'Thanks',
      nav,
      errors: null,
    })
  }
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: 'Management View',
    nav,
    errors: null,
    classificationSelect,
  })
}

invCont.buildAddClassification = async function (req, res, next) {
  const grid = await utilities.buildAddClassification()
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: 'Add Classification',
    nav,
    grid,
    errors: null,
  })
}

invCont.AddNewClassification = async function (req, res) {
  const grid = await utilities.buildAddClassification()
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const addResult = await invModel.AddNewClassification( classification_name )

  if (addResult) {
    req.flash(
      "notice",
      `The new classification, ${classification_name}, has been added.`
    )
    res.status(201).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      grid,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the new classification didn't work.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      grid,
      errors: null,
    })
  }
}

invCont.buildNewItem = async function (req, res, next) {
  const grid = await utilities.buildNewItem( await utilities.buildClassificationList())
  let nav = await utilities.getNav()
  res.render("./inventory/add-inventroy", {
    title: 'Add New Inventory Item',
    nav,
    grid,
    errors: null,
  })
}

invCont.AddNewItem = async function (req, res, next) {
  const grid = await utilities.buildNewItem( await utilities.buildClassificationList())
  let nav = await utilities.getNav()
 const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body

  const addResult = await invModel.AddNewItem( classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color )

  if (addResult) {
    req.flash(
      "notice",
      `The new item has been added.`
    )
    res.status(201).render("inventory/management", {
      title: "Management View",
      nav,
      grid,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the new item wasn't added.")
    res.status(501).render("inventory/add-inventroy", {
      title: "Add Inventory Item",
      nav,
      grid,
      errors: null,
    })}
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_id } = req.body
  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
    req.flash("notice", `The item was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}

module.exports = invCont