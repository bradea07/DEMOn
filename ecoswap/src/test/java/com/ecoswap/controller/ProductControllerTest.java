
package com.ecoswap.controller;
import java.io.File;

import com.ecoswap.model.Product;
import com.ecoswap.model.User;
import com.ecoswap.repository.UserRepository;
import com.ecoswap.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
public class ProductControllerTest {

    @InjectMocks
    private ProductController productController;

    @Mock
    private ProductService productService;

    @Mock
    private UserRepository userRepository;

    private User mockUser;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setUsername("testuser");
        mockUser.setEmail("test@example.com");
        mockUser.setName("Test Name");
    }

    @Test
    public void testAddProduct_Success() throws IOException {
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        MockMultipartFile image = new MockMultipartFile("images", "image.jpg", "image/jpeg", "fake-image".getBytes());

        ResponseEntity<?> response = productController.addProduct(
                "Title", "Category", "Description", "Location", 10.0,
                "Brand", "New", "123456", 1L, List.of(image)
        );

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(((Map) response.getBody()).get("message").toString().contains("successfully"));
    }

    @Test
    public void testAddProduct_InvalidUser() {
        when(userRepository.findById(2L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = productController.addProduct(
                "Title", "Category", "Description", "Location", 10.0,
                "Brand", "New", "123456", 2L, new ArrayList<>()
        );

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    public void testAddProduct_NoImages() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        ResponseEntity<?> response = productController.addProduct(
                "Title", "Category", "Description", "Location", 10.0,
                "Brand", "New", "123456", 1L, new ArrayList<>()
        );

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    public void testGetAllProducts_ReturnsList() {
        when(productService.getAllProducts()).thenReturn(List.of(new Product(), new Product()));
        List<Product> products = productController.getAllProducts();
        assertEquals(2, products.size());
    }

    @Test
    public void testSearchProducts_ByKeyword_Success() {
        when(productService.searchProductsByTitle("bike")).thenReturn(List.of(new Product()));
        ResponseEntity<List<Product>> response = productController.searchProducts("bike");
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
    }

    @Test
    public void testGetProductById_NotFound() {
        when(productService.getProductById(99L)).thenReturn(Optional.empty());
        ResponseEntity<?> response = productController.getProductById(99L);
        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    public void testDeleteProduct_NotFound() {
        when(productService.getProductById(123L)).thenReturn(Optional.empty());
        ResponseEntity<?> response = productController.deleteProduct(123L);
        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    public void testGetProductsByUser_Exception() {
        when(productService.getProductsByUserId(1L)).thenThrow(new RuntimeException("DB error"));
        ResponseEntity<?> response = productController.getProductsByUser(1L);
        assertEquals(500, response.getStatusCodeValue());
    }

    @Test
    public void testSearchWithFilters_NoFilters() {
        when(productService.searchProductsWithFilters(null, null, null, null, null, null, null))
            .thenReturn(List.of(new Product()));
        ResponseEntity<List<Product>> response = productController.searchProductsWithFilters(null, null, null, null, null, null, null);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
    }

    @Test
public void testUpdateProduct_Success() throws IOException {
    Product product = new Product();
    product.setId(1L);
    when(productService.getProductById(1L)).thenReturn(Optional.of(product));
    when(productService.addProduct(any(Product.class))).thenReturn(product);

    MockMultipartFile image = new MockMultipartFile("images", "img.jpg", "image/jpeg", "img".getBytes());

    ResponseEntity<?> response = productController.updateProduct(
        1L, "Title", "Category", "Description", "Location", 10.0,
        "Brand", "New", "123456", List.of(image)
    );

    assertEquals(200, response.getStatusCodeValue());
    assertTrue(((Map) response.getBody()).get("message").toString().contains("updated"));
}


@Test
public void testUpdateProduct_ProductNotFound() {
    when(productService.getProductById(99L)).thenReturn(Optional.empty());

    ResponseEntity<?> response = productController.updateProduct(
        99L, "Title", "Category", "Desc", "Loc", 9.0,
        "Brand", "Used", "000", null
    );

    assertEquals(404, response.getStatusCodeValue());
}

@Test
public void testDeleteProduct_Success() {
    Product product = new Product();
    product.setTitle("Test Product");

    when(productService.getProductById(5L)).thenReturn(Optional.of(product));

    ResponseEntity<?> response = productController.deleteProduct(5L);

    assertEquals(200, response.getStatusCodeValue());
    assertTrue(((Map<?, ?>) response.getBody()).get("message").toString().contains("deleted"));
}



@Test
public void testDeleteProduct_Exception() {
    Product product = new Product();
    product.setId(10L);

    when(productService.getProductById(10L)).thenReturn(Optional.of(product));
    doThrow(new RuntimeException("delete fail")).when(productService).deleteProductById(10L);

    ResponseEntity<?> response = productController.deleteProduct(10L);

    assertEquals(500, response.getStatusCodeValue());
    assertTrue(((Map<?, ?>) response.getBody()).get("error").toString().contains("delete"));
}



@Test
public void testGetProductById_Success() {
    Product product = new Product();
    product.setTitle("Found Product");

    when(productService.getProductById(1L)).thenReturn(Optional.of(product));

    ResponseEntity<?> response = productController.getProductById(1L);

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(product, response.getBody());
}



@Test
public void testGetProductsByUserId_Success() {
    List<Product> userProducts = List.of(new Product(), new Product());

    when(productService.getProductsByUserId(1L)).thenReturn(userProducts);

    ResponseEntity<?> response = productController.getProductsByUser(1L);

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(userProducts, response.getBody());
}



@Test
public void testSearchProducts_Empty() {
    when(productService.searchProductsByTitle("nonexistent")).thenReturn(List.of());

    ResponseEntity<List<Product>> response = productController.searchProducts("nonexistent");

    assertEquals(200, response.getStatusCodeValue());
    assertTrue(response.getBody().isEmpty());
}



@Test
public void testSearchWithFilters_AllSet() {
    when(productService.searchProductsWithFilters("tv", "Electronics", "New", "NY", "Samsung", 100.0, 500.0))
        .thenReturn(List.of(new Product()));

    ResponseEntity<List<Product>> response = productController.searchProductsWithFilters(
        "tv", "Electronics", "New", "NY", "Samsung", 100.0, 500.0
    );

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(1, response.getBody().size());
}

@Test
public void testUpdateProduct_WithoutImages() {
    Product product = new Product();
    product.setId(1L);
    when(productService.getProductById(1L)).thenReturn(Optional.of(product));
    when(productService.addProduct(any(Product.class))).thenReturn(product);

    ResponseEntity<?> response = productController.updateProduct(
            1L, "Title", "Category", "Description", "Location", 10.0,
            "Brand", "New", "123456", null
    );

    assertEquals(200, response.getStatusCodeValue());
    assertTrue(((Map<?, ?>) response.getBody()).get("message").toString().contains("updated"));
}


@Test
public void testDeleteProduct_GeneralException() {
    Product product = new Product();
    product.setId(99L);
    when(productService.getProductById(99L)).thenReturn(Optional.of(product));
    doThrow(new IllegalStateException("general fail")).when(productService).deleteProductById(99L);

    ResponseEntity<?> response = productController.deleteProduct(99L);

    assertEquals(500, response.getStatusCodeValue());
    assertTrue(((Map<?, ?>) response.getBody()).get("error").toString().contains("general fail"));
}

@Test
public void testAddProduct_ImageSaveFails() throws IOException {
    when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

    MultipartFile image = mock(MultipartFile.class);
    when(image.isEmpty()).thenReturn(false);
    when(image.getOriginalFilename()).thenReturn("error.jpg");

    // aruncă o IOException când se apelează transferTo()
    doThrow(new IOException("disk full")).when(image).transferTo(any(File.class));

    ResponseEntity<?> response = productController.addProduct(
            "Title", "Category", "Description", "Location", 10.0,
            "Brand", "New", "123456", 1L, List.of(image)
    );

    assertEquals(500, response.getStatusCodeValue());
    assertTrue(response.getBody().toString().contains("Failed to save image"));
}

@Test
public void testUpdateProduct_ImageSaveFails() throws IOException {
    Product product = new Product();
    product.setId(1L);
    when(productService.getProductById(1L)).thenReturn(Optional.of(product));
    when(productService.addProduct(any(Product.class))).thenReturn(product);

    MultipartFile image = mock(MultipartFile.class);
    when(image.isEmpty()).thenReturn(false);
    when(image.getOriginalFilename()).thenReturn("bad.jpg");

    // simulăm o eroare la salvare
    doThrow(new IOException("upload error")).when(image).transferTo(any(File.class));

    ResponseEntity<?> response = productController.updateProduct(
            1L, "Title", "Category", "Description", "Location", 10.0,
            "Brand", "New", "123456", List.of(image)
    );

    assertEquals(500, response.getStatusCodeValue());
    assertTrue(response.getBody().toString().contains("Failed to save image"));
}



}
