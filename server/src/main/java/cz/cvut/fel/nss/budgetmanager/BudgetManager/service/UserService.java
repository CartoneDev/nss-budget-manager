package cz.cvut.fel.nss.budgetmanager.BudgetManager.service;

import cz.cvut.fel.nss.budgetmanager.BudgetManager.model.User;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.repository.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
//@Transactional ??
public class UserService {
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;


    @Autowired
    public UserService(UserDao userDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Boolean createUser(String email, String username, String password){
        Objects.requireNonNull(email);
        Objects.requireNonNull(username);
        Objects.requireNonNull(password);

        boolean result = false;
        if (email.isEmpty() ||  username.isEmpty() || password.isEmpty()) {
            return result;
        } else {
            User user  = new User(email, username, password);
            user.encodePassword(passwordEncoder);
            userDao.persist(user);
            result = true;

        }
        return result;

    }

    @Transactional //readonly ??
    public User findUserByEmail(String userEmail) {
        return userDao.findByEmail(userEmail);
    }

}
