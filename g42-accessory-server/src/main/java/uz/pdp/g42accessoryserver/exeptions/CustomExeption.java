package uz.pdp.g42accessoryserver.exeptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class CustomExeption extends RuntimeException{
    public CustomExeption(String message) {
        super(message);
    }
}
