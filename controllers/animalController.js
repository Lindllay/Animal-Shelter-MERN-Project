const Animal = require("../models/Animal");
const CustomErrors = require("../errors");
const { StatusCodes } = require("http-status-codes");

const cloudinary = require("../lib/cloudinary");

const getAllAnimals = async (req, res) => {
	if (!req.query) {
		queryObject = {};
	} else {
		const { name, age, weight, breed, gender, adoptedAt, species } = req.query;
		const queryObject = {};

		if (name) {
			queryObject.name = { $regex: name, $options: "i" };
		}

		if (age) {
			const [min, max] = age.split("-");
			queryObject.age = { $gte: min, $lte: max };
		}

		if (weight) {
			const [min, max] = weight.split("-");
			queryObject.weight = { $gte: min, $lte: max };
		}
		if (breed) {
			queryObject.breed = breed;
		}
		if (gender) {
			queryObject.gender = gender;
		}
		if (adoptedAt) {
			queryObject.adoptedAt = { $gte: adoptedAt };
		}
		if (species) {
			queryObject.species = species;
		}
	}

	const animals = await Animal.find(queryObject);
	res.status(StatusCodes.OK).json({ animals, amount: animals.length });
};

const getAnimal = async (req, res) => {
	const { id } = req.params;

	const animal = await Animal.find({ _id: id });
	if (!animal)
		throw new CustomErrors.NotFoundError(
			"Nie znaleziono zwierzęcia o podanym id"
		);

	res.status(StatusCodes.OK).json(animal);
};

const createAnimal = async (req, res) => {
	const {
		name,
		age,
		weight,
		species,
		breed,
		gender,
		description,
		adoptedAt,
		image,
	} = req.body.data;

	if (!name || !age || !species || !weight || !gender || !image) {
		await cloudinary.uploader.destroy(req.body.image_id); // delete image from cloudinary if error occurs
		throw new CustomErrors.BadRequestError(
			"Proszę podać imię, wiek, wagę, płeć oraz dodać zdjęcie zwierzęcia"
		);
	}
	const animalObject = {
		name,
		age: Number(age),
		weight: Number(weight),
		species,
		breed,
		gender,
		description,
		adoptedAt,
		image,
	};

	await Animal.create(animalObject);

	res.status(StatusCodes.CREATED).json({ msg: "Success" });
};

const deleteAnimal = async (req, res) => {
	res.send("delete Animal");
};

const updateAnimal = async (req, res) => {
	res.send("update animal");
};

module.exports = {
	getAllAnimals,
	getAnimal,
	createAnimal,
	deleteAnimal,
	updateAnimal,
};
