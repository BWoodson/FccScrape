const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {User} = require('./../models/user');

// Clear the db before tests
before( (done) => {
  User.remove({})
  .then(() => done())
  .catch((e) => done(e));
});

describe('GET /scrape/:id', () => {
  it('should return a json document for a valid user', (done) => {
    var id = 'bwoodson';
    request(app)
      .get(`/scrape/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.profile).toBe(id);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.find({'profile': id}).then((user) => {
          expect(user.length).toExist().toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not return json document for a non-existent user', (done) => {
    var id = 'rgdcsjnsakdjncewnc';
    request(app)
      .get(`/scrape/${id}`)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.find().then((user) => {
          expect(user.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });
});