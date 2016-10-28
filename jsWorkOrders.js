

var WObaseurl = 'http://pacedevadmin.onsitedealersolutions.com/ws/api/';
var GlobalEmployeesOptions = '';
var siteServiceGlobal = '';
var empglobal = '';
var SelectedOption = '';
var GlobalData = '';
var EditNoteid = '';
var workOrderId = 0;

var notescount = 0;
var NotesArrayCount = 1;
var changeCount = 0;

var MainNotesArray = [];
var groupdata = [];
var ServiceNotes = [];
var selectedServices = [];
var selectedCatId = 0;

// Initializing Multi Select Plugin
jQuery(document).ready(function ($) {

    $('#keepRenderingSort').multiselect({
        //afterMoveToLeft: function ($left, $right, $options) {
        //    var count = parseInt($("#keepRenderingSort_to").children().length);
        //    var Vehicaltype = $("#dvDepartments").val();
        //    var value = $('#dvDepartments option[value=' + Vehicaltype + ']').text()
            
        //},
        beforeMoveToRight: function ($left, $right, $options) {
            var count = parseInt($("#keepRenderingSort_to").children().length) + 1;
            //var Vehicaltype = $("#dvDepartments").val();
            //var value = $('#dvDepartments option[value=' + Vehicaltype + ']').text();

            if (count > 5) {
                alert('Select 5 Services only.');
                return false;
            } else {
                selectedServices.push({
                    'catId': selectedCatId,
                    'serviceId': $options[0].value,
                    'serviceTitle': $options[0].text
                });
                return true;
            }
        },
        afterMoveToLeft: function ($left, $right, $options) {
            //var count = parseInt($("#keepRenderingSort_to").children().length) + 1;
            //var Vehicaltype = $("#dvDepartments").val();
            //var value = $('#dvDepartments option[value=' + Vehicaltype + ']').text();

            var Services = [];
            for (var i = 0; i < selectedServices.length; i++) {
                if ((selectedServices[i].catId != selectedCatId && selectedServices[i].serviceId != $options[0].value) || (selectedServices[i].catId == selectedCatId && selectedServices[i].serviceId != $options[0].value)) {
                    // $('#keepRenderingSort_to').append($("<option></option>").val(selectedServices.serviceId).html(value.name));


                    Services.push({
                        'catId': selectedServices[i].catId,
                        'serviceId': selectedServices[i].serviceId,
                        'serviceTitle': selectedServices[i].serviceTitle
                    });                   
                }
            }

            selectedServices = Services;

            //$("#keepRenderingSort_to").children().remove();

            //if (selectedServices.length > 0) {
            //    $.each(selectedServices, function (key, value, index) {
            //        $('#keepRenderingSort_to').append($("<option></option>").val(value.serviceId).html(value.serviceTitle));
            //    });
            //}


            //var expression = 'x=> x.catId == \'' + selectedCatId + '\'';
            //var catcount = $linq(selectedServices).where("" + expression + "").toArray();

            //if (catcount.length > 1) {
            //    var expression1 = 'x=> x.catId == \'' + selectedCatId + '\' && x.serviceId != \'' + $options[0].value + '\' ';
            //    selectedServices = $linq(selectedServices).where("" + expression1 + "").toArray();
            //} else {
            //    var expression1 = 'x=> x.catId != \'' + selectedCatId + '\' && x.serviceId != \'' + $options[0].value + '\' ';
            //    selectedServices = $linq(selectedServices).where("" + expression1 + "").toArray();
            //}
        },
        //leftAll: function () {
        //    alert('test');
        //}
    });

});

$('#keepRenderingSort_leftAll').on('click', function () {
    //$("#keepRenderingSort_to").children().remove();
    selectedServices = [];
});

$(document).ready(function () {

    $(".loadoverlay").show();

    $("#paneltitle").html('Work Order Queue');
    $("#ddlSites").prop("disabled", false);
    $("#txtcreatedby").html(localStorage.Employee_name);

    if (localStorage.token != "" && localStorage.token != null) {
        // Retrive Employees List
        RetriveEmployees();

        BindWorkOrders(localStorage.selectedSite);
        BindRequestedBy();
        BindCategories();

        if (localStorage.selectedSite != 0) {
            var Siteserviceurl = WObaseurl + 'SiteServiceInformation/' + localStorage.selectedSite;

            serviceCalling(Siteserviceurl);
            siteServiceGlobal = global;
        }
    }

   

   

    // TextBox Accept Numbers and : Only
    $("#txtVTime").keypress(function (e) {
        //if the letter is not digit then display error and don't type anything
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 58)) {           
            return false;
        }
    });

    $("#txtv17").blur(function () {
        var VinNumber = '';
        $("#txtvinid").children("input[type=text]").each(function (Index) {

            if (!isEmpty($(this).val())) {
                VinNumber += $(this).val();
            }

            var txtv17 = $("#txtv17").val();

            if (VinNumber.length == 17) {

                if (localStorage.StockNumber == 8) {
                    var stockNumber = VinNumber.substr(VinNumber.length - 8);
                    $('#txtVechicleStock').val(stockNumber);
                    $("#txtVechicleStock").attr("disabled", "disabled");
                }

                BindVINHistory(VinNumber);
            } else {
                $("#WOHDIV").hide();
                $("#WOHistory").children().remove();
                $("#txtVechicleStock").removeAttr("disabled", "disabled");
                //$('#txtVechicleStock').val('');
            }

        });
    });

    //$(document).ready(function () {
        
    //});


    $('#dvDepartments').on("change", "input[type=radio]", function () {
        var catId = this.value;
        selectedCatId = catId;
        BindServices(catId);
    });
    
    jQuery('#datetimepicker_Date').datetimepicker({
        showOn: 'button',
        buttonText: 'DATE',
        buttonImageOnly: true,
        buttonImage: 'images/Date-Icon.png',
        dateFormat: 'mm/dd/yy',
        showTimepicker: false,
        minDate: new Date(),
        beforeShow: function (input, inst) {
            $("#ui-datepicker-div").css('top', '246px');
            $("#ui-datepicker-div").css('left', '647.75px');
        },
        onSelect: function (selected, evnt) {
            changeCount = 1;
            $('#dvOTime').show();
            $('#txtVTime').val('');
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!

            var yyyy = today.getFullYear();

            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }

            today = mm + '/' + dd + '/' + yyyy;
            if (selected == today) {
                $('#selectable').show();
                $("#select-result").empty();
                $('.ui-widget-content').removeClass('ui-selected');               
            } else {
                $('#selectable').hide();
                $("#select-result").empty();              
            }
            $("#selecteddate").html(selected);
        }
    });
    $(".ui-datepicker-trigger").css('width', '41px');
    $(".ui-datepicker-trigger").css('cursor', 'pointer');

    
    $("#selectable").selectable({      
        selected: function (event, ui) {
            if (ui.selected.innerText == SelectedOption) {
                $('.ui-widget-content').removeClass('ui-selected');
                SelectedOption = '';
            } else {
                SelectedOption = ui.selected.innerText;
            }
        }
    });

    // Checking Site Stock Number
    if (localStorage.selectedSite != 0) {
        var SiteStockserviceurl = WObaseurl + 'SitePreference/0/' + localStorage.selectedSite;

        serviceCalling(SiteStockserviceurl);
        var SiteStock = global;

        if (SiteStock.length != 0) {
            localStorage.StockNumber = SiteStock[0].pfStockNumber;
        } else {
            localStorage.StockNumber = 0;
        }
    }

    

    $("#ddlSites").change(function () {
        $(".loadoverlay").show();
        var value = this.value;
        setTimeout(function () {
            //alert('test');       
            
            $('#sitename').html($("#ddlSites option:selected").text());
            localStorage.selectedSiteName = $("#ddlSites option:selected").text();
            //alert($('option:selected', this).text());

            localStorage.selectedSite = value;
            localStorage.LoginSiteId = '';

            var serviceurl = WObaseurl + 'SiteBrandInformation/' + value;

            serviceCalling(serviceurl);
            var sitebrands = global;
            localStorage.brandInfo = JSON.stringify(sitebrands);
            var brands = '';

            if (sitebrands.length > 0) {
                localStorage.default = 1;
                for (var i = 0; i < sitebrands.length; i++) {
                    var brandurl = sitebrands[i].siteBrandLogo == '' ? 'images/Brands/0.png?preset=thumb_Profile' : 'images/Brands/' + sitebrands[i].siteBrandLogo + '?preset=thumb_Profile';
                    brands += '<div class="brands" onclick="changebrand(' + sitebrands[i].siteBrandId + ')"><img src=' + brandurl + '  title =' + sitebrands[i].siteBrandName + '></div>';
                    //brands += '<div class="brands"><a  title =' + sitebrands[i].siteBrandName + ' onclick="changebrand(' + sitebrands[i].siteBrandId + ')">' + sitebrands[i].siteBrandName + '</a></div>';
                }

                $('#divbrands').html(brands);

                // Applying Brand CSS
                localStorage.dynamicCSS = JSON.stringify(sitebrands[0]);
                dynamicCSS();

                // Calling Site Brand Image Information
                var sitebrandimageurl = WObaseurl + 'SiteBrandImageInformation/' + sitebrands[0].siteId;
                serviceCalling(sitebrandimageurl);
                var sitebrandimages = global;
                localStorage.brandImagesInfo = JSON.stringify(sitebrandimages);

                if (sitebrandimages.length > 0) {

                    var url = '';
                    for (var j = 0; j < sitebrandimages.length; j++) {
                        if (sitebrands[0].siteBrandId == sitebrandimages[j].siteBrandId) {
                            url = sitebrandimages[j].siteBrandImage == '' || sitebrandimages[j].siteBrandImage == 'NA' ? 'images/Sites/Default.jpg' : 'images/Sites/' + sitebrandimages[j].siteBrandImage;
                        }
                    }

                    //alert(brandimages.length);
                    $('#masterbody').css({
                        "background": "url(" + url + ") no-repeat center center fixed",
                        "background-size": "cover",
                        "background-position": "center"
                    });
                }
                else {
                    $('#masterbody').css({
                        "background": "url(images/Sites/Default.jpg) no-repeat center center fixed",
                        "background-size": "cover",
                        "background-position": "center"
                    });
                }
            }
            else {
                $('#masterbody').css({
                    "background": "url(images/Sites/Default.jpg) no-repeat center center fixed",
                    "background-size": "cover",
                    "background-position": "center"
                });

                if (localStorage.selectedSite == 0) {
                    $('#divbrands').html('All Brands');
                    localStorage.default = 0;
                } else {
                    $('#divbrands').html('No Brands');
                    localStorage.default = 0;
                }

                localStorage.dynamicCSS = '';
                dynamicCSS();
            }

            RetriveEmployees();
            BindWorkOrders(localStorage.selectedSite);
            BindRequestedBy();

            if (localStorage.selectedSite != 0) {
                var Siteserviceurl = WObaseurl + 'SiteServiceInformation/' + localStorage.selectedSite;

                serviceCalling(Siteserviceurl);
                siteServiceGlobal = global;

                var Stockserviceurl = WObaseurl + 'SitePreference/0/' + localStorage.selectedSite;

                serviceCalling(Stockserviceurl);
                var SitePreference = global;

                if (SitePreference.length != 0) {
                    localStorage.StockNumber = SitePreference[0].pfStockNumber;
                } else {
                    localStorage.StockNumber = 0;
                }

                
            }
        }, 1000);

    });    
    

    


   

    $("#divbrands").css('padding', '0px');
});

