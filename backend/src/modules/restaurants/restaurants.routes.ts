import { Router } from 'express';
import { getRestaurantController, getRestaurantMenuController, listRestaurantsController } from './restaurants.controller.js';

export const restaurantsRouter = Router();

restaurantsRouter.get('/', listRestaurantsController);
restaurantsRouter.get('/:id', getRestaurantController);
restaurantsRouter.get('/:id/menu', getRestaurantMenuController);
