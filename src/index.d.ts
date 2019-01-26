declare module "@dazejs/framework" {

  declare class Container {
    constructor()
    /**
     * Bind a singleton to the container
     *
     * @param {string} abstract Object identifier
     * @param {mixed} concrete The object instance
     * @returns {void}
     * @public
     */
    singleton(abstract: any, concrete: any): void
    /**
     * Bind a multiton to the container
     *
     * @param {string} abstract Object identifier
     * @param {mixed} concrete The object instance
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
     * @param {mixed} abstract Object identifier
     * @returns {boolean}
     * @public
     */
    bound(abstract: any): boolean
    /**
     * Identifies whether the container has been instance
     *
     * @param {mixed} abstract Object identifier
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
     * @returns {mixed} instance
     * @public
     * @static
     */
    static get(abstract: any, args: any[]): object
    /**
     * bind an abstract in container
     *
     * @param {string} abstract Object identifier
     * @param {array} args params
     * @param {boolean} shared forced instantiation
     * @returns {mixed} instance
     * @public
     * @static
     */
    static bind(abstract: any, concrete: any, shared: boolean): object
    /**
     * Determines whether there is a corresponding binding within the container instance
     *
     * @param {mixed} abstract Object identifier
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
  
  declare class Config {
    constructor(configPath: string)
    set(name: string | object, value: any): object
    get(name: string, def: any): any
    has(name: string): boolean
    env: string
  }

  interface Decorators {
    Router: any
  }

  declare const Decorators: Decorators

  declare class Controller {
    
  }
}