package csd230.lab1;

import csd230.lab1.entities.BookEntity;
import csd230.lab1.entities.CartEntity;
import csd230.lab1.entities.UserEntity;
import csd230.lab1.repositories.BookEntityRepository;
import csd230.lab1.repositories.CartEntityRepository;
import csd230.lab1.repositories.UserEntityRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
	public CommandLineRunner demo(
			BookEntityRepository bookRepository,
			CartEntityRepository cartRepository,
			UserEntityRepository userRepository) {
		return (args) -> {
			if (bookRepository.count() == 0) {
				BookEntity book1 = new BookEntity("Book One", 29.90, 5, "Author A");
				book1.setIsbn("111111");

				BookEntity book2 = new BookEntity("Book Two", 39.90, 3, "Author B");
				book2.setIsbn("222222");

				bookRepository.save(book1);
				bookRepository.save(book2);
			}

			cartRepository.findById(1L)
					.orElseGet(() -> cartRepository.save(new CartEntity()));

			BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

			if (userRepository.findByUsername("admin") == null) {
				UserEntity admin = new UserEntity("admin", passwordEncoder.encode("admin"), "ADMIN");
				userRepository.save(admin);
			}

			if (userRepository.findByUsername("user") == null) {
				UserEntity user = new UserEntity("user", passwordEncoder.encode("user"), "USER");
				userRepository.save(user);
			}

			System.out.println("Derived Query: " + bookRepository.findByIsbn("111111"));
			System.out.println("Custom Query: " + bookRepository.findByAuthorCustom("Author B"));
			System.out.println("Default users ready: admin/admin and user/user");
		};
	}
}