function OnChangeCategory(ID) {
    var changeid = "#" + ID;
    
    var value = $('input[name=radios]:checked', changeid).val();

    var html = $('input[type="radio"]:checked', changeid).parent().text();   
   
    BindServices(value);
}

// Retrive Employees only 
function RetriveEmployees() {
    var path = '';

    if (localStorage.selectedSite == 0) {
        path = WObaseurl + 'EmployeesAllInformation/' + localStorage.EmployeeId + '/EP';
    } else {
        path = WObaseurl + 'SiteEmployeesInformation/' + localStorage.selectedSite + '/EP';
    }

    Calling(path);
    var Employees = empglobal;

    var options = '<option value="0">--Select--</option>';

    for (var i = 0; i < Employees.length; i++) {
        if (Employees[i].employeeStatus == 'Y')
            options += '<option value="' + Employees[i].employeeNumber + '">' + Employees[i].employeeName + '</option>';
    }

    GlobalEmployeesOptions = options;
}

// Binding Sales Managers
function BindRequestedBy() {
    var path = WObaseurl + 'SiteEmployeesInformation/' + localStorage.selectedSite + '/SA';

    Calling(path);
    var groups = empglobal; 
   
    var idname = '#ddlrequestby';

    $(idname).children().remove();
    $(idname).append($("<option></option>").val(0).html("--Select--"));
    $.each(groups, function (key, value) {
        var mname = '';
        if (value.employeeMiddleName != 'NA') {
            mname = value.employeeMiddleName;
        } else {
            mname = ' ';
        }
        var fullname = value.employeeFirstName + ' ' + mname + ' ' + value.employeeLastName;
        if (value.employeeStatus == 'Y') {
            $(idname).append($("<option></option>").val(value.employeeNumber).html(fullname));
        }
        
    });
}

// Retrive VIN history based on VIN Number
function BindVINHistory(VIN) {

    if (VIN != '') {
        //var vininfourl = WObaseurl + 'VinInformation/' + VIN;

        //serviceCalling(vininfourl);
        //var VINHistory = global;

        var vinserviceurl = WObaseurl + 'VinServiceInformation/' + VIN;

        serviceCalling(vinserviceurl);
        var History = global;

        var VINHistory = $linq(History).groupBy(function (x) { return x.workerOrderID; }).toArray();

        //var res = $linq(History).groupBy(function (x) { return x.categoryId; }).toArray();
        var colors = [{
            'id': 1,
            'color': '#bbced8'
        }, {
            'id': 2,
            'color': '#c8c4f5'
        }]
        var count = 0;
        


        if (VINHistory.length > 0) {
            var VINdivs = '<table class="table griddiv1 paginated" style="border: solid 3px #3a3b3c;"><thead style="text-align: center; background: #3a3b3c; color: #fff;"><tr><th>WO NUMBER</th><th rowspan="5" style="vertical-align: inherit;border-right: 1px solid #ddd;">REQUEST BY</th><th>DATE</th><th>CATEGORY</th><th>SERVICES</th></tr></thead><tbody id="">';
            for (var i = 0; i < VINHistory.length; i++) {
                var servicedivs = '';
                var expression1 = 'x=> x.workerOrderID == \'' + VINHistory[i].values[i].workerOrderID + '\'';
                var res = $linq(History).where("" + expression1 + "").toArray();


                res = $linq(res).groupBy(function (x) { return x.categoryId; }).toArray();
                var rowscount = 0;




                for (var j = 0; j < res.length; j++) {
                    rowscount += res[j].values.length;
                    servicedivs += '<td rowspan="' + res[j].values.length + '" style="background:' + colors[count].color + ';vertical-align: inherit;border-right: 1px solid #ddd;">' + res[j].values[0].categoryName + '</td>' +
                                                        '<td style="border-left: 1px solid #ddd;border-right: 1px solid #ddd;background:' + colors[count].color + '">' + res[j].values[0].serviceTitle + '</td>' +
                                                        '</tr>';

                    for (var z = 1; z < res[j].values.length; z++) {
                        servicedivs += '<tr style="background:' + colors[count].color + ';"><td>' + res[j].values[z].serviceTitle + '</td></tr>';
                    }

                }

                VINdivs += '<tr style="background:' + colors[count].color + ';"><td rowspan="' + rowscount + '" style="vertical-align: inherit;border-right: 1px solid #ddd;">' + VINHistory[i].values[i].workOrderNumber  + '</td>' +
                                                       '<td rowspan="' + rowscount + '" style="vertical-align: inherit;border-right: 1px solid #ddd;">' + VINHistory[i].values[i].serviceWORequestedBy + '</td><td rowspan="' + rowscount + '" style="vertical-align: inherit;border-right: 1px solid #ddd;">' + VINHistory[i].values[i].serviceWORequestedDate + '</td>' + servicedivs;

                if (count == 1) {
                    count--;
                } else {
                    count++;
                }
            }
            VINdivs += '</tbody></table>';
            $("#WOHistory").children().remove();
            $("#WOHDIV").show();
            $("#WOHistory").append(VINdivs);
        } else {
            $("#WOHDIV").hide();
            $("#WOHistory").children().remove();
        }
    }
}

// Binding WorkOrders
function BindWorkOrders(siteId) {
    SelectedOption = '';
    var url = WObaseurl + 'WorkOrder/0/' + siteId + '/' + localStorage.EmployeeId;
    serviceCalling(url);
    GlobalData = global;

    SearchWorkOrders(GlobalData);
}

