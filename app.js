// Utilidades

// Convertidor de números a letras (hasta millones)
function numeroALetras(num) {
  if (num === 0) return 'Cero';

  function Unidades(num) {
    switch (num) {
      case 1:
        return 'un';
      case 2:
        return 'dos';
      case 3:
        return 'tres';
      case 4:
        return 'cuatro';
      case 5:
        return 'cinco';
      case 6:
        return 'seis';
      case 7:
        return 'siete';
      case 8:
        return 'ocho';
      case 9:
        return 'nueve';
    }
    return '';
  }

  function Decenas(num) {
    let decena = Math.floor(num / 10);
    let unidad = num - decena * 10;

    switch (decena) {
      case 1:
        switch (unidad) {
          case 0:
            return 'diez';
          case 1:
            return 'once';
          case 2:
            return 'doce';
          case 3:
            return 'trece';
          case 4:
            return 'catorce';
          case 5:
            return 'quince';
          default:
            return 'dieci' + Unidades(unidad);
        }
      case 2:
        switch (unidad) {
          case 0:
            return 'veinte';
          default:
            return 'veinti' + Unidades(unidad);
        }
      case 3:
        return DecenasY('treinta', unidad);
      case 4:
        return DecenasY('cuarenta', unidad);
      case 5:
        return DecenasY('cincuenta', unidad);
      case 6:
        return DecenasY('sesenta', unidad);
      case 7:
        return DecenasY('setenta', unidad);
      case 8:
        return DecenasY('ochenta', unidad);
      case 9:
        return DecenasY('noventa', unidad);
      case 0:
        return Unidades(unidad);
    }
  }

  function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0) return strSin + ' y ' + Unidades(numUnidades);
    return strSin;
  }

  function Centenas(num) {
    let centena = Math.floor(num / 100);
    let decenas = num - centena * 100;

    switch (centena) {
      case 1:
        if (decenas > 0) return 'ciento ' + Decenas(decenas);
        return 'cien';
      case 2:
        return 'doscientos ' + Decenas(decenas);
      case 3:
        return 'trescientos ' + Decenas(decenas);
      case 4:
        return 'cuatrocientos ' + Decenas(decenas);
      case 5:
        return 'quinientos ' + Decenas(decenas);
      case 6:
        return 'seiscientos ' + Decenas(decenas);
      case 7:
        return 'setecientos ' + Decenas(decenas);
      case 8:
        return 'ochocientos ' + Decenas(decenas);
      case 9:
        return 'novecientos ' + Decenas(decenas);
    }
    return Decenas(decenas);
  }

  function Seccion(num, divisor, strSingular, strPlural) {
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;
    let letras = '';

    if (cientos > 0) {
      if (cientos > 1) {
        letras = Centenas(cientos) + ' ' + strPlural;
      } else {
        letras = strSingular;
      }
    }
    if (resto > 0) {
      letras += '';
    }
    return letras;
  }

  function Miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let strMiles = Seccion(num, divisor, 'un mil', 'mil');
    let strCentenas = Centenas(resto);

    if (strMiles == '') return strCentenas;
    return strMiles + (strCentenas ? ' ' + strCentenas : '');
  }

  function Millones(num) {
    let divisor = 1000000;
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let strMillones = Seccion(num, divisor, 'un millón', 'millones');
    let strMiles = Miles(resto);

    if (strMillones == '') return strMiles;
    return strMillones + (strMiles ? ' ' + strMiles : '');
  }

  let entero = Math.floor(num);
  let decimales = Math.round((num - entero) * 100);

  let letrasEntero = Millones(entero);
  letrasEntero = letrasEntero.charAt(0).toUpperCase() + letrasEntero.slice(1);

  if (decimales > 0) {
    return letrasEntero + ' con ' + decimales + '/100';
  } else {
    return letrasEntero;
  }
}

// Logica de Fechas
const meses = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

