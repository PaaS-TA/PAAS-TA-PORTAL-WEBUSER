<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<script>

    var serviceOpt = new Array();

    $(window).load(function () {
        getServices();
    });


    function getServices() {

        param = {
            orgName: currentOrg,
            spaceName: currentSpace
        }

        $.ajax({
            url: "/space/getSpaceSummary",
            method: "POST",
            data: JSON.stringify(param),
            dataType: 'json',
            contentType: "application/json",
            success: function (data) {

                $("#spaceList2").html("");

                $("#serviceSelect").html("");
                $("#serviceSelect").append('<option value="">서비스 목록</option>');
                $.each(data.services, function (id, list) {

                    var services = new Object();

                    if (list.servicePlan == undefined) {
                        servicePlan = "";
                    } else {
                        servicePlan = list.servicePlan.name;
                    }


                    if (list.servicePlan == undefined) {
                        label = "user-provided";

                    } else {
                        label = list.servicePlan.service.label;
                    }

                    if (list.appBindYn == "Y") {
                        if (JSON.stringify(serviceList).indexOf(list.name) < 0) {
                            $("#serviceSelect").append("<option value='" + list.guid + "'>" + list.name + "</option>");
                        } else {
                            $("#spaceList2").append(" <tr height='40'>" +
                                "<td style='height:20px;padding-left:20px;text-align:left;color:#979696' width='25%' class='eventTable'> <a href='#none' onClick='popupServiceEnv(\"" + label + "\",\"" + list.name + "\")'>" + list.name + "</a></td>" +
                                "<td style='padding-left:20px;text-align:left;color:#979696' width='25%' class='eventTable' > &nbsp;" + servicePlan + "</td>" +
                                "<td style='padding-left:20px;text-align:left;color:#979696' width='25%' class='eventTable' > &nbsp;" + label + "</td>" +
                                "<td style='padding-left:20px;text-align:center;color:#979696' width='20%' class='eventTable'> <button type='button' class='btn btn-delete  btn-sm' style='margin-top: 0px;' onClick='unbindService(\"" + list.name + "\")'>연결해제</button> </td>" +
                                "</tr>");
                        }
                    }
                    if(list.appBindParameter != null) {

                        parameterInsertForm(list.appBindParameter, list.guid);
                    }
                });

            }
        });


        // BIND :: INPUT TEXT BOX KEY UP
        $("#serviceSelect").on("change", function () {
            var cnt = 0;
            for (var i = 0; i < bindIds.length; i++) {
                var bindIdsSplit = bindIds[i].split("_");
                var guid = bindIdsSplit[0];
                if (guid == $(this).val()) {
                    cnt++;
                    $("#label").show();
                    $("#" + bindIds[i]).show();
                    $("#" + bindIds[i] + "_span").show();
                } else {
                    $("#" + bindIds[i]).hide();
                    $("#" + bindIds[i] + "_span").hide();
                }
            }

            if (cnt == 0) {
                $("#label").hide();
            }
        })

    }

    function popupServiceEnv(label, name) {

        var vcapService = JSON.stringify(vcapServices.VCAP_SERVICES).replace(label, "thisService");
        var newArr = JSON.parse(vcapService);
        var thisService = JSON.stringify(newArr.thisService[0].credentials).replace("{", "").replace("}", "").replace(/"/gi, " ");

        $("#modalTitle").html(name + " 서비스 환경변수");
        $("#modalText").html(thisService.replace(/,/gi, "<br>"));
        $("#modalCancelBtn").text("닫기");
        $("#modalExecuteBtn").hide();

        $('#modal').modal('toggle');

    }

    function setParmeterData(guid) {
        var data = "";

        for (var i = 0; i < bindIds.length; i++) {
            var bindIdsSplit = bindIds[i].split("_");
            var bindguid = bindIdsSplit[0];
            if (bindguid == guid) {
                var value = $("#" + bindIds[i]).val();

                if (value == undefined || value == null || value == 'null' || value == 'defalut') {
                    value = "default";
                }
                var paramName = bindIds[i].replace(guid + "_", "");
                if (data.length > 0) {
                    data = data + ',"' + paramName + '":"' + value + '"';
                } else {
                    data = data + '"' + paramName + '":"' + value + '"';
                }
            }
        }
        if (data.length > 0) {
            data = "{" + data + "}";
        }

        $("#serviceParam").val(data);
    }


    function bindService() {

        $('#modalMask').modal('toggle');
        var spinner = new Spinner().spin();

        setParmeterData($("#serviceSelect").val());
        param = {
            orgName: currentOrg,
            spaceName: currentSpace,
            appName: currentApp,
            serviceInstanceGuid: $("#serviceSelect").val(),
            parameters: $("#serviceParam").val()
        }


        $.ajax({
            url: "/catalog/appBindServiceV2",
            method: "POST",
            data: JSON.stringify(param),
            dataType: 'json',
            contentType: "application/json",

            success: function (data) {
                showAlert("success", $("#serviceSelect").val() + " 서비스가 연결되었습니다");
            },

            error: function (xhr, status, error) {
                showAlert("fail", JSON.parse(xhr.responseText).message);
            },

            complete: function (data) {
                getAppSummary();
                setTimeout("getServices()", 200);
                spinner.stop();
                $('#modalMask').modal('hide');
            }
        });

    }


    function unbindService(serviceName) {

        $('#modalMask').modal('toggle');
        var spinner = new Spinner().spin();

        param = {
            orgName: currentOrg,
            spaceName: currentSpace,
            name: currentApp,
            serviceName: serviceName
        }

        $.ajax({
            url: "/app/unbindService",
            method: "POST",
            data: JSON.stringify(param),
            dataType: 'json',
            contentType: "application/json",

            success: function (data) {
                showAlert("success", serviceName + " 서비스가 해제되었습니다");
            },

            error: function (xhr, status, error) {
                showAlert("fail", JSON.parse(xhr.responseText).message);
            },

            complete: function (data) {
                getAppSummary();
                setTimeout("getServices()", 200);
                spinner.stop();
                $('#modalMask').modal('hide');
            }
        });

    }

    var bindIds = [];

    function parameterInsertForm(data, guid) {

        var htmlString = [];
        // 1. 일단 중괄호를 없앤다.
        str = data.replace("}", "");
        str2 = str.replace("{", "");

        // 2. parameter 를 (,)기준으로 자른 다음 쌍따옴표 제거.
        split = str2.split(",");

        for (var i = 0; i < split.length; i++) {
            deleteSign = split[i].replace(/"/g, "");

            // 3. : 을 기준으로 value 부분을 넣어주기로 한다.
            splitSign = deleteSign.split(":");
            // 4. 들어오는 parameter 의 변수 타입에 따라 동적인 input box 생성.
            if (splitSign != null && splitSign != "undefined" && splitSign != "") {
                if (splitSign[1].trim() == "text") {
                    htmlString.push('<span id="' + guid + '_' + splitSign[0] + '_span" ><span style="display:inline-block; width:100px;text-align: left;">' + splitSign[0] + '</span>&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;<input type="text"  id="' + guid + '_' + splitSign[0] + '" maxlength="200" class="form-control-warning" style="width: 25%"  value="" /><p></span>');
                }

                if (splitSign[1].trim() == "password") {
                    htmlString.push('<span id="' + guid + '_' + splitSign[0] + '_span" ><span style="display:inline-block; width:100px;text-align: left;">' + splitSign[0] + '</span>&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;<input type="password"  id="' + guid + '_' + splitSign[0] + '" maxlength="200" class="form-control-warning" style="width: 25%"  value="" /><p></span>');
                }

                if (splitSign[1].trim() == "dafalut") {
                    htmlString.push('<span id="' + guid + '_' + splitSign[0] + '_span" ><span style="display:inline-block; width:100px;text-align: left;">' + splitSign[0] + '</span>&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;<input type="hidden"  id="' + guid + '_' + splitSign[0] + '" maxlength="200" class="form-control-warning" style="width: 25%" value="dafalut" /><p></span>');
                }

                bindIds.push(guid + '_' + splitSign[0]);

            }
        }

        $('#bindParams').append(htmlString);

        for (var i = 0; i < bindIds.length; i++) {
            $('#' + bindIds[i]).hide();
            $('#' + bindIds[i] + "_span").hide();
        }
        $("#label").hide();
    }

</script>

<div align="right" style='margin:px;' id="createSpaceBtn">
    <button type="button" class="btn btn-save btn-sm" style='margin-top: -20px;margin-right: 11px;'
            onclick="toggleBox('addService')">
        + 서비스 연결
    </button>
</div>
<div class="tab-title-box" id="addServiceBox" style="display: none">

    <div class="inner-addon right-addon">

        서비스명 : <select id="serviceSelect" style="width: 25%;height: 30px"></select>
        <input id="serviceParam" type="hidden" class="form-control-warning" style="width: 25%;">
        <button id="btn-addService" type="button" class="btn btn-save btn-sm" style='margin-top: -3px;'
                onclick="bindService()">
            연결
        </button>
        <button type="button" class="btn btn-cancel btn-sm" style='margin-top: -3px;' onclick="toggleBox('addService')">
            취소
        </button>
        </br></br>

        <span id="label" style="display:inline-block; width:525px;text-align: left;">앱 바인드 파라미터</span>
        <p>
        <p>
            <span id="bindParams"></span>


    </div>

</div>

<div style="margin: 0px 0px 0px 0px;width:100%;">
    <table width="100%" class="event-table">
        <thead>
        <tr height="40">
            <th style="background-color: #f6f6f6; padding-left:20px; text-align:left;"><font size="3px">이름</font></th>
            <th style="background-color: #f6f6f6; padding-left:20px; text-align:left;"><font size="3px">제공서비스</font>
            </th>
            <th style="background-color: #f6f6f6; padding-left:20px; text-align:left;"><font size="3px">서비스명</font></th>
            <th style="background-color: #f6f6f6; padding-left:20px; text-align:center;"><font size="3px">연결해제</font>
            </th>
        </tr>
        </thead>
        <tbody id="spaceList2">
        </tbody>
    </table>
</div>
