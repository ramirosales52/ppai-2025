# Notas

La clase CambioEstado guarda un historial de los estados por los que paso un objeto con el empleado responsable, la fecha de inicio y la fecha de fin (fechaActual). El metodo esEstadoActual() verifica si el cambio de estado esta activo (si la fechaFin es null (no existe))

En el diagrama de clases dice que el EventoSismico tiene 1 Alcance pero si el Evento es captado por mas de una
EstacionSismologica, tendriamos un Alcance por EstacionSismologica.

DUDAS:
El hipocentro: es el punto en la profundidad de la tierra (km) desde donde se origina el mismo.
porque el evento sismico tiene lat y long del hipocentro si dice que es en km?

FLUJOS ALTERNATIVOS:

- [x] A1: No hay sismos autodectados que aun no han sido revisados.
- [ ] A2: El AS modifica los datos del evento sismico.
- [x] A3: El AS selecciona la opcion Rechazar evento.
- [x] A4: El AS selecciona la opcion Solicitar revision a experto.
- [ ] A5: El AS no completa los datos minimos.
- [x] A6: Si la opción seleccionada es Confirmar evento, se actualiza el estado del evento sísmico a confirmado, registrando la fecha
      y hora actual como fecha de confirmación.
      y el AS logueado como responsable.
- [x] A7: Si la opción seleccionada es Solicitar revisión a experto, se actualiza el estado del evento sísmico a derivado a experto,
      registrando la fecha y hora actual, y el AS logueado.
- [ ] A8: El actor cancela la ejecucion del caso de uso.
