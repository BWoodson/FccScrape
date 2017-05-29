const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');

describe('GET /scrape/:id', () => {
  it('should return a json document', (done) => {
    var id = 'bwoodson';
    request(app)
      .get(`/scrape/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(id);
      })
      .end(done);
  });

  it('should not return json document', (done) => {
    request(app)
      .get(`/scrape/rgdcsjnsakdjncewnc`)
      .expect(404)
      .end(done);
  });
});