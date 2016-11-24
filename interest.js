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
	InterestTracker.prototype.zoom = function(upper_left_x, upper_left_y, bottom_right_x, bottom_right_y, time, isFinal) {

		submitOperation.call(this, 'zoom', {
			'upper_left_x': upper_left_x,
			'upper_left_y': upper_left_y,
			'bottom_right_x': bottom_right_x,
			'bottom_right_y': bottom_right_y,
			'time': time,
			'is_final': isFinal
		});

	};

	InterestTracker.prototype.movement = function(upper_left_x, upper_left_y, bottom_right_x, bottom_right_y, time, isFinal) {

		submitOperation.call(this, 'movement', {
			'upper_left_x': upper_left_x,
			'upper_left_y': upper_left_y,
			'bottom_right_x': bottom_right_x,
			'bottom_right_y': bottom_right_y,
			'time': time,
			'is_final': isFinal
		});

	};

	/*
	 * PRIVATE METHODS
	 */
	var submitOperation = function(name, data) {

		var url = prepareOperationUrl.call(this, name);
		var dataStr = prepareOperationData.call(this, name, data);

		sendData(url, dataStr);
	};

	var prepareOperationUrl = function(action) {
		return this.host + this.imageId + '/' + this.userId;
	};

	var prepareOperationData = function(op_name, data) {
		var params = {};
		for(var name in data) {
			if(data.hasOwnProperty(name)) {
				params[name] = data[name];
			}
		}

		// Add extra operation data
		data['event_type'] = op_name;
		data['op_order'] = this.opOrder++;
		
		return JSON.stringify([data]); //For some reason Flume only accepts an array with the object instead of the object
	};

	var sendData = function(url, data) {
		var httpRequest = new XMLHttpRequest();

		if (!httpRequest) {
			alert('Cannot create an XMLHTTP instance');
			return false;
		}
		httpRequest.onreadystatechange = processResponse.bind(httpRequest);
		httpRequest.open('POST', url);
		httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		httpRequest.send(data);
	};

	var processResponse = function() {
		if (this.readyState === XMLHttpRequest.DONE) {
			if (this.status === 200) {
				console.log(this.responseText);
			} else {
				console.error('There was a problem with the request:' + this.statusText);
			}
		}
	};


	return InterestTracker;

})();

