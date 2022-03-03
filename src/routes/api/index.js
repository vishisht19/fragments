// src/routes/api/index.js
const { readFragmentData } = require('../../model/data/memory/index');
const express = require('express');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
var Buffer = require('buffer/').Buffer;
const router = express.Router();
const path = require('path');

//Get route
router.get('/fragments', (req, res) => {
  // TODO: this is just a placeholder to get something working...
  let data = { fragments: [] };
  res.status(200).json(createSuccessResponse(data));
});

//Get/:id route
router.get('/fragments/:id', async function (req, res) {
  try {
    let ext = path.extname(req.params.id);

    if (ext == '') {
      let data = await readFragmentData(req.user, req.params.id);
      let data1 = data.toString('utf8');
      res.set('Content-Type', 'text/plain');
      res.status(200).json(data1);
    } else if (ext == '.txt') {
      const file = req.params.id;
      const filename = file.split('.').slice(0, -1).join('.');
      let data = await readFragmentData(req.user, filename);
      let data1 = data.toString('utf8');
      res.set('Content-Type', 'text/plain');
      res.status(200).json(data1);
    } else {
      throw new Error('Extension not recognized');
    }
  } catch (err) {
    res.status(404).json(createErrorResponse(404, err));
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
