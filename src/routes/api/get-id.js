// src/routes/api/get-id.js
const { createErrorResponse } = require('../../response');
const path = require('path');
const contentType = require('content-type');
var md = require('markdown-it')();
const { Fragment } = require('../../model/fragment');
var TurndownService = require('turndown');
var turndownService = new TurndownService();
//var gm = require('gm');
const sharp = require('sharp');

//const webp = require('webp-converter');
//var Buffer = require('buffer/').Buffer;
const pngToJpeg = require('png-to-jpeg');

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
        res.status(200).send(data.toString('base64'));
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
      //For conversion between images we dont need sharp, we just need to assign the content type
      res.setHeader('Content-Type', 'image/jpeg');
      // let data = await fragment2.getData(req.user, id);
      // var buf = await sharp(data).toFormat('jpeg').toBuffer();
      // // .then((buf) => res.status(200).send(buf.toString('base64')))
      // // .catch((err) => console.log(err));

      let data = await fragment2.getData(req.user, id);
      // var buf = gm(data).resize(100, 100).toBuffer('JPEG');
      pngToJpeg({ quality: 90 })(data).then((output) =>
        res.status(200).send(output.toString('base64'))
      );

      //  res.status(200).send(buf.toString('base64'));
    } else if (ext == '.webp') {
      res.setHeader('Content-Type', 'image/webp');
      let data = await fragment2.getData(req.user, id);
      //var dataBase64 = Buffer.from(data).toString('base64');
      // let rest = await webp.buffer2webpbuffer(data, 'png', '-q 80');

      // rest.then(function (result) {
      //   // you access the value from the promise here
      //   res.status(200).send(result.toString('base64'));
      // });

      res.status(200).send(data.toString('base64'));
    } else if (ext == '.gif') {
      res.setHeader('Content-Type', 'image/gif');
      let data = await fragment2.getData(req.user, id);
      res.status(200).send(data.toString('base64'));
    } else if (ext == '.png') {
      res.setHeader('Content-Type', 'image/png');
      const data = await fragment2.getData(req.user, id);

      sharp(data)
        .toFormat('png')
        .toBuffer()
        .then((data) => {
          var buff = data.toString('base64');
          res.status(200).send(buff);
        })
        .catch((err) => {
          console.log(err);
        });

      // var buff = gm(data.toBuffer('PNG'));
      // res.status(200).send(buff);
    } else {
      res.status(415).json(createErrorResponse(415, 'Extension cannot be recognized'));
    }
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'ID not found'));
  }
};
