// Set Table
var stokTable;
const tableColumns = [
    {
        id: 0,
        name: 'username',
        title: 'Username',
        check: false,
        checkId: null,
    },
    {
        id: 1,
        name: 'company',
        title: 'Company',
        check: true,
        checkId: 'companyCheck',
    },
    {
        id: 2,
        name: 'phoneNumber',
        title: 'Phone Number',
        check: true,
        checkId: 'phoneNumberCheck',
    },
    {
        id: 3,
        name: 'email',
        title: 'E-mail',
        check: true,
        checkId: 'emailCheck',
    },
    {
        id: 4,
        name: 'address',
        title: 'Address',
        check: true,
        checkId: 'addressCheck',
    },
    {
        id: 5,
        name: 'process',
        title: 'Process',
        check: false,
        checkId: null,
    }
];
var columnDefs = [];
columnDefs = tableColumns.map(function (column) {
    return { "name": column.name, "targets": column.id };
});

// User Prefs
var orderPref = [];
(getlocalstorage('orderPref'))
    ? orderPref = getlocalstorage('orderPref')
    : $(tableColumns).each(function (index, column) { orderPref.push(column.id) });
var visibilityPref = {};
(getlocalstorage('visibilityPref')) 
    ? visibilityPref = getlocalstorage('visibilityPref')
    : $(tableColumns).each(function (index, column) { visibilityPref[column.name] = true; });

// Create Table
$(document).ready(function () {
    stokTable = $('#customers').DataTable({
        scrollX: true,
        ajax: {
            url: "data.json",
            type: "GET",
            dataSrc: ""
        },
        dom: '<"cth"<"toolbar"><"frl"l>>rt<"cth"<i><p>>',
        columns: [
            {
                data: "username",
                render: function (data, type, row) {
                    if (data != null) {
                        return `<div class="cell flex-center">
                            ${data}
                        </div>`;
                    }
                    else { return '-'; }
                }
            },
            {
                data: "company",
                render: function (data, type, row) {
                    if (data != null) {
                        return `<div class="cell flex-center">
                            ${data}
                        </div>`;
                    }
                    else { return '-'; }
                },
                orderable: false,
            },
            {
                data: "phoneNumber",
                render: function (data, type, row) {
                    if (data != null) {
                        return `<div class="cell flex-center">
                            ${data}
                        </div>`;
                    }
                    else { return '-'; }
                },
                orderable: false,
            },
            {
                data: "email",
                render: function (data, type, row) {
                    if (data != null) {
                        return `<div class="cell flex-center">
                            ${data}
                        </div>`;
                    }
                    else { return '-'; }
                },
                orderable: false,
            },
            {
                data: "address",
                render: function (data, type, row) {
                    if (data != null) {
                        return `<div class="cell flex-center">
                            ${data}
                        </div>`;
                    }
                    else { return '-'; }
                },
                orderable: false,
            },
            {
                data: null,
                render: function (data, type, row) {
                    return `<div class="cell flex-center">
                                <button class="accept-button">Accept</button>
                            </div>`;
                },
                orderable: false,
            }
        ],
        columnDefs: columnDefs,
        colReorder: {
            order: orderPref,
        },
        fnInitComplete: function () {
            //Datatable Toolbar
            var toolbar = `<div class="toolbarFlex">
                                <button class="vs-btn toolbarButs"><i class="fa-solid fa-eye"></i> <span class="mobile-invis">Visibility</span></button>
                                <button class="toolbarButs"><i class="fa-solid fa-magnifying-glass"></i> <span class="mobile-invis">Filters<span></button>
                            </div>`;
            $('div.toolbar').html(`<div style="display:flex; gap:10px;"> ${toolbar} </div>`);
            //Visibility Settings
            $(".vs-btn").off('click').on('click', function () {
                SetVsColumns(stokTable, tableColumns, orderPref, visibilityPref);
                visSettingsOpen();
            });
            $(".vs-save").off('click').on('click', function () {
                //visibility
                setColumnVisibility(stokTable, tableColumns);
                //order
                orderPref = setColumnOrder(stokTable, orderPref);
                //close modal
                visSettingsClose();
                //setPrefs
                SetUserPrefs(visibilityPref, orderPref);
            });
            $(".vs-default").click(function () {
                //visibility
                $(".vs-columns input[type='checkbox']").prop('checked', true);
                setColumnVisibility(stokTable, tableColumns);
                //order
                orderPref = setDefaultColumnOrder(stokTable, orderPref);
                //close modal
                visSettingsClose();
                //setPrefs
                SetUserPrefs(visibilityPref, orderPref);
            });
            //Start
            SetVsColumns(stokTable, tableColumns, orderPref, visibilityPref);
            setColumnVisibility(stokTable, tableColumns);
            resetColReorderMD('#customers');
    
            //Draggable
            let drag = document.querySelector('#visibility-settings ul');
            new Sortable(drag, {
                animation: 150,
                handle: '#visibility-settings ul li i',
                forceFallback: true
            });
        },
        // language: {
        //     info: "_TOTAL_ kayıttan _START_ - _END_ kayıt gösteriliyor.",
        //     infoEmpty: "Gösterilecek hiç kayıt yok.",
        //     loadingRecords: "Kayıtlar yükleniyor.",
        //     lengthMenu: "Sayfada _MENU_ kayıt göster",
        //     zeroRecords: `<div class="table-empty">
        //                             <img src="/images/stock-not-found.png" />
        //                             <span style="padding-bottom:10px;">Aradığınız stoklar bulunamadı.</span>
        //                         </div>`,
        //     search: "Genel Arama:",
        //     infoFiltered: "(toplam _MAX_ kayıttan filtrelenenler)",
        //     buttons: {
        //         copyTitle: "Panoya kopyalandı.",
        //         copySuccess: "Panoya %d satır kopyalandı",
        //         copy: "Kopyala",
        //         print: "Yazdır",
        //     },
        //     paginate: {
        //         first: "İlk",
        //         previous: "Önceki",
        //         next: "Sonraki",
        //         last: "Son",
        //     },
        //     processing: `<div class="loadingCard">
        //                     <img id="myCart" src="/images/loading-gif/cart.gif" />
        //                 </div>`
        // },
    });
});