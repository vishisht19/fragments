const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
//var Buffer = require('buffer/').Buffer;
module.exports = async (req, res) => {
  try {
    //let id = req.params.id;
    let fragment2 = await Fragment.byId(req.user, req.params.id);
    const { type } = contentType.parse(fragment2.type);
    if (req.get('Content-Type') != type) {
      res.status(400).json(createErrorResponse(400, 'Content Type does not match'));
    } else {
      await Fragment.delete(req.user, req.params.id);
      await fragment2.setData(req.body);
      await fragment2.save();
      res.set('Location', ` http://${req.headers.host}/v1/fragments/${fragment2.id}`);
      res.status(200).json(
        createSuccessResponse({
          fragment: fragment2,
        })
      );
    }
  } catch (err) {
    res
      .status(404)
      .json(createErrorResponse(404, 'No Fragment with provided Id exists in the system'));
  }
};
