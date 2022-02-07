package uz.pdp.g42accessoryserver.service;

import com.google.gson.Gson;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.pdp.g42accessoryserver.payload.model.ProducCountByWarehouse;
import uz.pdp.g42accessoryserver.payload.model.WarehouseProductCount;
import uz.pdp.g42accessoryserver.repository.WarehouseRepository;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExcelService {

    @Autowired
    WarehouseRepository warehouseRepository;

    public ResponseEntity<byte[]> getProductCountByWarehouse(){
        XSSFWorkbook workbook = new XSSFWorkbook();
        CellStyle style =workbook.createCellStyle();
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setAlignment(HorizontalAlignment.CENTER);
        XSSFSheet sheet = workbook.createSheet("Product count info by warehouse");
        Row row = sheet.createRow(0);
        Cell cell = row.createCell(0);
        cell.setCellStyle(style);
        cell.setCellValue("T/R");
        cell = row.createCell(1);
        cell.setCellValue("Product Name");
        cell.setCellStyle(style);
        cell = row.createCell(2);
        cell.setCellValue("Product Count");
        cell.setCellStyle(style);
        sheet.addMergedRegion(new CellRangeAddress(0,0, 2,3));
        List<Object[]> objects = warehouseRepository.productCountByWarehouse();
        Gson gson = new Gson();

        int rowIndex=1;
        for (int i=0;i<objects.size();i++) {
            row = sheet.createRow(rowIndex);
            Object[] obj = objects.get(i);
            cell=row.createCell(0);
            cell.setCellStyle(style);
            cell.setCellValue(i+1);
            cell = row.createCell(1);
            String productName =String.valueOf(obj[1]);
            cell.setCellValue(productName);

            String arr=String.valueOf( obj[2]);
            WarehouseProductCount[] warehouseProductCounts = gson.fromJson(arr, WarehouseProductCount[].class);
            sheet.addMergedRegion(new CellRangeAddress(rowIndex,rowIndex+warehouseProductCounts.length-1,1,1));
            sheet.addMergedRegion(new CellRangeAddress(rowIndex,rowIndex+warehouseProductCounts.length-1,0,0));

            cell.setCellStyle(style);
            sheet.autoSizeColumn(1);
            sheet.autoSizeColumn(2);
            for (int j=0;j<warehouseProductCounts.length;j++) {
                cell=row.createCell(2);
                cell.setCellStyle(style);
                cell.setCellValue(warehouseProductCounts[j].getName());
                cell=row.createCell(3);
                cell.setCellValue(warehouseProductCounts[j].getCount());
                cell.setCellStyle(style);
                row = sheet.createRow(rowIndex+j+1);
            }
            rowIndex+=warehouseProductCounts.length;
        }
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        try {
            workbook.write(byteArrayOutputStream);
            byteArrayOutputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        byte[] bytes = byteArrayOutputStream.toByteArray();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + "Product Count" + ".xlsx")
                .body(bytes);
    }
}
