/* eslint-disable no-unused-vars */
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('../../src/model/data/memory/index.js');

describe('Fragments modifications', () => {
  // Write a test for calling createErrorResponse()
  test('readFragmentData()', async () => {
    const data = 'Hello';
    await writeFragmentData('aa', 'bb', data);
    // Expect the result to look like the following
    expect(await readFragmentData('aa', 'bb')).toEqual(data);
  });

  test('readFragment()', async () => {
    const fragmentData = { ownerId: 'a', id: 'b' };
    await writeFragment(fragmentData);
    // Expect the result to look like the following
    expect(await readFragment('a', 'b')).toEqual(fragmentData);
  });

  test('writeFragment()', async () => {
    const fragmentData = { ownerId: 'a', id: 'b', fragment: {} };
    const successResponse = await writeFragment(fragmentData);
    // Expect the result to look like the following
    expect(successResponse).toEqual(undefined);
  });

  test('writeFragmentData()', async () => {
    const successResponse = await writeFragmentData('x', 'y', 'This is the value');
    // Expect the result to look like the following
    expect(await readFragmentData('x', 'y')).toEqual('This is the value');
  });

  test('listFragments() returns all secondaryKey values', async () => {
    await writeFragmentData('i', 'a', '1');
    await writeFragmentData('i', 'b', '2');
    await writeFragmentData('i', 'c', '3');

    //  expect(Array.isArray(results)).toBe(true);
    expect(await listFragments('i', false).toEqual('1', '2', '3'));
  });
});
