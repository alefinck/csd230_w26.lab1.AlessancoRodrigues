package csd230.lab1;

import csd230.lab1.entities.BookEntity;
import csd230.lab1.entities.CartEntity;
import csd230.lab1.repositories.BookEntityRepository;
import csd230.lab1.repositories.CartEntityRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
	public CommandLineRunner demo(BookEntityRepository bookRepository, CartEntityRepository cartRepository) {
		return (args) -> {
			BookEntity book1 = new BookEntity("Book One", 29.90, 5, "Author A");
			book1.setIsbn("111111");

			BookEntity book2 = new BookEntity("Book Two", 39.90, 3, "Author B");
			book2.setIsbn("222222");

			bookRepository.save(book1);
			bookRepository.save(book2);

			CartEntity cart1 = new CartEntity();
			cart1.addProduct(book1);
			cartRepository.save(cart1);

			CartEntity cart2 = new CartEntity();
			cart2.addProduct(book1);
			cart2.addProduct(book2);
			cartRepository.save(cart2);

			System.out.println("Derived Query: " + bookRepository.findByIsbn("111111"));
			System.out.println("Custom Query: " + bookRepository.findByAuthorCustom("Author B"));
		};
	}
}