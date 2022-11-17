$(function() {
	$.get('tree.php', function (data) {
		$('#tree').html(data);
	});
})