function SearchWorkOrders(WoData) {
    //$(".loadoverlay").show();
    if (localStorage.selectedSite == 0) {
        $('#divbrands').html('');
    }

    //$("#loader").show();

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    var yyyy = today.getFullYear();

    today = mm + '-' + dd + '-' + yyyy;
    var TotalDivs = '';
    var count = 1;

    var msg = WoData;
    $("#WorkOrdersDiv").children().remove();
    $("#WorkOrdersDiv").html('');
    if (msg.length != 0) {
        var f = 1;
        // pageIndex = 1;

        for (var i = 0; i < msg.length; i++) {
            TotalDivs = '';
            var services = BindServicetoGrid(msg[i].workOrderNumber);
            var duedate = msg[i].workOrderRequestDate + '&nbsp;' + msg[i].workOrderRequestTime;
            //if (msg[i].workOrderSiteId == localStorage.selectedSite) {
            //if (msg[i].workOrderRequestDate == today) {
            //    duedate = msg[i].workOrderRequestTime;
            //} else {
            //    duedate = msg[i].workOrderRequestDate;
            //}

            var servicetable = '<table id="workorderTable" class="table" cellspacing="0" style="width:100%;margin:0px;"><thead><tr style="background-color: rgb(31, 32, 34);padding: 1px 0px 0px 5px;color: #fff;"><th>Department</th><th>Service Items</th><th>Approved</th><th>Assigned To</th><th>Status</th><th style="padding: 0px;text-align: center;">Notes</th></tr></thead><tbody id="Employeeserviceassignment_' + i + '">';

            for (var j = 0; j < services.length; j++) {
                var approval = '';
                var assignEmp = '';
                var status = '';
                // Checking Approval Required or Not
                if (services[j].workOrderServiceApprovalReq == 'Y') {
                    // Checking Approved or Not
                    if (services[j].workOrderServiceApprovedById != '') {

                        // Checking Service Assigned or Not
                        if (services[j].workOrderServiceAssignedToName != '') {
                            // Checking Service Picked or Not
                            if (services[j].workOrderServicePickedDate != '') {
                                // Checking Service Completed or Not
                                if (services[j].workOrderServiceCompletedDate != '') {
                                    assignEmp = '<div> Completed by &nbsp;-&nbsp;' + services[j].workOrderServiceAssignedToName + '<br />' + services[j].workOrderServiceCompletedDate + '&nbsp;' + services[j].workOrderServiceCompletedTime + '</div>';
                                    assignEmp += '<select style="width: 100%; height: 25px; border: 1px solid #ddd; border-radius: 4px; display:none;"  id="EmployeeWorkOrder_' + i + '_' + j + '" onchange="ddlAssignEmployee(this)" tabindex="1">' + GlobalEmployeesOptions + '</select>';
                                    status = 'Completed';
                                } else {
                                    assignEmp = '<div  id="wos_' + services[j].workOrderSeriveNumber + '"  title="Picked">Picked By &nbsp;' + services[j].workOrderServiceAssignedToName + '<br />' + services[j].workOrderServicePickedDate + '&nbsp;' + services[j].workOrderServicePickedTime + '</div>';
                                    assignEmp += '<select style="width: 100%; height: 25px; border: 1px solid #ddd; border-radius: 4px; display:none;"  id="EmployeeWorkOrder_' + i + '_' + j + '" onchange="ddlAssignEmployee(this)" tabindex="1">' + GlobalEmployeesOptions + '</select>';
                                    status = 'In Progress';
                                }
                            } else {
                                assignEmp = '<select style="width: 100%; height: 25px; border: 1px solid #ddd; border-radius: 4px;"  id="EmployeeWorkOrder_' + i + '_' + j + '" onchange="ddlAssignEmployee(this)" tabindex="1">' + GlobalEmployeesOptions + '</select>';
                                status = 'Assigned';
                            }
                        } else {
                            assignEmp = '<select style="width: 100%; height: 25px; border: 1px solid #ddd; border-radius: 4px;"  id="EmployeeWorkOrder_' + i + '_' + j + '" onchange="ddlAssignEmployee(this)" tabindex="1">' + GlobalEmployeesOptions + '</select>';
                            status = '<div id="dvstatus_' + i + '_' + j + '">Open</div>';
                        }

                        approval = '<div name="serv_' + i + '" id="wos_' + services[j].workOrderSeriveNumber + '"  title="Approved">Approved By ' + services[j].workOrderServiceApprovedByName + '<br />' + services[j].workOrderServiceApprovedDate + '&nbsp;' + services[j].workOrderServiceApprovedTime + '</div>';

                        // Checking Service Assigned or Not
                        //if (services[j].workOrderServiceAssignedToName != '')
                        //{
                        //    assignEmp = '<div>' + services[j].workOrderServiceAssignedToName + '</div>';
                        //} else {
                        //    assignEmp = '<select style="width: 100%; height: 35px; border: 1px solid #ddd; border-radius: 4px;"  id="EmployeeWorkOrder_' + i + '" onchange="ddlAssignEmployee(this)" tabindex="1">' + GlobalEmployeesOptions + '</select>';
                        //}
                    } else {
                        assignEmp = '<select disabled="disabled" style="width: 100%; height: 25px; border: 1px solid #ddd; border-radius: 4px;"  id="EmployeeWorkOrder_' + i + '_' + j + '" onchange="ddlAssignEmployee(this)" tabindex="1">' + GlobalEmployeesOptions + '</select>';
                        approval = '<div name="serv_' + i + '_' + j + '"><div id="wos_' + services[j].workOrderSeriveNumber + '" class="btn bg-primary btn-xs" title="Approve" onclick="ApproveWorkOrderService(\'' + services[j].workOrderSeriveNumber + '\',\'' + i + '_' + j + '\',\'' + services[j].workOrderId + '\')"> Approve </div><img id="imgApprove_' + i + '_' + j + '" src="images/ajax-loader.gif" style="display:none;" /></div>';
                        status = '<div id="dvstatus_' + i + '_' + j + '">Waiting for Approval</div>';
                    }
                } else {
                    // Checking Service Assigned or Not
                    if (services[j].workOrderServiceAssignedToName != '') {
                        // Checking Service Picked or Not
                        if (services[j].workOrderServicePickedDate != '') {
                            // Checking Service Completed or Not
                            if (services[j].workOrderServiceCompletedDate != '') {
                                assignEmp = '<div> Completed by &nbsp;-&nbsp;' + services[j].workOrderServiceAssignedToName + '<br />' + services[j].workOrderServiceCompletedDate + '&nbsp;' + services[j].workOrderServiceCompletedTime + '</div>';
                                assignEmp += '<select style="width: 100%; height: 25px; border: 1px solid #ddd; border-radius: 4px; display:none;"  id="EmployeeWorkOrder_' + i + '_' + j + '" onchange="ddlAssignEmployee(this)" tabindex="1">' + GlobalEmployeesOptions + '</select>';
                                status = 'Completed';
                            } else {
                                assignEmp = '<div  id="wos_' + services[j].workOrderSeriveNumber + '"  title="Picked">Picked By ' + services[j].workOrderServiceAssignedToName + '<br />' + services[j].workOrderServicePickedDate + '&nbsp;' + services[j].workOrderServicePickedTime + '</div>';
                                assignEmp += '<select style="width: 100%; height: 25px; border: 1px solid #ddd; border-radius: 4px; display:none;"  id="EmployeeWorkOrder_' + i + '_' + j + '" onchange="ddlAssignEmployee(this)" tabindex="1">' + GlobalEmployeesOptions + '</select>';
                                status = 'In Progress';
                            }

                        } else {
                            assignEmp = '<select style="width: 100%; height: 25px; border: 1px solid #ddd; border-radius: 4px;"  id="EmployeeWorkOrder_' + i + '_' + j + '" onchange="ddlAssignEmployee(this)" tabindex="1">' + GlobalEmployeesOptions + '</select>';
                            status = '<div id="dvstatus_' + i + '_' + j + '">Assigned</div>';
                        }
                    } else {
                        assignEmp = '<select style="width: 100%; height: 25px; border: 1px solid #ddd; border-radius: 4px;"  id="EmployeeWorkOrder_' + i + '_' + j + '" onchange="ddlAssignEmployee(this)" tabindex="1">' + GlobalEmployeesOptions + '</select>';
                        status = '<div id="dvstatus_' + i + '_' + j + '">Open</div>';
                    }
                    approval = '<div name="serv_' + i + '_' + j + '" id="wos_' + services[j].workOrderSeriveNumber + '" >NA</div>';

                }

                servicetable += '<tr>'
                             + '<td style="width: 100px;" id="' + services[j].workOrderServiceCategoryId + '">' + services[j].workOrderCategory + '</td>'
                             + '<td style="width: 230px;" id="' + services[j].workOrderSiteServiceId + '">' + services[j].workOrderService + '</td>'
                             + '<td>' + approval + '</td>'
                             + '<td>' + assignEmp + '</td>'
                             + '<td style="width: 85px;">' + status + '</td>'
                             + '<td style="vertical-align: inherit;text-align: center;width: 50px;"><a class="" style="cursor: pointer;" title="Notes" onclick="ViewGridServiceNotes(\'' + services[j].workOrderId + '\',\'' + services[j].workOrderServiceCategoryId + '\',\'' + services[j].workOrderSiteServiceId + '\')"><img src="images/viewicon.png" width="20" /></a></td>'
                             + '</tr>';
                //BindEmployees('#EmployeeWorkOrder_' + j);


            }

            servicetable += '</tbody></table>';
      
            var VIN = msg[i].workOrderVinNumber;
            var last8 = VIN.substr(VIN.length - 8);
            var first9 = VIN.substring(0, 9);

            var Header = ' <div id="row_' + i + '" style="margin-bottom: 1px !important;" class="style">'
                       + ' <div class="content-box-header panel-heading" style="padding-top: 0px; padding-left: 0px; background: #428bca; padding-bottom: 0px; color: #ffffff;">'
                       + '<div class="panel-options" style="margin-top: 5px;">'
                       + '<span style="color: #fff; font-size: 12px;">'
                       + '<i class="glyphicon glyphicon-calendar"></i>&nbsp;Due ' + duedate 
                       + '</span>'
                       + '</div>'
                       + '<div class="col-lg-2 col-md-2 col-sm-6" style="padding: 0px;"><label style="margin-left: 10px; margin-top: 5px;">VIN:</label>&nbsp;<span>' + first9 + last8 + '</span></div>'
                       + '<div class="panel-title col-lg-2 col-md-2 col-sm-2" style="margin-top: 7px; font-size: 12px; padding-left: 17px;" id="WOID_' + count + '">'

                        if (msg[i].workOrderStockNumber != '') {
                            Header += '<label>Stock Number:</label>&nbsp;<span>' + msg[i].workOrderStockNumber + '</span>'
                        }                      
                        Header += '</div>'
                       + '</div>';

            var Content = '<div class="content-box-large box-with-header" style="padding: 0px;margin-bottom: 0px !important;opacity: 100 !important;">'
                        + '<div class="row" id="dvInfo_' + i + '" style="margin: 0px;">'
                        + '<div class="col-sm-12" style="padding: 0px">'
                        + '<div class="col-sm-2" style="padding: 0px;">'
                        + '<div class="col-sm-12" style="padding: 5px 0px 5px 10px;">'
                        + '<label style="color: #005c8b;">Created by:&nbsp;</label>'
                        + '<label id="CreatedBy_' + count + '"> ' + msg[i].workOrderEmployeeName + '</label>'
                        + '<br>'
                        + '<label style="color: #005c8b;">On:&nbsp;</label>'
                        + '<label style="font-weight: bold font-size:12px;" id="TimeStatus_' + count + '"> ' + msg[i].workOrderTimeStatus + '<time class="timeago" datetime=""></time></label>'
                        + '</div>'
                        + '<div class="col-sm-12" style="margin: 5px 5px 5px 0px;">'
                        + '<img src="PACE-Work Orde Queue_files/bmw_car.png" class="img-responsive" width="191" height="92" alt="">'
                        + '</div>'
                        + '<div class="col-sm-12" style="margin:15px;"><input type="button" class="btn btn-info btn-xs" value="Work Order History" /></div>'
                        //+ '<div class="clearfix"></div>'
                        //+ '<div class="col-sm-12"><ul class="legend"><li><span class="awesome"></span>Assigned / Picked</li></ul></div>'
                        + '</div>'
                        + '<div class="col-sm-10">'
                        + '<div>'
                        + '<div class="col-lg-5 col-md-5 col-sm-5" style="padding: 0px;"><label style="color: #005c8b; font-weight: normal; font-size: 12px; padding: 5px 0px 5px 0px;">Requested Services</label></div>'
                        + '<div class="col-lg-5 col-md-5 col-sm-5"><label style="color: #005c8b; font-weight: normal; font-size: 12px; padding: 5px 0px 5px 0px;">Work Order Status: <span style="font-weight: 900;" id=wostatus_' + msg[i].workOrderNumber + '>' + msg[i].workOrderStatus + ' </span></label></div>'
                        + '</div>'
                        + '<div class="clearfix"></div>'
                        + '<div class="col-lg-12" style="border: 1px solid black; margin-bottom: 10px;padding: 0px;">' + servicetable + '</div>'
                        + '<div id="btnAssign_' + i + '" class="col-lg-12" style="text-align: right;display:none;"><div class="btn btn-primary btn-xs" id="btnAssignServ_' + i + '" title="Assign Services"  onclick="AssignWorkOrder(this,\'' + msg[i].workOrderNumber + '\',\'' + msg[i].workOrderSiteId + '\');">Assign Services</div><img id="imgWorkOrderAssign_' + msg[i].workOrderNumber + '" src="images/ajax-loader.gif" style="display:none;" /></div>'
                        //+ '<label style="color: #005c8b; font-weight: normal; font-size: 12px">Notes:</label>';
                        //+ '<div id="notes_' + msg[i].workOrderNumber + '" style="margin: 0px 0px 0px; margin-bottom: 20px;">' + msg[i].workOrderNote + '&nbsp-&nbsp<a style="color: #337ab7;cursor: pointer;" onclick="ViewGridWorkOrderNotes(' + msg[i].workOrderNumber +');">View</a></div>'
                        //if (msg[i].workOrderMultipleNotes == 'Y' && msg[i].workOrderNote != '') {
                        //    Content += '<label style="color: #005c8b; font-weight: normal; font-size: 12px">Notes:</label><div id="notes_' + msg[i].workOrderNumber + '" style="margin: 0px 0px 0px; margin-bottom: 20px;">' + msg[i].workOrderNote + '&nbsp-&nbsp<a title="View More"  style="color: #337ab7;cursor: pointer;" onclick="ViewGridWorkOrderNotes(' + msg[i].workOrderNumber + ');">More...</a></div>'
                        //} else if (msg[i].workOrderMultipleNotes == 'N' && msg[i].workOrderNote != '') {
                        //    Content += '<label style="color: #005c8b; font-weight: normal; font-size: 12px">Notes:</label><div id="notes_' + msg[i].workOrderNumber + '" style="margin: 0px 0px 0px; margin-bottom: 20px;">' + msg[i].workOrderNote + '</div>'
                        //}
                        //+ '<label style="color: #005c8b; font-weight: normal; font-size: 12px">Notes:</label><div id="notes_' + msg[i].workOrderNumber + '" style="margin: 0px 0px 0px; margin-bottom: 20px;">' + msg[i].workOrderNote + '&nbsp-&nbsp<a title="View More"  style="color: #337ab7;cursor: pointer;" onclick="ViewGridWorkOrderNotes(' + msg[i].workOrderNumber + ');">More...</a></div>'
                         if (msg[i].workOrderNote != '') {
                             Content += '<label style="color: #005c8b; font-weight: normal; font-size: 12px; margin: 18px 0px 0px 0px;">Notes:</label><div id="notes_' + msg[i].workOrderNumber + '" style="margin: 0px 0px 0px;margin-bottom: 10px;">' + msg[i].workOrderNote + '&nbsp;-&nbsp;<a title="View More"  style="color: #337ab7;cursor: pointer;" onclick="ViewGridWorkOrderNotes(' + msg[i].workOrderNumber + ');">Details</a></div>'
                        } else {
                             Content += '<label style="color: #005c8b; font-weight: normal; font-size: 12px; margin: 18px 0px 0px 0px;">Notes:</label><div id="notes_' + msg[i].workOrderNumber + '" style="margin: 0px 0px 0px;margin-bottom: 10px;">' + msg[i].workOrderNote + '<a title="View More"  style="color: #337ab7;cursor: pointer;" onclick="ViewGridWorkOrderNotes(' + msg[i].workOrderNumber + ');">Add Note</a></div>'
                        }
                        + '</div>'
                        + '</div>'
                        + '</div>'
                        + '</div>'
                        + '</div>';

            TotalDivs += Header + Content;
            f++;
            $("#WorkOrdersDiv").append(TotalDivs);

            // Checking for default select employee for assigned services
            for (var k = 0; k < services.length; k++) {
                // Checking Service Assigned or Not
                if (services[k].workOrderServiceAssignedToName != '') {
                    var ddid = "#EmployeeWorkOrder_" + i + "_" + k;
                    $(ddid).val(services[k].workOrderServiceAssignedToId);
                }
            }         
        }

        totalrecords = msg.length;
        totalpages = totalrecords
        //totalpages = Math.ceil(totalrecords / pagesize);
    } else {
        TotalDivs += '<div style="background: rgba(241,245,250,1);height: 21px;text-align: center;padding: 2px;font-size: 14px;"><span style="color:red;">No Work Orders Found !</span></div>'
        totalrecords = 0;
        $("#WorkOrdersDiv").append(TotalDivs);
    }
    //TotalDivs += '<div id="btnShowMore"  style="background-color: aliceblue;text-align:center;padding-top:5px;padding-bottom:5px;"><input class="btn btn-primary"  type="button" value="Show More" onclick="ViewMore();" /></div>';

    $(".loading").hide();

    
   // ShowMore(pagesize);

    //if (totalrecords <= pagesize) {
    //    $("#btnShowMore").hide();
    //}

    //$("#PayrollTable").tablesorter({});

    $(".loadoverlay").hide();
}


