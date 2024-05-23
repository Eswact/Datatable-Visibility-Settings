function setlocalstorage(tmpname, tmpvalue) {
    window.localStorage.setItem(tmpname, JSON.stringify(tmpvalue));
}
function getlocalstorage(tmpname) {
    return JSON.parse(window.localStorage.getItem(tmpname));
}
function SetUserPrefs(visibilityPref, orderPref) {
    setlocalstorage('orderPref', orderPref);
    setlocalstorage('visibilityPref', visibilityPref);
}

// Datatable visibility & ordering
function SetVsColumns(table ,tableColumns, orderPref, visibilityPref) {
    $('.vs-columns').html(
        orderPref.map(function (e) {
            thisColumn = tableColumns.find(x => x.id == e);
            if (thisColumn.check) {
                return `<li>
                            <label data-order="${thisColumn.name}" for="${thisColumn.checkId}" data-realorder=${thisColumn.id} class="vs-option">
                                <input type="checkbox" id="${thisColumn.checkId}" name="${thisColumn.checkId}" ${(visibilityPref[thisColumn.name]) ? 'checked' : ''}>
                                <span>${thisColumn.title}</span>
                            </label>
                            <i class="fa-solid fa-grip-vertical"></i>
                        </li>`
            }
            else {
                return `<li>
                            <label data-order="${thisColumn.name}" data-realorder=${thisColumn.id} class="vs-option">
                                <span>${thisColumn.title}</span>
                            </label>
                            <i class="fa-solid fa-grip-vertical"></i>
                        </li>`;
            }
        }).join('')
    );
    if (table) { SetLabelsFirstData(table); }
}

function SetLabelsFirstData(table) {
    var columnDefination = table.settings()[0].aoColumns;
    $('#visibility-settings ul li label').each(function () {
        let thisColumn = this.dataset.order;
        let thisDef = columnDefination.find(x => x.name == thisColumn);
        this.dataset.order = thisDef.idx;
    });
}

function setColumnVisibility(table, tableColumns) {
    let checkboxes = {};
    tableColumns.forEach(function (column) {
        if (column.check) { checkboxes[`${column.name}`] = column.checkId;}
    });
    Object.keys(checkboxes).forEach(function (columnName) {
        var checkboxSelector = checkboxes[columnName];
        var isVisible = $(`#${checkboxSelector}`).is(':checked');
        // Column Visibility
        table.column(columnName + ':name').visible(isVisible);
        // User Prefs
        visibilityPref[columnName] = isVisible;
    });
}

function setColumnOrder(table, orderPref) {
    let orderArray = [];
    let realOrderArray = [];
    let newOrderData = 0;
    $('#visibility-settings ul li label').each(function () {
        orderArray.push(parseInt(this.dataset.order));
        realOrderArray.push(parseInt(this.dataset.realorder));
    });
    $('#visibility-settings ul li label').each(function () {
        this.dataset.order = newOrderData;
        newOrderData++;
    });
    table.colReorder.order(orderArray);
    orderPref = realOrderArray;
    return orderPref;
}

function setDefaultColumnOrder(table, orderPref) { 
    let orderArray = [];
    let realOrderArray = [];
    for (var i = 0; i < orderPref.length; i++) {
        orderArray.push($(`#visibility-settings ul li label[data-realorder=${i}]`).data('order'));
        realOrderArray.push(i);
    }
    table.colReorder.order(orderArray);
    orderPref = realOrderArray;
    return orderPref;
}

function resetColReorderMD(tableId) {
    $($(tableId).DataTable().columns().header()).each(function () {
        var md = $._data($(this)[0]).events.mousedown;
        for (var i = 0, l = md.length; i < l; i++) {
            if (md[i].namespace == 'ColReorder') {
                md[i].handler = function () { }
            }
        }
    });
}

function visSettingsClose() { $('#visibility-settings').removeClass('open'); }
function visSettingsOpen() { $('#visibility-settings').addClass('open'); }