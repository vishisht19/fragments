// src/routes/api/get-id.js
const { createErrorResponse } = require('../../response');
const path = require('path');
const contentType = require('content-type');
var md = require('markdown-it')();
const { Fragment } = require('../../model/fragment');
var TurndownService = require('turndown');
var turndownService = new TurndownService();
const sharp = require('sharp');
//const fs = require('fs');

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
        // const fs = require("fs");
        // // Reads file in form buffer => <Buffer ff d8 ff db 00 43 00 ...
        // const buffer = fs.readFileSync("path-to-image.jpg");
        // img.src = URL.createObjectURL(await res.blob());
        res.status(200).send(data);
        //  res.status(200).send(fs.writeFileSync('file1.png', data));
      } else {
        res.status(200).send(`${data}`);
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
      //var convert = md.render(data.toString('utf8'));
      res.status(200).send(markdown.toString('utf8'));
    } else if (ext == '.jpg') {
      res.setHeader('Content-Type', 'image/jpeg');
      let data = await fragment2.getData(req.user, id);
      res.status(200).send(sharp(data).toFormat('jpeg'));
    } else if (ext == '.webp') {
      res.setHeader('Content-Type', 'image/webp');
      let data = await fragment2.getData(req.user, id);
      res.status(200).send(sharp(data).toFormat('webp'));
    } else if (ext == '.gif') {
      res.setHeader('Content-Type', 'image/gif');
      let data = await fragment2.getData(req.user, id);
      res.status(200).send(sharp(data).toFormat('gif'));
    } else if (ext == '.png') {
      res.setHeader('Content-Type', 'image/png');
      let data = await fragment2.getData(req.user, id);
      res.status(200).send(sharp(data).toFormat('png'));
    } else {
      res.status(415).json(createErrorResponse(415, 'Extension cannot be recognized'));
    }
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'ID not found'));
  }
};
