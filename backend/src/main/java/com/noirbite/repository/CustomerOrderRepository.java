package com.noirbite.repository;
import com.noirbite.model.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
    List<CustomerOrder> findByPhoneOrderByCreatedAtDesc(String phone);
    List<CustomerOrder> findAllByOrderByCreatedAtDesc();
}