// Retriving WorkOrders Services and retrun Based on WorkOrder Id
function BindServicetoGrid(woId) {
    var url = WObaseurl + 'WorkOrderService/0/' + woId
    var data = '';
    jQuery.support.cors = true;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        async: false,
        //crossDomain: true,
        async: false,
        success: function (response) {
            data = response;
        },
        error: function (response) {
            //alert(response.status + ' ' + response.statusText);
        },
    });
    return data;
}

// Showing Popup for Category Services
function ShowServices() {  
    $("#ServicesPopup").modal('show');
    $("#dvDepartments").focus();
}

// Retriving Service Categories for Selecting services when create Work Order
function BindCategories() {
    var path = WObaseurl + 'CategoryInformation/' + localStorage.EmployeeId + '/' + localStorage.selectedSite;

    Calling(path);
    var groups = empglobal;

    $('#dvDepartments').children().remove();

    $.each(groups, function (key, value) {
        if (value.serviceCategoryTitle != 'NA') {
            $('#dvDepartments').append('<div class="col-lg-6"><label class="radio"><input id="radio' + value.seriveCategoryNumber + '" type="radio" value="' + value.seriveCategoryNumber + '" name="radios"><span class="outer"><span class="inner"></span></span>' + value.serviceCategoryTitle + '</label></div>');
        }
    });
}


// Retriving Services based on Category Id to Select services when create Work Order
function BindServices(catId) {

    if (localStorage.selectedSite == 0) {
        alert('Please Select Site');
    } else {
        var path = WObaseurl + 'SiteServiceInformation/' + localStorage.selectedSite + '/' + catId;

        Calling(path);
        var groups = empglobal;
        //globalservicebinddata = groups;
        //categorycount = (groups.length - 1);       

        var idname = '#keepRenderingSort';

        $("#outputcontent").html('');
        $(idname).children().remove();
        
        if (groups.length != 0) {
            $.each(groups, function (key, value, index) {                

                var expression = 'x=> x.catId == \'' + catId + '\' && x.serviceId == \'' + value.serviceNumber + '\' ';
                var result = $linq(selectedServices).where("" + expression + "").toArray();

                if (result.length == 0) {
                    $(idname).append($("<option></option>").val(value.serviceNumber).html(value.serviceTitle));
                }

                //if ($("#keepRenderingSort_to option[value='" + value.serviceNumber + "']").length == 0) {
                //    $(idname).append($("<option></option>").val(value.serviceNumber).html(value.serviceTitle));
                //}

                //if ($("#keepRenderingSort_to option[value='" + value.serviceNumber + "']").length == 0) {
                //    $(idname).append($("<option></option>").val(value.serviceNumber).html(value.serviceTitle));
                //}
            });
        } else {
            $("#outputcontent").html('No Services Avaliable');           
        }
    }
}

// DDL Change event in Work Orde Grid for Assign service to Employees
function ddlAssignEmployee(ddlControl) {

    var ddlCount = 0;

    var ctrlid = ddlControl.id;
    var ctrlVaue = ddlControl.value;

    var values = ctrlid.split('_');


    var bodyid = $("#" + ctrlid).closest('tbody').attr('id');
    //var bodyid = $("#" + ctrlid).prevAll("tbody").attr('id');
    //$("#Employeeserviceassignment_" + ctrlid.split('_')[1] + " tr").each(function () {

    //var bodyid = "Employeeserviceassignment_ " + ctrlid.split('_')[1];

    var tbid = "#Employeeserviceassignment_" + values[1] + " tr";

    $(tbid).each(function () {
        var employeeid = $(this).children('td:nth-child(4)').find("select option:selected").val();

        if (employeeid != '0') {
            ddlCount = ddlCount + 1;
        }
    });

    //var btnId = bodyid.split('_')[1];

    var btnId = values[1];

    var ddddid = '#dvInfo_' + bodyid.split('_')[1] + '  #btnAssign_' + btnId;

    if (ddlCount > 0) {
        $('#btnAssign_' + btnId).show();
        //$('#dvInfo_' + ctrlid.split('_')[1] + '  #btnAssign_' + btnId).show();
    } else {
        $('#btnAssign_' + btnId).hide();
        //$('#dvInfo_' + ctrlid.split('_')[1] + '  #btnAssign_' + btnId).hide();
        ddlCount = 0;
    }
}

// Assigning Work Order Services to Employees
function AssignWorkOrder(ctrl, wId, wsiteId) {
    $('#imgWorkOrderAssign_' + wId).show();
    var ctrlid = ctrl.id;
    var assignedtoEmployees = '';
    //btnAssignServ_

    $("#Employeeserviceassignment_" + ctrlid.split('_')[1] + " tr").each(function () {

        var categoryid = $(this).children('td:nth-child(1)').attr('id');
        var serviceid = $(this).children('td:nth-child(2)').attr('id');
        var employeeid = $(this).children('td:nth-child(4)').find("select option:selected").val();

        if (employeeid != null && employeeid != undefined) {
            if (employeeid != '0') {
                assignedtoEmployees += '<WorkOrderServiceInfo><WoCategoryId>' + categoryid + '</WoCategoryId><WoServiceId>' + serviceid + '</WoServiceId><WoServiceEmpId>' + employeeid + '</WoServiceEmpId></WorkOrderServiceInfo>';
            }
        }
    });

    var today = new Date();
    var h = (today.getHours()), m = today.getMinutes();
    if (h < 10) {
        h = '0' + h;
    }
    if (m < 10) {
        m = '0' + m;
    }
    var _time = '';//(h > 12) ? (h - 12 + ':' + m + ' PM') : (h + ':' + m + ' AM');
    if (h == 12) {
        _time = h + ':' + m + ' PM';
    } else {
        _time = (h > 12) ? (h - 12 + ':' + m + ' PM') : (h + ':' + m + ' AM');
    }


    var obj = {};
    obj.WorkOrderNumber = wId;
    obj.WorkOrderSiteId = wsiteId;
    obj.WorkOrderAssignedBy = localStorage.EmployeeId;
    obj.WorkOrderAssignedTo = assignedtoEmployees;
    obj.WorkOrderAssignedDate = getCurrentDate();
    obj.WorkOrderAssignedTime = _time;
    //obj.WorkOrderStatus = 'Y';

    var url = WObaseurl + 'WorkOrderServiceAssignment/';
    //var url = '';
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        url: url,
        data: JSON.stringify(obj),
        success: function (response) {
            var res = response

            if (res == 'success') {
                data = '<p style="color:green">Work Order Assigned successfully!</p>';
                $('#divConfirm').html(data);
                $("#smallModal").modal('show');
                BindWorkOrders(localStorage.selectedSite);
            }
        },
        error: function (response) {
            // alert(response.status + ' ' + response.statusText);
        },
        complete: function () {
            $('#imgWorkOrderAssign_' + wId).hide();
        }
    });

}

// Show Popup for Addming Main Notes to create Work Order
function MainNotes() {
    $('#btnMainNotesOk').hide();
    $('#btnMainNotesAdd').show();
    $("#ViewMainNotes").children().remove(); 
    $("#txtMainNotes").show();
    $("#MainNotesPopup").modal('show');
    $('#txtMainNotes').focus();
}

// Adding Main Notes in Creating Work Order
function BindNotesToDiv() {
    var count = 0;
    $('#ViewNotesList tr td:first-child textarea:visible').each(function () {
        count++;
    });

    if (count != 0) {
        $('#ViewNotesList tr td:first-child textarea:visible').each(function () {

            var subnoteid = $(this).data('mainnotes');
            var notesid = '#EditMainNotes_' + $(this).data('mainnotes');

            $.each(MainNotesArray, function (index1) {
                if (MainNotesArray[index1].Id == subnoteid) {

                    MainNotesArray[index1].Notes = $(notesid).val();
                }
            });

        });
    } else {
        var text = $("#txtMainNotes").val();


        if (text != '') {
            if (MainNotesArray.length == 0) {
                MainNotesArray.push({
                    'Id': 1,
                    'Notes': text
                });
            } else {
                MainNotesArray.push({
                    'Id': (MainNotesArray.length + 1),
                    'Notes': text
                });
            }

        }
    }
    var colors = [{
        'id': 0,
        'color': '#bbced8'
    }, {
        'id': 1,
        'color': '#c8c4f5'
    }]

    var div = '';

    $("#notesbody").children().remove();
    if (MainNotesArray.length != 0) {
        for (var i = 0; i < MainNotesArray.length; i++) {
            var text = '';
            text = nl2br(MainNotesArray[i].Notes)
            div += '<tr style="background:' + colors[notescount].color + '"><td style="padding: 7px;">' + text + '</td><td style="vertical-align: inherit;text-align: center;width: 50px;"><a class="" style="cursor: pointer;" title="Delete" onclick="DeleteMainNotes(' + MainNotesArray[i].Id + ')"><img src="images/deleteicon.png" width="20" /></a></td></tr>';
            if (notescount == 1) {
                notescount--;
            } else {
                notescount++;
            }
        }

        $("#notesmaindiv").show();
        $("#notesbody").append(div);

        $('#NotesCount').html(MainNotesArray.length);
        $("#txtMainNotes").val('');
    } else {
        $("#notesmaindiv").hide();
        $('#NotesCount').html(MainNotesArray.length);
        $("#txtMainNotes").val('');
    }




    //var div = '<div><div><span>' + text + '<span></div><div><a class="glyphicon glyphicon-trash" style="cursor: pointer;" title="Delete" onclick=""></a></div></div>';

}

