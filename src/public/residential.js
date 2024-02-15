let sortOrder = 'asc'; // Add this line at the top of your script

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    

    // Realiza una solicitud para obtener los datos
    fetch('http://localhost:3004/agents')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error de red: ${response.status}`);
            }
            return response.json();
                                             
        })
        .then(data => {
            // Limpia el contenido existente en el tbody
            tableBody.innerHTML = '';

            // Agrega filas de datos
            data.data.forEach(fila => {
                const tr = document.createElement('tr');

                // Añade celdas con datos en las posiciones correctas
                const regionCell = document.createElement('td');
                regionCell.textContent = fila.region;
                tr.appendChild(regionCell);

                const firstNameCell = document.createElement('td');
                firstNameCell.textContent = fila.first_name;
                firstNameCell.classList.add('first-name'); // Añade una clase para ordenar
                tr.appendChild(firstNameCell);

                const lastNameCell = document.createElement('td');
                lastNameCell.textContent = fila.last_name;
                lastNameCell.classList.add('last-name'); // Añade una clase para ordenar
                tr.appendChild(lastNameCell);

                const ratingCell = document.createElement('td');
                ratingCell.textContent = fila.rating;
                ratingCell.classList.add('rating'); // Añade una clase para ordenar
                ratingCell.classList.add(getColorClass(fila.rating));
                tr.appendChild(ratingCell);

                const feeCell = document.createElement('td');
                feeCell.innerHTML = formatCurrency(fila.fee, true);
                feeCell.classList.add('fee'); // Añade una clase para ordenar
                tr.appendChild(feeCell);

                // Agrega la fila al tbody
                tableBody.appendChild(tr);
            });

            // Añade evento de clic a las celdas de encabezado para la ordenación
            const lastNameHeader = document.getElementById('last-name-header');
            lastNameHeader.addEventListener('click', () => {
                sortTable(lastNameHeader.dataset.column);
            });
            const firstNameHeader = document.getElementById('first-name-header');
            firstNameHeader.addEventListener('click', () => {
                sortTable(firstNameHeader.dataset.column);
            });
            const feeHeader = document.getElementById('fee-header');
            feeHeader.addEventListener('click', () => {
                sortTable(feeHeader.dataset.column, true); // passing true to indicate numeric sorting
            });
            const ratingHeader = document.getElementById('rating-header');
            ratingHeader.addEventListener('click', () => {
                sortTable(ratingHeader.dataset.column, true); // passing true to indicate numeric sorting
            });

        })
        .catch(error => console.error('Error al obtener datos:', error));
});

function sortTable(column, isNumeric = false) {
    const table = document.getElementById('table-body');
    const rows = Array.from(table.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aValue = getSortableValue(a, column);
        const bValue = getSortableValue(b, column);

        // Modify this part to consider the sortOrder
        let compareResult;
        if (isNumeric) {
            compareResult = parseFloat(aValue) - parseFloat(bValue);
        } else {
            compareResult = aValue.localeCompare(bValue);
        }

        if (sortOrder === 'desc') {
            compareResult *= -1; // Reverse the comparison result
        }
        return compareResult;
    });

    // Toggle the sortOrder for the next call
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';

    // Limpia el contenido actual del tbody
    table.innerHTML = '';

    // Agrega las filas ordenadas al tbody
    rows.forEach(row => {
        table.appendChild(row);
    });
}

function getSortableValue(row, column) {
    const cell = row.querySelector(`td.${column}`);
    if (cell) {
        const value = cell.textContent.replace(/[^0-9.]/g, '');
        return value;
    } else {
        return '';
    }
}

function formatCurrency(amount, sortable = false) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    if (sortable) {
        return `<span data-sort-value="${amount}">${formatter.format(amount)}</span>`;
    } else {
        return formatter.format(amount);
    }
}

function getColorClass(rating) {
    if (rating === 100) {
        return 'green';
    } else if (rating >= 90) {
        return 'blue';
    } else {
        return 'purple';
    }
}
