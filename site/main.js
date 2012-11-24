var init = false;
	
$(document).ready(function() {

	if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){
		$("#controls").html("Internet Explorer is not compatible with this site.<br />Please come back in a different browser. Thanks!");
	} else {
		// initialize
		requestNonsense();
		
		// bind clicking of "GO!"
		$("#get_nonsense").click(function(e) {
			e.preventDefault();
			requestNonsense();
		});
		
		// only let numbers be typed in number boxes
		$(".num_box").keydown(function(event) {
			// Allow: backspace, delete, tab and escape
			if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || 
				// Allow: Ctrl+A
				(event.keyCode == 65 && event.ctrlKey === true) || 
				// Allow: home, end, left, right
				(event.keyCode >= 35 && event.keyCode <= 39)) {
				// let it happen, don't do anything
					return;
			}
			else {
				// Ensure that it is a number and stop the keypress
				if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
					event.preventDefault(); 
				}   
			}
		});
		
		// should never be ""; restore defaults
		$("#source").blur(function() {
			if ($(this).val().length == 0) $(this).val("http://eliotswasteland.tripod.com/twl.html");
		});
		$("#num_lines").blur(function() {
			if ($(this).val().length == 0 || parseInt($(this).val()) < 1) $(this).val("5");
		});
		$("#num_words").blur(function() {
			if ($(this).val().length == 0 || parseInt($(this).val()) < 1) $(this).val("7");
		});	
	};
});

// load new nonsense
function requestNonsense() {
	if (init) $("#footer").fadeOut(200); // can't call together, want one callback
	if (init) $("#nonsense").fadeOut(200, continueRequest);
	else continueRequest();
};

function continueRequest() {
	var source = $("#source").val();
	if (source.indexOf("http://") == -1) source = "http://" + source
	var num_lines = $("#num_lines").val();
	var num_words = $("#num_words").val();
	$.getJSON("http://mattnichols.net:5000/json?callback=?", {
		'url': source,
		'lines': num_lines,
		'words': num_words
	}, updateNonsense);
};

// callback for python ajax
function updateNonsense(data) {
	var p = data['poem'];
	if (!init) $("#nonsense, #footer").hide();
	$("#content_wrapper").show();
	$("#nonsense").html(p).fadeIn((init ? 200 : 500));
	if (!init) $("#footer").fadeIn(700);
	init = true;
};