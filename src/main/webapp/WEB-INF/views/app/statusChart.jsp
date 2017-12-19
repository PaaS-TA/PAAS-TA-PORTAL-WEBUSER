<%--
  Created by IntelliJ IDEA.
  User: hrjin
  Date: 2017-10-13
  Time: 오후 4:33
  To change this template use File | Settings | File Templates.
--%>
<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@include file="../layout/top.jsp" %>
<%@include file="../layout/left.jsp" %>
<%@include file="../layout/alert.jsp" %>
<style>
    .chart {
        float: left;
        margin-left: 10px;
        margin-top: 70px;
    }

    .chart2 {
        display: inline-block;
        margin-left: 10px;
    }

    .chart3 {
        float: left;
        width: 340px;
        height: 285px;
        display: inline-block;
        margin-left: 10px;
    }
</style>
<div class="row" style="margin-top:-19px">
    <div class="panel content-box col-sm-12 col-md-12 mt-5">
        <h4 class="modify_h4 fwb"> 어플리케이션 명 : <span id="app"></span></h4>
        <div>
            <select id="instanceSelect" name="instanceSelect" class="form-control2" style="background-color:#fafafa;"
                    onchange="valueChange(this.value)">
            </select>
            <button type="button" id="timeRange0" onclick="getMonitoringChart(3, 1)">현재</button>
            <button type="button" id="timeRange1" onclick="getMonitoringChart(15, 30)">지난 15m</button>
            <button type="button" id="timeRange2" onclick="getMonitoringChart(30, 60)">30m</button>
            <button type="button" id="timeRange3" onclick="getMonitoringChart(60, 60*2)">1h</button>
            <button type="button" id="timeRange4" onclick="getMonitoringChart(60*3, 60*5)">3h</button>
            <button type="button" id="timeRange5" onclick="getMonitoringChart(60*6, 60*10)">6h</button>
            <button type="button" id="timeRange6" onclick="getMonitoringChart(60*12, 60*25)">12h</button>
            <button type="button" id="timeRange7" onclick="getMonitoringChart(60*24, 60*50)">1day</button>
            <button type="button" id="timeRange8" onclick="getMonitoringChart(60*48, 60*100)">2day</button>
            <button type="button" id="timeRange9" onclick="getMonitoringChart(60*168, 60*350)">1week</button>
            <button type="button" id="timeRange10" onclick="getMonitoringChart(60*720, 60*1350)">1month</button>
        </div>
    </div>
    <div>
        <div class="chart" id="chart" style="width: 96%;"></div>
        <div class="chart2" id="chart2" style="width: 96%;"></div>
        <div class="chart3" id="chart3" style="width: 96%;"></div>
    </div>

</div>

<input type="hidden" id="key" name="key" value="${key}"/>


<input type="hidden" id="sValue" name="sValue"/>
<input type="hidden" id="timeRange" name="timeRange" value="${key}"/>
<input type="hidden" id="groupBy" name="groupBy"/>


