declare module "@dazejs/framework" {


  class Config {
    constructor(configPath: string)
    set(name: string | object, value: any): object
    get(name: string, def: any): any
    has(name: string): boolean
    env: string
  }

  class Container {
    constructor()
    /**
     * Bind a singleton to the container
     *
     * @param {string} abstract Object identifier
     * @param {*} concrete The object instance
     * @returns {void}
     * @public
     */
    singleton(abstract: any, concrete: any): void
    /**
     * Bind a multiton to the container
     *
     * @param {string} abstract Object identifier
     * @param {*} concrete The object instance
     * @returns {void}
     * @public
     */
    multiton(abstract: any, concrete: any): void
    /**
     * Determines if the instance is Shared
     *
     * @param {string} abstract Object identifier
     * @returns {boolean}
     * @public
     */
    isShared(abstract: any): boolean
    /**
     * Identifies whether the container has been bound
     *
     * @param {*} abstract Object identifier
     * @returns {boolean}
     * @public
     */
    bound(abstract: any): boolean
    /**
     * Identifies whether the container has been instance
     *
     * @param {*} abstract Object identifier
     * @public
     */
    exists(abstract: any): boolean
    /**
     * Bind multiple dependencies to the container
     *
     * @param {MapArray} mapArray multiple dependencies array
     * @returns {void}
     * @public
     */
    setBinds(mapArray: any[]): void
    /**
     * Create an instance of an object
     * @param {string} abstract Object identifier
     * @param {array} args params
     * @param {boolean} force forced instantiation
     * @returns {Container} this
     * @public
     */
    make(abstract: any, args: any[], newInstance: boolean): object

    /**
     * gets the object instance in the container
     *
     * @param {string} abstract class name or identif∂ier
     * @param {array} args params
     * @returns {*} instance
     * @public
     * @static
     */
    static get(abstract: any, args: any[]): object
    static get(abstract: 'config', args: any[]): Config
    /**
     * bind an abstract in container
     *
     * @param {string} abstract Object identifier
     * @param {array} args params
     * @param {boolean} shared forced instantiation
     * @returns {*} instance
     * @public
     * @static
     */
    static bind(abstract: any, concrete: any, shared: boolean): object
    /**
     * Determines whether there is a corresponding binding within the container instance
     *
     * @param {*} abstract Object identifier
     * @returns {boolean} has abstract
     * @public
     * @static
     */
    static has(abstract: any): boolean
    /**
     * Get the container instance
     *
     * @returns {object} container instance
     * @public
     * @static
     */
    static getInstance(): object
    /**
     * Set the container instance
     *
     * @param {object} instance container instance
     * @returns {void}
     * @public
     * @static
     */
    static setInstance(instance: object): void
  }



  class Application extends Container {
  }

  // Decorators
  interface Http {
    Code(code: number): any,
    Get(path: string): any,
    Post(path: string): any,
    Put(path: string): any,
    Patch(path: string): any,
    Delete(path: string): any,
    Head(path: string): any,
    Options(path: string): any,
    All(path: string): any,
  }
  const Http: Http
  /**
   * 将一个类标记为控制器
   * @param prefix 控制器路由前缀
   */
  function Controller(prefix: string): any
  function RestController(prefix: string): any
  function Service(name: string): any
  function Resource(name: string): any
  function Component(name: string): any
  function Validator(name: string): any
  function Provider(name: string): any
  function Middleware(name: string): any
  function Multiton(): any
  function useMiddleware(name: string): any
  function CrossOrigin(options: object): any
  function Ignore(): any
}
