// src/routes/api/index.js
const { readFragmentData } = require('../../model/data/memory/index');
const express = require('express');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
var Buffer = require('buffer/').Buffer;
const router = express.Router();

//Get route
router.get('/fragments', (req, res) => {
  // TODO: this is just a placeholder to get something working...
  let data = { fragments: [] };
  res.status(200).json(createSuccessResponse(data));
});

//Get/:id route
router.get('/fragments/:id', async function (req, res) {
  try {
    let data = await readFragmentData(req.user, req.params.id);
    data = data.toString('utf8');
    res.status(200).json(data);
  } catch (err) {
    res.status(415).json(createErrorResponse(415, err));
  }
});

//Get/:id/info route
router.get('/fragments/:id/info', async function (req, res) {
  try {
    let data = await Fragment.byId(req.user, req.params.id);
    res.status(200).json(
      createSuccessResponse({
        fragment: data,
      })
    );
  } catch (err) {
    res.status(415).json(createErrorResponse(415, err));
  }
});

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
        // eslint-disable-next-line no-undef
        res.set('Location', ` ${req.headers.host}/v1/fragments/${fragment.id}`);

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