<script type="text/javascript">
    var cpuUsage;
    var memoryUsage;
    var networkIoKByteUsage;
    var networkIoKByteUsageRx;
    var networkIoKByteUsageTx;
    var networkIoKByteUsageTimeRx = new Array();
    var networkIoKByteUsageValueRx = new Array();
    var networkIoKByteUsageTimeTx = new Array();
    var networkIoKByteUsageValueTx = new Array();
    var appIdx = $('#key').val();



    function valueChange(f) {
        $("#sValue").val(f);
        settingValue();
    }

    // 앱 정보 받아오기
    var getAppInfo = function () {
        $("#orgName").text(currentOrg);
        $("#spaceName").text(currentSpace);

        getAppSummary();
    };


    function getAppSummary() {
        param = {
            guid: currentAppGuid
        };

        $.ajax({
            url: "/app/getAppSummary",
            method: "POST",
            data: JSON.stringify(param),
            dataType: 'json',
            contentType: "application/json",
            success: function (data) {
                if (data) {
                    $("#app").text(data.name);

                    var htmlString;
                    htmlString = "<option value='ALL'>ALL</option>";
                    for (var i = 0; i < data.instances; i++) {
                        if (i == appIdx) {
                            htmlString += "<option selected='selected' value=" + i + ">" + i + "</option>";
                        } else {
                            htmlString += "<option value=" + i + ">" + i + "</option>";
                        }
                    }
                    var divSelectBox = $('#instanceSelect');
                    divSelectBox.html(htmlString);

                    settingValue();

                }
            },
            error: function (xhr, status, error) {
                location = "/login";
            },
            complete: function (data) {
            }

        });

    }


    function settingValue() {
        var sValue = $("#sValue").val();
        var timeRange = $("#timeRange").val();
        var groupBy = $("#groupBy").val();

        var selectBoxCount = $("#instanceSelect option").size() - 1;
        if (sValue == "ALL") {
            var idxAll = 0;
            for (var i = 0; i < selectBoxCount-1; i++) {
                idxAll += "," + (i + 1);
            }
            sValue = idxAll;
        }

        getCpuUsage(sValue, timeRange, groupBy);
        getMemoryUsage(sValue, timeRange, groupBy);
        getNetworkIoKByteUsage(sValue, timeRange, groupBy);
    }


    // CPU 사용량 조회
    var getCpuUsage = function (selectedApp, defaultTimeRange, groupBy) {
        var reqParam = {
            guid: currentAppGuid,
            idx: selectedApp
        };

        var defaultTimeRangeString = defaultTimeRange + "m";
        var groupByString = groupBy + "s";

        procCallAjax("/app/getCpuUsage?defaultTimeRange=" + defaultTimeRangeString + "&groupBy=" + groupByString, reqParam, procCallbackCpuUsage);

    };
    var cpuUsageData;
    var procCallbackCpuUsage = function (data) {
        var cpuTime = new Array();
        var cpuValue = new Array();

        cpuUsageData = new Array();
        cpuUsage = data.data;

        var cnt = 0;
        for (var i = 0; i < cpuUsage.length; i++) {
            if (i == 0) {
                cpuTime.push("cpuTime");
            }
            cpuValue = new Array();
            cpuValue.push(cpuUsage[i].serviceName);

            if (cpuUsage[i].data != null) {

                for (var j = 0; j < cpuUsage[i].data.length; j++) {
                    if (i == 0) {
                        cpuTime.push(cpuUsage[i].data[j].time);
                        cnt++;
                    }
                    cpuValue.push(cpuUsage[i].data[j].value);
                }
            } else {
                for (var j = 0; j < cnt; j++) {
                    cpuValue.push(0);
                }
            }

            if (i == 0) {
                cpuUsageData.push(cpuTime);
            }
            cpuUsageData.push(cpuValue);
        }

        cpuChart();
    };



    // Memory 사용량 조회
    var getMemoryUsage = function (selectedApp, defaultTimeRange, groupBy) {
        var reqParam = {
            guid: currentAppGuid,
            idx: selectedApp
        };

        var defaultTimeRangeString = defaultTimeRange + "m";
        var groupByString = groupBy + "s";

        procCallAjax("/app/getMemoryUsage?defaultTimeRange=" + defaultTimeRangeString + "&groupBy=" + groupByString, reqParam, procCallbackMemoryUsage);
    };

    var memoryUsageData;
    var procCallbackMemoryUsage = function (data) {
        var memoryTime = new Array();
        var memoryValue = new Array();

        memoryUsageData = new Array();
        memoryUsage = data.data;

        var cnt = 0;
        for (var i = 0; i < memoryUsage.length; i++) {
            if (i == 0) {
                memoryTime.push("memoryTime");
            }
            memoryValue = new Array();
            memoryValue.push(memoryUsage[i].serviceName);

            if (memoryUsage[i].data != null) {
                for (var j = 0; j < memoryUsage[i].data.length; j++) {
                    if (i == 0) {
                        memoryTime.push(memoryUsage[i].data[j].time);
                        cnt++;
                    }
                    memoryValue.push(memoryUsage[i].data[j].value);
                }
            } else {
                for (var j = 0; j < cnt; j++) {
                    memoryValue.push(0);
                }
            }

            if (i == 0) {
                memoryUsageData.push(memoryTime);
            }
            memoryUsageData.push(memoryValue);
        }

        memoryChart();

    };

    var getNetworkIoKByteUsage = function (selectedApp, defaultTimeRange, groupBy) {
        var reqParam = {
            guid: currentAppGuid,
            idx: selectedApp
        };

        var defaultTimeRangeString = defaultTimeRange + "m";
        var groupByString = groupBy + "s";
        procCallAjax("/app/getNetworkIoKByte?defaultTimeRange=" + defaultTimeRangeString + "&groupBy=" + groupByString, reqParam, procCallbackNetworkIoKByteUsage);
    };


    var networkIoKByteUsageData;
    var procCallbackNetworkIoKByteUsage = function (data) {
        var networkIoKByteUsageTime = new Array();
        var networkIoKByteUsageValue = new Array();
        networkIoKByteUsageData = new Array();
        networkIoKByteUsage = data.data;

        for (var i = 0; i < networkIoKByteUsage.length; i++) {
            if (i == 0) {
                networkIoKByteUsageTime.push("networkTime");
            }
            networkIoKByteUsageValue = new Array();
            networkIoKByteUsageValue.push(networkIoKByteUsage[i].serviceName);
            for (var j = 0; j < networkIoKByteUsage[i].data.length; j++) {
                if (i == 0) {
                    networkIoKByteUsageTime.push(networkIoKByteUsage[i].data[j].time);
                }
                networkIoKByteUsageValue.push(networkIoKByteUsage[i].data[j].value);
            }
            if (i == 0) {
                networkIoKByteUsageData.push(networkIoKByteUsageTime);
            }
            networkIoKByteUsageData.push(networkIoKByteUsageValue);
        }

        networkIoKByteChart();
    };


    // cpuChart 만들기
    function cpuChart() {
        bb.generate({
            bindto: "#chart",
            data: {
                x: "cpuTime",
                columns: cpuUsageData
            },
            "axis": {
                "x": {
                    "type": "timeseries",
                    "tick": {
                        "format": "%y/%-m/%-d %H:%M"
                    }
                }
            }
        });
    }


    // memoryChart 만들기
    function memoryChart() {
        bb.generate({
            bindto: "#chart2",
            data: {
                x: "memoryTime",
                xFormat: "%Y-%m-%d %H:%M:%S",
                columns: memoryUsageData
            },
            "axis": {
                "x": {
                    "type": "timeseries",
                    "tick": {
                        "format": "%y/%-m/%-d %H:%M"
                    }
                }
            }
        });
    }

    // networkIoKByteChart 만들기
    function networkIoKByteChart() {
        bb.generate({
            bindto: "#chart3",
            data: {
                x: "networkTime",
                columns: networkIoKByteUsageData
            },
            "axis": {
                "x": {
                    "type": "timeseries",
                    "tick": {
                        "format": "%y/%-m/%-d %H:%M"
                    }
                }
            }
        });
    }

    var getMonitoringChart = function (defaultTimeRange, groupBy) {
        $("#timeRange").val(defaultTimeRange);
        $("#groupBy").val(groupBy);
        settingValue();
    };

    $(document).ready(function () {
        $("#sValue").val(appIdx);
        $("#timeRange").val(3);
        $("#groupBy").val(1);
        getAppInfo();

    });

</script>

<%@include file="../layout/bottom.jsp" %>




