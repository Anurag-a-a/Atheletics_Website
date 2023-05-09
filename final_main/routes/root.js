import {Router} from 'express';
const router = Router();
import * as middleware from '../middleware.js';
import xss from 'xss';
import session from 'express-session';

router.route('/').get(middleware.rootMiddleware,async (req, res) => {
  return res.json({error: 'YOU SHOULD NOT BE HERE!'});
});



export default router;