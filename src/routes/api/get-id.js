// // src/routes/api/get-id.js
// const { readFragmentData } = require('../../model/data/memory/index');
// const { createErrorResponse } = require('../../response');
// const path = require('path');

// module.exports = async (req, res) => {
//   try {

//     let ext = path.extname(req.params.id);
//     if (ext == '') {
//       let data = await readFragmentData(req.user, req.params.id);
//     //  res.setHeader('Content-Type', 'text/plain');
//       res.status(200).json(data.toString('utf8'));
//     } else if (ext == '.txt') {
//       const id = req.params.id.split('.').slice(0, -1).join('.');
//       let data = await readFragmentData(req.user, id);
//       res.setHeader('Content-Type', 'text/plain');
//       res.status(200).json(data.toString('utf8'));
//     } else {
//       res.status(415).json(createErrorResponse(415, 'Extension cannot be recognized'));
//     }
//   } catch (err) {
//     let data = await readFragmentData(req.user, req.params.id);
//     let status = err.status || 415;
//     if (!data) {
//       status = 404;
//     }
//     res.status(status).json(createErrorResponse(status, 'ID not found'));
//   }
// };

// src/routes/api/get-id.js
const { readFragmentData, readFragment } = require('../../model/data/memory/index');
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
        res.status(200).json(`<h1>${data}</h1>`);
      } else {
        res.status(200).json(data.toString('utf8'));
      }
    } else if (ext == '.txt') {
      res.setHeader('Content-Type', 'text/plain');
      let data = await readFragmentData(req.user, id);
      res.status(200).json(data.toString('utf8'));
    } else if (ext == '.html') {
      res.setHeader('Content-Type', 'text/html');
      let data = await readFragmentData(req.user, id);
      res.status(200).json(`<h1>${data}</h1>`);
    } else {
      res.status(415).json(createErrorResponse(415, 'Extension cannot be recognized'));
    }
  } catch (err) {
    let data = await readFragmentData(req.user, req.params.id);
    let status = err.status || 415;
    if (!data) {
      status = 404;
    }
    res.status(status).json(createErrorResponse(status, 'ID not found'));
  }
};