function nl2br(str) {
    //var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    var breakTag = '<br />';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

// Deleting Main WorkOrder Notes
function DeleteMainNotes(id) {
    var bool = confirm("Do you really want to delete this record?");
    if (bool == false) {
        return;
    }
    MainNotesArray = jQuery.grep(MainNotesArray, function (value1, index1) {
        return value1.Id != id
    });

    var divs = '';

    $.each(MainNotesArray, function (key, value) {
        var text = nl2br(value.Notes)
        divs += '<tr id="MainNotesrow' + value.Id + '" style="border-bottom: 1px solid #c5b4b4;"><td  style="padding: 16px;"><span id="Mainnotespan' + key + '">' + text + '</span><textarea data-mainnotes="' + value.Id + '" id="EditMainNotes_' + value.Id + '" class="form-control" placeholder="NOTES" style="display:none;resize: none;" rows="2" cols="10" tabindex="1"></textarea></td><td id="tdEditMainNotes_' + value.Id + '" style="text-align:center;width:35px;"><a id="" class="" style="cursor: pointer;" title="Edit Notes" onclick="EditMainNotes(\'Mainnotespan' + key + '\',\'EditMainNotes_' + value.Id + '\')"><img src="images/editicon.png" id="EditImgMainNotes_' + value.Id + '" width="28" /></a></td><td style="text-align:center;width:35px;"><a id="" class="" style="cursor: pointer;" title="Delete Notes" onclick="DeleteMainNotes(' + value.Id + ')"><img src="images/deleteicon.png" width="28" /></a></td></tr>';
    });
    $("#ViewNotesList").children().remove();
    $("#ViewNotesList").append(divs);

    if (MainNotesArray.length == 0) {
        $("#ViewNotesDetails").modal('hide');
    }

    BindNotesToDiv();
}

// Showing All Work Orders Notes
function ViewNotes() {
    var divs = '';   

    $.each(MainNotesArray, function (key, value) {
        var text = nl2br(value.Notes)
        divs += '<tr id="MainNotesrow' + value.Id + '" style="border-bottom: 1px solid #c5b4b4;"><td  style="padding: 16px;"><span id="Mainnotespan' + key + '">' + text + '</span><textarea data-mainnotes="' + value.Id + '" id="EditMainNotes_' + value.Id + '" class="form-control" placeholder="NOTES" style="display:none;resize: none;" rows="2" cols="10" tabindex="1"></textarea></td><td id="tdEditMainNotes_' + value.Id + '" style="text-align:center;width:35px;"><a id="" class="" style="cursor: pointer;" title="Edit Notes" onclick="EditMainNotes(\'Mainnotespan' + key + '\',\'EditMainNotes_' + value.Id + '\')"><img src="images/editicon.png" id="EditImgMainNotes_' + value.Id + '" width="28" /></a></td><td style="text-align:center;width:35px;"><a id="" class="" style="cursor: pointer;" title="Delete Notes" onclick="DeleteMainNotes(' + value.Id + ')"><img src="images/deleteicon.png" width="28" /></a></td></tr>';
    });
    $("#ViewNotesList").children().remove();
    $("#ViewNotesList").append(divs);
    $("#ViewNotesDetails").modal('show');
}

// Edit Work Order Notes when creating WO
function EditMainNotes(sid, tid) {
    
    var id = tid.split('_')[1];
    $('#tdEditMainNotes_' + id).hide();

    $("#" + sid).hide();
    $("#" + tid).val($("#" + sid).html());
    $("#" + tid).show();
   
}

// Edit Service Notes when creating WO
function EditServiceNotes(sid, tid) {
    $("#" + sid).hide();
    $("#" + tid).val($("#" + sid).html());
    $("#" + tid).show();

    var id = tid.split('_')[1];
    $('#tdimgEditNotes_' + id).hide();
}

function ViewGridWorkOrderNotes(woId) {
    var url = WObaseurl + 'WorkOrderServiceNotes/' + woId + '/0';

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (response) {
            var msg = response;

            var items = '';
            $.each(msg, function (key, value) {
                //var text = nl2br(value.woNotesServiceNotes)

                items += '<tr id="" style="border-bottom: 1px solid #c5b4b4;"><td  style="padding: 16px 0px;"><span id="MainNotespan' + key + '">' + value.woNotesServiceNotes + '</span></td></tr>';
            });
            $("#WOGridViewNotesSpan").children().remove();
            $("#WOGridViewNotesSpan").append(items);
            $("#WOGriddvtxtNotesDiv").hide();
            $('#btnWOGridOK').removeAttr('onclick');
            $('#WOAddGridNotes').attr('onclick', 'AddWONewNotesGrid(\'' + woId + '\')');
            $("#WOGriNotesPopup").modal('show');
        },
        error: function (response) {
            //alert(response.status + ' ' + response.statusText);
        },
    });


}

function ViewGridServiceNotes(woId,catId, wosId) {
    var url = WObaseurl + 'WorkOrderServiceNotes/' + woId + '/' + wosId;
    workOrderId = woId;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (response) {
            var msg = response;

            var items = '';
            $.each(msg, function (key, value) {
                //var text = nl2br(value.woNotesServiceNotes)

                items += '<tr id="" style="border-bottom: 1px solid #c5b4b4;"><td  style="padding: 16px 0px;"><span id="notespan' + key + '">' + value.woNotesServiceNotes + '</span></td></tr>';
            });

            if (items == '') {
                items = '<tr style="text-align: center;color:red;"><td>Notes Not Available</td></tr>';
            }

            $("#GridViewNotesSpan").children().remove();
            $("#GridViewNotesSpan").append(items);
            $("#GriddvtxtNotesDiv").hide();
            $('#btnGridServivesOK').removeAttr('onclick');
            $('#AddGridNotes').attr('onclick', 'AddNewNotesGrid(\'' + woId + '\',\'' + catId + '\',\'' + wosId + '\')');
            //$("#txtNotesDiv").hide();
            $("#GriNotesPopup").modal('show');
        },
        error: function (response) {
            //alert(response.status + ' ' + response.statusText);
        },
    });


}

function clearData() {
    $("#txtvinid").children("input[type=text]").each(function () {
        $(this).val('');
    });
    $("#txtBulkVINS").val('');
    $("#txtVechicleStock").val('');
    $("#txtrouid").val('');
    $("#keepRenderingSort_to").children().remove();
    $("#keepRenderingSort").children().remove();
    //$('#dvDepartments option').attr('selected', false);
    $("#dvDepartments input[type=radio][name=radios]").prop("checked", false);
    $("#txtVTime").val('');
    $('.ui-widget-content').removeClass('ui-selected');
    $('#ddlrequestby').val(0);

    ServiceNotes = [];
    MainNotesArray = [];
    $("#notesmaindiv").hide();
    $("#NotesCount").html('');
    $("#notesbody").children().remove();
    $('#dvOTime').hide();   
    changeCount = 0;
    SelectedOption = '';
    
}

// Move cursor to next textbox when entering VIN Number
function ChangeNumber(CurrentId, NextId) {
    var len = $("#" + CurrentId).val().trim().length;

    if ($("#" + CurrentId).val().trim().length == 1) {
        $("#" + NextId).focus();
    }

    $('#txtvinid').keyup(function (e) {
        if (e.keyCode == 8) {
            CurrentId = CurrentId.split('v');
            CurrentId[1] = (CurrentId[1] - 1);
            CurrentId = CurrentId[0] + 'v' + CurrentId[1];

            $("#" + CurrentId).focus();
        }

    })
}

function AddWorkOrder() {
   
    if (localStorage.selectedSite == 0) {
        alert('Please Select a Site');
        return false;
    }
   
    //if (localStorage.StockNumber == 8) { $("#txtVechicleStock").attr("disabled", "disabled"); } else { $("#txtVechicleStock").removeAttr("disabled", "disabled"); }
    selectedServices = [];
    selectedCatId = 0;
    $("#WOHDIV").hide();
    $("#WOHistory").children().remove();
    clearData();
    $("#ddlSites").prop("disabled", true);
    $('#dvOTime').show();
    $('#dvFilter').hide();
    $("#addworkorder").hide();
    $("#backtoqueue").show();
    $("#paneltitle").html('New Work Order');
    $("#WorkOrders").hide();
    $("#CreateWorkOrder").show();
    $("#txtv1").focus();

    var currentdate = new Date();
    currentdate = (currentdate.getMonth() + 1) + '/' + currentdate.getDate() + '/' + currentdate.getFullYear();
    jQuery('#datetimepicker_Date').val(currentdate);
    $('#selecteddate').text(currentdate);    
}

function CloseAddWorkOrder() {
    $("#txtVechicleStock").removeAttr("disabled", "disabled");
    $("#addworkorder").show();
    $("#backtoqueue").hide();
    $("#paneltitle").html('Work Order Queue');
    $('#dvFilter').show();

    ServiceNotes = [];
    MainNotesArray = [];
    $("#notesmaindiv").hide();
    $("#NotesCount").html('');
    $("#notesbody").children().remove();

    $("#keepRenderingSort_to").children().remove();
    $("#keepRenderingSort").children().remove();
    $("input[type=radio][name=radios]").prop("checked", false);
    $("#txtNotes").val('');
    $("#Extratimediv").hide();    

    $("#SelectedServices").children().remove();
    $("#WorkOrders").show();
    $("#CreateWorkOrder").hide();

    $("#ddlSites").prop("disabled", false);
}

