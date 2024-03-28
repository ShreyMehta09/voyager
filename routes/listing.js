const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingContoller = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });
//index-create route
router
	.route("/")
	.get(wrapAsync(listingContoller.index))
	.post(
		isLoggedIn,
		upload.single("listing[image]"),
		validateListing,
		wrapAsync(listingContoller.createListing)
	);
//new route
router.get("/new", isLoggedIn, listingContoller.renderNewForm);

//show-update-delete route
router
	.route("/:id")
	.get(wrapAsync(listingContoller.showListing))
	.put(
		isLoggedIn,
		isOwner,
		upload.single("listing[image]"),
		validateListing,
		wrapAsync(listingContoller.updateListing)
	)
	.delete(isLoggedIn, isOwner, wrapAsync(listingContoller.deleteListing));

//edit route
router.get(
	"/:id/edit",
	isLoggedIn,
	isOwner,
	wrapAsync(listingContoller.editListing)
);

module.exports = router;
