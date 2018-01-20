let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
let th = require('./testHelper.js');
process.env.TESTMODE = true;
let app = require('../lib//app.js');

let fs = {
  readFileSync: (fileName) => {
    return `{"teja" : {"username" : "tejam"},
  "nrjais" : {"username" : "nrjais", "sessionId" : "12345"}}`
  }
}

app.initialize(fs);

describe('app', () => {
  describe('GET /bad', () => {
    it('responds with 404', done => {
      request(app, { method: 'GET', url: '/bad' }, (res) => {
        assert.equal(res.statusCode, 404);
        done();
      })
    })
  })

  describe('login handler', () => {
    describe('get /', () => {
      it('it serves login page if the user not loggedIn', () => {
        request(app, { method: 'GET', headers: {}, url: '/' }, (res) => {
          assert.equal(res.statusCode, 200);
          th.body_contains(res, 'Login here');
        })
      })
    })
    describe('get /login', () => {
      it('it serves login page if the user not loggedIn', () => {
        request(app, { method: 'GET', headers: {}, url: '/' }, (res) => {
          assert.equal(res.statusCode, 200);
          th.body_contains(res, 'Login here');
        })
      })

      it('redirect to todolists page if user loggedin', () => {
        request(app, { method: 'GET', url: '/login', headers: { cookie: "sessionid=12345" } }, (res) => {
          th.should_be_redirected_to(res, '/todolists');
        })
      })
    })
    describe('post /login badUser', () => {
      it('redirect to login page ', () => {
        request(app, { method: 'POST', url: '/login', body: `userId=rajm` }, (res) => {
          th.should_be_redirected_to(res, '/login');
        })
      });
      it('redirect to login page when no userID is given', () => {
        request(app, { method: 'POST', url: '/login', body: `userId=` }, (res) => {
          th.should_be_redirected_to(res, '/login');
        })
      })
      it('sets message cookie with a Login Failed', () => {
        request(app, { method: 'POST', url: '/login', body: `userId=rajm` }, (res) => {
          th.should_have_cookie(res, 'message', 'Login Failed');
        })
      })
    })
    describe('post /login validUser', () => {
      it('should set sessionId cookie', () => {
        request(app, { method: 'POST', url: '/login', body: `userId=teja` }, (res) => {
          th.should_have_cookie(res, 'sessionid');
        })
      })
      it('should redirect home page', () => {
        request(app, { method: 'POST', url: '/login', body: `userId=teja` }, (res) => {
          th.should_be_redirected_to(res, '/todolists');
        })
      })
    })
  });
  describe('logout handler', () => {
    describe('/logout', () => {
      it('should logout the user when user is logged in', () => {
        request(app, { method: 'GET', url: '/logout', headers: { cookie: "sessionid=12345" } }, (res) => {
          th.should_be_redirected_to(res, '/');
        })
      });
      it('should redirect to / when user is not logged in', () => {
        request(app, { method: 'GET', url: '/logout' }, (res) => {
          th.should_be_redirected_to(res, '/login');
        })
      });
    });
  });

  describe('todolists handler', () => {
    describe('GET /todolists', () => {
      it('should redirect to login when not logged in', () => {
        request(app, { method: 'GET', url: '/todolists'}, (res) => {
          th.should_be_redirected_to(res, '/login');
        });
      });
      it('should respond with todolists page with no lists present', () => {
        request(app, { method: 'GET', url: '/todolists', headers: { cookie: "sessionid=12345" } }, (res) => {
          th.body_contains(res, 'Title :')
          th.body_contains(res, 'Description :');
        });
      });
    });

    describe('POST /todolists', () => {
      describe('saves todolist', () => {
        it('should add a todo list for user', () => {
          request(app, {
            method: 'POST', url: '/todolists',
            body: `title=test&description=testing`,
            headers: { cookie: 'sessionid=12345' }
          }, res => {
            th.should_be_redirected_to(res, '/todolists');
          })
        });
        it('should respond with the added todolist', () => {
          request(app, {
            method: 'GET', url: '/todolists',
            headers: { cookie: 'sessionid=12345' }
          }, res => {
            th.body_contains(res, 'test');
            th.body_contains(res, 'Title :')
            th.body_contains(res, 'Description :');
          })
        });
      });
    });
  });
});