document.addEventListener('DOMContentLoaded', () => {
  const fechaInput = document.getElementById('fecha');
  const diaInput = document.getElementById('dia');
  const mesInput = document.getElementById('mes');
  const anioInput = document.getElementById('anio');

  fechaInput.addEventListener('change', (e) => {
    if (!e.target.value) {
      diaInput.value = '';
      mesInput.value = '';
      anioInput.value = '';
      return;
    }

    // Add correct timezone parsing
    const date = new Date(e.target.value + 'T00:00:00');

    diaInput.value = date.getDate();
    mesInput.value = meses[date.getMonth()];
    anioInput.value = date.getFullYear();
  });

  const valorInput = document.getElementById('valor');
  const valorLetrasInput = document.getElementById('valor_letras');

  valorInput.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      valorLetrasInput.value = '';
    } else {
      valorLetrasInput.value = numeroALetras(val);
    }
  });

  // Generación de documento desde servidor
  const form = document.getElementById('docForm');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    try {
      // Calcular valores derivados de fecha
      let fechaCalculada = document.getElementById('fecha').value;
      let calcDia = '',
        calcMes = '',
        calcAnio = '';
      if (fechaCalculada) {
        const d = new Date(fechaCalculada + 'T00:00:00');
        calcDia = d.getDate();
        calcMes = meses[d.getMonth()];
        calcAnio = d.getFullYear();
      }

      // Calcular valor en letras
      let valNum = parseFloat(document.getElementById('valor').value);
      let calcValLetras = isNaN(valNum) ? '' : numeroALetras(valNum);

      // Recopilar datos del formulario
      const data = {
        DIA: calcDia,
        MES: calcMes,
        ANIO: calcAnio,
        NOMBRE_INTERMEDIARIO: document
          .getElementById('nombre_intermediario')
          .value.toUpperCase(),
        ESTADO_CIVIL_INTERMEDIARIO: document
          .getElementById('estado_civil_intermediario')
          .value.toUpperCase(),
        NOMBRE: document.getElementById('nombre').value.toUpperCase(),
        ESTADO_CIVIL: document
          .getElementById('estado_civil')
          .value.toUpperCase(),
        MARCA: document.getElementById('marca').value.toUpperCase(),
        MODELO: document.getElementById('modelo').value.toUpperCase(),
        CHASIS: document.getElementById('chasis').value.toUpperCase(),
        MOTOR: document.getElementById('motor').value.toUpperCase(),
        COLOR: document.getElementById('color').value.toUpperCase(),
        ANIO_VEHICULO: document.getElementById('anio_vehiculo').value,
        PLACA: document.getElementById('placa').value.toUpperCase(),
        VALOR: isNaN(valNum)
          ? ''
          : new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(valNum),
        VALOR_EN_LETRAS: calcValLetras.toLowerCase(),
      };

      // Cambiar estado a cargando
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Generando Documento...';
      submitBtn.disabled = true;

      // Peticion al servidor Node.js local
      const res = await fetch('/api/generate-docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || 'Error en el servidor y generación de plantilla.',
        );
      }

      // Obtener el archivo como un Blob
      const blob = await res.blob();

      // Extraer el nombre de archivo de la cabecera 'content-disposition', o asignar uno default
      let filename = `Documentos_${data.NOMBRE.replace(/\s+/g, '_')}_${data.ANIO}.zip`;
      const disposition = res.headers.get('Content-Disposition');
      if (disposition && disposition.indexOf('filename=') !== -1) {
        const filenameFragment = disposition.split('filename=')[1];
        if (filenameFragment) {
          // elimina comillas si tuviera
          filename = filenameFragment.replace(/['"]/g, '');
        }
      }

      // Crear URL y descargar usando API nativas
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Limpieza
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Restaurar estado del boton
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    } catch (error) {
      console.error(error);
      alert('Error: ' + error.message);

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Generar Documento';
      submitBtn.disabled = false;
    }
  });
});
