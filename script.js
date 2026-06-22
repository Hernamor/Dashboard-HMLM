// Variables globales para la gestion de graficos
let instanciaGraficoRegresion = null;

// Ejecucion automatica inicial al cargar el documento
window.onload = function() {
    calcularRegresion();
    calcularArbol();
};

// ==========================================
// SECCION: MODELO DE REGRESION LINEAL
// ==========================================
function calcularRegresion() {
    // Captura elasticidad de datos ingresados
    const inputX = document.getElementById('reg-x').value.split(',').map(Number);
    const inputY = document.getElementById('reg-y').value.split(',').map(Number);

    if (inputX.length !== inputY.length || inputX.length < 2) {
        alert("Error: Los conjuntos X e Y deben tener la misma cantidad de elementos numéricos.");
        return;
    }

    const n = inputX.length;
    let sumaX = 0, sumaY = 0, sumaXY = 0, sumaXX = 0, sumaYY = 0;

    for (let i = 0; i < n; i++) {
        sumaX += inputX[i];
        sumaY += inputY[i];
        sumaXY += inputX[i] * inputY[i];
        sumaXX += inputX[i] * inputX[i];
        sumaYY += inputY[i] * inputY[i];
    }

    // Calculo de pendiente (m) e intercepto (b) - Metodo de Minimos Cuadrados
    const m = (n * sumaXY - sumaX * sumaY) / (n * sumaXX - sumaX * sumaX);
    const b = (sumaY - m * sumaX) / n;

    // Generacion de valores proyectados por la linea de tendencia
    let valoresYPredichos = [];
    let sumaResiduosCuadrados = 0; // Para calcular MSE
    let sumaTotalCuadrados = 0;     // Para calcular R2
    const promedioY = sumaY / n;

    for (let i = 0; i < n; i++) {
        const predicho = m * inputX[i] + b;
        valoresYPredichos.push(predicho);
        
        sumaResiduosCuadrados += Math.pow(inputY[i] - predicho, 2);
        sumaTotalCuadrados += Math.pow(inputY[i] - promedioY, 2);
    }

    // Calculo formal de Metricas
    const mse = sumaResiduosCuadrados / n;
    const r2 = 1 - (sumaResiduosCuadrados / sumaTotalCuadrados);

    // Actualizacion de la interfaz de usuario
    document.getElementById('metric-r2').innerText = r2.toFixed(4);
    document.getElementById('metric-mse').innerText = mse.toFixed(2);
    document.getElementById('reg-equation').innerText = `Y = ${m.toFixed(2)}X + (${b.toFixed(2)})`;

    // Renderizado o actualizacion de la grafica interactiva
    renderizarGraficoRegresion(inputX, inputY, valoresYPredichos);
}

function renderizarGraficoRegresion(datosX, datosY, predichosY) {
    const ctx = document.getElementById('chartRegresion').getContext('2d');
    
    // Si existe una grafica previa, se destruye para evitar superposiciones
    if (instanciaGraficoRegresion) {
        instanciaGraficoRegresion.destroy();
    }

    // Mapeo de puntos de dispersion originales
    const puntosDispersion = datosX.map((x, i) => ({ x: x, y: datosY[i] }));
    // Mapeo de linea de regresion lineal
    const puntosLinea = datosX.map((x, i) => ({ x: x, y: predichosY[i] }));

    instanciaGraficoRegresion = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Datos Historicos Reales',
                    data: puntosDispersion,
                    backgroundColor: '#486581',
                    pointRadius: 6
                },
                {
                    label: 'Linea de Regresion Proyectada',
                    data: puntosLinea,
                    type: 'line',
                    borderColor: '#ef4444',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Variable Independiente (X)' } },
                y: { title: { display: true, text: 'Variable Dependiente (Y)' } }
            }
        }
    });
}


// ==========================================
// SECCION: MODELO DE ARBOL DE DECISION
// ==========================================
function actualizarProfundidadTexto(valor) {
    document.getElementById('depth-value').innerText = valor;
}

function seleccionarDatasetArbol() {
    calcularArbol();
}

