package com.adm.cruddemo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.micrometer.common.lang.NonNull;
import jakarta.persistence.*;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="users")
public class User {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name="first_name", nullable = true)
    private String firstName;
    @Column(name="last_name", nullable = true)
    private String lastName;
    @Column(name="username", unique = true, nullable = false)
    private String userName;
    @Column(name="email", unique = true, nullable = false)
    private String email;
    @Column(name="password", nullable = false)
    private String password;
    @Column(name="enabled", nullable = false)
    private boolean enabled;
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(
                    name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(
                    name = "role_id", referencedColumnName = "id"))
    private Set<Role> roles;
    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Dashboard> dashboards;

    //Methods
    public void addRole(Role role) {
        this.roles.add(role);
    }
    public void addDashboard(Dashboard dashboard) {
        this.dashboards.add(dashboard);
        dashboard.setUser(this);
    }

    //Constructors
    public User(){}
    public User(String firstName, String lastName, String userName, String email, String password, boolean enabled) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.enabled = enabled;
    }
    public User(String firstName, String lastName, String userName, String email, String password, boolean enabled,
                Set<Role> roles, List<Dashboard> dashboards) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.enabled = enabled;
        this.roles = roles;
        this.dashboards = dashboards;
    }

    //Getters & Setters
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public boolean isEnabled() {
        return enabled;
    }
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
    public Collection<Role> getRoles() {
        return roles;
    }
    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }

}
