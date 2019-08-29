declare module "@dazejs/framework" {


  class Config {
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
    singleton(abstract: string, concrete: any): this
    /**
     * Bind a multiton to the container
     *
     * @param {string} abstract Object identifier
     * @param {*} concrete The object instance
     * @returns {void}
     * @public
     */
    multiton(abstract: string, concrete: any): this
    /**
     * Determines if the instance is Shared
     *
     * @param {string} abstract Object identifier
     * @returns {boolean}
     * @public
     */
    isShared(abstract: string): boolean
    /**
     * Identifies whether the container has been bound
     *
     * @param {*} abstract Object identifier
     * @returns {boolean}
     * @public
     */
    bound(abstract: string): boolean
    /**
     * Identifies whether the container has been instance
     *
     * @param {*} abstract Object identifier
     * @public
     */
    exists(abstract: string): boolean
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
    make(abstract: string, args: any[], newInstance: boolean): object

    /**
     * gets the object instance in the container
     *
     * @param {string} abstract class name or identif∂ier
     * @param {array} args params
     * @returns {*} instance
     * @public
     * @static
     */
    static get(abstract: string, args: any[]): object
    // static get(abstract: 'config', args: any[]): Config
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
    static bind(abstract: string, concrete: any, shared: boolean): object
    /**
     * Determines whether there is a corresponding binding within the container instance
     *
     * @param {*} abstract Object identifier
     * @returns {boolean} has abstract
     * @public
     * @static
     */
    static has(abstract: string): boolean
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

  class Controller {
    app: Application;
    config: Config;
  }

  // Decorators
  interface IHttp {
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

  const Http: IHttp;
}
