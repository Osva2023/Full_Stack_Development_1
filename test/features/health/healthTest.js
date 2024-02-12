const chai = require('chai');
const sinon = require('sinon');
const HealthController = require('../src/features/health/health.controller');
const ResponseUtil = require('../src/shared/utils/response-util').ResponseUtil;

describe('HealthController',()=>{
  afterEach(() => {
    sinon.restore();
  });

  describe('#helloWorld()',()=>{
    it('respond with Hello World',(done)=>{
      sinon.stub(ResponseUtil,'respondOk').callsFake((res,data,message)=>{
        chai.assert.equal(message,'Hello World');
        done();
      });
      
      void HealthController.helloWorld();
    });
  });
});