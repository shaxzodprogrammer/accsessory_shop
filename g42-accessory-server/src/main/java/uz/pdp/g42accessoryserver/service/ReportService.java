package uz.pdp.g42accessoryserver.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import uz.pdp.g42accessoryserver.entity.Defect;
import uz.pdp.g42accessoryserver.entity.Report;
import uz.pdp.g42accessoryserver.entity.User;
import uz.pdp.g42accessoryserver.entity.enums.ReportStatus;
import uz.pdp.g42accessoryserver.entity.enums.RoleName;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.repository.ReportRepository;
import uz.pdp.g42accessoryserver.utills.CommonUtills;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    ReportRepository reportRepository;

    @Autowired
    DtoService dtoService;


    public ApiResponse getAllReportByStatus(ReportStatus status, Integer page, Integer size, User user, String startDate, String endDate,
                                            Integer shopId) throws IllegalAccessException {
        Page<Report> reports = reportRepository.findAllByStatus(status,CommonUtills.getPageableByCreatedAtDesc(page,size));
        if (dtoService.userRoleName(user).equals(RoleName.ROLE_SELLER)){
            reports=reportRepository.findAllBySellerIdAndStatus(user.getId(),status,CommonUtills.getPageableByCreatedAtDesc(page,size));
            try {
                String[] newDate = startDate.split(" ");
                String startDate1 = "";
                startDate1+=newDate[0];
                startDate1+=", " + newDate[1];
                startDate1+=" " + newDate[2];
                startDate1+=" " + newDate[3];
                SimpleDateFormat formatter=new SimpleDateFormat("E, MMM dd yyyy");
                Date date1 = formatter.parse(startDate1);
                Timestamp startDate2 = new Timestamp(date1.getTime());

                String[] newDate1 = endDate.split(" ");
                String endDate1 = "";
                endDate1+=newDate1[0];
                endDate1+=", " + newDate1[1];
                endDate1+=" " + newDate1[2];
                endDate1+=" " + newDate1[3];
                Date date2 = formatter.parse(endDate1);
                Timestamp endDate2 = new Timestamp(date2.getTime());
                List<Report> reportList = new ArrayList<>();
                reportList = reportRepository.findAllByStatusAndSellerAndCreatedAtBetween(status, user, startDate2, endDate2);
                return new ApiResponse("Ok", true, reportList.stream().map(item->dtoService.reportDto(item)).collect(Collectors.toList()),reportRepository.count(),0);
            }
            catch (Exception e) {
                return new ApiResponse("Ok", true, reports.getContent().stream().map(item->dtoService.reportDto(item)).collect(Collectors.toList()),reports.getTotalElements(),reports.getTotalPages());
            }
        }
        else {
            if (shopId!=null&&shopId>0){
                reports=reportRepository.findAllByStatusAndShopId(status,shopId,CommonUtills.getPageableByCreatedAtDesc(page,size));
            }
            try {
                String[] newDate = startDate.split(" ");
                String startDate1 = "";
                startDate1+=newDate[0];
                startDate1+=", " + newDate[1];
                startDate1+=" " + newDate[2];
                startDate1+=" " + newDate[3];
                SimpleDateFormat formatter=new SimpleDateFormat("E, MMM dd yyyy");
                Date date1 = formatter.parse(startDate1);
                Timestamp startDate2 = new Timestamp(date1.getTime());
                String[] newDate1 = endDate.split(" ");
                String endDate1 = "";
                endDate1+=newDate1[0];
                endDate1+=", " + newDate1[1];
                endDate1+=" " + newDate1[2];
                endDate1+=" " + newDate1[3];
                Date date2 = formatter.parse(endDate1);
                Timestamp endDate2 = new Timestamp(date2.getTime());
                List<Report> reportList = new ArrayList<>();
                if (shopId!=null&&shopId>0){
                    reportList=reportRepository.findAllByStatusAndShopIdAndCreatedAtBetween(status,shopId,startDate2,endDate2);
                }else {
                    reportList=reportRepository.findAllByStatusAndCreatedAtBetween(status,startDate2,endDate2);
                }

                return new ApiResponse("Ok", true, reportList.stream().map(item->dtoService.reportDto(item)).collect(Collectors.toList()),reportRepository.count(),0);
            }
            catch (Exception e) {
                return new ApiResponse("Ok", true, reports.getContent().stream().map(item->dtoService.reportDto(item)).collect(Collectors.toList()),reports.getTotalElements(),reports.getTotalPages());
            }
        }
    }

    public ApiResponse acceptReport(UUID id, User user) {
        try {
            Report report = reportRepository.findById(id).orElseThrow(() -> new IllegalStateException("Report not found"));
            report.setStatus(ReportStatus.ACCEPTED);
            report.setManagerOrDirector(user);
            reportRepository.save(report);
            return new ApiResponse("Ok", true);
        }catch (Exception e){
            e.printStackTrace();
            return new ApiResponse("Error", false);
        }
    }

}
