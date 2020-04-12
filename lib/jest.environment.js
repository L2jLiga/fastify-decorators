const NodeEnvironment = require('jest-environment-node');

class FastifyDecoratorsTestEnvironment extends NodeEnvironment {
    async setup() {
        require('reflect-metadata');
        this.global.Reflect = Reflect;
        await super.setup();
    }
}

module.exports = FastifyDecoratorsTestEnvironment;
