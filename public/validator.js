$(function () {
	const inputSelector = ':input[required]:visible';
	function checkForm() {
		let isValidForm = true;
		$(this.form).find(inputSelector).each(function() {
			if(!this.value.trim()) {
				isValidForm = false;
			}
		});
		$(this.form).find('#convert').prop('disabled', !isValidForm);
		return isValidForm;
	};

	$('#convert').closest('form')
		.submit(function() {
			return checkForm.apply($(this).find(':input')[0]);
		})
		.find(inputSelector).keyup(checkForm).keyup();
});
