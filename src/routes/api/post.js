const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

const fs = require('fs');
//var Buffer = require('buffer/').Buffer;
module.exports = async (req, res) => {
  try {
    const fragment = new Fragment({ ownerId: req.user, type: req.get('Content-Type') });
    await fragment.save();
    if (req.body == {} || req.body == '') {
      throw new Error('Data not valid');
    }
    //var buffer = FileReader.readAsBinaryString(req.body);
    if (req.get('Content-Type').match(`image/*`)) {
      // // Reads file in form buffer => <Buffer ff d8 ff db 00 43 00 ...
      const buffer = fs.readFileSync(req.body);
      //var fr = new FileReader();

      await fragment.setData(buffer);
    } else {
      if (req.body == {} || req.body == '') {
        throw new Error('Data not valid');
      }
      await fragment.setData(req.body);
    }

    // await fragment.setData(req.body);
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
