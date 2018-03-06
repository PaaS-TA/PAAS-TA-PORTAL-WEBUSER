<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%--<%@include file="../layout/top.jsp" %>--%>
<%--<%@include file="../layout/left.jsp" %>--%>
<%--<%@include file="../layout/alert.jsp" %>--%>

    <div>
        <input type="button" value="Click" onclick="getAppSummary()">
    </div>
    <table>
        <tr>
            <td>
                <div id="name"></div>
            </td>
        </tr>
    </table>
<script type="text/javascript" src="/resources/js/lib/jquery-2.2.4.js"></script>
<script type="text/javascript">
    // 앱 정보 받아오기
    function getAppSummary() {
        var param = {
            guid: '42a50bfe-f186-48dc-8e5c-ad2a73bc4a8a'
        };

        $.ajax({
            url: "/app/getAppSummary",
            method: "POST",
            data: JSON.stringify(param),
            dataType: 'json',
            contentType: "application/json",
            success: function (data) {
                if (data) {
                    console.log(data);
                    $('#name').val(data.name);
                }
            },
            error: function (xhr, status, error) {
                console.log("error");
            },
            complete: function (data) {
            }

        });

    }

    $(document.body).ready(function() {
        console.log(":::::::::: console 확인 :::::::");
    });
</script>

