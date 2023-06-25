package cz.cvut.fel.nss.budgetmanager.BudgetManager.model;

import jakarta.persistence.*;

import java.io.Serializable;
import java.math.BigDecimal;


/**
 * Represents a goal entity in the system.
 */
@Entity
@Table(name = "goals")
public class Goal implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "goals_id")
    private Long goalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id")
    private Wallet wallet;

    @Column
    private String goal;

    @Column
    private BigDecimal moneyGoal;

    public Long getGoalId() {
        return goalId;
    }

    public void setGoalId(Long goalId) {
        this.goalId = goalId;
    }

    public Wallet getWallet() {
        return wallet;
    }

    public void setWallet(Wallet wallet) {
        this.wallet = wallet;
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

