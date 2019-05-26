const express = require('express');
const router = express.Router();
const authMiddleware = require('./middleware/Authenticator');

const toolController = require('./controller/ToolController');
const authenticationController = require('./controller/AuthenticationController');

router.use(authMiddleware);

router.get('/authenticate', authenticationController.authenticate);

router.get('/tools', toolController.getTools);
router.get('/tools/:_id', toolController.getToolById);
router.post('/tools', toolController.includeTool);
router.delete('/tools/:_id', toolController.deleteTool);

module.exports = router;
