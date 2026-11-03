package csd230.lab1;

import com.github.javafaker.Faker;
import csd230.lab1.entities.*;
import csd230.lab1.repositories.*;
import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class Application implements CommandLineRunner {
	private final ProductEntityRepository productRepository;
	private final UserEntityRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public Application(ProductEntityRepository productRepository,
					   UserEntityRepository userRepository,
					   PasswordEncoder passwordEncoder) {
		this.productRepository = productRepository;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Override
	@Transactional
	public void run(String... args) {
		Faker faker = new Faker();
		// Seed 10 random books
		for (int i = 0; i < 10; i++) {
			productRepository.save(new BookEntity(
					faker.book().title(),
					Double.parseDouble(faker.commerce().price()),
					10,
					faker.book().author()
			));
		}

		// Create Default Users
		userRepository.save(new UserEntity("admin", passwordEncoder.encode("admin"), "ADMIN"));
		userRepository.save(new UserEntity("user", passwordEncoder.encode("user"), "USER"));
		System.out.println("REST API Lab Ready: admin/admin and user/user created.");
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/api/**").allowedOrigins("*").allowedMethods("GET", "POST", "PUT", "DELETE");
			}
		};
	}
}