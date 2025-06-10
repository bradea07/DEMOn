package com.ecoswap.service;

import com.ecoswap.dto.ShippingTransactionDTO;
import com.ecoswap.model.ShippingTransaction;
import com.ecoswap.repository.ShippingTransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ShippingService {

    private final ShippingTransactionRepository shippingTransactionRepository;
    private final MailService mailService;

    public ShippingService(ShippingTransactionRepository shippingTransactionRepository, MailService mailService) {
        this.shippingTransactionRepository = shippingTransactionRepository;
        this.mailService = mailService;
    }    public ShippingTransactionDTO createShippingTransaction(ShippingTransactionDTO shippingTransactionDTO) {
        ShippingTransaction shippingTransaction = convertToEntity(shippingTransactionDTO);
        
        // Set creation time
        shippingTransaction.setCreatedAt(LocalDateTime.now());
        
        // Generate transaction number if not provided
        if (shippingTransaction.getTransactionNumber() == null) {
            shippingTransaction.setTransactionNumber("SHP-" + UUID.randomUUID().toString().substring(0, 8));
        }
        
        ShippingTransaction savedTransaction = shippingTransactionRepository.save(shippingTransaction);
        
        // Send confirmation email
        sendShippingConfirmationEmail(savedTransaction);
        
        return new ShippingTransactionDTO(savedTransaction);
    }
    
    private void sendShippingConfirmationEmail(ShippingTransaction transaction) {
        // Check if sender email is available
        if (transaction.getFromEmail() != null && !transaction.getFromEmail().isEmpty()) {
            String subject = "EcoSwap: Your Shipping Confirmation";
            
            StringBuilder body = new StringBuilder();
            body.append("Hello ").append(transaction.getFromName()).append(",\n\n");
            body.append("Thank you for using EcoSwap Delivery Service!\n\n");
            body.append("Your shipping has been confirmed with the following details:\n\n");
            body.append("Transaction Number: ").append(transaction.getTransactionNumber()).append("\n");
            body.append("Shipment ID: ").append(transaction.getShipmentId()).append("\n");
            body.append("Shipping Provider: ").append(transaction.getProvider()).append("\n");
            body.append("Service Type: ").append(transaction.getService()).append("\n");
            body.append("Estimated Delivery Days: ").append(transaction.getEstimatedDays()).append("\n\n");
            
            body.append("From:\n");
            body.append(transaction.getFromName()).append("\n");
            body.append(transaction.getFromStreet()).append("\n");
            body.append(transaction.getFromCity()).append(", ");
            body.append(transaction.getFromState()).append(" ");
            body.append(transaction.getFromZip()).append("\n");
            body.append(transaction.getFromCountry()).append("\n\n");
            
            body.append("To:\n");
            body.append(transaction.getToName()).append("\n");
            body.append(transaction.getToStreet()).append("\n");
            body.append(transaction.getToCity()).append(", ");
            body.append(transaction.getToState()).append(" ");
            body.append(transaction.getToZip()).append("\n");
            body.append(transaction.getToCountry()).append("\n\n");
              body.append("A courier will call you soon to pick up the package. Please prepare the package properly.\n\n");
            body.append("Thank you for using EcoSwap!\n");
            body.append("The EcoSwap Team");
            
            mailService.sendEmail(transaction.getFromEmail(), subject, body.toString());
        }
        
        // Also send confirmation to recipient if email is available
        if (transaction.getToEmail() != null && !transaction.getToEmail().isEmpty()) {
            String subject = "EcoSwap: Package Delivery Notification";
            
            StringBuilder body = new StringBuilder();
            body.append("Hello ").append(transaction.getToName()).append(",\n\n");
            body.append("We are pleased to inform you that a package has been arranged for delivery to you via EcoSwap!\n\n");
            body.append("Delivery details:\n\n");
            body.append("Shipping Provider: ").append(transaction.getProvider()).append("\n");
            body.append("Service Type: ").append(transaction.getService()).append("\n");
            body.append("Estimated Arrival: ").append(transaction.getEstimatedDays()).append(" days\n\n");
            
            body.append("Sender:\n");
            body.append(transaction.getFromName()).append("\n\n");
            
            body.append("Delivery Address:\n");
            body.append(transaction.getToName()).append("\n");
            body.append(transaction.getToStreet()).append("\n");
            body.append(transaction.getToCity()).append(", ");
            body.append(transaction.getToState()).append(" ");
            body.append(transaction.getToZip()).append("\n");
            body.append(transaction.getToCountry()).append("\n\n");
            
            body.append("A courier will deliver your package soon according to the selected service.\n\n");
            body.append("Thank you for using EcoSwap!\n");
            body.append("The EcoSwap Team");
            
            mailService.sendEmail(transaction.getToEmail(), subject, body.toString());
        }
    }

    public List<ShippingTransactionDTO> getAllShippingTransactions() {
        List<ShippingTransaction> transactions = shippingTransactionRepository.findAll();
        return transactions.stream()
                .map(ShippingTransactionDTO::new)
                .collect(Collectors.toList());
    }

    public ShippingTransactionDTO getShippingTransactionById(Long id) {
        ShippingTransaction transaction = shippingTransactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipping transaction not found with ID: " + id));
        return new ShippingTransactionDTO(transaction);
    }

    public ShippingTransactionDTO getShippingTransactionByShipmentId(String shipmentId) {
        ShippingTransaction transaction = shippingTransactionRepository.findByShipmentId(shipmentId);
        if (transaction == null) {
            throw new RuntimeException("Shipping transaction not found with shipment ID: " + shipmentId);
        }
        return new ShippingTransactionDTO(transaction);
    }

    public List<ShippingTransactionDTO> getShippingTransactionsByFromEmail(String email) {
        List<ShippingTransaction> transactions = shippingTransactionRepository.findByFromEmail(email);
        return transactions.stream()
                .map(ShippingTransactionDTO::new)
                .collect(Collectors.toList());
    }

    public List<ShippingTransactionDTO> getShippingTransactionsByToEmail(String email) {
        List<ShippingTransaction> transactions = shippingTransactionRepository.findByToEmail(email);
        return transactions.stream()
                .map(ShippingTransactionDTO::new)
                .collect(Collectors.toList());
    }

    private ShippingTransaction convertToEntity(ShippingTransactionDTO dto) {
        return ShippingTransaction.builder()
                .id(dto.getId())
                .transactionNumber(dto.getTransactionNumber())
                .amount(dto.getAmount())
                .currency(dto.getCurrency())
                .createdAt(dto.getCreatedAt())
                .shipmentId(dto.getShipmentId())
                .rateId(dto.getRateId())
                .provider(dto.getProvider())
                .service(dto.getService())
                .estimatedDays(dto.getEstimatedDays())
                .fromName(dto.getFromName())
                .fromStreet(dto.getFromStreet())
                .fromCity(dto.getFromCity())
                .fromState(dto.getFromState())
                .fromZip(dto.getFromZip())
                .fromCountry(dto.getFromCountry())
                .fromPhone(dto.getFromPhone())
                .fromEmail(dto.getFromEmail())
                .toName(dto.getToName())
                .toStreet(dto.getToStreet())
                .toCity(dto.getToCity())
                .toState(dto.getToState())
                .toZip(dto.getToZip())
                .toCountry(dto.getToCountry())
                .toPhone(dto.getToPhone())
                .toEmail(dto.getToEmail())
                .parcelLength(dto.getParcelLength())
                .parcelWidth(dto.getParcelWidth())
                .parcelHeight(dto.getParcelHeight())
                .parcelWeight(dto.getParcelWeight())
                .build();
    }
}
