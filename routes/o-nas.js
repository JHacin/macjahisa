const express = require('express');
const router = express.Router({ mergeParams: true });
const { renderGenericPage } = require('./util');

router.get('/:podstran', renderGenericPage);

module.exports = router;
