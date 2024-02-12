const Agent = require('../../shared/db/mongodb/schemas/agent.Schema')
const asyncWrapper = require('../../shared/util/base-utils')

const createAgent = asyncWrapper( async (req,res) => {
  const agent = await  Agent.create(req.body);
  res.status(201).json({ msg: 'Agent created', data: agent }); 
});

const getAllAgents = asyncWrapper( async (req,res) => {
  const agents = await Agent.find({});
  const agentsAlpha = agents.sort((a, b) => a.last_name.localeCompare(b.last_name));
  res.status(200).json({ data: agentsAlpha });
});

const getAgentsByRegion = asyncWrapper( async (req,res) => {
  const regionSelected = req.query.region;
  const agents = await Agent.find({ region: regionSelected.toLowerCase() });
  if(agents.length === 0){
    res.status(404).json({ msg: `No agents found in ${regionSelected}` })
    return;
  }
  res.status(200).json({ agents });
});

const updateAgentInfo = asyncWrapper( async (req,res) => {
  const { id:agentID } = req.params;
  const agent = await Agent.findByIdAndUpdate({ _id:agentID }, req.body, {
    new:true,
    runValidators:true
  });
  if (!agent) {
    return res.status(404).json({ msg:`No agent with id ${agentID}` })    
  }
  res.status(200).json({ agent }) 
});

const deleteAgent = asyncWrapper( async (req,res) => {
  const { id:agentID } = req.params;
  const agent = await Agent.findOneAndDelete({ _id: agentID });   
  if (!agent) {
    return res.status(404).json({ msg:`No agent with id ${agentID}` })    
  }
  if (agent.length > 1) {
    return res.status(404).json({ msg:'Multiple agents returned, can only delete one at a time' })    
  }
  res.status(201).json({ msg:'Agent deleted', agent });  
});

module.exports = {
  createAgent,
  getAllAgents,
  getAgentsByRegion,
  updateAgentInfo,
  deleteAgent
};