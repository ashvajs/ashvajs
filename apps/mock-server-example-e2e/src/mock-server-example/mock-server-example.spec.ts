import axios from 'axios';

describe('GET /', () => {
  it('should return for test/get.json ', async () => {
    const res = await axios.get(`/api/v1/test`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      status: 'succes',
      data: {
        examples: 'get response example',
      },
    });
  });
  it('should return for test/post.json ', async () => {
    const res = await axios.post(`/api/v1/test`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      status: 'succes',
      data: {
        examples: 'post response example',
      },
    });
  });
});
