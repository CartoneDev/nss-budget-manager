package cz.cvut.fel.nss.budgetmanager.BudgetManager.repository;

import cz.cvut.fel.nss.budgetmanager.BudgetManager.model.Goal;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class GoalDao extends BaseDao<Goal> {

    /**
     * Constructs a new BaseDao instance with the given type parameter.
     * 2
     * the class type of the entity managed by this BaseDao.
     */
    public GoalDao() {
        super(Goal.class);
    }

    public List<Goal> getAllGoals(Long Id){
        TypedQuery<Goal> query = em.createQuery("SELECT g from Goal g where g.wallet.walletId = :Id", Goal.class);
        query.setParameter("Id", Id);
        return query.getResultList();
    }
}
