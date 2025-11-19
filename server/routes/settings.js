const express = require('express');
const router = express.Router();

const { getSettings, upsertSettings } = require('../controllers/settings');

router.route('/')
  .get(getSettings)
  .put(upsertSettings)
  .post(upsertSettings);

module.exports = router;