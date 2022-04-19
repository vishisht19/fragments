// src/routes/api/index.js
const express = require('express');
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
const router = express.Router();

//Get route
router.get('/fragments', require('./get'));

//Get/:id route
router.get('/fragments/:id', require('./get-id'));

//Get/:id/info route
router.get('/fragments/:id/info', require('./get-id-info'));

//POST route
// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // See if we can parse this content type. If we can, `req.body` will be
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });

// Use a raw body parser for POST, which will give a `Buffer` Object or `{}` at `req.body`
router.post('/fragments', rawBody(), require('./post'));

router.put('/fragments/:id', rawBody(), require('./put'));

router.delete('/fragments/:id', require('./delete-id'));
module.exports = router;
