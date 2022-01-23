function parseTime(date_string) {
	var date = new Date(date_string);
	var date_now = new Date();
	var seconds_between_dates = Math.floor((date_now - date) / 1000);
	var minutes_between_dates = Math.floor((date_now - date) / (60 * 1000));
	var hours_between_dates = Math.floor((date_now - date) / (60 * 60 * 1000));
	var days_between_dates = Math.floor((date_now - date) / (60 * 60 * 24 * 1000));
	var weeks_between_dates = Math.floor((date_now - date) / (60 * 60 * 24 * 7 * 1000));



	var post_date_output;
	if (seconds_between_dates < 60) {
		post_date_output = `${seconds_between_dates} seconds ago`;
	} else if (minutes_between_dates < 60) {
		post_date_output = `${minutes_between_dates} minutes ago`;
	}
	else if (hours_between_dates < 24) {
		post_date_output = `${hours_between_dates} hours ago`;
	} else if (days_between_dates <= 7) {
		post_date_output = `${days_between_dates} days ago`;
	} else {
		post_date_output = `${weeks_between_dates} weeks ago`;
	}

	return post_date_output;
}

export default parseTime;