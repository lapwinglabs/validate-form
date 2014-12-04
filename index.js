/**
 * Module dependencies
 */

var Schema = require('rube-schema');
var event = require('event');
var Form = require('form');
var noop = function () {};

/**
 * Export `Validate`
 */

module.exports = Validate;

/**
 * Initialize `Validate` with `el`
 *
 * @param {Element} el
 * @return {Validate}
 */

function Validate(el) {
  if (!(this instanceof Validate)) return new Validate(el);
  this.schema = new Schema();
  this.form = Form(el)
  this.el = el;

  // noops
  this._submit = noop;
  this._blur = noop;

  // event binding
  event.bind(this.el, 'submit', this.onsubmit.bind(this));
  var inputs = this.inputs = el.querySelectorAll('input,textarea');
  for (var i = 0, input; input = inputs[i++];) {
    event.bind(input, 'blur', this.onblur.bind(this));
  }
}

/**
 * Set fields
 *
 * @param {Object|RubeSchema} fields
 * @return {Validate}
 * @api public
 */

Validate.prototype.fields = function(fields) {
  fields = fields.attr ? fields.attr() : fields;
  for (var field in fields) this.field(field, fields[field]);
  return this;
};

/**
 * Add a field
 *
 * @param {String} name
 * @param {Rube} rube (optional)
 * @return {Validate}
 * @api public
 */

Validate.prototype.field = function(name, rube) {
  var input = this.el.querySelector('[name="' + name + '"]');
  input && this.schema.attr(name, rube);
  return this;
}

/**
 * Set a submit handler
 *
 * @param {Function} fn
 * @return {Validate}
 * @api public
 */

Validate.prototype.submit = function(fn) {
  this._submit = fn;
  return this;
};

/**
 * Set an on blur handler
 *
 * @param {Function} fn
 * @return {Validate}
 * @api public
 */

Validate.prototype.blur = function(fn) {
  this._blur = fn;
  return this;
};

/**
 * Validate a field
 *
 * @param {String} field
 * @param {String} val
 * @param {Function} fn
 * @return {Validate}
 * @api public
 */

Validate.prototype.validate = function(field, val, fn) {
  var attr = this.schema.attr(field);
  var self = this;

  // run rube
  attr(val, function(err, v) {
    if (err) fn(err);
    else fn(err, v);
  });

  return this;
};


/**
 * Submit event handler
 *
 * @param {Event} e
 * @return {Validate}
 * @api private
 */

Validate.prototype.onsubmit = function(e) {
  e.preventDefault();

  var attrs = this.schema.attr();
  var form = this.form;
  var json = {};

  for (attr in attrs) {
    json[attr] = this.form.value(attr);
  }

  this.schema(json, this._submit);
  return this;
};

/**
 * On blur event handler
 *
 * @param {Event} e
 * @return {Validate}
 * @api private
 */

Validate.prototype.onblur = function(e) {
  var target = e.target;
  var name = target.getAttribute('name');
  if (!name) return this;
  var value = this.form.value(name);
  if (!value) return this;
  var self = this;

  // validate
  this.validate(name, value, function(err, v) {
    if (err) return self._blur(err, name);
    return self._blur(null, name, v);
  });

  return this;
};

