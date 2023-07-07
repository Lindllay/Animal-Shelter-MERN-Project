const Admin = require("../models/Admin");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password)
		throw new BadRequestError("Please provide email and password");

	const user = await Admin.findOne({ email });
	if (!user) throw new UnauthenticatedError("Invalid Credentials");

	const isPasswordCorrect = await user.comparePassword(password);
	console.log(password, user.password, isPasswordCorrect);

	if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Credentials");

	const token = user.createJWT();

	res.status(StatusCodes.OK).json({ token });
};

const logout = async (req, res) => {
	res.send("Logout");
};

const dashboard = async (req, res) => {
	res.status(StatusCodes.OK).json(req.user);
};

module.exports = { login, logout, dashboard };
