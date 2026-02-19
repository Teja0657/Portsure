package com.example.ComplianceReportService.service;

import com.example.ComplianceReportService.client.PortfolioClient;
import com.example.ComplianceReportService.dto.PortfolioDto;
import com.example.ComplianceReportService.entity.ComplianceReport;
import com.example.ComplianceReportService.repositiory.ComplianceReportRepositiory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ComplianceService {

    @Autowired
    private ComplianceReportRepositiory logRepository;

    @Autowired
    private PortfolioClient portfolioClient;

    public List<ComplianceReport> getAllLogs() {
        return logRepository.findAll();
    }

    public ComplianceReport createLog(ComplianceReport log) {
        if (log.getDate() == null) {
            log.setDate(LocalDate.now());
        }
        return logRepository.save(log);
    }

    @Transactional
    public List<ComplianceReport> auditAllPortfolios() {
        try {
            // UPDATED: Now uses the standalone PortfolioDto class
            List<PortfolioDto> allPortfolios = portfolioClient.getAllPortfolios();

            if (allPortfolios == null || allPortfolios.isEmpty()) {
                return logRepository.findAll();
            }

            // UPDATED: Loop variable type changed to PortfolioDto
            for (PortfolioDto p : allPortfolios) {
                try {
                    // NULL SAFETY: Skip portfolios with missing percentage data
                    if (p.getPortfolioId() == null ||
                            p.getEquityPercentage() == null ||
                            p.getDerivativePercentage() == null ||
                            p.getBondPercentage() == null) {
                        continue;
                    }

                    // Prepare Variables
                    // Note: Ensure your repository accepts Integer, otherwise consider changing
                    // entity to Long
                    Integer pIdAsInt = p.getPortfolioId().intValue();
                    double equity = p.getEquityPercentage();
                    double derivative = p.getDerivativePercentage();
                    double bond = p.getBondPercentage();

                    // Default to SEBI if null, otherwise use the portfolio's type
                    String regulationType = (p.getRegulationType() != null) ? p.getRegulationType() : "SEBI";
                    String status = "COMPLIANCE"; // Removed trailing space for cleanliness
                    String findings = "No compliance violations detected";

                    if ("SEBI".equalsIgnoreCase(regulationType)) {
                        // --- SEBI RULES ---
                        if (derivative > bond) {
                            status = "NON-COMPLIANCE";
                            findings = "SEBI VIOLATION: Risk too high. Derivative % cannot exceed Bond %.";
                        } else if (derivative > 50) {
                            status = "NON-COMPLIANCE";
                            findings = "SEBI VIOLATION: Regulatory Cap. Derivatives cannot exceed 50%.";
                        } else if (bond < 10) {
                            status = "NON-COMPLIANCE";
                            findings = "SEBI VIOLATION: Liquidity Issue. Bonds must be at least 10%.";
                        }
                    } else if ("MiFID II".equalsIgnoreCase(regulationType)) {
                        // --- MiFID II RULES ---
                        if (derivative > equity) {
                            status = "NON-COMPLIANCE";
                            findings = "MiFID WARNING: Speculative Portfolio (Derivatives > Equity).";
                        } else if ((equity + derivative) > 80) {
                            status = "NON-COMPLIANCE";
                            findings = "MiFID WARNING: High Risk Allocation (>80% Risk Assets).";
                        } else if(bond + equity < 30){
                            status = "NON-COMPLIANCE";
                            findings = "MiFID WARNING: Insufficient Diversification (Bond + Equity < 30%).";
                        }
                    }

                    Optional<ComplianceReport> existingLog = logRepository.findByPortfolioId(pIdAsInt);
                    ComplianceReport log = existingLog.orElse(new ComplianceReport());

                    log.setPortfolioId(pIdAsInt);
                    log.setComplianceStatus(status);
                    log.setFindings(findings);
                    log.setRegulationType(regulationType);
                    log.setDate(LocalDate.now());

                    logRepository.save(log);

                } catch (Exception e) {

                }
            }

            return logRepository.findAll();

        } catch (Exception e) {
            throw e;
        }
    }
}