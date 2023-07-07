const CustomError = require("../errors");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("../lib/cloudinary");

const uploadAnimalImage = async (req, res) => {
	if (!req.files) {
		throw new CustomError.BadRequestError("No File Uploaded");
	}

	const animalImage = req.files.image;

	if (!animalImage.mimetype.startsWith("image")) {
		throw new CustomError.BadRequestError("Please Upload Image");
	}

	if (animalImage.size > 1024 * 1024 * 1024) {
		throw new CustomError.BadRequestError(
			"Please upload image smaller than 1MB"
		);
	}
	const result = await cloudinary.uploader.upload(animalImage.tempFilePath, {
		use_filename: false,
		folder: "photos",
	});
	fs.unlinkSync(animalImage.tempFilePath);

	return res
		.status(StatusCodes.OK)
		.json({ image: { src: result.secure_url, public_id: result.public_id } });
};

module.exports = {
	uploadAnimalImage,
};
