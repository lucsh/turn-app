"use strict"; 
class Notificacion {

	send (titulo, contenido) {

		var cambiarTitulo = function () {  
			var tituloViejo = document.title;
			var mensaje = titulo + ', ' + contenido;
			var timeoutId = false;

			var blink = function() {
                	//Cambio el title
                	document.title = document.title == mensaje ? tituloViejo : mensaje;
                    //Para de blinkear cuando esta en focus
                    if(document.hasFocus())
                    {
                    	document.title = tituloViejo;
                    	clearInterval(timeoutId);
                    }                       
                };

                if (!timeoutId) {
                	//blinkea
                	timeoutId = setInterval(blink, 300);
                };
            };

            const opciones = {  
            	body : contenido, 
            	//icon: '../assets/imagenes/notif.png', 
            	tag: 'notice', 
            	renotify:true, 
            	requireInteraction :true, 
            	vibrate: [200, 100, 200], 
            	closeDelay: 10000 
            }; 

            cambiarTitulo();

	  // Verificar si el navegador acepta notificaciones
	  if (!("Notification" in window)) {
	  	alert(titulo + ", " + contenido);
	  }

	  // Verifico si ya fue otorgado el permiso de las notificaciones
	  else if (Notification.permission === "granted") {
	    // Si asi es, creo la notificacion
	    var notificacion = new Notification(titulo, opciones);
	}

	  // Si no, solicito el permiso del usuario
	  else if (Notification.permission !== "denied") {
	  	Notification.requestPermission(function (permission) {
	      // Si acepta, creo una notificacion
	      if (permission === "granted") {
	      	var notificacion = new Notification(titulo, opciones);
	      }
	  });
	  }

	}

}

export default Notificacion;