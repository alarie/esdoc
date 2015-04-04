import AbstractDoc from './AbstractDoc.js';
import ParamParser from '../Parser/ParamParser.js';

export default class MethodDoc extends AbstractDoc {
  _apply() {
    super._apply();

    this['@param']();
    this['@property']();
    this['@return']();
    this['@type']();
    this['@abstract']();
    this['@override']();
    this['@throws']();
    this['@fires']();
    this['@listens']();

    delete this._value.export;
    delete this._value.importPath;
    delete this._value.importStyle;
  }

  ['@kind']() {
    super['@kind']();
    if (this._value.kind) return;
    this._value.kind = this._node.kind;
  }

  ['@name']() {
    super['@name']();
    if (this._value.name) return;
    this._value.name = this._node.key.name;
  }

  ['@memberof']() {
    super['@memberof']();
    if (this._value.memberof) return;

    let memberof;
    let parent = this._node.parent;
    while (parent) {
      if (parent.type === 'ClassDeclaration') {
        memberof = `${this._pathResolver.filePath}~${parent.id.name}`;
        this._value.memberof = memberof;
        return;
      }
      parent = parent.parent;
    }
  }

  ['@param']() {
    let values = this._findAllTagValues(['@param']);
    if (!values) return;

    this._value.params = [];
    for (let value of values) {
      let {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value);
      let result = ParamParser.parseParam(typeText, paramName, paramDesc);
      this._value.params.push(result);
    }
  }

  ['@return']() {
    let value = this._findTagValue(['@return', '@returns']);
    if (!value) return;

    let {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value, true, false, true);
    let result = ParamParser.parseParam(typeText, paramName, paramDesc);
    this._value.return = result;
  }

  ['@property']() {
    let values = this._findAllTagValues(['@property']);
    if (!values) return;

    this._value.properties = [];
    for (let value of values) {
      let {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value);
      let result = ParamParser.parseParam(typeText, paramName, paramDesc);
      this._value.properties.push(result);
    }
  }

  ['@type']() {
    let value = this._findTagValue(['@type']);
    if (!value) return;

    let {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value, true, false, false);
    let result = ParamParser.parseParam(typeText, paramName, paramDesc);
    this._value.type = result;
  }

  ['@abstract']() {
    let tag = this._find(['@abstract']);
    if (tag) {
      this._value.abstract = true;
    }
  }

  ['@override'](){
    let tag = this._find(['@override']);
    if (tag) {
      this._value.override = true;
    }
  }

  ['@throws'](){
    let values = this._findAllTagValues(['@throws']);
    if (!values) return;

    this._value.throws = [];
    for (let value of values) {
      let {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value, true, false, true);
      let result = ParamParser.parseParam(typeText, paramName, paramDesc);
      this._value.throws.push({
        types: result.types,
        description: result.description
      });
    }
  }

  ['@fires'](){
    let values = this._findAllTagValues(['@fires']);
    if (!values) return;

    this._value.fires = [];
    for (let value of values) {
      let {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value, true, false, true);
      let result = ParamParser.parseParam(typeText, paramName, paramDesc);
      this._value.fires.push({
        types: result.types,
        description: result.description
      });
    }
  }

  ['@listens'](){
    let values = this._findAllTagValues(['@listens']);
    if (!values) return;

    this._value.listens = [];
    for (let value of values) {
      let {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value, true, false, true);
      let result = ParamParser.parseParam(typeText, paramName, paramDesc);
      this._value.listens.push({
        types: result.types,
        description: result.description
      });
    }
  }
}
