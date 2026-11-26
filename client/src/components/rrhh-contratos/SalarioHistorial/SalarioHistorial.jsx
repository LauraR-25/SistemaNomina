import { DataTable } from '../../common/data/DataTable/index.js';
import { Badge } from '../../common/ui/Badge/index.js';
import { formatFecha, formatMoneda } from '../../../utils/formatters.js';
import {
  esSalarioVigente,
  filtrarHistorialSalarios,
} from './salarioHistorial.model.js';
import styles from './SalarioHistorial.module.css';

export function SalarioHistorial({
  historial = [],
  personaId,
  contratoId,
  moneda = 'VES',
  cargando = false,
}) {
  const registros = filtrarHistorialSalarios(historial, {
    personaId,
    contratoId,
  });

  const columnas = [
    {
      key: 'vigente_desde',
      header: 'Desde',
      render: (valor, registro) =>
        formatFecha(valor ?? registro.fecha ?? registro.created_at),
    },
    {
      key: 'vigente_hasta',
      header: 'Hasta',
      render: (valor) => (valor ? formatFecha(valor) : 'Indefinido'),
    },
    {
      key: 'monto',
      header: 'Monto',
      align: 'right',
      render: (valor, registro) => {
        const monto = formatMoneda(valor ?? registro.salario, moneda);

        return esSalarioVigente(registro) ? (
          <strong className={styles.vigente}>{monto}</strong>
        ) : (
          <span className="tabular">{monto}</span>
        );
      },
    },
    {
      key: 'motivo',
      header: 'Motivo',
      render: (valor) => valor || '—',
    },
    {
      key: 'vigencia',
      header: 'Vigencia',
      render: (valor, registro) =>
        esSalarioVigente(registro) ? (
          <Badge variant="accent" size="sm" dot>
            Vigente
          </Badge>
        ) : (
          <Badge variant="neutral" size="sm">
            Anterior
          </Badge>
        ),
    },
  ];

  return (
    <DataTable
      datos={registros}
      columnas={columnas}
      loading={cargando}
      emptyTitle="Sin historial salarial"
      emptyMessage="Todavía no hay registros de salarios para este contrato o persona."
      ariaLabel="Historial de salarios"
    />
  );
}
