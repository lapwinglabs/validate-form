var Schema = require('lapwinglabs/rube-schema');
var domify = require('component/domify');
var formEl = domify(require('./form.html'));
var Form = require('..');

/**
 * Regexps
 */

var isEmail = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

document.body.appendChild(formEl);

var schema = Schema();

schema.attr('profile[name]')
    .required()
    .type(String)
    .format(/^\s+|\s+$/g, '')
    .between(2, 30)

schema.attr('profile[email]')
    .required()
    .type(String)
    .format(/^\s+|\s+$/g, '')
    .assert(isEmail)
    .use(function(value, done) {
      setTimeout(function() {
        done();
      }, 0)
    });

schema.attr('profile[age]')
    .required()
    .format(/^\s+|\s+$/g, '')
    .cast(Number)
    .type(Number)
    .between(18, 100)


var form = Form(formEl)
form.fields(schema)

form.blur(function(err, name, value) {
  console.log(err, name, value);
});

form.submit(function(errors, values) {
  if (errors) console.log(errors);
  else console.log(values);
});
