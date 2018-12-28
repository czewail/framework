declare module "@dazejs/framework" {

  declare class Container {
    constructor()
    singleton(abstract: any, concrete: any): void
    multiton(abstract: any, concrete: any): void
    isShared(abstract: any): boolean
    bound(abstract: any): boolean
    exists(abstract: any): boolean
    setBinds(mapArray: any[]): void

    /**
     * Create an instance of an object
     * @param {string} abstract Object identifier
     * @param {array} args params
     * @param {boolean} force forced instantiation
     */
    make(abstract: any, args: any[], newInstance: boolean): object

    /**
     * gets the object instance in the container
     * @param {string} abstract class name or identif∂ier
     * @param {array} args params
     */
    static get(abstract: any, args: any[]): object
    static bind(abstract: any, concrete: any, shared: boolean): object
    static has(abstract: any): boolean
    static getInstance(): object
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