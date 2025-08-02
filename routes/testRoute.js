import express from 'express'

import { testController } from '../controllers/testController.js';

//router object
const router = express.Router()

//route
router.get('/test', testController);


// export
export default router