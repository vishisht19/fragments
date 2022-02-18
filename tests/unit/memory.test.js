/* eslint-disable no-unused-vars */
const MemoryDB = require('../../src/model/data/memory/memory-db');

const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('../../src/model/data/memory/index.js');

beforeEach(() => {
  const data = new MemoryDB();
  const metadata = new MemoryDB();
});

// Define (i.e., name) the set of tests we're about to do
describe('Fragments modifications', () => {
  // Write a test for calling createErrorResponse()
  test('readFragment()', () => {
    const data = { value: 123 };
    writeFragmentData('a', 'b', data);
    // Expect the result to look like the following
    const readResponse = readFragmentData('a', 'b');
    expect(readResponse).toEqual(data);
  });

  // Write a test for calling createSuccessResponse() with no argument
  test('writeFragment()', () => {
    const fragmentData = { ownerId: 'a', Id: 'b', fragment: {} };
    const successResponse = writeFragment(fragmentData);
    // No arg passed
    //readFragment('a', 'b');
    // Expect the result to look like the following
    expect(successResponse).toBe(undefined);
  });

  // Write a test for calling createSuccessResponse() with an argument
  test('createSuccessResponse(data)', () => {
    // Data argument included
    const data = { a: 1, b: 2 };
    const successResponse = createSuccessResponse(data);
    // Expect the result to look like the following
    expect(successResponse).toEqual({
      status: 'ok',
      a: 1,
      b: 2,
    });
  });
});
