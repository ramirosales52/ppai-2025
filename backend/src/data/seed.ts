import pool from './database';

async function seed() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS tipo_dato (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        unidad_medida VARCHAR(50) NOT NULL,
        umbral NUMERIC(10, 2) NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS estado (
        id SERIAL PRIMARY KEY,
        nombre_clase VARCHAR(100) NOT NULL,
        nombre_estado VARCHAR(100) NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS origen_generacion (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS estacion_sismologica (
        id SERIAL PRIMARY KEY,
        codigo_estacion VARCHAR(50) NOT NULL UNIQUE,
        latitud NUMERIC(10, 6) NOT NULL,
        longitud NUMERIC(10, 6) NOT NULL,
        nombre VARCHAR(200) NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS sismografo (
        id SERIAL PRIMARY KEY,
        fecha_instalacion TIMESTAMP NOT NULL,
        codigo VARCHAR(50) NOT NULL UNIQUE,
        numero_serie INTEGER NOT NULL,
        estacion_id INTEGER REFERENCES estacion_sismologica(id),
        estado_id INTEGER REFERENCES estado(id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS serie_temporal (
        id SERIAL PRIMARY KEY,
        fecha_hora_inicio TIMESTAMP NOT NULL,
        fecha_hora_fin TIMESTAMP NOT NULL,
        umbral_sugerido NUMERIC(10, 2) NOT NULL,
        sismografo_id INTEGER REFERENCES sismografo(id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS muestra_sismica (
        id SERIAL PRIMARY KEY,
        fecha_hora_muestra TIMESTAMP NOT NULL,
        serie_temporal_id INTEGER REFERENCES serie_temporal(id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS detalle_muestra_sismica (
        id SERIAL PRIMARY KEY,
        valor NUMERIC(10, 2) NOT NULL,
        muestra_sismica_id INTEGER REFERENCES muestra_sismica(id),
        tipo_dato_id INTEGER REFERENCES tipo_dato(id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS evento_sismico (
        id VARCHAR(50) PRIMARY KEY,
        fecha_hora_ocurrencia TIMESTAMP NOT NULL,
        latitud_epicentro NUMERIC(10, 6) NOT NULL,
        latitud_hipocentro NUMERIC(10, 6) NOT NULL,
        longitud_epicentro NUMERIC(10, 6) NOT NULL,
        longitud_hipocentro NUMERIC(10, 6) NOT NULL,
        profundidad NUMERIC(10, 2) NOT NULL,
        valor_magnitud NUMERIC(10, 2) NOT NULL,
        estado_actual_id INTEGER REFERENCES estado(id),
        origen_generacion_id INTEGER REFERENCES origen_generacion(id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS evento_serie (
        evento_id VARCHAR(50) REFERENCES evento_sismico(id),
        serie_temporal_id INTEGER REFERENCES serie_temporal(id),
        PRIMARY KEY (evento_id, serie_temporal_id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS empleado (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        mail VARCHAR(200) NOT NULL UNIQUE,
        telefono BIGINT NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS usuario (
        id SERIAL PRIMARY KEY,
        nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
        contraseña VARCHAR(200) NOT NULL,
        empleado_id INTEGER REFERENCES empleado(id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS cambio_estado (
        id SERIAL PRIMARY KEY,
        fecha_hora_inicio TIMESTAMP NOT NULL,
        fecha_hora_fin TIMESTAMP,
        estado_id INTEGER REFERENCES estado(id),
        empleado_id INTEGER REFERENCES empleado(id),
        evento_id VARCHAR(50) REFERENCES evento_sismico(id)
      )
    `);

    const estadoInserts = [
      ['EventoSismico', 'auto_confirmado'],
      ['EventoSismico', 'auto_detectado'],
      ['EventoSismico', 'pendiente_de_revision'],
      ['EventoSismico', 'bloqueado_en_revision'],
      ['EventoSismico', 'confirmado'],
      ['EventoSismico', 'rechazado'],
      ['EventoSismico', 'derivado_experto'],
      ['Sismografo', 'en_linea']
    ];

    for (const [nombreClase, nombreEstado] of estadoInserts) {
      await client.query(
        'INSERT INTO estado (nombre_clase, nombre_estado) VALUES ($1, $2)',
        [nombreClase, nombreEstado]
      );
    }

    const origenInserts = ['interplaca', 'volcanico', 'explosiones_de_minas'];
    for (const nombre of origenInserts) {
      await client.query('INSERT INTO origen_generacion (nombre) VALUES ($1)', [nombre]);
    }

    const tiposInserts = [
      ['Velocidad de onda', 'Km/seg', 8.0],
      ['Frecuencia de onda', 'Hz', 12.0],
      ['Longitud de onda', 'km/ciclo', 0.75]
    ];

    for (const [nombre, unidad, umbral] of tiposInserts) {
      await client.query(
        'INSERT INTO tipo_dato (nombre, unidad_medida, umbral) VALUES ($1, $2, $3)',
        [nombre, unidad, umbral]
      );
    }

    const estacionesInserts = [
      ['EST-001', -34.6037, -58.3816, 'Estación 1'],
      ['EST-002', -31.4201, -64.1888, 'Estación 2'],
      ['EST-003', -38.0055, -57.5426, 'Estación 3']
    ];

    for (const [codigo, lat, lon, nombre] of estacionesInserts) {
      await client.query(
        'INSERT INTO estacion_sismologica (codigo_estacion, latitud, longitud, nombre) VALUES ($1, $2, $3, $4)',
        [codigo, lat, lon, nombre]
      );
    }

    const estadoEnLinea = await client.query(
      "SELECT id FROM estado WHERE nombre_estado = 'en_linea'"
    );
    const estadoEnLineaId = estadoEnLinea.rows[0].id;

    const sismografosInserts = [
      ['2020-05-12', 'SIS-001', 12345, 1, estadoEnLineaId],
      ['2021-03-08', 'SIS-002', 54321, 1, estadoEnLineaId],
      ['2019-11-20', 'SIS-003', 67890, 2, estadoEnLineaId],
      ['2022-02-01', 'SIS-004', 98760, 2, estadoEnLineaId],
      ['2023-06-15', 'SIS-005', 11223, 3, estadoEnLineaId],
      ['2024-01-10', 'SIS-006', 33211, 3, estadoEnLineaId]
    ];

    for (const [fecha, codigo, serie, estacionId, estadoId] of sismografosInserts) {
      await client.query(
        'INSERT INTO sismografo (fecha_instalacion, codigo, numero_serie, estacion_id, estado_id) VALUES ($1, $2, $3, $4, $5)',
        [fecha, codigo, serie, estacionId, estadoId]
      );
    }

    const seriesInserts = [
      ['2025-02-21T19:05:41', '2025-02-21T19:15:41', 50, 4],
      ['2025-03-03T14:30:00', '2025-03-03T14:40:00', 50, 5],
      ['2025-03-03T14:30:00', '2025-03-03T14:40:00', 50, 3],
      ['2025-04-01T10:00:00', '2025-04-01T10:10:00', 50, 6],
      ['2025-04-02T08:30:00', '2025-04-02T08:40:00', 50, 1],
      ['2025-04-10T22:00:00', '2025-04-10T22:00:00', 50, 4]
    ];

    for (const [inicio, fin, umbral, sismoId] of seriesInserts) {
      await client.query(
        'INSERT INTO serie_temporal (fecha_hora_inicio, fecha_hora_fin, umbral_sugerido, sismografo_id) VALUES ($1, $2, $3, $4)',
        [inicio, fin, umbral, sismoId]
      );
    }

    const muestrasInserts = [
      ['2025-02-21T19:05:41', 1],
      ['2025-02-21T19:15:41', 1],
      ['2025-02-21T19:10:41', 1],
      ['2025-03-03T14:30:00', 2],
      ['2025-03-03T14:35:00', 2],
      ['2025-03-03T14:40:00', 2],
      ['2025-04-02T08:35:00', 3],
      ['2025-04-01T10:00:00', 3],
      ['2025-04-01T10:10:00', 3],
      ['2025-04-01T10:00:00', 4],
      ['2025-04-01T10:10:00', 4],
      ['2025-04-02T08:30:00', 5],
      ['2025-04-02T08:35:00', 5],
      ['2025-04-02T08:40:00', 5],
      ['2025-04-10T22:00:00', 6]
    ];

    for (const [fecha, serieId] of muestrasInserts) {
      await client.query(
        'INSERT INTO muestra_sismica (fecha_hora_muestra, serie_temporal_id) VALUES ($1, $2)',
        [fecha, serieId]
      );
    }

    const detallesInserts = [
      [7.0, 1, 1], [10.0, 1, 2], [0.7, 1, 3],
      [6.99, 2, 1], [10.01, 2, 2], [0.7, 2, 3],
      [7.02, 3, 1], [10.0, 3, 2], [0.69, 3, 3],
      [8.5, 4, 1], [12.5, 4, 2], [0.8, 4, 3],
      [8.1, 5, 1], [12.6, 5, 2], [0.78, 5, 3],
      [7.9, 6, 1], [12.4, 6, 2], [0.79, 6, 3],
      [6.4, 7, 1], [9.1, 7, 2], [0.73, 7, 3],
      [7.8, 8, 1], [11.5, 8, 2], [0.76, 8, 3],
      [7.7, 9, 1], [11.3, 9, 2], [0.74, 9, 3],
      [7.8, 10, 1], [11.5, 10, 2], [0.76, 10, 3],
      [7.7, 11, 1], [11.3, 11, 2], [0.74, 11, 3],
      [6.5, 12, 1], [9.0, 12, 2], [0.72, 12, 3],
      [6.4, 13, 1], [9.1, 13, 2], [0.73, 13, 3],
      [6.6, 14, 1], [8.9, 14, 2], [0.71, 14, 3],
      [8.2, 15, 1], [12.1, 15, 2], [0.81, 15, 3]
    ];

    for (const [valor, muestraId, tipoId] of detallesInserts) {
      await client.query(
        'INSERT INTO detalle_muestra_sismica (valor, muestra_sismica_id, tipo_dato_id) VALUES ($1, $2, $3)',
        [valor, muestraId, tipoId]
      );
    }

    const empleadosInserts = [
      ['Juan', 'Perez', 'emp1@ccrs.con', 123123123],
      ['Juan', 'Perez', 'emp2@ccrs.con', 123123123],
      ['Juan', 'Perez', 'emp3@ccrs.con', 123123123]
    ];

    for (const [nombre, apellido, mail, telefono] of empleadosInserts) {
      await client.query(
        'INSERT INTO empleado (nombre, apellido, mail, telefono) VALUES ($1, $2, $3, $4)',
        [nombre, apellido, mail, telefono]
      );
    }

    const usuariosInserts = [
      ['juan1.p', '123abc', 1],
      ['juan2.p', '123abc', 2],
      ['juan3.p', '123abc', 3]
    ];

    for (const [usuario, pass, empId] of usuariosInserts) {
      await client.query(
        'INSERT INTO usuario (nombre_usuario, contraseña, empleado_id) VALUES ($1, $2, $3)',
        [usuario, pass, empId]
      );
    }

    const origenIds = await client.query('SELECT id, nombre FROM origen_generacion');
    const origenMap: any = {};
    origenIds.rows.forEach((row: any) => {
      origenMap[row.nombre] = row.id;
    });

    const estadoIds = await client.query("SELECT id, nombre_estado FROM estado WHERE nombre_clase = 'EventoSismico'");
    const estadoMap: any = {};
    estadoIds.rows.forEach((row: any) => {
      estadoMap[row.nombre_estado] = row.id;
    });

    const eventosData = [
      ['ES-001-2025', new Date(), -24.7821, -24.7900, -65.4232, -65.4300, 145, 3.9, origenMap['explosiones_de_minas'], [1, 2]],
      ['ES-002-2025', new Date(), -31.4201, -31.4300, -64.1888, -64.1900, 50, 1.8, origenMap['interplaca'], [3, 4, 5, 6]],
      ['ES-003-2025', new Date(), -34.6037, -34.6100, -58.3816, -58.3900, 43, 5.2, origenMap['volcanico'], [1]],
      ['ES-004-2025', new Date(), -24.7821, -24.7900, -65.4232, -65.4300, 145, 3.9, origenMap['explosiones_de_minas'], [1, 2, 3, 4, 5, 6]],
      ['ES-005-2025', new Date(), -24.7821, -24.7900, -65.4232, -65.4300, 160, 3.9, origenMap['volcanico'], [2, 6]],
      ['ES-006-2025', new Date(), -24.7821, -24.7900, -65.4232, -65.4300, 388, 2.3, origenMap['interplaca'], [4, 6]],
      ['ES-007-2025', new Date(), -26.8303, -26.8400, -65.2038, -65.2100, 600, 4.3, origenMap['explosiones_de_minas'], [1]],
      ['ES-008-2025', new Date(), -38.0055, -38.0100, -57.5426, -57.5500, 450, 4.6, origenMap['volcanico'], [1]]
    ];

    for (const [id, fecha, latEpi, latHipo, lonEpi, lonHipo, prof, mag, origenId, series] of eventosData as any[]) {
      const estadoId = mag >= 4.0 ? estadoMap['auto_confirmado'] : estadoMap['auto_detectado'];
      
      await client.query(
        `INSERT INTO evento_sismico (id, fecha_hora_ocurrencia, latitud_epicentro, latitud_hipocentro, 
         longitud_epicentro, longitud_hipocentro, profundidad, valor_magnitud, estado_actual_id, origen_generacion_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [id, fecha, latEpi, latHipo, lonEpi, lonHipo, prof, mag, estadoId, origenId]
      );

      for (const serieId of series) {
        await client.query(
          'INSERT INTO evento_serie (evento_id, serie_temporal_id) VALUES ($1, $2)',
          [id, serieId]
        );
      }

      await client.query(
        'INSERT INTO cambio_estado (fecha_hora_inicio, fecha_hora_fin, estado_id, empleado_id, evento_id) VALUES ($1, $2, $3, $4, $5)',
        [new Date(), null, estadoId, null, id]
      );
    }

    await client.query('COMMIT');
    console.log('Seed completado');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en seed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
