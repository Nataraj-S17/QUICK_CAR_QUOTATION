const carService = require('../services/carService');

/**
 * Get list of cars with filters
 * Public Route
 */
exports.getCars = async (req, res) => {
    try {
        const { min_price, max_price, fuel_type, min_mileage } = req.query;

        const filters = {
            min_price: min_price ? parseFloat(min_price) : undefined,
            max_price: max_price ? parseFloat(max_price) : undefined,
            fuel_type: fuel_type,
            min_mileage: min_mileage ? parseInt(min_mileage) : undefined
        };

        const cars = await carService.fetchCarsWithFilters(filters);

        res.json({
            success: true,
            count: cars.length,
            data: cars
        });

    } catch (err) {
        console.error('Get Cars Error:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching cars'
        });
    }
};
