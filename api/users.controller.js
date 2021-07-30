import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UsersDAO from "../DAO/usersDAO.js";
import escapeSpecChars from "../middleware/stringFilters.js";
import isEmail from "validator/lib/isEmail.js";

export default class UsersController {
    static apiSignIn = async(req, res) => {
        try {
            const { email, password } = req.body;
            const user = {
                email: escapeSpecChars(email),
                password: escapeSpecChars(password),
            };

            // check if email is valid
            if (!isEmail(email)) {
                console.log("Invalid email address.");
                return res.status(400).json({ message: "Invalid email address." });
            }

            // check if user exists
            const isUserResponse = await UsersDAO.isUser(user);

            if (!isUserResponse) {
                return res.status(422).json({ message: "User doesn`t exists." });
            }

            const isPasswordCorrect = await bcrypt.compare(
                password,
                isUserResponse.password
            );

            if (!isPasswordCorrect) {
                return res.status(400).json({ message: "Wrong password." });
            }

            const token = jwt.sign({ email: isUserResponse.email, id: isUserResponse._id },
                "test", {
                    expiresIn: "1h",
                }
            );

            res.status(200).json({ isUserResponse, token });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    };

    static apiSignUp = async(req, res) => {
        const { email, password, confirmPassword, firstName, lastName } = req.body;
        console.log(req.body);
        const user = {
            email: escapeSpecChars(email),
            password,
            name: `${escapeSpecChars(firstName)} ${escapeSpecChars(lastName)}`,
        };
        console.log(user);

        // check if email is valid
        if (!isEmail(user.email)) {
            return res.status(400).json({ message: "Invalid email address." });
        }

        // check confirmPassword
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }
        try {
            const hashedPassword = await bcrypt.hash(password, 12);

            const isUserResponse = await UsersDAO.isUser(user);
            // check user existence
            if (isUserResponse) {
                res.status(422).json({ message: "Users already exists." });
            } else {
                const userResponse = await UsersDAO.addUser({
                    ...user,
                    password: hashedPassword,
                });

                const token = jwt.sign({ email, id: userResponse.ops[0]._id }, "test", {
                    expiresIn: "1h",
                });

                res
                    .status(200)
                    .json({ status: "success", user: userResponse.ops[0], token });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    };
}