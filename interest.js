var InterestTracker = (function() {

	/*
	 * CONSTRUCTOR
	 */
	function InterestTracker (host, userId, imageId) {
		this.host = ( host.substr(-1) != '/' ? host + '/' : host );
		this.userId = userId;
		this.imageId = imageId;
		this.opOrder = 0;
	}

	/*
	 * PUBLIC METHODS
	 */
	InterestTracker.prototype.zoom = function(upper_left_x, upper_left_y, bottom_right_x, bottom_right_y) {

		submitOperation.call(this, 'zoom', {
			'upper_left_x': upper_left_x,
			'upper_left_y': upper_left_y,
			'bottom_right_x': bottom_right_x,
			'bottom_right_y': bottom_right_y
		});

	};

	InterestTracker.prototype.movement = function(upper_left_x, upper_left_y, bottom_right_x, bottom_right_y) {

		submitOperation.call(this, 'movement', {
			'upper_left_x': upper_left_x,
			'upper_left_y': upper_left_y,
			'bottom_right_x': bottom_right_x,
			'bottom_right_y': bottom_right_y
		});

	};

	/*
	 * PRIVATE METHODS
	 */
	var submitOperation = function(name, data) {

		var url = prepareOperationUrl.call(this, name);
		var dataStr = prepareOperationData.call(this, data);

		sendData(url, dataStr);
	};

	var prepareOperationUrl = function(action) {
		return this.host + this.imageId + '/' + this.userId + '/' + action;
	};

	var prepareOperationData = function(data) {
		var params = [];
		for(var name in data) {
			params.push(name + '=' + encodeURIComponent(data[name]));
		}

		// Add extra operation data
		params.push('time=' + encodeURIComponent(new Date().getTime()));
		params.push('op_order=' + encodeURIComponent(this.opOrder++));

		return params.join('&');
	};

	var sendData = function(url, data) {
		var httpRequest = new XMLHttpRequest();

		if (!httpRequest) {
			alert('Cannot create an XMLHTTP instance');
			return false;
		}
		httpRequest.onreadystatechange = processResponse.bind(httpRequest);
		httpRequest.open('POST', url);
		httpRequest.send(data);
	};

	var processResponse = function() {
		if (this.readyState === XMLHttpRequest.DONE) {
			if (this.status === 200) {
				console.log(this.responseText);
			} else {
				console.error('There was a problem with the request.');
			}
		}
	};


	return InterestTracker;

})();

