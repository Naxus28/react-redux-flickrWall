/* */ 
(function(Buffer) {
  var http = require('http');
  var convert = require('encoding').convert;
  var Headers = require('./headers');
  module.exports = Response;
  function Response(body, opts) {
    opts = opts || {};
    this.url = opts.url;
    this.status = opts.status;
    this.statusText = http.STATUS_CODES[this.status];
    this.headers = new Headers(opts.headers);
    this.body = body;
    this.bodyUsed = false;
    this.size = opts.size;
    this.ok = this.status >= 200 && this.status < 300;
    this.timeout = opts.timeout;
  }
  Response.prototype.json = function() {
    return this._decode().then(function(text) {
      return JSON.parse(text);
    });
  };
  Response.prototype.text = function() {
    return this._decode();
  };
  Response.prototype._decode = function() {
    var self = this;
    if (this.bodyUsed) {
      return Response.Promise.reject(new Error('body used already for: ' + this.url));
    }
    this.bodyUsed = true;
    this._bytes = 0;
    this._abort = false;
    this._raw = [];
    return new Response.Promise(function(resolve, reject) {
      var resTimeout;
      if (self.timeout) {
        resTimeout = setTimeout(function() {
          self._abort = true;
          reject(new Error('response timeout at ' + self.url + ' over limit: ' + self.timeout));
        }, self.timeout);
      }
      self.body.on('error', function(err) {
        reject(new Error('invalid response body at: ' + self.url + ' reason: ' + err.message));
      });
      self.body.on('data', function(chunk) {
        if (self._abort || chunk === null) {
          return;
        }
        if (self.size && self._bytes + chunk.length > self.size) {
          self._abort = true;
          reject(new Error('content size at ' + self.url + ' over limit: ' + self.size));
          return;
        }
        self._bytes += chunk.length;
        self._raw.push(chunk);
      });
      self.body.on('end', function() {
        if (self._abort) {
          return;
        }
        clearTimeout(resTimeout);
        resolve(self._convert());
      });
    });
  };
  Response.prototype._convert = function(encoding) {
    encoding = encoding || 'utf-8';
    var charset = 'utf-8';
    var res,
        str;
    if (this.headers.has('content-type')) {
      res = /charset=([^;]*)/i.exec(this.headers.get('content-type'));
    }
    if (!res && this._raw.length > 0) {
      str = this._raw[0].toString().substr(0, 1024);
    }
    if (!res && str) {
      res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
    }
    if (!res && str) {
      res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
      if (res) {
        res = /charset=(.*)/i.exec(res.pop());
      }
    }
    if (!res && str) {
      res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
    }
    if (res) {
      charset = res.pop();
      if (charset === 'gb2312' || charset === 'gbk') {
        charset = 'gb18030';
      }
    }
    return convert(Buffer.concat(this._raw), encoding, charset).toString();
  };
  Response.Promise = global.Promise;
})(require('buffer').Buffer);
