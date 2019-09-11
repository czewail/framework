

interface IObj {
  [key: string]: any
}

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


  class Response {
    json: () => this
    text: () => this
    html: () => this
    cookie: <T extends IObj>(key: string, value: any, options: T) => this
    withCookie: (cookie: any) => this
    attachment: <T extends IObj>(filename?: sting, options: T) => this
    getCode: () => number
    getData: <T extends IObj>() => T
    getStatus: () => number
    setHeaders: <T extends IObj>(headers: T) => this
    setCode: (code: number) => this
    setType: (type: string) => this
    setLength: (length: number) => this
    setVary: (vary: string) => this
    eTag: (etag: string) => this
    lastModified: (time: string | number | Date) => this
    setData: <T extends IObj>(data: T) => this
    setStatus: (code: number) => this
    setHeader: (name: string, value: any) => this
    error: (message: string, code: number) => this
    success: (message: string, code: number) => this
    Continue: () => this
    SwitchingProtocols: () => this
    Processing: () => this
    EarlyHints: () => this
    OK: () => this
    Created: () => this
    Accepted: () => this
    NonAuthoritativeInformation: () => this
    NoContent: () => this
    ResetContent: () => this
    PartialContent: () => this
    MultiStatus: () => this
    AlreadyReported: () => this
    IMUsed: () => this
    MultipleChoices: () => this
    MovedPermanently: () => this
    Found: () => this
    SeeOther: () => this
    NotModified: () => this
    UseProxy: () => this
    Unused: () => this
    TemporaryRedirect: () => this
    PermanentRedirect: () => this
    BadRequest: () => this
    Unauthorized: () => this
    PaymentRequired: () => this
    Forbidden: () => this
    NotFound: () => this
    MethodNotAllowed: () => this
    NotAcceptable: () => this
    ProxyAuthenticationRequired: () => this
    RequestTimeout: () => this
    Conflict: () => this
    Gone: () => this
    LengthRequired: () => this
    PreconditionFailed: () => this
    PayloadTooLarge: () => this
    URITooLong: () => this
    UnsupportedMediaType: () => this
    RangeNotSatisfiable: () => this
    ExpectationFailed: () => this
    ImATeapot: () => this
    MisdirectedRequest: () => this
    UnprocessableEntity: () => this
    Locked: () => this
    FailedDependency: () => this
    UnorderedCollection: () => this
    UpgradeRequired: () => this
    PreconditionRequired: () => this
    TooManyRequests: () => this
    RequestHeaderFieldsTooLarge: () => this
    UnavailableForLegalReasons: () => this
    InternalServerError: () => this
    NotImplemented: () => this
    BadGateway: () => this
    ServiceUnavailable: () => this
    GatewayTimeout: () => this
    HTTPVersionNotSupported: () => this
    VariantAlsoNegotiates: () => this
    InsufficientStorage: () => this
    LoopDetected: () => this
    BandwidthLimitExceeded: () => this
    NotExtended: () => this
    NetworkAuthenticationRequired: () => this
  }
  class Redirect extends Response {
    go: (url: string) => this
    back: () => this
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

  class Request {
    getHeaders: <T extends IObj>() => T
    getHeader: (name: string) => any
    getMethod: () => string
    isOptions: () => boolean
    isHead: () => boolean
    isGet: () => boolean
    isPost: () => boolean
    isPut: () => boolean
    isPatch: () => boolean
    isDelete: () => boolean
    getLength: () => ?number
    getUrl: () => string
    getSocket: () => any
    getProtocol: () => 'http' | 'https'
    getHost: () => string
    getOrigin: () => string
    getHref: () => string
    getPath: () => string
    getQuerystring: () => string
    getSearch: () => string
    getQuery: <T extends IObj>() => T
    getType: () => string
    acceptsTypes: (...params: string[]) => string
    acceptsEncodings: (...params: string[]) => string
    acceptsCharsets: (...params: string[]) => string
    acceptsLanguages: (...params: string[]) => string
    cookieValue: (name: string) => any
    session: () => any
    sessionValue: (key: string) => any
    getBody: <T extends IObj>() => T
    getFiles: <T extends IObj>() => T
    getParam: (name: string) => any
    getParams: <T extends IObj>() => T
    only: <T extends IObj>(...params: string[] | string[][]) => T 
    except: <T extends IObj>(...params: string[] | string[][]) => T
    hasParam: (name: string) => boolean
    validate: (validator: any, message: string) => void
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
    Get(path: string): any,
    Post(path: string): any,
    Put(path: string): any,
    Patch(path: string): any,
    Delete(path: string): any,
    Head(path: string): any,
    Options(path: string): any,
    All(path: string): any,
    OriginalReq(): any,
    Req(): any,
    OriginalRes(): any,
    Res(): any,
    Request(): any,
    Response(): any,
    Query(): any,
    Params(): any,
    Header(): any,
    Headers(): any,
    Body(): any,
    CookieValue(): any,
    SessionValue(): any,
    Code(): any,
  }

  const Http: IHttp;

  function useMiddleware(): any
  function Component(): any
  function CrossOrigin(): any
  function Csrf(): any
  function Ignore(): any
  function Injectable(): any
  function Multiton(): any
  function Rest(): any
  function Route(): any
  function useService(): any
  function useValidator(): any
  function useResource(): any
  function useComponent(): any
  function Config(): any
  function App(): any
  function Messenger(): any
}