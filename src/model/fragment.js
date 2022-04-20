// Use https://www.npmjs.com/package/nanoid to create unique IDs
const { nanoid } = require('nanoid');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
var Buffer = require('buffer/').Buffer;

const logger = require('../logger');
// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    this.id = id;
    if (!id) {
      this.id = nanoid();
    }
    this.ownerId = ownerId;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();

    if (!ownerId) {
      throw new Error(`OwnerID string is required`);
    }
    if (!type) {
      throw new Error(`type string is required`);
    }
    if (typeof size == 'number' && size == parseInt(size)) {
      this.size = size;
      if (size < 0) {
        throw new Error(`Cannot be negative`);
      }
    } else {
      throw new Error(`Not a number`);
    }
    if (Fragment.isSupportedType(type) === true) {
      this.type = type;
    } else {
      throw new Error(`Not Supported`);
    }
    // TODO
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    try {
      logger.debug({ ownerId, expand }, 'Fragment.byUser()');
      let x = await listFragments(ownerId, expand);
      // if (x == [undefined] || x === [undefined] || x == [{}] || x === {}) {
      //   return [];
      // } else {
      return x;
      // }
    } catch (err) {
      return [];
    }
  }
  // this.updated = new Date().toISOString();
  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const req = await readFragment(ownerId, id);
    const frag = new Fragment({
      ownerId: req.ownerId,
      type: req.type,
      id: req.id,
      created: req.created,
      updated: req.updated,
      size: req.size,
    });
    if (frag === undefined) {
      throw new Error('Does not exist');
    } else {
      return frag;
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    // TODO
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    // TODO
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    // TODO
    // if (!Buffer.isBuffer(data)) {
    //   throw new Error('data is not a Buffer');
    // }
    this.updated = new Date().toISOString();
    var str = data;
    this.size = Buffer.byteLength(str, 'utf-8');
    this.save();
    return writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */

  get isText() {
    // TODO`
    let ret = false;
    const { type } = contentType.parse(this.type);
    if (type.match(`text/*`)) {
      ret = true;
    }
    return ret;
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    // TODO
    let format = ['text/plain'];
    return format;
  }
  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    // TODO
    const { type } = contentType.parse(value);
    // var re = new RegExp('/text*/');
    if (type.match(`text/*`) || type.match('application/json') || type.match(`image/*`)) {
      return true;
    } else {
      return false;
    }
    // return value.isText();
  }
}

module.exports.Fragment = Fragment;
