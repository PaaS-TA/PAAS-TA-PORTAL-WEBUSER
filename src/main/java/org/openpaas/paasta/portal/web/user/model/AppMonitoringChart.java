package org.openpaas.paasta.portal.web.user.model;

/**
 * Created by hrjin on 2017-10-26.
 */
public class AppMonitoringChart {
    private String guid;
    private String idx;

    public String getGuid() {
        return guid;
    }

    public void setGuid(String guid) {
        this.guid = guid;
    }

    public String getIdx() {
        return idx;
    }

    public void setIdx(String idx) {
        this.idx = idx;
    }

    @Override
    public String toString() {
        return "AppMonitoringChart{" +
                "guid='" + guid + '\'' +
                ", idx=" + idx +
                '}';
    }
}
