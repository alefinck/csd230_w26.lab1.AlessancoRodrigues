package csd230.lab1.repositories;

import csd230.lab1.entities.BookEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookEntityRepository extends JpaRepository<BookEntity, Long> {

    List<BookEntity> findByIsbn(String isbn);

    @Query("SELECT b FROM BookEntity b WHERE b.author = :author")
    List<BookEntity> findByAuthorCustom(@Param("author") String author);
}