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

    public ShippingService(ShippingTransactionRepository shippingTransactionRepository) {
        this.shippingTransactionRepository = shippingTransactionRepository;
    }

    public ShippingTransactionDTO createShippingTransaction(ShippingTransactionDTO shippingTransactionDTO) {
        ShippingTransaction shippingTransaction = convertToEntity(shippingTransactionDTO);
        
        // Set creation time
        shippingTransaction.setCreatedAt(LocalDateTime.now());
        
        // Generate transaction number if not provided
        if (shippingTransaction.getTransactionNumber() == null) {
            shippingTransaction.setTransactionNumber("SHP-" + UUID.randomUUID().toString().substring(0, 8));
        }
        
        ShippingTransaction savedTransaction = shippingTransactionRepository.save(shippingTransaction);
        return new ShippingTransactionDTO(savedTransaction);
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
