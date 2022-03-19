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
    const results = listFragments('vvxczc', true);
    expect(await results).toEqual([undefined]);
  });

  test('deleteFragment() removes value put() into db', async () => {
    await writeFragmentData('a', 'b', { value: 1 });
    expect(await readFragmentData('a', 'b')).toEqual({ value: 1 });
    await deleteFragment('a', 'b');
    expect(await readFragmentData('a', 'b')).toBe(undefined);
  });
});
