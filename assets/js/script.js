document.getElementById('convert-button').addEventListener('click', convertmoneda);

async function convertmoneda() {
  const monto = document.getElementById('monto').value;
  const moneda = document.getElementById('moneda').value;
  const resultElement = document.getElementById('result');
  const errorMessageElement = document.getElementById('error-message');
  const chartContainer = document.getElementById('chart-container');
  
  errorMessageElement.innerText = ''; // limpia error
  resultElement.innerText = 'Resultado: Cargando...';

  // obtiene datos de la api tipo monedas
  try {
    const response = await fetch('https://mindicador.cl/api');
    if (!response.ok) {
      throw new Error('Error al obtener los datos de la API');
    }

    const data = await response.json();
    const exchangeRate = data[moneda].valor;

    console.log('Tasa de cambio para', moneda, ':', exchangeRate);

    const convertedmonto = monto * exchangeRate;

    //resultElement.innerText = `Resultado: $${convertedmonto.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resultElement.innerText = `Resultado: $${convertedmonto.toFixed(2)}`;

    // obtiene data historica
    const historicalData = await getHistoricalData(moneda);
    renderChart(historicalData.dates, historicalData.values);

  } catch (error) {
    resultElement.innerText = 'Resultado: Error';
    errorMessageElement.innerText = `Error: ${error.message}`;
  }
}

async function getHistoricalData(moneda) {
  // Para simular datos historicos
  const dates = [];
  const values = [];
  
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString());
    values.push(Math.random() * 1000 + 900); // mostrar valores
  }
  
  return { dates, values };
}

function renderChart(labels, data) {
  const ctx = document.getElementById('monedaChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Valor histórico',
        data: data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'Fecha' } },
        y: { title: { display: true, text: 'Valor' } }
      }
    }
  });
}
