// Elementos del DOM
const currentOperationElement = document.getElementById('current-operation')
const previousOperationElement = document.getElementById('previous-operation')
const historyList = document.getElementById('history-list')
const themeToggleBtn = document.getElementById('theme-toggle-btn')
const buttons = document.querySelectorAll('.btn')

// Estado de la calculadora
let currentOperation = '0'
let previousOperation = ''
let operation = undefined
let shouldResetScreen = false
let history = []

// Inicializar cuando el DOM esta cargado
document.addEventListener('DOMContentLoaded', () => {
    // Establecer tema predeterminado (tema claro)
    themeToggleBtn.textContent = '☀️'
})

// Interruptor de tema (claro/oscuro)
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme')
    if (document.body.classList.contains('dark-theme')) {
        themeToggleBtn.textContent = '🌙'
    } else {
        themeToggleBtn.textContent = '☀️'
    }
})

// Eventos de clic en botones
buttons.forEach(button => {
    button.addEventListener('click', () => {
        // Manejar diferentes tipos de botones
        if (button.classList.contains('number')) {
            inputNumber(button.dataset.value)
        } else if (button.classList.contains('operator')) {
            inputOperator(button.dataset.value)
        } else if (button.classList.contains('equals')) {
            calculate()
        } else if (button.classList.contains('decimal')) {
            inputDecimal()
        } else if (button.classList.contains('clear')) {
            clear()
        } else if (button.classList.contains('backspace')) {
            backspace()
        }
        updateDisplay()
    })
})

// Soporte para teclado
document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') {
        inputNumber(event.key)
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        inputOperator(event.key)
    } else if (event.key === '=' || event.key === 'Enter') {
        calculate()
    } else if (event.key === '.') {
        inputDecimal()
    } else if (event.key === 'Escape') {
        clear()
    } else if (event.key === 'Backspace') {
        backspace()
    } else if (event.key === '%') {
        inputOperator('%')
    }
    updateDisplay()
})

// Manejador de entrada de numeros
function inputNumber(number) {
    if (currentOperation === '0' || shouldResetScreen) {
        currentOperation = number
        shouldResetScreen = false
    } else {
        currentOperation += number
    }
}

// Manejador de entrada decimal
function inputDecimal() {
    if (shouldResetScreen) {
        currentOperation = '0.'
        shouldResetScreen = false
        return
    }
    if (!currentOperation.includes('.')) {
        currentOperation += '.'
    }
}

// Manejador de entrada de operadores
function inputOperator(op) {
    if (operation !== undefined && !shouldResetScreen) {
        calculate()
    }
    
    previousOperation = currentOperation
    operation = op
    shouldResetScreen = true
}

// Calcular resultado
function calculate() {
    let result
    const prev = parseFloat(previousOperation)
    const current = parseFloat(currentOperation)
    
    if (isNaN(prev) || isNaN(current)) return
    
    switch (operation) {
        case '+':
            result = prev + current
            break
        case '-':
            result = prev - current
            break
        case '*':
            result = prev * current
            break
        case '/':
            if (current === 0) {
                result = 'Error: Division por cero'
                currentOperation = result
                return
            } else {
                result = prev / current
            }
            break
        case '%':
            result = prev * current / 100
            break
        default:
            return
    }
    
    // Formatear la expresion para mostrar
    let operationSymbol
    switch (operation) {
        case '+': operationSymbol = '+'; break
        case '-': operationSymbol = '−'; break
        case '*': operationSymbol = '×'; break
        case '/': operationSymbol = '÷'; break
        case '%': operationSymbol = '%'; break
    }
    
    const historyEntry = `${previousOperation} ${operationSymbol} ${currentOperation} = ${result}`
    
    // Agregar al historial y actualizar UI solo si no hay error
    if (typeof result === 'number') {
        addToHistory(historyEntry)
        currentOperation = String(result)
        previousOperation = ''
        operation = undefined
    } else {
        currentOperation = result
    }
}

// Agregar operacion al historial
function addToHistory(entry) {
    history.unshift(entry)
    if (history.length > 5) {
        history.pop()
    }
    updateHistoryDisplay()
}

// Actualizar visualizacion del historial
function updateHistoryDisplay() {
    historyList.innerHTML = ''
    history.forEach(entry => {
        const li = document.createElement('li')
        li.textContent = entry
        historyList.appendChild(li)
    })
}

// Limpiar calculadora
function clear() {
    currentOperation = '0'
    previousOperation = ''
    operation = undefined
}

// Retroceder - eliminar ultimo digito
function backspace() {
    if (currentOperation.length === 1 || 
        (currentOperation.length === 2 && currentOperation.startsWith('-'))) {
        currentOperation = '0'
    } else {
        currentOperation = currentOperation.slice(0, -1)
    }
}

// Actualizar visualizacion
function updateDisplay() {
    currentOperationElement.textContent = currentOperation
    
    if (operation !== undefined) {
        let operationSymbol
        switch (operation) {
            case '+': operationSymbol = '+'; break
            case '-': operationSymbol = '−'; break
            case '*': operationSymbol = '×'; break
            case '/': operationSymbol = '÷'; break
            case '%': operationSymbol = '%'; break
        }
        previousOperationElement.textContent = `${previousOperation} ${operationSymbol}`
    } else {
        previousOperationElement.textContent = ''
    }
}
