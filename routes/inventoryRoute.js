// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index") 
const addValidate = require('../utilities/inventory-validation')
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInvetoryId));
router.get("/", utilities.handleErrors(invController.buildManagement));
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.get("/add-inventory", utilities.handleErrors(invController.buildNewItem));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

router.post(
    "/add-classification", 
    addValidate.addClassRules(), 
    addValidate.checkAddData, 
    utilities.handleErrors(invController.AddNewClassification)
)

router.post(
    "/add-inventory",
    addValidate.addItemRules(), 
    addValidate.checkAddData, 
    utilities.handleErrors(invController.AddNewItem)
);

module.exports = router;