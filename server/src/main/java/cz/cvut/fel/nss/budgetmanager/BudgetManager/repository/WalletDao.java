package cz.cvut.fel.nss.budgetmanager.BudgetManager.repository;

import cz.cvut.fel.nss.budgetmanager.BudgetManager.model.Wallet;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class WalletDao extends BaseDao<Wallet>{
    /**
     * Constructs a new BaseDao instance with the given type parameter.
     *
     * the class type of the entity managed by this BaseDao.
     */
    public WalletDao() {
        super(Wallet.class);
    }

    public Wallet findSingletonWallet() {
        TypedQuery<Wallet> query = em.createQuery("SELECT w FROM Wallet w", Wallet.class);
        List<Wallet> wallets = query.getResultList();
        return wallets.isEmpty() ? null : wallets.get(0);
    }

    public Wallet findByClientEmail(String email){
        TypedQuery<Wallet> query = em.createNamedQuery("findByClientEmail", Wallet.class);
        query.setParameter("email", email);
        return query.getSingleResult();
    }
}
