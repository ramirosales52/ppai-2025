import pool from './database';
import EventoSismico from '../models/EventoSismico';
import Usuario from '../models/Usuario';
import Empleado from '../models/Empleado';
import Estado from '../models/Estado';
import OrigenDeGeneracion from '../models/OrigenDeGeneracion';
import SerieTemporal from '../models/SerieTemporal';
import Sismografo from '../models/Sismografo';
import EstacionSismologica from '../models/EstacionSismologica';
import MuestraSismica from '../models/MuestraSismica';
import DetalleMuestraSismica from '../models/DetalleMuestraSismica';
import TipoDeDato from '../models/TipoDeDato';
import CambioEstado from '../models/CambioEstado';

export async function cargarEventosSismicos(): Promise<EventoSismico[]> {
  const eventosResult = await pool.query(`
    SELECT 
      es.id, es.fecha_hora_ocurrencia, es.latitud_epicentro, es.latitud_hipocentro,
      es.longitud_epicentro, es.longitud_hipocentro, es.profundidad, es.valor_magnitud,
      e.nombre_clase as estado_clase, e.nombre_estado,
      og.nombre as origen_nombre
    FROM evento_sismico es
    JOIN estado e ON es.estado_actual_id = e.id
    JOIN origen_generacion og ON es.origen_generacion_id = og.id
    ORDER BY es.fecha_hora_ocurrencia
  `);

  const eventos: EventoSismico[] = [];
  
  for (const row of eventosResult.rows) {
    const evento = new EventoSismico(
      new Date(row.fecha_hora_ocurrencia),
      parseFloat(row.latitud_epicentro),
      parseFloat(row.latitud_hipocentro),
      parseFloat(row.longitud_epicentro),
      parseFloat(row.longitud_hipocentro),
      parseFloat(row.valor_magnitud),
      parseFloat(row.profundidad),
      new OrigenDeGeneracion(row.origen_nombre),
      []
    );
    
    (evento as any).id = row.id;
    (evento as any).estadoActual = new Estado(row.estado_clase, row.nombre_estado);
    (evento as any).cambioEstado = [];
    (evento as any).serieTemporal = [];
    (evento as any).alcance = null;
    
    eventos.push(evento);
  }
  
  return eventos;
}

export async function cargarDatosCompletosPorEvento(eventoId: string): Promise<{series: SerieTemporal[], cambios: CambioEstado[]}> {
  const series = await cargarSeriesTemporalesPorEvento(eventoId);
  const cambios = await cargarCambiosEstadoPorEvento(eventoId);
  return { series, cambios };
}

async function cargarSeriesTemporalesPorEvento(eventoId: string): Promise<SerieTemporal[]> {
  const result = await pool.query(`
    SELECT st.id, st.fecha_hora_inicio, st.fecha_hora_fin, st.umbral_sugerido,
           s.id as sismografo_id, s.fecha_instalacion, s.codigo, s.numero_serie,
           est.id as estacion_id, est.codigo_estacion, est.latitud, est.longitud, est.nombre as estacion_nombre,
           e.nombre_clase as estado_clase, e.nombre_estado
    FROM serie_temporal st
    JOIN evento_serie es ON st.id = es.serie_temporal_id
    JOIN sismografo s ON st.sismografo_id = s.id
    JOIN estacion_sismologica est ON s.estacion_id = est.id
    JOIN estado e ON s.estado_id = e.id
    WHERE es.evento_id = $1
  `, [eventoId]);

  const series: SerieTemporal[] = [];
  
  for (const row of result.rows) {
    const muestras = await cargarMuestrasSismicasPorSerie(row.id);
    
    const estacion = new EstacionSismologica(
      row.codigo_estacion,
      parseFloat(row.latitud),
      parseFloat(row.longitud),
      row.estacion_nombre
    );
    
    const sismografo = new Sismografo(
      new Date(row.fecha_instalacion),
      row.codigo,
      row.numero_serie,
      new Estado(row.estado_clase, row.nombre_estado),
      estacion
    );
    
    const serie = new SerieTemporal(
      new Date(row.fecha_hora_inicio),
      new Date(row.fecha_hora_fin),
      parseFloat(row.umbral_sugerido),
      muestras,
      sismografo
    );
    
    series.push(serie);
  }
  
  return series;
}