// Creating Work Order
function SaveWorkOrder() {
    if (CheckForm() == true) {

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        var chours = today.getHours();
        var cminutes = today.getMinutes();
        today = yyyy + '/' + mm + '/' + dd + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();



        var StociId = '';
        var VINNUMBER = '';
        var VinCount = '';
        $("#txtvinid").children("input[type=text]").each(function () {
            //Do stuff here
            VINNUMBER += $(this).val();
        });
        StociId = $("#txtVechicleStock").val();

        var roid = $("#txtrouid").val();

        var date = $("#datetimepicker_Date").val();
        var OTime = $('#txtVTime').val();

        var timeselect = '';

        if (SelectedOption == 'ASAP') {
            if (OTime != '') {
                timeselect = OTime + ' (ASAP)';
            } else {

                var now = new Date();
                var hours = now.getHours();
                var minutes = now.getMinutes();
                var time = 0;

                if (minutes < 10) {
                    minutes = '0' + minutes;
                }

                time = (hours + 3);
                if (time >= 24) {
                    var NextDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                    var Nextday = NextDate.getDate()
                    var Nextmonth = NextDate.getMonth() + 1
                    var Nextyear = NextDate.getFullYear()

                    if (Nextday < 10) {
                        Nextday = '0' + Nextday;
                    }

                    if (Nextmonth < 10) {
                        Nextmonth = '0' + Nextmonth;
                    }

                    var nextHours = (time - 24);

                    if (nextHours < 10) {
                        nextHours = '0' + nextHours;
                    }

                    if (minutes < 10) {
                        minutes = '0' + minutes;
                    }

                    time = nextHours + ':' + minutes;
                    date = Nextmonth + '/' + Nextday + '/' + Nextyear;
                } else {
                    if (time < 10) {
                        time = '0' + time;
                    }
                    time = time + ':' + minutes;
                }

                timeselect = time + ' (ASAP)';
            }      
        } else if (SelectedOption == 'CUSTOMER WAITING') {
            timeselect = OTime + ' (CW)';
        } else {
            timeselect = OTime;
        }

        var createdby = localStorage.EmployeeId;
        var requestedby = jQuery("#ddlrequestby option:selected").val();

        var bulk = $("#txtBulkVINS").val();

        var BulkEntry = chunk(bulk, 17).join(',');
        var BULKENTRYXML = '';
        if (BulkEntry != '') {
            BulkEntry = BulkEntry.split(',');
            for (var i = 0; i < BulkEntry.length; i++) {
                BULKENTRYXML += '<Root><Id>' + BulkEntry[i] + '</Id></Root>';
            }
        }
        var categoryid = '';//$("VehicalTypes_1").val();
        //categoryid = jQuery("#VehicalTypes_1 option:selected").val();
        categoryid = 0;
        //$('input[type="radio"]:checked', '#VehicalTypes_1').val();
        //var firstservice = $("#SeviceTypes_1").val();
        //var values = '<ServiceInfo><WOS_SITE_SERVICE_ID>' + firstservice + '</WOS_SITE_SERVICE_ID></ServiceInfo>';

        var ids = '';

        for (var i = 0; i < groupdata.length; i++) {
            ids += '<ServiceInfo><WOS_SERVICE_CATEGORY_ID>' + groupdata[i].categoryid + '</WOS_SERVICE_CATEGORY_ID><WOS_SITE_SERVICE_ID>' + groupdata[i].value + '</WOS_SITE_SERVICE_ID></ServiceInfo>';
        }
        var notes = '';

        $.each(ServiceNotes, function (key, value) {
            $.each(ServiceNotes[key].Notes, function (key1, value1) {
                notes += '<Notes><WON_SERVICE_CATEGORY_ID>' + value.categoryid + '</WON_SERVICE_CATEGORY_ID><WON_SERVICE_ID>' + value.ServiceID + '</WON_SERVICE_ID><WON_NOTES>' + value1.Notes + '</WON_NOTES><WON_TYPE>S</WON_TYPE></Notes>';
            });
        });


        $.each(MainNotesArray, function (key, value) {
            notes += '<Notes><WON_SERVICE_CATEGORY_ID></WON_SERVICE_CATEGORY_ID><WON_SERVICE_ID></WON_SERVICE_ID><WON_NOTES>' + value.Notes + '</WON_NOTES><WON_TYPE>W</WON_TYPE></Notes>';
        });

        var obj = {};

        obj.WorkOrderAction = 'A';
        obj.WorkOrderId = 0;

        //obj.woid = 0;
        obj.WorkOrderSiteId = parseInt(localStorage.selectedSite);
        if (BULKENTRYXML == '') {
            obj.WorkOrderVinNumber = VINNUMBER;
        } else {
            obj.WorkOrderVinNumber = BULKENTRYXML;
        }
        obj.WorkOrderStockNumber = StociId;
        obj.WorkOrderROId = roid;
        obj.WorkOrderDate = date;
        obj.WorkOrderTime = timeselect;
        obj.WorkOrderCreatedBy = parseInt(localStorage.EmployeeId);
        obj.WorkOrdeRequestedBy = requestedby;
        //obj.CategoryID = categoryid;
        obj.WorkOrderServices = ids;
        obj.WorkOrderNotes = notes;
        //obj.status = 'O';
        obj.WorkOrderCratedDate = today;
        //obj.action = 'I';
        //alert(values);

        
        var url = '';
        if (BULKENTRYXML == '') {
            //url = 'webmethods/webmethods.aspx/WorkOrdersAction';
            url = WObaseurl + 'WorkOrderOperations';
        } else {
            //url = 'webmethods/webmethods.aspx/WorkOrdersBulkAction'
            url = WObaseurl + 'WorkOrderOperationsBulkVins';
        }

        $.ajax({
            type: 'Post',
            url: url,
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            datatype: "jsondata",
            async: "false",
            success: function (response) {
                //var Data = '';
                //var msg = eval('(' + response.d + ')');
                //var msg = response.d;

                if (response == 'success') {
                    //$('#dvFilter').show();

                    data = '<p style="color:green">Work Order Created successfully!</p>';
                    $('#divConfirm').html(data);
                    $("#smallModal").modal('show');

                    BindWorkOrders(localStorage.selectedSite);
                    CloseAddWorkOrder();
                }
            },
            error: function (response) {
                //alert(response.status + ' ' + response.statusText);
            }
        });

    }
}

// Approve Work Order Service
function ApproveWorkOrderService(wosId, number, woId) {
    $('#imgApprove_' + number).show();
    var url = WObaseurl + 'ApproveService/';

    //var url = 'http://localhost:60672/api/ApproveService/';


    var today = new Date();
    var h = (today.getHours()), m = today.getMinutes();
    if (h < 10) {
        h = '0' + h;
    }
    if (m < 10) {
        m = '0' + m;
    }
    var _time = '';//(h > 12) ? (h - 12 + ':' + m + ' PM') : (h + ':' + m + ' AM');
    if (h == 12) {
        _time = h + ':' + m + ' PM';
    } else {
        _time = (h > 12) ? (h - 12 + ':' + m + ' PM') : (h + ':' + m + ' AM');
    }

    var obj = {};
    obj.WorkOrderId = woId;
    obj.WorkOrderSeriveNumber = wosId;
    obj.WorkOrderServiceApprovedById = localStorage.EmployeeId;

    var wosDate = getCurrentDate();
    var wosTime = _time;

    obj.WorkOrderServiceApprovedDate = wosDate;
    obj.WorkOrderServiceApprovedTime = wosTime;

    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        url: url,
        data: JSON.stringify(obj),
        success: function (response) {
            var data = response.split(',');

            if (data[0] == 'success') {
                $('#WorkOrdersDiv [name="serv_' + number + '"]').html('Approved By ' + data[1] + '<br />' + wosDate + '&nbsp;' + wosTime);
                $('#WorkOrdersDiv [name="serv_' + number + '"]').closest('td').next().find('select').removeAttr("disabled");
                var id = '#wostatus_' + woId;
                $(id).html(data[2]);
                $('#dvstatus_' + number).text('Open');
            }
        },
        error: function (response) {
            // alert(response.status + ' ' + response.statusText);
        },
        complete: function () {
            $('#imgApprove_' + number).hide();
        }
    });

}

function chunk(str, n) {
    var ret = [];
    var i;
    var len;

    for (i = 0, len = str.length; i < len; i += n) {
        ret.push(str.substr(i, n))
    }

    return ret
};

function CheckForm() {

    var txtv1 = '';
    var txtv2 = '';
    var textboxcount = 1;
    var vinnumber = '';
    $("#txtvinid").children("input[type=text]").each(function (Index) {
        //Do stuff here
        if (!isEmpty($(this).val())) {
            txtv1 += $(this).val();
        }       
    });
    var bulk = $("#BulkEntry").is(':visible');
    var BulkEntry = $("#txtBulkVINS").val();
    var stockNumber = $('#txtVechicleStock').val().trim();
    var roNumber = $('#txtrouid').val();
    var validationCount = 0;

    if (txtv1 != '' && bulk == false) {
        
        var count = txtv1.length;
        if (count != 17) {
            addErrorMessage('Enter Valid Vehicle VIN');
        }

    } else if (txtv1 == '' && bulk == false) {       

        if (isEmpty(stockNumber)) {
            addErrorMessage('Enter VIN or Stock Number');
        }

       
    } else if (bulk == true && BulkEntry == '') {
        if (isEmpty(stockNumber)) {
            addErrorMessage('Enter Bulk Entry or Stock Number');
        }

        validationCount = 1;
    }

    if (txtv1 == '' && bulk == true && BulkEntry != '') {
        var count = ((BulkEntry.length) % 17);

        if (count != 0) {
            addErrorMessage('Enter Valid VIN Number.' + '\n' + '  -    Only ' + BulkEntry.length + ' Numbers have been Entered' + '\n' + '  -    It must contain 17 Digit or Multiples of 17 Digits' + '\n' + '  -    (ex: 17,34,51,68.....)');
        }
        validationCount = 1;
    }
    
    if (validationCount == 1) {
        var count = ((BulkEntry.length) % 17);

        if (count == 0) {
            if (!isEmpty(stockNumber)) {

                if (localStorage.StockNumber == 6) {
                    if (stockNumber.length != 6) {
                        addErrorMessage('Valid Stock Number 6-Digits');
                    }
                } else if (localStorage.StockNumber == 8) {
                    if (stockNumber.length != 8) {
                        addErrorMessage('Valid Stock Number 8-Digits');
                    }
                } else if (localStorage.StockNumber == 9) {
                    if (stockNumber.length != 9) {
                        addErrorMessage('Valid Stock Number 9-Digits');
                        //addErrorMessage('Enter 9 Digit Stock Number');
                    }
                }
            }
        }

    } else {
        if (!isEmpty(stockNumber)) {
            if (localStorage.StockNumber == 6) {
                if (stockNumber.length != 6) {
                    addErrorMessage('Valid Stock Number 6-Digits');
                }
            } else if (localStorage.StockNumber == 9) {
                if (stockNumber.length != 9) {
                    addErrorMessage('Valid Stock Number 9-Digits');
                }
            }
        }
    }

    

    var services = $('#keepRenderingSort_to').children().length;
    if (services == 0) {
        addErrorMessage('Please Select Services');
    }

    var errcount = 0;
    for (var i = 0; i < groupdata.length; i++) {

        var expression1 = 'x=> x.seriveCategoryNumber == \'' + groupdata[i].categoryid + '\' && x.serviceNumber == \'' + groupdata[i].value + '\' ';
        var res = $linq(siteServiceGlobal).where("" + expression1 + "").toArray();

        if (res[0].siteServiceRORequired == 'Y') {
            errcount = errcount + 1;
        }
    }

    if (errcount > 0) {
        if (isEmpty(roNumber)) addErrorMessage('Enter RO Number');
    } 

    var date = $("#datetimepicker_Date").val();
    if (isSelected(date)) addErrorMessage('Select Date');

    var optionTime = $('#txtVTime').val();
    var time = $("#timetextbox").text();

    if (!isEmpty(optionTime)) {
        if (!/^\d{2}:\d{2}$/.test(optionTime)) addErrorMessage('Enter Valid Time (eg:- 18:15)');;
    }

    var Requestedby = $("#ddlrequestby").val();
    if (isSelected(Requestedby)) addErrorMessage('Select Requested By');

    var note = $("#txtNotes").val();

    //if (MainNotesArray.length == 0) {
    //    addErrorMessage('Enter Notes');
    //}    

    var count = $("#servicesdivs").children().length;

    return displayErrors();
}

