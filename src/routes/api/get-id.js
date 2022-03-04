// src/routes/api/get-id.js
const { readFragmentData } = require('../../model/data/memory/index');
const { createErrorResponse } = require('../../response');
const path = require('path');

module.exports = async (req, res) => {
  try {
    let ext = path.extname(req.params.id);
    if (ext == '') {
      let data = await readFragmentData(req.user, req.params.id);
      res.setHeader('Content-Type', 'text/plain');
      res.status(200).json(data.toString('utf8'));
    } else if (ext == '.txt') {
      const id = req.params.id.split('.').slice(0, -1).join('.');
      let data = await readFragmentData(req.user, id);
      res.setHeader('Content-Type', 'text/plain');
      res.status(200).json(data.toString('utf8'));
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
