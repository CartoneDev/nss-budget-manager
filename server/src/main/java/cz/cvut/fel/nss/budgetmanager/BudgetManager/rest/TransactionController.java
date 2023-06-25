package cz.cvut.fel.nss.budgetmanager.BudgetManager.rest;

import cz.cvut.fel.nss.budgetmanager.BudgetManager.dto.TransactionResponseDTO;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.exceptions.NotFoundException;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.model.Category;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.model.Transaction;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.model.Wallet;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.repository.TransactionRepository;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.security.util.SecurityUtils;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.service.CategoryService;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.service.TransactionService;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.service.WalletService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * REST controller for managing transactions.
 */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("rest/transaction")
public class TransactionController {
    private final TransactionService transactionService;
    private final WalletService walletService;
    private final CategoryService categoryService;
    private final TransactionRepository transactionRepository;

    /**
     * Constructs a new TransactionController with the provided services and repository.
     *
     * @param transactionService     The TransactionService to be used.
     * @param walletService          The WalletService to be used.
     * @param categoryService        The CategoryService to be used.
     * @param transactionRepository  The TransactionRepository to be used.
     */
    @Autowired
    public TransactionController(TransactionService transactionService, WalletService walletService,
                                 CategoryService categoryService, TransactionRepository transactionRepository){
        this.transactionService = transactionService;
        this.walletService = walletService;
        this.categoryService = categoryService;
        this.transactionRepository = transactionRepository;
    }

    /**
     * Retrieves all transactions.
     *
     * @return The list of TransactionResponseDTO objects.
     */
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<TransactionResponseDTO> getAllTransactions() {
        Wallet wallet = SecurityUtils.getCurrentUser().getWallet();
        List<Transaction> list = walletService.getTransactions(wallet.getWalletId());
        ModelMapper modelMapper = new ModelMapper();
        return list.stream().map(transaction -> modelMapper.map(transaction, TransactionResponseDTO.class)).toList();
    }


    /**
     * Retrieves a transaction by its ID.
     *
     * @param id The ID of the transaction.
     * @return The ResponseEntity containing the retrieved TransactionResponseDTO object and the appropriate status.
     * @throws NotFoundException if the transaction with the specified ID is not found.
     */
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TransactionResponseDTO> getTransactionById(@PathVariable Long id) {
        Transaction transaction = transactionService.findTransactionById(id);
        if (transaction == null) {
            throw new NotFoundException("Transaction not found");
        }
        ModelMapper modelMapper = new ModelMapper();
        TransactionResponseDTO transactionResponseDTO = modelMapper.map(transaction, TransactionResponseDTO.class);

        return ResponseEntity.status(HttpStatus.OK).body(transactionResponseDTO);
    }

    /**
     * Creates a new transaction.
     *
     * @param transaction The transaction to create.
     * @return The ResponseEntity containing the created TransactionResponseDTO object and the appropriate status.
     */
    @PostMapping(value = "/new", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TransactionResponseDTO> createTransaction(@RequestBody Transaction transaction) {
        Wallet wallet = SecurityUtils.getCurrentUser().getWallet();
        Category category = categoryService.getCategoryByName(transaction.getCategory().getName());
        ModelMapper modelMapper = new ModelMapper();
        Transaction.Builder builder = new Transaction.Builder();
        builder
                .typeTransaction(transaction.getTypeTransaction())
                .category(category)
                .transDate()
                .wallet(wallet)
                .money(transaction.getMoney(), transaction.getTypeTransaction())
                .name(transaction.getDescription());
        transactionService.persist(builder.build());
        TransactionResponseDTO transactionResponseDTO = modelMapper.map(builder.build(), TransactionResponseDTO.class);
        wallet.addTransaction(transaction);
        walletService.updateWallet(wallet);
        walletService.checkBudgetLimit(wallet.getWalletId());
        walletService.updateWallet(wallet);
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionResponseDTO);
    }

    /**
     * Updates an existing transaction.
     *
     * @param id                The ID of the transaction to update.
     * @param updatedTransaction The updated transaction object.
     * @return The ResponseEntity containing the updated TransactionResponseDTO object and the appropriate status.
     * @throws NotFoundException if the transaction with the specified ID is not found.
     */
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TransactionResponseDTO> updateTransaction(@PathVariable Long id, @RequestBody Transaction updatedTransaction) {
        Transaction transaction = transactionService.findTransactionById(id);
        if (transaction == null) {
            throw new NotFoundException("Transaction not found");
        }
        transaction.setDescription(updatedTransaction.getDescription());
        transaction.setCategory(updatedTransaction.getCategory());
        transaction.setMoney(updatedTransaction.getMoney());
        transaction.setTypeTransaction(updatedTransaction.getTypeTransaction());
        transaction.setDate(updatedTransaction.getDate());

        ModelMapper modelMapper = new ModelMapper();
        TransactionResponseDTO transactionResponseDTO = modelMapper.map(transactionService.update(transaction),
                TransactionResponseDTO.class);
        return ResponseEntity.ok(transactionResponseDTO);
    }

    /**
     * Deletes a transaction.
     *
     * @param id The ID of the transaction to delete.
     * @return The ResponseEntity with no content and the appropriate status.
     * @throws NotFoundException if the transaction with the specified ID is not found.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        Transaction transaction = transactionService.findTransactionById(id);
        if (transaction == null) {
            throw new NotFoundException("Transaction not found");
        }
        transactionService.deleteTransaction(transaction.getTransId());
        return ResponseEntity.noContent().build();
    }

    /**
     * Searches for transactions based on the specified parameters.
     *
     * @param category    The category of the transactions (optional).
     * @param date        The date of the transactions (optional).
     * @param description The description of the transactions (optional).
     * @param amount      The amount of the transactions (optional).
     * @return The list of TransactionResponseDTO objects matching the search criteria.
     */
    @GetMapping("/search")
    public List<TransactionResponseDTO> searchTransaction(@RequestParam(required = false) Category category,
                                               @RequestParam(required = false) LocalDate date,
                                               @RequestParam(required = false) String description,
                                               @RequestParam(required = false) BigDecimal amount){
        List<Transaction> list = transactionService.searchTransactions(category, date, description, amount);
        ModelMapper modelMapper = new ModelMapper();
        return list.stream().map(transaction -> modelMapper.map(transaction, TransactionResponseDTO.class)).toList();
    }

    /**
     * Exports transactions to a text file.
     *
     * @return The ResponseEntity containing the exported file resource and the appropriate status.
     */
    @GetMapping("/export")
    public ResponseEntity<Resource> exportTransaction() {
        try {
            Resource fileResource = transactionService.exportTransactionsToTxtFile();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"transactions.txt\"")
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(fileResource);
        } catch (IOException e) {
            // Handle the exception accordingly
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Retrieves transactions by description.
     *
     * @param description The description of the transactions.
     * @return The list of Transaction objects matching the description.
     */
    @GetMapping(value = "/findByDescription/{description}", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Transaction> findByDescription(@PathVariable String description) {
        return transactionRepository.findTransactionByDescription(description);
    }
}
