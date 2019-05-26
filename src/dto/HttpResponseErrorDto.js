class HttpResponseErrorDto {
	constructor(_code, _status, _message) {
		this.code = _code;
		this.status = _status;
		this.message = _message;
	}
}

module.exports = HttpResponseErrorDto;
