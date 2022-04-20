// src/routes/api/get-id.js
const { createErrorResponse } = require('../../response');
const path = require('path');
const contentType = require('content-type');
var md = require('markdown-it')();
const { Fragment } = require('../../model/fragment');
var TurndownService = require('turndown');
var turndownService = new TurndownService();
const sharp = require('sharp');

module.exports = async (req, res) => {
  try {
    let fragment_id = req.params.id;
    let ext = path.extname(fragment_id);
    let id = path.parse(fragment_id).name;
    let fragment2 = await Fragment.byId(req.user, id);
    const { type } = contentType.parse(fragment2.type);
    res.setHeader('Content-Type', type);

    if (ext == '') {
      let data = await fragment2.getData();
      if (type.match(`image/*`)) {
        res.status(200).send(data);
      } else {
        res.status(200).send(data.toString('utf8'));
      }
    } else if (ext == '.txt') {
      res.setHeader('Content-Type', 'text/plain');
      let data = await fragment2.getData(req.user, id);
      res.status(200).send(data.toString('utf8'));
    } else if (ext == '.html') {
      res.setHeader('Content-Type', 'text/html');
      let data = await fragment2.getData(req.user, id);
      var result = md.render(data.toString('utf8'));
      res.status(200).send(result.toString('utf8'));
    } else if (ext == '.md') {
      res.setHeader('Content-Type', 'text/markdown');
      let data = await fragment2.getData(req.user, id);
      var markdown = turndownService.turndown(data.toString('utf8'));
      res.status(200).send(markdown.toString('utf8'));
    } else if (ext == '.jpg') {
      res.setHeader('Content-Type', 'image/jpeg');
      let data = await fragment2.getData(req.user, id);
      res.status(200).send(sharp(data).toFormat('jpeg').toBuffer());
    } else if (ext == '.webp') {
      res.setHeader('Content-Type', 'image/webp');
      let data = await fragment2.getData(req.user, id);
      res.status(200).send(sharp(data).toFormat('webp').toBuffer());
    } else if (ext == '.gif') {
      res.setHeader('Content-Type', 'image/gif');
      let data = await fragment2.getData(req.user, id);
      res.status(200).send(sharp(data).toFormat('gif').toBuffer());
    } else if (ext == '.png') {
      res.setHeader('Content-Type', 'image/png');
      let data = await fragment2.getData(req.user, id);
      res.status(200).send(sharp(data).toFormat('png').toBuffer());
    } else {
      res.status(415).json(createErrorResponse(415, 'Extension cannot be recognized'));
    }
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'ID not found'));
  }
};
