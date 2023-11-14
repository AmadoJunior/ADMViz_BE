package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepo extends JpaRepository<UserEntity, Integer> { }
