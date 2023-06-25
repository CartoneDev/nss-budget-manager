package cz.cvut.fel.nss.budgetmanager.BudgetManager.security.service;

import cz.cvut.fel.nss.budgetmanager.BudgetManager.model.User;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.repository.UserDao;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.repository.security.AuthTokenDao;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.security.token.AuthToken;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@AllArgsConstructor
public class TokenValidatorService {
    private static final String SECRET_KEY = "secret_key";
    private final AuthTokenDao authTokenDao;
    private final UserDao userDao;

    /**
     * Validates a token by checking its expiration date and comparing it with the stored hash.
     *
     * @param hash The token hash to validate.
     * @return true if the token is valid, false otherwise.
     */
    public boolean validateToken(String hash) {
        User user = userDao.findByEmail(hash);

        if (user == null) {
            log.info(String.format("User is null. User with email does not exist: %s", hash));
            return false;
        }

        AuthToken authToken = authTokenDao.findActiveUserToken(user.getClientId()).get(0);

        LocalDateTime currentDate = LocalDateTime.now();
        LocalDateTime expirationDate = authToken.getExpirationDate();

        if (expirationDate.isBefore(currentDate)) {
            return false;
        }

        String hashFromDb = authToken.getToken();
        return hash.equals(hashFromDb);
    }
}
