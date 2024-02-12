require('dotenv').config();
const Express = require('express');
const app = Express();
const port = process.env.PORT || 3004;


const MongoManager = require('./src/shared/db/mongodb/mongo-manager')
const MiddleWare = require('./src/shared/middleware/base-middleware');
const HealthRoutes = require('./src/routes/health.routes');
const AdminRoutes = require('./src/routes/admin.routes');
const PublicRoutes = require('./src/routes/public.routes');
const AgentRoutes = require('./src/routes/agent.routes')
const regionRouter = require('./src/routes/region.routes')


app.use(Express.static('./src/public')) //serves our static genesis project
app.use(Express.json())


MiddleWare.registerBaseMiddleWare(app)
HealthRoutes.registerHealthRoutes(app);
AdminRoutes.registerAdminRoutes(app);
PublicRoutes.registerPublicRoutes(app);
AgentRoutes.registerAgentRoutes(app)
regionRouter.registerRegionRoutes(app)


MongoManager.openMongoConnection();
app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})
