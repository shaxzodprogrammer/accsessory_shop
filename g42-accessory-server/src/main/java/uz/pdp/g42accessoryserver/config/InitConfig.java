package uz.pdp.g42accessoryserver.config;

import org.springframework.core.io.ClassPathResource;

import javax.swing.*;
import java.util.Properties;

//import javax.swing.*;

public class InitConfig {

    public static boolean isStart() {
        Properties props = new Properties();
        try {
            props.load(new ClassPathResource("/application.properties").getInputStream());
            if (props.getProperty("spring.jpa.hibernate.ddl-auto").equals("update")
                    && props.getProperty("spring.datasource.initialization-mode").equals("never")) {
                return true;
            }
            else{
                String confirm = JOptionPane.showInputDialog("Ma'lumotlarni o'chirib yuborma! Keyin bilmay qoldim dema! Agar rostdan ham o'chirmoqchi bo'lsang. O'chirish kodi (DROP_G42_ACCESSORY_DATABASE) :");
                if (confirm!=null && confirm.equals("DROP_G42_ACCESSORY_DATABASE")){
                    return true;
                }
            }
//            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
