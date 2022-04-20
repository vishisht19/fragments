// src/routes/api/get-id-info.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const path = require('path');

module.exports = async (req, res) => {
  try {
    let fragment_id = req.params.id;
    let id = path.parse(fragment_id).name;
    let data = await Fragment.byId(req.user, id);
    res.status(200).json(
      createSuccessResponse({
        fragment: data,
      })
    );
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'No such fragment exist'));
  }
};
