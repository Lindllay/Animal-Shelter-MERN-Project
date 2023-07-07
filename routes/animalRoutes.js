const express = require("express");
const router = express.Router();

const {
	getAllAnimals,
	getAnimal,
	createAnimal,
	deleteAnimal,
	updateAnimal,
} = require("../controllers/animalController");
const { uploadAnimalImage } = require("../controllers/uploadsController");

router.route("/uploadImage").post(uploadAnimalImage);
router.route("/").get(getAllAnimals).post(createAnimal);
router.route("/:id").get(getAnimal).delete(deleteAnimal).patch(updateAnimal);

module.exports = router;
