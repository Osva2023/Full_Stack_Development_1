const AgentController = require('../features/agent/agent.controller');

const registerAgentRoutes = (app) => {
  app.post('/agent-create', AgentController.createAgent);

  app.get('/agents', AgentController.getAllAgents);

  app.get('/agents-by-region', AgentController.getAgentsByRegion);

  app.post('/agent-update-info/:id', AgentController.updateAgentInfo);

  app.post('/agent-delete/:id', AgentController.deleteAgent);
}

module.exports = {registerAgentRoutes};