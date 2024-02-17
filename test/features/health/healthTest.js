const chai = require('chai');
const sinon = require('sinon');
const HealthController = require('../../../src/features/health/health.controller');
const ResponseUtil = require('../../../src/shared/utils/response-util').ResponseUtil;

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
  describe('#status()',()=>{
    it('respond with Environment',async()=>{
      const sendStub = sinon.stub();
      const res = {send:sendStub};
      

      await HealthController.status(null,res);
      const envName = process.env.ENV_NAME;
      const port = process.env.PORT || 3004;
      expectedMessage = `Environment '${envName}' running on port: ${port}`;
      sinon.assert.calledWith(sendStub, expectedMessage);
    });
  });
  describe('#error()',()=>{
    it('respond with error',()=>{
      const statusStub = sinon.stub();
      const sendStub = sinon.stub();    
      const res = {status:statusStub,send:sendStub};

      HealthController.error(null,res);
      sinon.assert.calledWith(statusStub,400);
      sinon.assert.calledWith(sendStub,'error');
    });
  });
     
});