// Lógica para el Random Forest (Árboles de decisión)
function ejecutarRandomForest() {
    // 1. Obtener los datos del momento (elástico)
    const var1 = parseFloat(document.getElementById('rf-var1').value);
    const var2 = parseFloat(document.getElementById('rf-var2').value);
    const resultadoDiv = document.getElementById('rf-resultado');

    // Validación básica
    if (isNaN(var1) || isNaN(var2)) {
        resultadoDiv.innerHTML = "⚠️ Por favor, ingresa ambos valores numéricos.";
        resultadoDiv.style.color = "red";
        return;
    }

    // 2. Simulación de la lógica del Random Forest basado en reglas históricas
    let prediccion = "";
    
    if (var1 > 30 && var2 >= 2000) {
        prediccion = "Clasificación A (Alta Probabilidad)";
    } else if (var1 <= 30 && var2 > 1000) {
        prediccion = "Clasificación B (Probabilidad Media)";
    } else {
        prediccion = "Clasificación C (Baja Probabilidad)";
    }

    // 3. Mostrar resultado
    resultadoDiv.innerHTML = `✅ Resultado del Bosque: <strong>${prediccion}</strong>`;
    resultadoDiv.style.color = "#16a085";
}

// Lógica para la Red Neuronal
function ejecutarRedNeuronal() {
    // 1. Obtener los datos
    const var1 = parseFloat(document.getElementById('nn-var1').value);
    const var2 = parseFloat(document.getElementById('nn-var2').value);
    const resultadoDiv = document.getElementById('nn-resultado');

    // Validación básica
    if (isNaN(var1) || isNaN(var2)) {
        resultadoDiv.innerHTML = "⚠️ Faltan datos de entrada para la red.";
        resultadoDiv.style.color = "red";
        return;
    }

    // 2. Simulación Matemática (Pesos y Sesgos básicos de una neurona)
    const peso1 = 0.65;
    const peso2 = 0.80;
    const sesgo = 1.2;

    // Función de activación simple (Cálculo)
    let activacion = (var1 * peso1) + (var2 * peso2) + sesgo;
    let confianza = (activacion / 10).toFixed(2); // Normalizar un poco para la vista

    // 3. Mostrar resultado
    resultadoDiv.innerHTML = `✅ Predicción Neuronal: Nivel de confianza de <strong>${confianza}</strong>`;
    resultadoDiv.style.color = "#16a085";
}