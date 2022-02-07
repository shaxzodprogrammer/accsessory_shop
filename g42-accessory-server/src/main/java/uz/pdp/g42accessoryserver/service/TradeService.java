package uz.pdp.g42accessoryserver.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.pdp.g42accessoryserver.entity.*;
import uz.pdp.g42accessoryserver.entity.enums.DiscountType;
import uz.pdp.g42accessoryserver.entity.enums.ReportStatus;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.payload.ProductWithAmountDto;
import uz.pdp.g42accessoryserver.payload.TradeDto;
import uz.pdp.g42accessoryserver.repository.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TradeService {
    @Autowired
    TradeRepository tradeRepository;

    @Autowired
    ReportRepository reportRepository;

    @Autowired
    ShopRepository shopRepository;

    @Autowired
    ProductWithAmountRepository productWithAmountRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    DiscountRepository discountRepository;

    @Autowired
    DtoService dtoService;

    @Transactional
    public ApiResponse saveOrEdit(TradeDto dto, User user){
        Trade trade = new Trade();
        List<Shop> allBySellerId = shopRepository.findAllBySellerId(user.getId());
        if (dto.getId()!=null){
            trade = tradeRepository.findById(dto.getId()).orElseThrow(() -> new IllegalStateException("Trade not found"));
            Report report = trade.getReport();
            if (report.getStatus().equals(ReportStatus.ACCEPTED)||report.getStatus().equals(ReportStatus.NEW)){
                return new ApiResponse("Error",false);
            }
            Discount discount = trade.getDiscount();
            if (discount!=null){
                discountRepository.deleteById(discount.getId());
            }
            List<ProductWithAmount> productWithAmounts = trade.getProductWithAmounts();
            for (ProductWithAmount productWithAmount : productWithAmounts) {
                productWithAmountRepository.deleteById(productWithAmount.getId());
            }
        }else {
            Optional<Report> byAcceptedFalseAndShop = reportRepository.findByStatusAndShop(ReportStatus.DRAFT,allBySellerId.get(0));
            Report report = new Report();
            if (byAcceptedFalseAndShop.isPresent()){
                report = byAcceptedFalseAndShop.get();
            }else {
                report.setSeller(user);
                report.setStatus(ReportStatus.DRAFT);
                report.setShop(allBySellerId.get(0));
                report=reportRepository.save(report);
            }
            trade.setReport(report);
        }
        trade.setShop(allBySellerId.get(0));
        trade.setSeller(user);
        trade=tradeRepository.save(trade);
        double totalSum=0;
        double totalIncomeSum=0;
        double totalAfterDiscountSum=0;
        List<ProductWithAmountDto> productWithAmountDtos = dto.getProductWithAmountDtos();
        for (ProductWithAmountDto productWithAmountDto : productWithAmountDtos) {
            if (productWithAmountDto.getAmount()<1){
                throw new NumberFormatException();
            }
            Product product = productRepository.findById(productWithAmountDto.getProductDto().getId()).orElseThrow(() -> new IllegalStateException("Product not found"));
            ProductWithAmount productWithAmount = new ProductWithAmount();
            productWithAmount.setProduct(product);
            productWithAmount.setTrade(trade);
            productWithAmount.setAmount(productWithAmountDto.getAmount());
            productWithAmount.setRealSoldPrice(productWithAmountDto.getRealSoldPrice());
            productWithAmount=productWithAmountRepository.save(productWithAmount);
            totalSum+=productWithAmount.getAmount()*productWithAmount.getRealSoldPrice();
            totalIncomeSum+=product.getIncomePrice()*productWithAmount.getAmount();
        }
        totalAfterDiscountSum=totalSum;
        if (dto.getDiscountDto()!=null){
            Discount discount = new Discount();
            discount.setDiscountType(dto.getDiscountDto().getDiscountType());
            discount.setAmount(dto.getDiscountDto().getAmount());
            discount=discountRepository.save(discount);
            trade.setDiscount(discount);
            if (discount.getDiscountType().equals(DiscountType.PERCENT)){
                totalAfterDiscountSum-=(totalAfterDiscountSum*discount.getAmount())/100;
            }else {
                totalAfterDiscountSum-=discount.getAmount();
            }
        }
        trade.setTotalSum(totalSum);
        trade.setTotalIncomeSum(totalIncomeSum);
        trade.setAfterDiscountTotalSum(totalAfterDiscountSum);
        tradeRepository.save(trade);
        return new ApiResponse(dto.getId()!=null?"Edited":"Saved",true);
    }

    public ApiResponse getAllByDraftReport(User user){
        List<Shop> allBySellerId = shopRepository.findAllBySellerId(user.getId());
        Shop shop = allBySellerId.get(0);
        Optional<Report> byAcceptedFalseAndShop = reportRepository.findByStatusAndShop(ReportStatus.DRAFT,shop);
        if (byAcceptedFalseAndShop.isPresent()){
            Report report = byAcceptedFalseAndShop.get();
            List<Trade> allByShopAndSellerAndReport = tradeRepository.findAllByShopAndSellerAndReportOrderByCreatedAtDesc(shop, user, report);
            return new ApiResponse("Ok",true,allByShopAndSellerAndReport.stream().map(item->dtoService.tradeDto(item)).collect(Collectors.toList()));
        }
        return new ApiResponse("Error",false);
    }

    public ApiResponse remove(UUID id) {
        try {
            Trade trade = tradeRepository.findById(id).orElseThrow(() -> new IllegalStateException("Trade not fount"));
            Report report = trade.getReport();
            if (report.getStatus().equals(ReportStatus.ACCEPTED)||report.getStatus().equals(ReportStatus.NEW)){
                return new ApiResponse("Error",false);
            }
            tradeRepository.deleteById(id);
            return new ApiResponse("Deleted",true);
        }catch (Exception e){
            e.printStackTrace();
            return new ApiResponse("Error",false);
        }
    }

    public ApiResponse closeDay(UUID id) {
      try {
          Trade trade = tradeRepository.findById(id).orElseThrow(() -> new IllegalStateException("Trade not found"));
          Report report = trade.getReport();
          if (report.getStatus().equals(ReportStatus.ACCEPTED)||report.getStatus().equals(ReportStatus.NEW)){
              return new ApiResponse("Error",false);
          }
          List<Trade> allByReport = tradeRepository.findAllByReport(report);
          double totalSum=0;
          for (Trade trade1 : allByReport) {
              totalSum+=trade1.getAfterDiscountTotalSum();
          }
          report.setTotalSum(totalSum);
          report.setStatus(ReportStatus.NEW);
          reportRepository.save(report);
          return new ApiResponse("ok",true);
      }catch (Exception e){
          return new ApiResponse("Error",false);
      }
    }
}
