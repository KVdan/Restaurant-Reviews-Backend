import ReviewsDAO from "../DAO/reviewsDAO.js";

export default class ReviewsController {
    static async apiPostReview(req, res, next) {
        try {
            const restaurantId = req.body.restaurant_id;
            const review = req.body.text.replace(/\$/g, "&#038;");
            const userInfo = {
                name: req.body.name,
                _id: req.userId,
            };
            const date = new Date();

            const reviewResponse = await ReviewsDAO.addReview(
                restaurantId,
                userInfo,
                review,
                date
            );

            res.json({ status: "success", reviewResponse });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.body.review_id;
            const text = req.body.text.replace(/\$/g, "&#038;");
            const date = new Date();

            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                req.userId,
                text,
                date
            );

            var { error } = reviewResponse;
            if (error) {
                res.status(400).json({ error });
            }

            if (reviewResponse.modifiedCount === 0) {
                throw new Error(
                    "unable to update review - user may not be original poster"
                );
            }

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.query.id;
            const userId = req.userId;
            const reviewResponse = await ReviewsDAO.deleteReview(reviewId, userId);
            res.json({ status: "success", reviewResponse });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}