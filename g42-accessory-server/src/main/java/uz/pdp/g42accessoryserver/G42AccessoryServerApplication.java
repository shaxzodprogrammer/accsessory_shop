package uz.pdp.g42accessoryserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.web.bind.annotation.CrossOrigin;
import uz.pdp.g42accessoryserver.config.InitConfig;

@SpringBootApplication
@CrossOrigin
public class G42AccessoryServerApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
//        if (InitConfig.isStart()){
            SpringApplication.run(G42AccessoryServerApplication.class, args);
//        }
    }

}
