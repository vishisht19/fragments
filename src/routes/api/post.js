const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    const fragment = new Fragment({ ownerId: req.user, type: req.get('Content-Type') });
    await fragment.save();
    await fragment.setData(req.body);
    res.set('Location', ` http://${req.headers.host}/v1/fragments/${fragment.id}`);
    res.status(201).json(
      createSuccessResponse({
        fragment: fragment,
      })
    );
  } catch (err) {
    res.status(415).json(createErrorResponse(415, err));
  }
};
