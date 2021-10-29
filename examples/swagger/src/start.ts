import { hostname, port } from './config.js';
import { app } from './index.js';

app.listen(port, hostname, (error, address) => {
  if (error != null) {
    console.error(error);
    process.exit(-1);
  }
  console.log(`Application start and listening at ${address}`);
  console.log(`Documentation available at ${address}/documentation`);
  console.log(`Available routes: \n${app.printRoutes()}`);
});
