import * as supertest from 'supertest';
import { server } from '../app/main.js'

describe('loading express', function () {
  afterEach(function () {
    server.close();
  });

  it('Test successful API call', function testLedgerEP(done) {
    supertest.agent(server)
      .get('/ledger?start_date=2020-01-31&end_date=2021-03-31&frequency=MONTHLY&weekly_rent=555')
      .trustLocalhost()
      .expect(200, done);
  });

  it('Test Missing Query Params', function testLedgerEP(done) {
    supertest.agent(server)
      .get('/ledger?start_date=2020-01-31&frequency=MONTHLY&weekly_rent=555')
      .trustLocalhost()
      .expect(400, done);
  });

  it('404 everything else', function testInvalidPath(done) {
    supertest.agent(server)
      .get('/foo/bar')
      .trustLocalhost()
      .expect(404, done);
  });

  // TODO: Further tests can be added to check the scenarios
});