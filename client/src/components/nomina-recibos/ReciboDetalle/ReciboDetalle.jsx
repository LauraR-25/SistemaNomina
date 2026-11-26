import { Button } from '../../common/ui/Button/index.js';
import { StatusBadge } from '../../common/ui/StatusBadge/index.js';
import {
  formatFecha,
  formatMoneda,
  formatNumero,
  formatRif,
} from '../../../utils/formatters.js';
import {
  etiquetaMetodoPago,
  etiquetaPeriodo,
  nombreEmpleado,
  numero,
} from '../nominaRecibos.helpers.js';
import {
  calcularTotalesRecibo,
  clasificarConceptosRecibo,
} from './reciboDetalle.model.js';
import styles from './ReciboDetalle.module.css';

function nombreConcepto(concepto) {
  return (
    concepto.nombre ??
    concepto.concepto?.nombre ??
    concepto.descripcion ??
    concepto.concepto_id ??
    'Concepto'
  );
}

function montoConcepto(concepto) {
  return numero(
    concepto.monto ?? concepto.monto_total ?? concepto.total ?? 0
  );
}

function TablaConceptos({ conceptos = [], moneda }) {
  return (
    <table className={styles.tablaConceptos}>
      <thead>
        <tr>
          <th scope="col">Concepto</th>
          <th scope="col" className={styles.derecha}>
            Cantidad
          </th>
          <th scope="col" className={styles.derecha}>
            Monto
          </th>
        </tr>
      </thead>
      <tbody>
        {conceptos.length === 0 ? (
          <tr>
            <td colSpan={3} className={styles.vacio}>
              Sin conceptos registrados
            </td>
          </tr>
        ) : (
          conceptos.map((concepto, indice) => (
            <tr key={concepto.id ?? indice}>
              <td>{nombreConcepto(concepto)}</td>
              <td className={styles.derecha}>
                {formatNumero(concepto.cantidad ?? 1)}
              </td>
              <td className={styles.derecha}>
                {formatMoneda(montoConcepto(concepto), moneda)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export function ReciboDetalle({
  recibo,
  empresa,
  periodo,
  moneda,
}) {
  const datosRecibo = recibo ?? {};
  const datosEmpresa = empresa ?? datosRecibo.empresa ?? {};
  const datosPeriodo = periodo ?? datosRecibo.periodo ?? null;
  const persona =
    datosRecibo.empleado ??
    datosRecibo.persona ??
    datosRecibo.contrato?.persona ??
    null;
  const monedaFinal = moneda ?? datosEmpresa.moneda_codigo ?? 'VES';
  const conceptos = datosRecibo.conceptos ?? datosRecibo.detalle ?? [];
  const { asignaciones, deducciones, aportesPatronales } =
    clasificarConceptosRecibo(conceptos);
  const totales = calcularTotalesRecibo(conceptos);
  const totalAsignaciones = numero(
    datosRecibo.total_asignaciones ?? totales.asignaciones
  );
  const totalDeducciones = numero(
    datosRecibo.total_deducciones ?? totales.deducciones
  );
  const totalAportes = numero(
    datosRecibo.total_aportes_patronales ??
      aportesPatronales.reduce((acc, concepto) => acc + montoConcepto(concepto), 0)
  );
  const neto = numero(datosRecibo.neto_pagar ?? totales.neto);

  function imprimir() {
    if (typeof window !== 'undefined') window.print();
  }

  return (
    <div className={styles.documento}>
      <div className={styles.acciones}>
        <Button iconLeft="download" onClick={imprimir}>
          Imprimir
        </Button>
      </div>

      <div className={styles.cabecera}>
        <div>
          <span className={styles.marca}>Recibo de pago</span>
          <h2 className={styles.empresaNombre}>
            {datosEmpresa.nombre ?? 'Empresa'}
          </h2>
          <span className={styles.secundario}>
            RIF {formatRif(datosEmpresa.rif)}
          </span>
        </div>
        <div className={styles.identificador}>
          <span className={styles.numero}>
            N.º {datosRecibo.numero ?? datosRecibo.id ?? '—'}
          </span>
          <StatusBadge estado={datosRecibo.estado ?? 'PENDIENTE'} size="sm" />
        </div>
      </div>

      <div className={styles.datos}>
        <section>
          <h3 className={styles.tituloBloque}>Empleado</h3>
          <dl className={styles.lista}>
            <div>
              <dt>Nombre</dt>
              <dd>{nombreEmpleado(persona)}</dd>
            </div>
            <div>
              <dt>Cédula</dt>
              <dd>{persona?.cedula ?? '—'}</dd>
            </div>
            <div>
              <dt>Cargo</dt>
              <dd>{datosRecibo.contrato?.cargo ?? '—'}</dd>
            </div>
          </dl>
        </section>

        <section>
          <h3 className={styles.tituloBloque}>Período y pago</h3>
          <dl className={styles.lista}>
            <div>
              <dt>Período</dt>
              <dd>{etiquetaPeriodo(datosPeriodo)}</dd>
            </div>
            <div>
              <dt>Fecha de pago</dt>
              <dd>{formatFecha(datosRecibo.fecha_pago)}</dd>
            </div>
            <div>
              <dt>Método</dt>
              <dd>{etiquetaMetodoPago(datosRecibo.metodo_pago)}</dd>
            </div>
            <div>
              <dt>Referencia</dt>
              <dd>{datosRecibo.referencia_pago ?? '—'}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className={styles.bloque}>
        <h3 className={styles.tituloBloque}>Asignaciones</h3>
        <TablaConceptos conceptos={asignaciones} moneda={monedaFinal} />
      </section>

      <section className={styles.bloque}>
        <h3 className={styles.tituloBloque}>Deducciones</h3>
        <TablaConceptos conceptos={deducciones} moneda={monedaFinal} />
      </section>

      <section className={`${styles.bloque} ${styles.aportes}`}>
        <h3 className={styles.tituloBloque}>
          Aportes patronales
          <span className={styles.informativo}>Informativo</span>
        </h3>
        <TablaConceptos conceptos={aportesPatronales} moneda={monedaFinal} />
        <p className={styles.nota}>
          Los aportes patronales no se descuentan del neto a pagar del empleado.
        </p>
        <div className={styles.totalAportes}>
          <span>Total aportes patronales</span>
          <strong className="tabular">{formatMoneda(totalAportes, monedaFinal)}</strong>
        </div>
      </section>

      <div className={styles.resumenTotales}>
        <div>
          <span>Total asignaciones</span>
          <strong>{formatMoneda(totalAsignaciones, monedaFinal)}</strong>
        </div>
        <div>
          <span>Total deducciones</span>
          <strong>{formatMoneda(totalDeducciones, monedaFinal)}</strong>
        </div>
      </div>

      <div className={styles.neto}>
        <span>Neto a pagar</span>
        <strong className="tabular">{formatMoneda(neto, monedaFinal)}</strong>
      </div>
    </div>
  );
}

export default ReciboDetalle;
