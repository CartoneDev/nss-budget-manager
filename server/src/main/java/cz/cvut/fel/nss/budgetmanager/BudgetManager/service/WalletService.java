package cz.cvut.fel.nss.budgetmanager.BudgetManager.service;

import cz.cvut.fel.nss.budgetmanager.BudgetManager.model.*;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.model.notification.NotificationType;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.repository.GoalDao;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.repository.TransactionDao;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.repository.WalletDao;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.service.kafka.NotificationProducer;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Service class for managing wallet-related operations.
 */
@Service
@Transactional
public class WalletService {

    private TransactionService transactionService;
    private NotificationService notificationService;

    private final WalletDao walletDao;
    private final TransactionDao transactionDao;
    private final GoalDao goalDao;

    private final NotificationProducer notificationProducer;

    /**
     * Constructs a new WalletService with the given dependencies.
     *  @param walletDao             The WalletDao to interact with wallet data.
     * @param transactionDao        The TransactionDao to interact with transaction data.
     * @param notificationService   The NotificationService for managing notifications.
     * @param notificationProducer  The NotificationProducer for sending email notifications.
     * @param transactionService    The TransactionService for transaction-related operations.
     * @param goalDao               The GoalDao to interact with goal data.
     */
    @Autowired
    public WalletService(WalletDao walletDao, TransactionDao transactionDao,
                         NotificationService notificationService, NotificationProducer notificationProducer, TransactionService transactionService, GoalDao goalDao) {
        this.walletDao = walletDao;
        this.transactionDao = transactionDao;
        this.notificationService = notificationService;
        this.notificationProducer = notificationProducer;
        this.transactionService = transactionService;
        this.goalDao = goalDao;
    }

    /**
     * Creates a new wallet for the given user.
     *
     * @param name The name of the wallet.
     * @param user The user associated with the wallet.
     * @return The created wallet.
     */
    public Wallet createWallet(String name, User user) {
        Wallet newWallet = new Wallet();
        newWallet.setAmount(BigDecimal.valueOf(0));
        newWallet.setName(name + "Wallet");
        newWallet.setClient(user);
        newWallet.setBudgetLimit(BigDecimal.valueOf(100000));
        newWallet.setCurrency(Currency.CZK);
        walletDao.persist(newWallet);
        return newWallet;
    }

    /**
     * Updates the specified wallet.
     *
     * @param wallet The wallet to update.
     */
    public void updateWallet(Wallet wallet) {
        Objects.requireNonNull(wallet);
        walletDao.update(wallet);
    }

    /**
     * Adds the specified amount of money to the wallet.
     *
     * @param wallet The wallet to add money to.
     * @param amount The amount of money to add.
     */
    public void addMoney(Wallet wallet, BigDecimal amount) {
        Objects.requireNonNull(wallet);
        wallet.setAmount(wallet.getAmount().add(amount));
        walletDao.update(wallet);
    }

    /**
     * Retrieves the wallet associated with the specified user email.
     *
     * @param email The email of the user.
     * @return The wallet associated with the user email.
     */
    public Wallet getByClientEmail(String email) {
        return walletDao.findByClientEmail(email);
    }

    /**
     * Retrieves the total balance of the specified wallet.
     *
     * @param walletId The ID of the wallet.
     * @return The total balance of the wallet.
     */
    public BigDecimal getTotalBalance(Long walletId) {
        Wallet wallet = getWalletById(walletId);
        if (wallet != null) {
            return wallet.getAmount();
        }
        return BigDecimal.ZERO;
    }

    /**
     * Retrieves the wallet with the specified ID.
     *
     * @param walletId The ID of the wallet.
     * @return The wallet with the specified ID.
     */
    public Wallet getWalletById(Long walletId) {
        return walletDao.find(walletId);
    }

    /**
     * Calculates the total income of the specified wallet.
     *
     * @param wallet The wallet to calculate the total income for.
     * @return The total income of the wallet.
     */
    public BigDecimal calculateTotalIncome(Wallet wallet) {
        BigDecimal totalIncome = BigDecimal.ZERO;

        for (Transaction transaction : wallet.getTransactions()) {
            if (transaction.getTypeTransaction() == TypeTransaction.INCOME) {
                totalIncome = totalIncome.add(transaction.getMoney());
            }
        }
        return totalIncome;
    }

    /**
     * Retrieves the transactions associated with the specified wallet ID.
     *
     * @param walletId The ID of the wallet.
     * @return The transactions associated with the wallet.
     */
    public List<Transaction> getTransactions(Long walletId) {
        Wallet wallet = getWalletById(walletId);
        return wallet.getTransactions();
    }

