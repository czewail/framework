export class View {
  app: object;
  vars: any;
  template: string;
  combineVars(vars: {}): any
  assign(name: string, value: any): this
  render(template: string, vars: object): this
  render(vars: object): this
  getTemplate():string
  getVars(): object
}