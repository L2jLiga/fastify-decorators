declare module 'mocha' {
  type Done = (err?: any) => void;

  /**
   * Callback function used for tests and hooks.
   */
  type Func = (done: Done) => void;

  /**
   * Async callback function used for tests and hooks.
   */
  type AsyncFunc = () => PromiseLike<unknown>;

  interface HookFunction {
    /**
     * [bdd, qunit, tdd] Describe a "hook" to execute the given callback `fn`. The name of the
     * function is used as the name of the hook.
     *
     * - _Only available when invoked via the mocha CLI._
     */
    (fn: Func): void;

    /**
     * [bdd, qunit, tdd] Describe a "hook" to execute the given callback `fn`. The name of the
     * function is used as the name of the hook.
     *
     * - _Only available when invoked via the mocha CLI._
     */
    (fn: AsyncFunc): void;

    /**
     * [bdd, qunit, tdd] Describe a "hook" to execute the given `title` and callback `fn`.
     *
     * - _Only available when invoked via the mocha CLI._
     */
    (name: string, fn?: Func): void;

    /**
     * [bdd, qunit, tdd] Describe a "hook" to execute the given `title` and callback `fn`.
     *
     * - _Only available when invoked via the mocha CLI._
     */
    (name: string, fn?: AsyncFunc): void;
  }

  interface TestFunction {
    /**
     * Describe a specification or test-case with the given callback `fn` acting as a thunk.
     * The name of the function is used as the name of the test.
     *
     * - _Only available when invoked via the mocha CLI._
     */
    (fn: Func): unknown;

    /**
     * Describe a specification or test-case with the given callback `fn` acting as a thunk.
     * The name of the function is used as the name of the test.
     *
     * - _Only available when invoked via the mocha CLI._
     */
    (fn: AsyncFunc): unknown;

    /**
     * Describe a specification or test-case with the given `title` and callback `fn` acting
     * as a thunk.
     *
     * - _Only available when invoked via the mocha CLI._
     */
    (title: string, fn?: Func): unknown;

    /**
     * Describe a specification or test-case with the given `title` and callback `fn` acting
     * as a thunk.
     *
     * - _Only available when invoked via the mocha CLI._
     */
    (title: string, fn?: AsyncFunc): unknown;

    /**
     * Indicates this test should be executed exclusively.
     *
     * - _Only available when invoked via the mocha CLI._
     */
    only: Exclude<TestFunction, 'only' | 'skip'>;

    /**
     * Indicates this test should not be executed.
     *
     * - _Only available when invoked via the mocha CLI._
     */
    skip: Exclude<TestFunction, 'only' | 'skip'>;

    /**
     * Number of attempts to retry.
     *
     * - _Only available when invoked via the mocha CLI._
     */
    retries(n: number): void;
  }

  interface SuiteFunction {
    /**
     * [bdd, tdd] Describe a "suite" with the given `title` and callback `fn` containing
     * nested suites.
     *
     * - _Only available when invoked via the mocha CLI._
     */
    (title: string, fn: () => void): unknown;

    /**
     * [qunit] Describe a "suite" with the given `title`.
     *
     * - _Only available when invoked via the mocha CLI._
     */
    (title: string): unknown;

    /**
     * [bdd, tdd, qunit] Indicates this suite should be executed exclusively.
     *
     * - _Only available when invoked via the mocha CLI._
     */
    only: Exclude<SuiteFunction, 'only' | 'skip'>;

    /**
     * [bdd, tdd] Indicates this suite should not be executed.
     *
     * - _Only available when invoked via the mocha CLI._
     */
    skip: Exclude<SuiteFunction, 'only' | 'skip'>;
  }

  export const before: HookFunction;
  export const beforeEach: HookFunction;
  export const afterEach: HookFunction;
  export const after: HookFunction;

  export const it: TestFunction;
  export const describe: SuiteFunction;
}
