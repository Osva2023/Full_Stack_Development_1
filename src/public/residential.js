
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
               
            var regionSelect = document.getElementById('region');
            regionSelect.addEventListener('change', filterByRegion );
        })
                
});

function sortTable(column, isNumeric = false) {
    const table = document.getElementById('table-body');
    const rows = Array.from(table.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aValue = getSortableValue(a, column, isNumeric);
        const bValue = getSortableValue(b, column, isNumeric);

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

function getSortableValue(row, column, isNumeric) {

    const cell = row.querySelector(`td.${column}`);
    if (cell) {
        if (isNumeric) {
            return cell.textContent.replace(/[^0-9.]/g, '');
        } else {
            return cell.textContent;
        }
        
    } else {
        return '';
    }
}
function formatCurrency(value, useSymbol = false) {
    // Convert the value to a number if it's a string
    var numberValue = typeof value === 'string' ? parseFloat(value) : value;

    // Format the number as currency
    var formattedValue = numberValue.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Remove the dollar sign if useSymbol is false
    if (!useSymbol) {
        formattedValue = formattedValue.replace('$', '');
    }

    return formattedValue;
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
function filterByRegion() {
    var regionSelect = document.getElementById('region');
    var regionSelected = regionSelect.value;
    

    console.log('Region selected:', regionSelected); // Log the selected region
    
    var url = regionSelected === 'all' 
    ? 'http://localhost:3004/agents' 
    : 'http://localhost:3004/agents-by-region?region=' + regionSelected;

    fetch (url)

        .then(response => response.json())
        .then(data => {
            console.log('Type of data:', typeof data);        // Log the type of data  
            console.log('Data received:', data);                      // Log the data array
            let dataArray;
            if (typeof data === 'object' && data.hasOwnProperty('data') && Array.isArray(data.data)) {
                dataArray = data.data;
            } else if (Array.isArray(data)) {
                dataArray = data;
            } else {
                console.error('Unexpected data structure:', data);
                return;
            }

            // Map over the data array and create a new object for each item
            const filteredData = dataArray.map(item => ({
                region: item.region,
                first_name: item.first_name,
                last_name: item.last_name,
                fee: item.fee,
                rating: item.rating
            }));

            // Get the table body
            const tbody = document.querySelector('table tbody');

            // Clear the table body
            tbody.innerHTML = '';

            // Create a new row for each item in the filtered data
            filteredData.forEach(item => {
                const tr = document.createElement('tr');

                // Create a new cell for each property in the item
                for (const property in item) {
                    const td = document.createElement('td');
                    td.textContent = item[property];
                    tr.appendChild(td);
                }

                // Append the row to the table body
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error al obtener datos:', error));
    }



// function showAllRegions() {
//     // Realizar una solicitud para obtener todos los datos de las regiones
//     fetch('http://localhost:3004/agents')
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`Error de red: ${response.status}`);
//         }
//         return response.json();
                                         
//     })
//     .then(data => {
//         // Limpia el contenido existente en el tbody
//         tableBody.innerHTML = '';

//         // Agrega filas de datos
//         data.data.forEach(fila => {
//             const tr = document.createElement('tr');

//             // Añade celdas con datos en las posiciones correctas
//             const regionCell = document.createElement('td');
//             regionCell.textContent = fila.region;
//             tr.appendChild(regionCell);

//             const firstNameCell = document.createElement('td');
//             firstNameCell.textContent = fila.first_name;
//             firstNameCell.classList.add('first-name'); // Añade una clase para ordenar
//             tr.appendChild(firstNameCell);

//             const lastNameCell = document.createElement('td');
//             lastNameCell.textContent = fila.last_name;
//             lastNameCell.classList.add('last-name'); // Añade una clase para ordenar
//             tr.appendChild(lastNameCell);

//             const ratingCell = document.createElement('td');
//             ratingCell.textContent = fila.rating;
//             ratingCell.classList.add('rating'); // Añade una clase para ordenar
//             ratingCell.classList.add(getColorClass(fila.rating));
//             tr.appendChild(ratingCell);

//             const feeCell = document.createElement('td');
//             feeCell.innerHTML = formatCurrency(fila.fee, true);
//             feeCell.classList.add('fee'); // Añade una clase para ordenar
//             tr.appendChild(feeCell);

//             // Agrega la fila al tbody
//             tableBody.appendChild(tr);
//         });
//     })
// }






