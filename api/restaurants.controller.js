import RestaurantsDAO from "../DAO/restaurantsDAO.js";

export default class restaurantsController {
    static async apiGetRestaurants(req, res, next) {
        const restaurantsPerPage = req.query.restaurantsPerPage ?
            parseInt(req.query.restaurantsPerPage, 10) :
            20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};
        if (req.query.cuisine) {
            filters.cuisine = req.query.cuisine;
        }
        if (req.query.name) {
            filters.name = req.query.name;
        }

        const { restaurantsList, totalNumRestaurants } =
        await RestaurantsDAO.getRestaurants({
            filters,
            page,
            restaurantsPerPage,
        });

        let response = {
            filters: filters,
            total_results: totalNumRestaurants,
            entries_per_page: restaurantsPerPage,
            page: page,
            restaurants: restaurantsList,
        };
        res.json(response);
    }

    static async apiGetRestaurantById(req, res, next) {
        try {
            let id = req.params.id || {};
            let restaurant = await RestaurantsDAO.getRestaurantByID(id);
            if (!restaurant) {
                res.status(404).json({ error: "Not found" });
                return;
            }
            res.json(restaurant);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiGetRestaurantCuisines(req, res, next) {
        try {
            let cuisines = await RestaurantsDAO.getCuisines();
            res.json(cuisines);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }
}