async function cargarMuestrasSismicasPorSerie(serieId: number): Promise<MuestraSismica[]> {
  const result = await pool.query(`
    SELECT ms.id, ms.fecha_hora_muestra
    FROM muestra_sismica ms
    WHERE ms.serie_temporal_id = $1
    ORDER BY ms.fecha_hora_muestra
  `, [serieId]);

  const muestras: MuestraSismica[] = [];
  
  for (const row of result.rows) {
    const detalles = await cargarDetallesMuestraSismica(row.id);
    
    const muestra = new MuestraSismica(
      new Date(row.fecha_hora_muestra),
      detalles
    );
    
    muestras.push(muestra);
  }
  
  return muestras;
}

async function cargarDetallesMuestraSismica(muestraId: number): Promise<DetalleMuestraSismica[]> {
  const result = await pool.query(`
    SELECT dms.valor,
           td.nombre, td.unidad_medida, td.umbral
    FROM detalle_muestra_sismica dms
    JOIN tipo_dato td ON dms.tipo_dato_id = td.id
    WHERE dms.muestra_sismica_id = $1
  `, [muestraId]);

  return result.rows.map(row => 
    new DetalleMuestraSismica(
      parseFloat(row.valor),
      new TipoDeDato(row.nombre, row.unidad_medida, parseFloat(row.umbral))
    )
  );
}

async function cargarCambiosEstadoPorEvento(eventoId: string): Promise<CambioEstado[]> {
  const result = await pool.query(`
    SELECT ce.fecha_hora_inicio, ce.fecha_hora_fin,
           e.nombre_clase as estado_clase, e.nombre_estado,
           emp.nombre, emp.apellido, emp.mail, emp.telefono
    FROM cambio_estado ce
    JOIN estado e ON ce.estado_id = e.id
    LEFT JOIN empleado emp ON ce.empleado_id = emp.id
    WHERE ce.evento_id = $1
    ORDER BY ce.fecha_hora_inicio
  `, [eventoId]);

  return result.rows.map(row => {
    const empleado = row.nombre 
      ? new Empleado(row.nombre, row.apellido, row.mail, row.telefono)
      : null;
    
    return new CambioEstado(
      new Estado(row.estado_clase, row.nombre_estado),
      new Date(row.fecha_hora_inicio),
      row.fecha_hora_fin ? new Date(row.fecha_hora_fin) : null,
      empleado
    );
  });
}

export async function cargarUsuarios(): Promise<Usuario[]> {
  const result = await pool.query(`
    SELECT u.nombre_usuario, u.contraseña,
           e.nombre, e.apellido, e.mail, e.telefono
    FROM usuario u
    JOIN empleado e ON u.empleado_id = e.id
  `);

  return result.rows.map(row => 
    new Usuario(
      row.nombre_usuario,
      row.contraseña,
      new Empleado(row.nombre, row.apellido, row.mail, row.telefono)
    )
  );
}

export async function actualizarEstadoEvento(
  eventoId: string,
  nuevoEstadoNombre: string,
  fechaHoraFin: Date,
  fechaHoraInicio: Date,
  empleado: Empleado | null
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const estadoResult = await client.query(
      `SELECT id FROM estado WHERE nombre_estado = $1 AND nombre_clase = 'EventoSismico'`,
      [nuevoEstadoNombre]
    );
    const nuevoEstadoId = estadoResult.rows[0].id;

    await client.query(
      `UPDATE cambio_estado SET fecha_hora_fin = $1 
       WHERE evento_id = $2 AND fecha_hora_fin IS NULL`,
      [fechaHoraFin, eventoId]
    );

    let empleadoId = null;
    if (empleado) {
      const empResult = await client.query(
        `SELECT id FROM empleado WHERE mail = $1`,
        [empleado.getMail()]
      );
      empleadoId = empResult.rows[0]?.id;
    }

    await client.query(
      `INSERT INTO cambio_estado (fecha_hora_inicio, fecha_hora_fin, estado_id, empleado_id, evento_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [fechaHoraInicio, null, nuevoEstadoId, empleadoId, eventoId]
    );

    await client.query(
      `UPDATE evento_sismico SET estado_actual_id = $1 WHERE id = $2`,
      [nuevoEstadoId, eventoId]
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
