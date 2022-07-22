function enviar(){
		var dados = $('#contactForm').serialize();
		console.log( dados );
		$.ajax({
			type: "POST",
			url: "https://submit.jotform.com/submit/222020965857055/",
			data: dados,
			success: function(){
				$('#status').html(
				'<div class="alert alert-success" role="alert">'+
					'Sua mensagem foi enviada.'+
				'</div>'
				);
				setTimeout(function() {
					$('#status').html('');
				}, 2000);
			}
		});
		return false;
}
