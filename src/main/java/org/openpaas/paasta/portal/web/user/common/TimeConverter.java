package org.openpaas.paasta.portal.web.user.common;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by hrjin on 2017-10-23.
 */
public class TimeConverter {

    public List<Map> timeConverter(String type, List<Map> dataList) {
        List<Map> re = new ArrayList<Map>();

        if (dataList != null) {
            try {
                for (Map data : dataList) {
                    Map reData = new HashMap();
                    List<Map> listData = new ArrayList<>();

                    if (data != null) {
                        String serviceName = data.get("name").toString();
                        reData.put("serviceName", type + serviceName);
                        Map value = (Map) data.get("data");
                        if (value != null) {
                            List<Map> bodys = (List<Map>) value.get("data");
                            if (bodys != null) {

                                for (Map body : bodys) {
                                    Map r = new HashMap();
                                    if (body != null) {
                                        if (body.get("time") != null) {
                                            long unix = Long.parseLong(body.get("time").toString());
                                            long unixTime = unix * 1000L;
                                            Date date = new Date(unixTime);

                                            r.put("time", date.getTime());
                                            r.put("value", body.get("value").toString());
                                            listData.add(r);
                                        } else {
                                            r.put("time", null);
                                            r.put("value", null);
                                            listData.add(r);
                                        }
                                    }
                                }
                            } else {
                                Map r = new HashMap();
                                r.put("time", null);
                                r.put("value", null);
                                listData.add(r);
                            }
                        } else {
                            Map r = new HashMap();
                            r.put("time", null);
                            r.put("value", null);
                            listData.add(r);
                        }


                        reData.put("data", listData);
                        re.add(reData);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

        }
        return re;
    }


    public List<Map> timeConvert(List<Map> dataList) {
        try {
            List<Map> completeList = new ArrayList<Map>();

            SimpleDateFormat simpleDate = new SimpleDateFormat("MMddHHmm");
            simpleDate.setTimeZone(TimeZone.getTimeZone("GMT+9"));

            for (Map d : dataList) {
                String idx = d.get("idx").toString();
                Map data = (Map) d.get("data");
                List<Map> bodys = (List<Map>) data.get("data");
                for (Map body : bodys) {
                    Map returnData = new HashMap();
                    List<Map> reData = new ArrayList<Map>();
                    String serviceName = body.get("serviceName").toString() + "_" + idx;
                    returnData.put("serviceName", serviceName);
                    List<Map> networkdataList = (List<Map>) body.get("data");
                    if(networkdataList!=null) {
                        for (Map network : networkdataList) {
                            Map r = new HashMap();
                            if (network.get("time") != null) {
                                long unix = Long.parseLong(network.get("time").toString());
                                long unixTime = unix * 1000L;
                                Date date = new Date(unixTime);

                                r.put("time", date.getTime());
                                r.put("value", network.get("value").toString());
                                reData.add(r);
                            } else {
                                r.put("time", null);
                                r.put("value", null);
                                reData.add(r);
                            }
                        }
                    }else{
                        Map r = new HashMap();
                        r.put("time", null);
                        r.put("value", null);
                        reData.add(r);
                    }
                    returnData.put("data", reData);
                    completeList.add(returnData);
                }
            }
            return completeList;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }


}
