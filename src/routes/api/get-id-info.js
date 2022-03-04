// src/routes/api/get-id-info.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    let data = await Fragment.byId(req.user, req.params.id);
    res.status(200).json(
      createSuccessResponse({
        fragment: data,
      })
    );
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'No such fragment exist'));
  }
};
