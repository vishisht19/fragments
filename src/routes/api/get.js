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
    } else if (queryData > 1) {
      throw new Error();
    }
    metaData = await Fragment.byUser(req.user, expandStatus);
    res.status(200).json(
      createSuccessResponse({
        fragments: metaData,
      })
    );
  } catch (err) {
    res.status(400).json(createErrorResponse(400, 'Invalid request'));
  }
};
