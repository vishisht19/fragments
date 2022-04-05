// src/routes/api/get-id.js
const { readFragmentData, readFragment } = require('../../model/data/index');
const { createErrorResponse } = require('../../response');
const path = require('path');
const contentType = require('content-type');

module.exports = async (req, res) => {
  try {
    let fragment_id = req.params.id;
    let ext = path.extname(fragment_id);
    let id = path.parse(fragment_id).name;
    let x = await readFragment(req.user, id);
    const { type } = contentType.parse(x.type);
    res.setHeader('Content-Type', type);

    if (ext == '') {
      let data = await readFragmentData(req.user, id);
      if (type.match(`text/html`)) {
        res.status(200).send(`${data}`);
      } else if (type.match(`text/markdown`)) {
        res.status(200).send(`${data}`);
      } else if (type.match(`application/json`)) {
        res.status(200).send(`${data}`);
      } else {
        res.status(200).send(data.toString());
      }
    } else if (ext == '.txt') {
      res.setHeader('Content-Type', 'text/plain');
      let data = await readFragmentData(req.user, id);
      res.status(200).send(data.toString('utf8'));
    } else if (ext == '.html') {
      res.setHeader('Content-Type', 'text/html');
      let data = await readFragmentData(req.user, id);
      res.status(200).send(`<h1>${data}</h1>`);
    } else if (ext == '.md') {
      res.setHeader('Content-Type', 'text/markdown');
      let data = await readFragmentData(req.user, id);
      res.status(200).send(`# ${data}`);
    } else {
      res.status(415).json(createErrorResponse(415, 'Extension cannot be recognized'));
    }
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'ID not found'));
  }
};
