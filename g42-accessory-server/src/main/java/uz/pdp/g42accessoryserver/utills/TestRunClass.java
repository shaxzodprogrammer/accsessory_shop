package uz.pdp.g42accessoryserver.utills;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;

public class TestRunClass {
    public static void main(String[] args) throws ParseException {
        String date = "Sat Jul 17 2021 11:18:16 GMT+0500 (Пакистан, стандартное время)";
        String[] newDate = date.split(" ");
        String startDate = "";
        startDate+=newDate[0];
        startDate+=", " + newDate[1];
        startDate+=" " + newDate[2];
        startDate+=" " + newDate[3];
        SimpleDateFormat formatter4=new SimpleDateFormat("E, MMM dd yyyy");
        Date date1 = formatter4.parse(startDate);
        Timestamp timestamp = new Timestamp(date1.getTime());
        System.out.println(timestamp);
    }

}