function calcularArbol() {
    const profundidadMax = parseInt(document.getElementById('tree-depth').value);
    const datasetSeleccionado = document.getElementById('tree-dataset').value;
    
    let estructuraTexto = "";
    let exactitud = 0;
    let gini = 0;

    // Logica elastica adaptativa simulando ramificaciones matematicas segun profundidad e hiperparametros
    if (datasetSeleccionado === "clima") {
        // Simulacion basada en un set de clasificacion crediticia comercial
        if (profundidadMax === 1) {
            estructuraTexto = "Raiz: ¿Historial Crediticio es Bueno?\n |-- SI -> [Aprobar Credito] (Gini: 0.15)\n |-- NO -> [Rechazar Credito] (Gini: 0.22)";
            exactitud = 75.5;
            gini = 0.18;
        } else if (profundidadMax === 2) {
            estructuraTexto = "Raiz: ¿Historial Crediticio es Bueno?\n |-- SI -> ¿Ingresos Mensuales > $15,000?\n |    |-- SI -> [Aprobar Credito Premium] (Gini: 0.02)\n |    |-- NO -> [Aprobar Credito Basico] (Gini: 0.08)\n |-- NO -> [Rechazar Credito] (Gini: 0.22)";
            exactitud = 84.2;
            gini = 0.10;
        } else {
            estructuraTexto = "Raiz: ¿Historial Crediticio es Bueno?\n |-- SI -> ¿Ingresos Mensuales > $15,000?\n |    |-- SI -> [Aprobar Credito Premium] (Gini: 0.02)\n |    |-- NO -> ¿Tiene Deudas Activas?\n |    |    |-- SI -> [Rechazar Credito] (Gini: 0.05)\n |    |    |-- NO -> [Aprobar Credito Basico] (Gini: 0.01)\n |-- NO -> ¿Tiene Propiedades Aval?\n |    |-- SI -> [Aprobar Credito Especial] (Gini: 0.12)\n |    |-- NO -> [Rechazar Credito] (Gini: 0.00)";
            exactitud = 93.8;
            gini = 0.04;
        }
    } else if (datasetSeleccionado === "riesgo") {
        // Simulacion basada en parametros medicos de criticidad
        if (profundidadMax === 1) {
            estructuraTexto = "Raiz: ¿Edad del Paciente > 60 Anos?\n |-- SI -> [Riesgo Alto] (Gini: 0.31)\n |-- NO -> [Riesgo Bajo] (Gini: 0.19)";
            exactitud = 71.0;
            gini = 0.25;
        } else if (profundidadMax === 2) {
            estructuraTexto = "Raiz: ¿Edad del Paciente > 60 Anos?\n |-- SI -> ¿Presion Arterial > 140?\n |    |-- SI -> [Unidad Cuidados Intensivos] (Gini: 0.05)\n |    |-- NO -> [Monitoreo Preventivo] (Gini: 0.12)\n |-- NO -> [Riesgo Bajo] (Gini: 0.19)";
            exactitud = 81.5;
            gini = 0.12;
        } else {
            estructuraTexto = "Raiz: ¿Edad del Paciente > 60 Anos?\n |-- SI -> ¿Presion Arterial > 140?\n |    |-- SI -> [Unidad Cuidados Intensivos] (Gini: 0.05)\n |    |-- NO -> ¿Sintomas Previos Existentes?\n |    |    |-- SI -> [Monitoreo Hospitalario] (Gini: 0.02)\n |    |    |-- NO -> [Monitoreo Preventivo] (Gini: 0.01)\n |-- NO -> ¿Nivel Oxigenacion < 90%?\n |    |-- SI -> [Tratamiento Inmediato] (Gini: 0.08)\n |    |-- NO -> [Alta Medica] (Gini: 0.00)";
            exactitud = 95.2;
            gini = 0.03;
        }
    }

    // Renderizado de las metricas calculadas del arbol
    document.getElementById('metric-accuracy').innerText = `${exactitud.toFixed(1)}%`;
    document.getElementById('metric-gini').innerText = gini.toFixed(2);
    document.getElementById('tree-structure').innerText = estructuraTexto;
}
