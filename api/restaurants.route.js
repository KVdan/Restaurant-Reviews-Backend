import express from "express";
import RestaurantsCtroller from "./restaurants.controller.js";
import ReviewsController from "./review.controller.js";
import UsersController from "./users.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(RestaurantsCtroller.apiGetRestaurants);
router.route("/id/:id").get(RestaurantsCtroller.apiGetRestaurantById);
router.route("/cuisines").get(RestaurantsCtroller.apiGetRestaurantCuisines);
router
    .route("/review")
    .post(auth, ReviewsController.apiPostReview)
    .put(auth, ReviewsController.apiUpdateReview)
    .delete(auth, ReviewsController.apiDeleteReview);

router.route("/user/signin").post(UsersController.apiSignIn);
router.route("/user/signup").post(UsersController.apiSignUp);

export default router;