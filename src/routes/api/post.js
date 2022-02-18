// /* eslint-disable no-unused-vars */
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = (req, res) => {
  logger.debug(`Accept new req`);

  try {
    const fragment = new Fragment({ ownerId: req.user, type: req.get('Content-Type') });
    fragment.save();

    fragment.setData(req.data);

    logger.debug({ fragment }, `Created new fragment`);
    res.setHeader('Cache-Control', 'no-cache');
    res.set('Content-Type', fragment.type);
    res.status(201).json(
      createSuccessResponse({
        fragment: fragment,
      })
    );
  } catch (err) {
    res.status(415).json(createErrorResponse(415, err));
  }
};
