package cz.cvut.fel.nss.budgetmanager.BudgetManager.dto;

import java.math.BigDecimal;
import java.util.Map;

public class WalletGoalResponseDTO {
    private Long goalId;
    private String goal;
    private BigDecimal moneyGoal;

    public Long getGoalId() {
        return goalId;
    }

    public void setGoalId(Long goalId) {
        this.goalId = goalId;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public BigDecimal getMoneyGoal() {
        return moneyGoal;
    }

    public void setMoneyGoal(BigDecimal moneyGoal) {
        this.moneyGoal = moneyGoal;
    }
}

