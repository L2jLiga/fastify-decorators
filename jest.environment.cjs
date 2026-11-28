
const {TestEnvironment} = require('jest-environment-node');

class FastifyDecoratorsTestEnvironment extends TestEnvironment {
  setup() {
    require('reflect-metadata');
    this.global.Reflect = Reflect;
    return super.setup();
  }
}

module.exports = FastifyDecoratorsTestEnvironment;
