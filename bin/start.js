/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

const instance = require('../dist/server').instance;

instance.listen(3000, (err) => {
    if (err) {
        throw err;
    }

    console.log(`Application is ready and listening on http://localhost:3000`);
    console.log(`Available routes:`);
    console.log(instance.printRoutes());
});
