package cz.cvut.fel.nss.budgetmanager.Dispatcher.model;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class Goal {
    private Long goalId;
    private String goal;
    private BigDecimal moneyGoal;
    private Wallet wallet;
}
