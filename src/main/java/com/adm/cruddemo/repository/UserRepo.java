package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.UserEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class UserRepo implements IUserRepo{
    private EntityManager entityManager;
    @Autowired
    public UserRepo(EntityManager entityManager){
        this.entityManager = entityManager;
    }
    @Override
    @Transactional
    public void save(UserEntity user) {
        entityManager.persist(user);
    }
    @Override
    @Transactional
    public void update(UserEntity user) {
        entityManager.merge(user);
    }
    @Override
    @Transactional
    public void remove(UserEntity user) {
        entityManager.remove(user);
    }
    @Override
    public UserEntity findById(int id) {
        return entityManager.find(UserEntity.class, id);
    }
    @Override
    public List<UserEntity> getAllUsers() {
        TypedQuery<UserEntity>  usersQuery = entityManager.createQuery("From UserEntity", UserEntity.class);
        return usersQuery.getResultList();
    }
    @Override
    public List<UserEntity> findByFirstName(String firstName) {
        TypedQuery<UserEntity> firstNameQuery = entityManager.createQuery("From UserEntity WHERE firstName=:inputData", UserEntity.class);
        firstNameQuery.setParameter("inputData", firstName);
        return firstNameQuery.getResultList();
    }
}