    /**
     * Calculates the budget progress of the specified wallet.
     *
     * @param walletId The ID of the wallet.
     * @return A map containing the total income, total expenses, and balance of the wallet.
     */
    public Map<String, BigDecimal> calculateBudgetProgress(Long walletId) {
        Wallet wallet = getWalletById(walletId);
        BigDecimal totalIncome = transactionService.calculateTotalIncome(wallet);
        BigDecimal totalExpenses = transactionService.calculateTotalExpenses(wallet);
        BigDecimal balance = totalIncome.subtract(totalExpenses);

        Map<String, BigDecimal> budgetProgress = new HashMap<>();
        budgetProgress.put("totalIncome", totalIncome);
        budgetProgress.put("totalExpenses", totalExpenses);
        budgetProgress.put("balance", balance);

        return budgetProgress;
    }

    /**
     * Checks if the total expenses of the specified wallet exceed the budget limit,
     * and sends a notification if so.
     *
     * @param walletId The ID of the wallet.
     */
    public void checkBudgetLimit(Long walletId) {
        Wallet wallet = getWalletById(walletId);
        BigDecimal totalExpenses = transactionService.calculateTotalExpenses(wallet);

        if (Math.abs(totalExpenses.compareTo(wallet.getBudgetLimit())) > 0) {
            notificationService.pushNotification(
                    wallet.getClient().getClientId(),
                    NotificationType.BUDGET_OVERLIMIT,
                    NotificationType.BUDGET_OVERLIMIT.getValue());
            notificationProducer.sendEmail(getWalletById(walletId).getClient().getEmail());
        }
    }

    /**
     * Adds a goal with the specified name and amount to the wallet.
     *
     * @param goal     The name of the goal.
     * @param money    The amount of money for the goal.
     * @param walletId The ID of the wallet.
     */
    public void addGoal(String goal, BigDecimal money, Long walletId) {
        Wallet wallet = getWalletById(walletId);
        Goal newGoal = new Goal();
        newGoal.setGoal(goal);
        newGoal.setMoneyGoal(money);
        wallet.addGoal(newGoal);
    }

    /**
     * Gets all goals for user's wallet.
     *
     * @param walletId The id of user's wallet.
     * @return all user's wallet goals.
     */
    public List<Goal> getAllGoals(Long walletId){
        Wallet wallet = getWalletById(walletId);
        return goalDao.getAllGoals(wallet.getWalletId());
    }


    /**
     * Changes the currency of the specified wallet.
     *
     * @param currency The new currency.
     * @param wallet   The wallet to update.
     */
    public void changeCurrency(Currency currency, Wallet wallet){
        switch (currency) {
            case CZK -> {
                if (wallet.getCurrency() == Currency.EUR) {
                    BigDecimal multipliedEURtoCZK = new BigDecimal("22");
                    wallet.setAmount(wallet.getAmount().multiply(multipliedEURtoCZK));
                    wallet.setBudgetLimit(wallet.getBudgetLimit().multiply(multipliedEURtoCZK));
                }
                if (wallet.getCurrency() == Currency.USD) {
                    BigDecimal multipliedUSDtoCZK = new BigDecimal("22.05");
                    wallet.setAmount(wallet.getAmount().multiply(multipliedUSDtoCZK));
                    wallet.setBudgetLimit(wallet.getBudgetLimit().multiply(multipliedUSDtoCZK));

                }
                wallet.setCurrency(Currency.CZK);
                walletDao.update(wallet);
            }
            case EUR -> {
                if (wallet.getCurrency() == Currency.CZK) {
                    BigDecimal multipliedCZKtoEur = new BigDecimal("0.042");
                    wallet.setAmount(wallet.getAmount().multiply(multipliedCZKtoEur));
                    wallet.setBudgetLimit(wallet.getAmount().multiply(multipliedCZKtoEur));
                }
                if (wallet.getCurrency() == Currency.USD) {
                    BigDecimal multipliedUSDtoEUR = new BigDecimal("0.93");
                    wallet.setAmount(wallet.getAmount().multiply(multipliedUSDtoEUR));
                    wallet.setBudgetLimit(wallet.getBudgetLimit().multiply(multipliedUSDtoEUR));
                }
                wallet.setCurrency(Currency.EUR);
                walletDao.update(wallet);
            }
            case USD -> {
                if (wallet.getCurrency() == Currency.EUR) {
                    BigDecimal multipliedEURtoUSD = new BigDecimal("1.07");
                    wallet.setAmount(wallet.getAmount().multiply(multipliedEURtoUSD));
                    wallet.setBudgetLimit(wallet.getBudgetLimit().multiply(multipliedEURtoUSD));
                }
                if (wallet.getCurrency() == Currency.CZK){
                    BigDecimal multipliedCZKToUSD = new BigDecimal("0.045");
                    wallet.setAmount(wallet.getAmount().multiply(multipliedCZKToUSD));
                    wallet.setBudgetLimit(wallet.getBudgetLimit().multiply(multipliedCZKToUSD));
                }
                wallet.setCurrency(Currency.USD);
                walletDao.update(wallet);
            }
        }
    }
}
