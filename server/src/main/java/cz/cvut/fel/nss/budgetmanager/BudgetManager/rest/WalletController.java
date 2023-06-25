package cz.cvut.fel.nss.budgetmanager.BudgetManager.rest;

import cz.cvut.fel.nss.budgetmanager.BudgetManager.dto.TransactionResponseDTO;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.dto.WalletGoalResponseDTO;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.dto.WalletResponseDTO;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.exceptions.NotFoundException;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.model.Currency;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.model.Goal;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.model.Transaction;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.model.Wallet;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.security.util.SecurityUtils;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.service.WalletService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * REST controller for managing wallet-related operations.
 */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("rest/wallet")
public class WalletController {
    private final WalletService walletService;

    /**
     * Constructs a new WalletController with the provided WalletService and UserService.
     *
     * @param walletService The WalletService to be used.
     */
    @Autowired
    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    /**
     * Updates a wallet.
     *
     * @param updatedWallet The updated wallet object.
     * @return The ResponseEntity containing the updated WalletResponseDTO object and the appropriate status.
     */
    @PutMapping(value = "walletModification", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WalletResponseDTO> updateWallet(@RequestBody Wallet updatedWallet){
        Wallet wallet = SecurityUtils.getCurrentUser().getWallet();

        wallet.setAmount(updatedWallet.getAmount());
        wallet.setBudgetLimit(updatedWallet.getBudgetLimit());
        wallet.setCurrency(updatedWallet.getCurrency());
        walletService.updateWallet(wallet);

        ModelMapper modelMapper = new ModelMapper();
        WalletResponseDTO walletResponseDTO = modelMapper.map(wallet, WalletResponseDTO.class);
        return ResponseEntity.ok(walletResponseDTO);
    }

    /**
     * Adds money to a wallet.
     *
     * @param amount The amount of money to add.
     * @return The ResponseEntity with no content and the appropriate status.
     */
    @PutMapping(value = "/money")
    public ResponseEntity<Void> addMoneyToWallet(@RequestBody BigDecimal amount) {
        Wallet userWallet = SecurityUtils.getCurrentUser().getWallet();
        walletService.addMoney(userWallet, amount);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    /**
     * Adds a goal to a wallet.
     *
     * @param request The Goal object containing the goal details.
     * @return The ResponseEntity containing the updated Goal object and the appropriate status.
     * @throws NotFoundException if the goal is null.
     */
    @PostMapping(value = "/goal", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ExceptionHandler({NotFoundException.class})
    public ResponseEntity<WalletGoalResponseDTO> addGoal(@RequestBody Goal request) {
        Wallet wallet = SecurityUtils.getCurrentUser().getWallet();
        if (request == null){
            throw new NotFoundException("Goal must be not null!");
        }
        walletService.addGoal(request.getGoal(), request.getMoneyGoal(), wallet.getWalletId());
        walletService.updateWallet(wallet);
        ModelMapper modelMapper = new ModelMapper();
        WalletGoalResponseDTO walletGoalResponseDTO = modelMapper.map(request, WalletGoalResponseDTO.class);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(walletGoalResponseDTO);
    }

    /**
     * Get all user's wallet's goals;
     *
     * @return all goals of user's wallet.
     */

    @GetMapping(value = "/allGoals")
    public List<WalletGoalResponseDTO> getAllGoals(){
        Wallet wallet = SecurityUtils.getCurrentUser().getWallet();
        List<Goal> list = walletService.getAllGoals(wallet.getWalletId());
        ModelMapper modelMapper = new ModelMapper();
        return list.stream().map(goal -> modelMapper.map(goal, WalletGoalResponseDTO.class)).toList();
    }

    /**
     * Changes the currency of a wallet.
     *
     * @param currency The new currency.
     * @return The ResponseEntity with no content and the appropriate status.
     */
    @PutMapping(value = "/currency")
    public ResponseEntity<Void> changeCurrency(@RequestParam("currency")Currency currency){
        Wallet userWallet = SecurityUtils.getCurrentUser().getWallet();
        walletService.changeCurrency(currency, userWallet);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    /**
     * Retrieves the wallet of the current user.
     *
     * @return The ResponseEntity containing the WalletResponseDTO object and the appropriate status.
     */
    @GetMapping(value = "/myWallet")
    public ResponseEntity<WalletResponseDTO> getWallet() {
        Wallet wallet = SecurityUtils.getCurrentUser().getWallet();
        ModelMapper modelMapper = new ModelMapper();
        WalletResponseDTO walletResponseDTO = modelMapper.map(wallet, WalletResponseDTO.class);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(walletResponseDTO);
    }

}
