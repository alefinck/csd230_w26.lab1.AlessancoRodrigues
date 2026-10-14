package csd230.lab1.controllers;

import csd230.lab1.entities.BookEntity;
import csd230.lab1.entities.CartEntity;
import csd230.lab1.entities.OrderEntity;
import csd230.lab1.entities.ProductEntity;
import csd230.lab1.entities.PublicationEntity;
import csd230.lab1.entities.UserEntity;
import csd230.lab1.repositories.BookEntityRepository;
import csd230.lab1.repositories.CartEntityRepository;
import csd230.lab1.repositories.OrderEntityRepository;
import csd230.lab1.repositories.UserEntityRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.security.Principal;
import java.time.LocalDateTime;

@Controller
@RequestMapping("/cart")
public class CartController {

    private final CartEntityRepository cartRepository;
    private final BookEntityRepository bookRepository;
    private final OrderEntityRepository orderRepository;
    private final UserEntityRepository userRepository;

    public CartController(CartEntityRepository cartRepository,
                          BookEntityRepository bookRepository,
                          OrderEntityRepository orderRepository,
                          UserEntityRepository userRepository) {
        this.cartRepository = cartRepository;
        this.bookRepository = bookRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    private CartEntity getCartForCurrentUser(Principal principal) {
        String username = principal.getName();
        UserEntity user = userRepository.findByUsername(username);
        CartEntity cart = cartRepository.findByUser(user);
        if (cart == null) {
            cart = new CartEntity();
            cart.setUser(user);
            cartRepository.save(cart);
        }
        return cart;
    }

    @GetMapping
    public String viewCart(Model model, Principal principal) {
        CartEntity cart = getCartForCurrentUser(principal);
        model.addAttribute("cart", cart);
        return "cartDetails";
    }

    @GetMapping("/add/{bookId}")
    public String addToCart(@PathVariable Long bookId, Principal principal) {
        CartEntity cart = getCartForCurrentUser(principal);
        BookEntity book = bookRepository.findById(bookId).orElse(null);
        if (book != null) {
            cart.addProduct(book);
            cartRepository.save(cart);
        }
        return "redirect:/books";
    }

    @GetMapping("/remove/{bookId}")
    public String removeFromCart(@PathVariable Long bookId, Principal principal) {
        CartEntity cart = getCartForCurrentUser(principal);
        BookEntity book = bookRepository.findById(bookId).orElse(null);
        if (book != null) {
            cart.getProducts().remove(book);
            cartRepository.save(cart);
        }
        return "redirect:/cart";
    }

    @PostMapping("/checkout")
    public String checkout(Principal principal) {
        CartEntity cart = getCartForCurrentUser(principal);

        if (cart.getProducts().isEmpty()) {
            return "redirect:/cart";
        }

        OrderEntity order = new OrderEntity();
        order.setOrderDate(LocalDateTime.now());

        double total = 0.0;

        for (ProductEntity product : cart.getProducts()) {
            total += product.getPrice();
            order.addProduct(product);

            if (product instanceof PublicationEntity publication) {
                if (publication.getCopies() > 0) {
                    publication.setCopies(publication.getCopies() - 1);
                }
            }
        }

        order.setTotalAmount(total);

        orderRepository.save(order);

        cart.getProducts().clear();
        cartRepository.save(cart);

        return "redirect:/cart/order/" + order.getId();
    }

    @GetMapping("/order/{orderId}")
    public String viewOrder(@PathVariable Long orderId, Model model) {
        OrderEntity order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return "redirect:/books";
        }
        model.addAttribute("order", order);
        return "orderDetails";
    }
}