// Showig Bulk VIN Entry TextBox
function AddBulkEntry() {
    $("#VinNumberDev").hide();
    $("#BulkEntry").show();
    //$("#BulkEntryShow").hide();
    //$("#VinNumberShow").show();
    $("#txtvinid").children("input[type=text]").each(function () {
        $(this).val('');
    });
    $("#txtBulkVINS").focus();
    $("#txtBulkVINS").val('');
    $("#txtVechicleStock").val('');
    $("#txtVechicleStock").removeAttr("disabled");
}

// Showig VIN Entry TextBox
function VinNumberShow() {
    //$("#BulkEntryShow").show();
    //$("#VinNumberShow").hide();
    $("#VinNumberDev").show();
    $("#BulkEntry").hide();
    $("#txtv1").focus();
    $("#txtVechicleStock").val('');
    if (localStorage.StockNumber == 8) { $("#txtVechicleStock").attr("disabled", "disabled"); }
    
}

function BindServicestoDev() {

    var data = [];
    groupdata = [];

    data = selectedServices;
    //$('#keepRenderingSort_to option').each(function () {
    //    data.push({
    //        'value': $(this).val(),
    //        'text': $(this).text()
    //    });
    //});
   
    if (data.length != 0) {
        var divs = '<table class="table griddiv1 paginated" style="border: solid 3px #3a3b3c;"><thead style="text-align: center;background: #3a3b3c;color: #fff;"><tr><th>CATEGORY</th><th>SERVICES</th><th style="padding: 0px;text-align: center;">NOTES</th><th></th></tr></thead><tbody id="servicesbody">';

        for (var i = 0; i < data.length; i++) {


            var expression1 = 'x=> x.seriveCategoryNumber == \'' + data[i].catId + '\' && x.serviceNumber == \'' + data[i].serviceId + '\' && x.serviceSiteStatus.toUpperCase() == \'Y\' || x.seriveCategoryNumber == \'' + data[i].catId + '\' && x.serviceNumber == \'' + data[i].serviceId + '\' && x.serviceSiteStatus.toUpperCase() == \'A\'';
            var res = $linq(siteServiceGlobal).where("" + expression1 + "").toArray();

            groupdata.push({
                'category': res[0].serviceCategoryTitle,
                'categoryid': res[0].seriveCategoryNumber,
                'service': res[0].serviceTitle,
                'value': res[0].serviceNumber
            })
        }

        var res = $linq(groupdata).groupBy(function (x) { return x.category; }).toArray();
        var colors = [{
            'id': 1,
            'color': '#bbced8'
        }, {
            'id': 2,
            'color': '#c8c4f5'
        }]
        var count = 0;
        for (var j = 0; j < res.length; j++) {


            divs += '<tr style="background:' + colors[count].color + ';"><td rowspan="' + res[j].values.length + '" style="vertical-align: inherit;">' + res[j].key + '</td><td style="border-left: 1px solid #ddd;">' + res[j].values[0].service + '</td><td style="text-align: center;padding:3px;"><a id="AddNotes' + res[j].values[0].value + '" class="" style="cursor: pointer;cursor:pointer;" title="Add Notes" onclick="AddNotesToService(' + res[j].values[0].value + ',\'' + res[j].key + '\',\'' + res[j].values[0].service + '\',\'' + res[j].values[0].categoryid + '\',\'AddNotes' + res[j].values[0].value + '\',\'A\')"><img src="images/addnotes.png" width="20" /></a></td><td style="text-align:center;padding:3px;"><a class="" style="cursor: pointer;" title="Delete" onclick="Delete(\'' + res[j].values[0].categoryid + '\',\'' + res[j].values[0].value + '\',\'' + res[j].key + '\')"><img src="images/deleteserviceicon.png" width="28" /></a></td></tr>';

            for (var z = 1; z < res[j].values.length; z++) {

                divs += '<tr style="background:' + colors[count].color + ';"><td>' + res[j].values[z].service + '</td><td style="text-align: center;padding:3px;"><a id="AddNotes' + res[j].values[z].value + '" class="" style="cursor: pointer;cursor:pointer;" title="Add Notes" onclick="AddNotesToService(' + res[j].values[z].value + ',\'' + res[j].key + '\',\'' + res[j].values[z].service + '\',\'' + res[j].values[z].categoryid + '\',\'AddNotes' + res[j].values[z].value + '\',\'A\')"><img src="images/addnotes.png" width="20" /></a></td><td style="text-align:center;padding:3px"><a style="cursor: pointer;" class="" title="Delete" onclick="Delete(\'' + res[j].values[z].categoryid + '\',\'' + res[j].values[z].value + '\',\'' + res[j].key + '\')"><img src="images/deleteserviceicon.png" width="28" /></a></td></tr>';
            }
            if (count == 1) {
                count--;
            } else {
                count++;
            }
        }
        divs += '</tbody></table>';
        $("#SelectedServices").children().remove();
        $("#SelectedServices").append(divs);

        var img = '';
        var mtd = '';
        if (ServiceNotes.length > 0) {
            jQuery.each(ServiceNotes, function (index, val) {
                for (var i = 0; i < groupdata.length; i++) {
                    if (val.ServiceID == groupdata[i].value) // delete index
                    {
                        var ind = '';
                        $("#AddNotes" + groupdata[i].value + " img").attr('src', 'images/viewicon.png');
                        $("#AddNotes" + groupdata[i].value).attr('onclick', '');
                        $("#AddNotes" + groupdata[i].value).attr('title', 'View Notes');
                        $("#AddNotes" + groupdata[i].value).attr('onclick', 'ViewServiceNotes(' + val.NotesId + ',\'AddNotes' + groupdata[i].value + '\')');
                        //img = '<img src="images/viewicon.png" width="28" />';
                        //mtd = 'ViewServiceNotes(' + val.NotesId + ',\'AddNotes' + res[j].values[z].value + '\')';
                    }
                }
            });
        }

    } else {
        $("#SelectedServices").children().remove();
    }

}

function AddNotesToService(sid, key, servicetitle, cid, id, type) {
    Notes(type);
    $('#NotesOk').attr('onclick', 'AddNotesToArray(' + sid + ',\'' + key + '\',\'' + servicetitle + '\',\'' + cid + '\',' + id + ',\'' + type + '\')');
    $("#noteslabel").html('NOTES:')
    $('#txtNotes').val('');
}

function AddNotesToArray(sid, key, servicetitle, cid, ctrlid, type) {

    if (type == 'A') {
        var notes = $("#txtNotes").val();

        if (notes != '') {
            ServiceNotes.push({
                'NotesId': NotesArrayCount,
                'ServiceID': sid,
                'ServiceTitle': servicetitle,
                'category': key,
                'categoryid': cid,
                'Notes': [{
                    'SubnotesId': 1,
                    'Notes': notes
                }]
            });

            $("#txtNotes").val('');
            $("#" + ctrlid.id + ' img').attr('src', 'images/viewicon.png');
            //$("#" + id.id).removeClass('glyphicon-plus-sign');
            //$("#" + id.id).addClass('glyphicon glyphicon-eye-open');
            $("#" + ctrlid.id).attr('onclick', '');
            $("#" + ctrlid.id).attr('title', 'View Notes');
            $('#' + ctrlid.id).attr('onclick', 'ViewServiceNotes(' + NotesArrayCount + ',\'' + ctrlid.id + '\')');
            NotesArrayCount++;
        }
    } else {
        if (ServiceNotes.length < 1) {

        }
    }

}

function Notes(type) {
    if (type == 'M') {
        $("#txtNotes").focus();
        $("#NotesPopup").modal('show');
        $('#NotesOk').attr('onclick', 'BindNotesToDiv()');
        $("#noteslabel").html('Service Notes');
    } else {
        $("#ViewNotesSpan").children().remove();
        $("#txtNotes").focus();
        $("#txtNotesDiv").show();
        $("#addnewnotes").hide();
        $("#NotesPopup").modal('show');

    }
}

function ViewServiceNotes(id, servicerowid) {
    var expression1 = 'x=> x.NotesId == \'' + id + '\'';
    var res = $linq(ServiceNotes).where("" + expression1 + "").toArray();
    EditNoteid = id;
    $("#noteslabel").html(res[0].ServiceTitle.toUpperCase() + ' NOTES:');
    Notes('S');
    $("#txtNotesDiv").hide();
    if (res[0].Notes.length > 1) {
        var items = '';
        $.each(res[0].Notes, function (key, value) {
            var text = nl2br(value.Notes)

            items += '<tr id="row' + value.SubnotesId + '" style="border-bottom: 1px solid #c5b4b4;"><td  style="padding: 16px; 0px;"><span id="notespan' + key + '">' + text + '</span><textarea data-notes="' + value.SubnotesId + '" id="EditNotes_' + value.SubnotesId + '" class="form-control" placeholder="NOTES" style="display:none;resize: none;" rows="2" cols="10" tabindex="1"></textarea></td><td style="text-align:center;width:35px;"><a id="tdimgEditNotes_' + value.SubnotesId + '" style="cursor: pointer;" title="Edit Notes" onclick="EditServiceNotes(\'notespan' + key + '\',\'EditNotes_' + value.SubnotesId + '\')"><img src="images/editicon.png" width="28" /></a></td><td style="text-align:center;width:35px;"><a id="" class="" style="cursor: pointer;" title="Delete Notes" onclick="DeleteServiceNotes(\'row' + value.SubnotesId + '\',\'' + value.SubnotesId + '\',\'' + res[0].NotesId + '\',\'' + servicerowid + '\')"><img src="images/deleteicon.png" width="28" /></a></td></tr>';
        });
        $("#ViewNotesSpan").children().remove();
        $("#ViewNotesSpan").append(items);
        $("#addnewnotes").show();
    } else if (res[0].Notes.length != 0) {
        $("#ViewNotesSpan").children().remove();
        var text = nl2br(res[0].Notes[0].Notes)
        $("#ViewNotesSpan").append('<tr id="row' + res[0].Notes[0].SubnotesId + '" style="border-bottom: 1px solid #c5b4b4;"><td  style="padding: 16px 0px;"><span id="notespan0">' + text + '</span><textarea data-notes="' + res[0].Notes[0].SubnotesId + '" id="EditNotes_' + res[0].Notes[0].SubnotesId + '" class="form-control" placeholder="NOTES" style="display:none;resize: none;" rows="2" cols="10" tabindex="1"></textarea></td><td  style="text-align:center;width:35px;"><a id="tdimgEditNotes_' + res[0].Notes[0].SubnotesId + '" class="" style="cursor: pointer;" title="Edit Notes" onclick="EditServiceNotes(\'notespan0\',\'EditNotes_' + res[0].Notes[0].SubnotesId + '\')"><img src="images/editicon.png" width="28" /></a></td><td style="text-align:center;width:35px;"><a id="" class="" style="cursor: pointer;width:35px;" title="Delete Notes" onclick="DeleteServiceNotes(\'row' + res[0].Notes[0].SubnotesId + '\',\'' + res[0].Notes[0].SubnotesId + '\',\'' + res[0].NotesId + '\',\'' + servicerowid + '\')"><img src="images/deleteicon.png" width="28" /></a></td></tr>');
        $("#addnewnotes").show();
    } else {
        $("#txtNotes").focus();
        $("#txtNotesDiv").show();
        $("#addnewnotes").hide();
    }

    $('#NotesOk').attr('onclick', '');
    $('#NotesOk').attr('onclick', 'AddMultipleNotes(' + id + ',\'' + servicerowid + '\')');

}

