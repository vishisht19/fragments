// src/routes/api/get-id.js
const { createErrorResponse } = require('../../response');
const path = require('path');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    let fragment_id = req.params.id;
    let ext = path.extname(fragment_id);
    let id = path.parse(fragment_id).name;
    let data = await Fragment.getOrConvert(req.user, ext, id);
    const header = data[0],
      frag_data = data[1],
      code = data[2];

    if (code == 415) {
      res.status(415).json(createErrorResponse(415, 'Extension cannot be recognized'));
    } else {
      res.setHeader('Content-Type', header);
      res.status(200).send(frag_data);
    }
  } catch {
    res.status(404).json(createErrorResponse(404, 'ID not found'));
  }
};
