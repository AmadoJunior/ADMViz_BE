package com.adm.cruddemo.excerpt;

import com.adm.cruddemo.repository.UserRepo;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {UserRepo.class})
public interface UserProjection {
}