function AddMultipleNotes(id, servicerowid) {
    var count = 0;
    var ctrl = 0;
    var textvalue = $("#txtNotes").val();
   
    $('#ViewNotesSpan tr td:first-child textarea:visible').each(function () {
        count++;
    });

    if (count != 0) {
        $('#ViewNotesSpan tr td:first-child textarea:visible').each(function () {
            //alert($(this).attr("id"));
            //alert($(this).data('notes'));
            var subnoteid = $(this).data('notes');
            var notesid = '#EditNotes_' + $(this).data('notes');
            $.each(ServiceNotes, function (index) {
                var countlength = (ServiceNotes[index].Notes.length) - 1;
                if (ServiceNotes[index].NotesId == id) {
                    $.each(ServiceNotes[index].Notes, function (index1) {
                        if (ServiceNotes[index].Notes[index1].SubnotesId == subnoteid) {
                            ServiceNotes[index].Notes[index1].Notes = $(notesid).val();
                            ctrl = ctrl + 1;
                            if (count == ctrl) {
                                if (textvalue.trim() != '') {
                                    ServiceNotes[index].Notes.push({
                                        'SubnotesId': (ServiceNotes[index].Notes.length + 1),
                                        'Notes': textvalue
                                    });
                                }
                            }
                        }                        
                    });

                    //if (countlength = index1) {
                        //if (textvalue.trim() != '') {
                        //    ServiceNotes[index].Notes.push({
                        //        'SubnotesId': (ServiceNotes[index].Notes.length + 1),
                        //        'Notes': textvalue
                        //    });
                        //}
                    //}
                }
            });
        });

        
    } else {       
        var notes = $("#txtNotes").val();
        if (notes != '') {
            $.each(ServiceNotes, function (index) {
                if (ServiceNotes[index].NotesId == id) {
                    ServiceNotes[index].Notes.push({
                        'SubnotesId': (ServiceNotes[index].Notes.length + 1),
                        'Notes': notes
                    });
                }
            });

            $.each(ServiceNotes, function (index) {
                if (ServiceNotes[index].NotesId == id) {
                    if (ServiceNotes[index].Notes.length > 0) {                        
                        $("#" + servicerowid + ' img').attr('src', 'images/viewicon.png');
                        $("#" + servicerowid).attr('title', 'View Notes');
                    }
                }
            });
            $("#txtNotes").val('');
        }       
    }
}

function DeleteServiceNotes(rid, id, nid, servicerowid) {
    var bool = confirm("Do you really want to delete this record?");
    if (bool == false) {
        return;
    }

    $("#" + rid).remove();

    jQuery.each(ServiceNotes, function (index, value) {
        if (value.NotesId == nid) {
            value.Notes = jQuery.grep(value.Notes, function (value1, index1) {
                return value1.SubnotesId != id
            });
        }
    });

    $.each(ServiceNotes, function (index) {
        if (ServiceNotes[index].NotesId == nid) {
            if (ServiceNotes[index].Notes.length == 0) {
                $("#" + servicerowid + ' img').attr('src', 'images/addnotes.png');               
                $("#" + servicerowid).attr('title', 'Add Notes');
            } else {              
                $("#" + servicerowid + ' img').attr('src', 'images/viewicon.png');
                $("#" + servicerowid).attr('title', 'View Notes');
            }
        }
    });
}

function AddNewNotes() {
    $("#txtNotes").val('');
    $("#txtNotesDiv").show();
    //$('#NotesOk').attr('onclick', 'EditNotes(' + id + ')');
}

function AddNewNotesGrid(woId, catId, wosId) {
    //$("#GridViewNotesSpan").children().remove();
    $("#txtNotesGrid").val('');
    $("#GriddvtxtNotesDiv").show();
    $('#btnGridServivesOK').attr('onclick', 'SaveNotesGrid(\'' + woId + '\',\'' + catId + '\',\'' + wosId + '\')');
}
function SaveNotesGrid(woId,catId,wosId) {
    var txtNotes = $("#txtNotesGrid").val();
    if (txtNotes.trim() == '') {
        $('#GriNotesPopup').hide();
    } else {

        var url = WObaseurl + 'AddWorkOrderServiceNotes/';

        var obj = {};
        obj.WONotesWoId = woId;
        obj.WONotesServiceCatId = catId;
        obj.WONotesServiceId = wosId;
        obj.WONotesServiceNotes = txtNotes;
        obj.WONotesServiceInsertedBy = localStorage.EmployeeId;
        obj.WONotesServiceNotesType = 'S';
        obj.WONotesStatus = 'Y';

        $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            url: url,
            data: JSON.stringify(obj),
            success: function (response) {       

                if (response == 'success') {
                    $('#GriNotesPopup').hide();
                }
            },
            error: function (response) {
                // alert(response.status + ' ' + response.statusText);
            },
        });

    }
}

function AddWONewNotesGrid(woId) {
    $("#txtWONotesGrid").val('');
    $("#WOGriddvtxtNotesDiv").show();
    $('#btnWOGridOK').attr('onclick', 'SaveWONotesGrid(\'' + woId + '\')');
}

function SaveWONotesGrid(woId) {
    var txtNotes = $("#txtWONotesGrid").val();
    if (txtNotes.trim() == '') {
        $('#WOGriNotesPopup').hide();
    } else {

        var url = WObaseurl + 'AddWorkOrderNotes/';

        var obj = {};
        obj.WONotesWoId = woId;      
        obj.WONotesServiceNotes = txtNotes;
        obj.WONotesServiceInsertedBy = localStorage.EmployeeId;
        obj.WONotesServiceNotesType = 'W';
        obj.WONotesStatus = 'Y';

        $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            url: url,
            data: JSON.stringify(obj),
            async:false,
            success: function (response) {
                var data = response.split(',');
                if (data[0] == 'success') {
                    $('#WOGriNotesPopup').hide();

                    if (data[1] == 1) {           
                        $('#notes_' + woId).html(txtNotes + '&nbsp;-&nbsp;<a title="Details" style="color: #337ab7;cursor: pointer;" onclick="ViewGridWorkOrderNotes(' + woId + ');">Details</a>');
                    }
                }
            },
            error: function (response) {
                // alert(response.status + ' ' + response.statusText);
            },
        });

    }
}

function Delete(catId,servid, name) {
    var bool = confirm("Do you really want to delete this record?");
    if (bool == false) {
        return;
    }

    var Services = [];
    for (var i = 0; i < selectedServices.length; i++) {
        if (((selectedServices[i].catId != catId && selectedServices[i].serviceId != servid) || (selectedServices[i].catId == catId && selectedServices[i].serviceId != servid)) || ((selectedServices[i].catId != catId && selectedServices[i].serviceId != servid) || (selectedServices[i].catId != catId && selectedServices[i].serviceId == servid))) {
            // $('#keepRenderingSort_to').append($("<option></option>").val(selectedServices.serviceId).html(value.name));


            Services.push({
                'catId': selectedServices[i].catId,
                'serviceId': selectedServices[i].serviceId,
                'serviceTitle': selectedServices[i].serviceTitle
            });

            //var expression = 'x=> x.catId == \'' + catId + '\'';
            //var catcount = $linq(selectedServices).where("" + expression + "").toArray();

            //if (catcount.length > 1) {
            //    var expression11 = 'x=> x.catId == \'' + catId + '\' && x.serviceId != \'' + servid + '\' ';
            //    selectedServices = $linq(selectedServices).where("" + expression11 + "").toArray();
            //} else {
            //    var expression22 = 'x=> x.catId != \'' + catId + '\' && x.serviceId != \'' + servid + '\' ';
            //    selectedServices = $linq(selectedServices).where("" + expression22 + "").toArray();
            //}
        }
    }

    selectedServices = Services;

    $("#keepRenderingSort_to").children().remove();

    if (selectedServices.length > 0) {
        $.each(selectedServices, function (key, value, index) {
            $('#keepRenderingSort_to').append($("<option></option>").val(value.serviceId).html(value.serviceTitle));
        });
    }
 

    //var expression = 'x=> x.catId == \'' + catId + '\' && x.serviceId == \'' + value.serviceNumber + '\' ';
    //var result = $linq(selectedServices).where("" + expression + "").toArray();

    //if (result.length == 0) {
    //    $(idname).append($("<option></option>").val(value.serviceNumber).html(value.serviceTitle));
    //}

    //selectedServices.push({
    //    'catId': selectedCatId,
    //    'serviceId': $options[0].value
    //});

    var categoryid = $('input[type="radio"]:checked', '#dvDepartments').val();
    //$('#keepRenderingSort_to option[value="' + id + '"]').remove();


    BindServices(categoryid);

    var count = $("#servicesbody").children().length;
    if (count == 0) {
        $("#SelectedServices").children().remove();
    }  


    //ServiceNotes = jQuery.grep(ServiceNotes, function (value, index) {       
    //    return value.ServiceID != id     
    //});
    BindServicestoDev();
}

// Global Function for calling Services
function Calling(serviceurl) {

    jQuery.support.cors = true;

    $.ajax({
        url: serviceurl,
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (response) {
            empglobal = response;
        }
    });
}

// Getting Current Time
function getTime() {
    var today = new Date();
    return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}

// Getting Current Date
function getCurrentDate() {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    return today = mm + '/' + dd + '/' + yyyy;

    //today = mm + '/' + dd + '/' + yyyy;

    //alert(today);
}
