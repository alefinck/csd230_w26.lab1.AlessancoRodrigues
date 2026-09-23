package csd230.lab1;

import csd230.lab1.entities.BookEntity;
import csd230.lab1.entities.CartEntity;
import csd230.lab1.repositories.BookEntityRepository;
import csd230.lab1.repositories.CartEntityRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional
public class RepositoryTests {

    @Autowired
    private BookEntityRepository bookRepository;

    @Autowired
    private CartEntityRepository cartRepository;

    @Test
    public void testCrudOperations() {
        BookEntity book = new BookEntity("Title 1", 19.99, 5, "Author Name");
        book.setIsbn("1234567890");

        BookEntity savedBook = bookRepository.save(book);
        assertThat(savedBook.getId()).isNotNull();

        Optional<BookEntity> foundBook = bookRepository.findById(savedBook.getId());
        assertThat(foundBook).isPresent();

        bookRepository.delete(savedBook);
        assertThat(bookRepository.findById(savedBook.getId())).isEmpty();
    }

    @Test
    public void testDerivedQuery() {
        BookEntity book = new BookEntity("Unique Title", 29.99, 2, "Test Author");
        book.setIsbn("0987654321");
        bookRepository.save(book);

        List<BookEntity> foundBooks = bookRepository.findByIsbn("0987654321");
        assertThat(foundBooks).isNotEmpty();
        assertThat(foundBooks.get(0).getIsbn()).isEqualTo("0987654321");
    }

    @Test
    public void testCartProductRelationship() {
        BookEntity book = new BookEntity("Cart Book", 9.99, 10, "Author");
        bookRepository.save(book);

        CartEntity cart = new CartEntity();
        cartRepository.save(cart);

        cart.addProduct(book);
        cartRepository.save(cart);

        Optional<CartEntity> foundCart = cartRepository.findById(cart.getId());
        assertThat(foundCart).isPresent();
        assertThat(foundCart.get().getProducts()).hasSize(1);
    }
}