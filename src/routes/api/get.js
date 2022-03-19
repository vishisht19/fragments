//  src/routes/api/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    let queryData = req.query.expand;
    let expandStatus = false;
    let metaData;
    if (queryData == 1) {
      expandStatus = true;
    }
    metaData = await Fragment.byUser(req.user, expandStatus);
    res.status(200).json(
      createSuccessResponse({
        fragments: metaData,
      })
    );
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'No such fragment exist'));
  }
};
