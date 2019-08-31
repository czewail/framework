



declare module "@dazejs/framework" {
  class Config {
    set(name: string | object, value: any): object
    get(name: string, def: any): any
    has(name: string): boolean
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
    /**
     * bind an abstract in container
     *
     * @param {string} abstract Object identifier
     * @param {array} args params
     * @param {boolean} shared forced instantiation
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
    get(abstract: string, args: any[]): object
  }

  class Base {
    app: Application
    config: Config
    messenger: Messenger
    /**
     * Create Response instance - 生成响应实例
     * @param data Response Data - 响应数据
     * @param code Response statusCode - 响应状态码
     * @param header Response Headers - 额外响应头
     */
    response: (data: any, code: number, header: H) => Response
    /**
     * Create Redirect response instance - 生成重定向响应实例
     * @param  url redirect url - 重定向地址
     * @param code Response statusCode - 响应状态码
     * @param header Response Headers - 额外响应头
     */
    redirect: (url: string, code: number, header: H) => Redirect
  }

  class Messenger {

  }

  class Response {

  }

  class Redirect extends Response {

  }

  class Request {

  }

  class View {

  }

  class Resource {

  }

  class Service {

  }

  class Validate {

  }

  interface IResourceHelper {
    item: () => Resource,
    collection: () => Resource,
  }

  class Controller extends Base {
    request: Request;
    render: () => View;
    assign: () => View;
    view: () => View;
    resource: () => IResourceHelper;
    service: () => Service;
    validate: () => Validate;
    item: () => Resource;
    collection: () => Resource;
  }

  class Middleware extends Base {
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