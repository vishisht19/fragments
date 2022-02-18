// src/routes/api/index.js

const express = require('express');

const router = express.Router();

router.get('/fragments', require('./get'));

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
var Buffer = require('buffer/').Buffer;
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
    // eslint-disable-next-line no-unused-vars
    verify: async (req, res, buf, encoding) => {
      req.rawBody = buf;
      if (!Buffer.isBuffer(Buffer.from(buf))) {
        res.status(415).json(createErrorResponse(415, 'Cannot post fragment'));
      }
      if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
      }
      try {
        const fragment = new Fragment({ ownerId: req.user, type: req.get('Content-Type') });
        await fragment.save();

        await fragment.setData(Buffer.from(buf));

        res.set('Content-Type', fragment.type);
        res.status(201).json(
          createSuccessResponse({
            fragment: fragment,
          })
        );
      } catch (err) {
        res.status(415).json(createErrorResponse(415, err));
      }
    },
  });

// Use a raw body parser for POST, which will give a `Buffer` Object or `{}` at `req.body`
router.post('/fragments', rawBody());

module.exports = router;
