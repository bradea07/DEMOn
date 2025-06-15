-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: ecoswap
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `product_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6sgu5npe8ug4o42bf9j71x20c` (`product_id`),
  KEY `FKk7du8b8ewipawnnpg76d55fus` (`user_id`),
  CONSTRAINT `FK6sgu5npe8ug4o42bf9j71x20c` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKk7du8b8ewipawnnpg76d55fus` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (40,'2025-06-13 13:25:53.452630',5,39),(41,'2025-06-13 13:53:51.208914',6,39),(45,'2025-06-13 14:14:14.623156',11,39);
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `sender_id` bigint NOT NULL,
  `receiver_id` bigint NOT NULL,
  `product_id` bigint DEFAULT NULL,
  `content` text NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_read` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  KEY `fk_messages_product` (`product_id`),
  CONSTRAINT `fk_messages_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=263 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (257,28,15,9,'salut','2025-06-13 10:19:37',_binary '\0'),(258,28,15,9,'pret?','2025-06-13 10:19:38',_binary '\0'),(259,39,28,5,'hey ','2025-06-13 10:25:42',_binary '\0'),(260,39,1,6,'hello is this still available?','2025-06-13 10:54:00',_binary ''),(261,39,15,11,'hello is this still availabale?','2025-06-13 11:04:39',_binary '\0'),(262,39,1,6,'sall','2025-06-15 13:16:03',_binary '');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `is_read` bit(1) NOT NULL,
  `message` varchar(500) NOT NULL,
  `rating_score` int DEFAULT NULL,
  `type` enum('PRODUCT_FAVORITED','NEW_MESSAGE','RATING_RECEIVED') NOT NULL,
  `product_id` bigint DEFAULT NULL,
  `trigger_user_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKix2l63ilcu384ke5kprwx1xy` (`product_id`),
  KEY `FK880krosxj6pw42rtv9clv3d2g` (`trigger_user_id`),
  KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`),
  CONSTRAINT `FK880krosxj6pw42rtv9clv3d2g` FOREIGN KEY (`trigger_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKix2l63ilcu384ke5kprwx1xy` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (38,'2025-06-03 00:50:25.078634',_binary '','ioan added your product \"Logitech MX Master 3S Wireless Mouse\" to their favorites',NULL,'PRODUCT_FAVORITED',109,1,13),(39,'2025-06-03 00:53:39.358026',_binary '','ioan sent you a message about \"Logitech MX Master 3S Wireless Mouse\"',NULL,'NEW_MESSAGE',109,1,13),(47,'2025-06-03 10:21:14.793632',_binary '','ioan added your product \"Logitech MX Master 3S Wireless Mouse\" to their favorites',NULL,'PRODUCT_FAVORITED',109,1,13),(48,'2025-06-03 10:21:26.441418',_binary '','ioan sent you a message about \"Logitech MX Master 3S Wireless Mouse\"',NULL,'NEW_MESSAGE',109,1,13),(49,'2025-06-03 10:24:48.536565',_binary '','ioan sent you a message about \"2121\"',NULL,'NEW_MESSAGE',76,1,13),(53,'2025-06-03 11:08:05.598649',_binary '','ioan sent you a message about \"2121\"',NULL,'NEW_MESSAGE',76,1,13),(54,'2025-06-03 11:12:49.857711',_binary '','ioan sent you a message about \"Logitech MX Master 3S Wireless Mouse\"',NULL,'NEW_MESSAGE',109,1,13),(57,'2025-06-03 11:16:07.223951',_binary '','cari28 sent you a message about \"231312\"',NULL,'NEW_MESSAGE',95,28,13),(58,'2025-06-03 11:18:46.232493',_binary '','cari28 sent you a message about \"Logitech MX Master 3S Wireless Mouse\"',NULL,'NEW_MESSAGE',109,28,13),(59,'2025-06-03 11:18:58.002304',_binary '','cari28 sent you a message about \"Logitech MX Master 3S Wireless Mouse\"',NULL,'NEW_MESSAGE',109,28,13),(64,'2025-06-03 12:13:00.779779',_binary '','cari28 sent you a message about \"2121\"',NULL,'NEW_MESSAGE',76,28,13),(69,'2025-06-03 12:24:01.257392',_binary '','cari28 added your product \"Logitech MX Master 3S Wireless Mouse\" to their favorites',NULL,'PRODUCT_FAVORITED',109,28,13),(70,'2025-06-03 15:55:12.293527',_binary '','cari28 added your product \"Logitech MX Master 3S Wireless Mouse\" to their favorites',NULL,'PRODUCT_FAVORITED',109,28,13),(71,'2025-06-03 16:14:51.343652',_binary '','cari28 sent you a message about \"2121\"',NULL,'NEW_MESSAGE',76,28,13),(72,'2025-06-03 16:16:37.766558',_binary '','cari28 sent you a message about \"Logitech MX Master 3S Wireless Mouse\"',NULL,'NEW_MESSAGE',109,28,13),(73,'2025-06-03 16:18:51.662251',_binary '','cari28 sent you a message about \"Logitech MX Master 3S Wireless Mouse\"',NULL,'NEW_MESSAGE',109,28,13),(74,'2025-06-03 16:20:50.115267',_binary '','cari28 added your product \"Logitech MX Master 3S Wireless Mouse\" to their favorites',NULL,'PRODUCT_FAVORITED',109,28,13),(75,'2025-06-03 16:20:52.817806',_binary '','cari28 added your product \"Logitech MX Master 3S Wireless Mouse\" to their favorites',NULL,'PRODUCT_FAVORITED',109,28,13),(76,'2025-06-03 16:20:58.817342',_binary '','cari28 added your product \"Logitech MX Master 3S Wireless Mouse\" to their favorites',NULL,'PRODUCT_FAVORITED',109,28,13),(77,'2025-06-03 16:22:18.629124',_binary '','cari28 sent you a message about \"Logitech MX Master 3S Wireless Mouse\"',NULL,'NEW_MESSAGE',109,28,13),(78,'2025-06-03 16:24:59.175601',_binary '','cari28 added your product \"Logitech MX Master 3S Wireless Mouse\" to their favorites',NULL,'PRODUCT_FAVORITED',109,28,13),(89,'2025-06-04 02:19:38.871545',_binary '','ioan sent you a message about \"telefon\"',NULL,'NEW_MESSAGE',97,1,13),(90,'2025-06-04 02:29:38.018650',_binary '','sapte sent you a message about \"ceapa\"',NULL,'NEW_MESSAGE',58,13,15),(91,'2025-06-04 02:37:32.299719',_binary '','12345 sent you a message about \"R\"',NULL,'NEW_MESSAGE',113,17,15),(92,'2025-06-04 02:37:40.020573',_binary '','12345 gave you a 5-star rating',5,'RATING_RECEIVED',NULL,17,15),(94,'2025-06-04 03:07:24.123027',_binary '','cari28 sent you a message about \"Logitech MX Master 3S Wireless Mouse\"',NULL,'NEW_MESSAGE',109,28,13),(98,'2025-06-08 23:27:04.275562',_binary '','ioan gave you a 2-star rating',2,'RATING_RECEIVED',NULL,1,13),(99,'2025-06-09 00:50:45.950859',_binary '','ioan added your product \"2121\" to their favorites',NULL,'PRODUCT_FAVORITED',76,1,13),(100,'2025-06-10 00:55:05.493591',_binary '','ioan sent you a message about \"ceapa\"',NULL,'NEW_MESSAGE',58,1,15),(102,'2025-06-10 11:05:59.436285',_binary '','ioan sent you a message about \"ceapa\"',NULL,'NEW_MESSAGE',58,1,15),(103,'2025-06-10 11:08:23.979103',_binary '','test gave you a 5-star rating',5,'RATING_RECEIVED',NULL,39,13),(104,'2025-06-10 11:28:51.325776',_binary '','test added your product \"231312\" to their favorites',NULL,'PRODUCT_FAVORITED',95,39,13),(107,'2025-06-10 11:49:39.924662',_binary '','test sent you a message about \"Logitech MX Master 3S Wireless Mouse\"',NULL,'NEW_MESSAGE',109,39,13),(108,'2025-06-10 11:50:24.181828',_binary '','sapte sent you a message about \"Logitech MX Master 3S Wireless Mouse\"',NULL,'NEW_MESSAGE',109,13,39),(109,'2025-06-10 12:15:51.170273',_binary '','sapte sent you a message about \"1111111111111111\"',NULL,'NEW_MESSAGE',117,13,39),(110,'2025-06-10 12:16:13.423486',_binary '','sapte added your product \"1111111111111111\" to their favorites',NULL,'PRODUCT_FAVORITED',117,13,39),(116,'2025-06-10 12:19:44.557252',_binary '','test sent you a message about \"telefon\"',NULL,'NEW_MESSAGE',97,39,13),(128,'2025-06-10 13:53:16.106320',_binary '','test sent you a message about \"tetest\"',NULL,'NEW_MESSAGE',111,39,13),(129,'2025-06-10 13:53:27.036853',_binary '','test sent you a message about \"tetest\"',NULL,'NEW_MESSAGE',111,39,13),(130,'2025-06-10 13:53:28.960594',_binary '','test sent you a message about \"tetest\"',NULL,'NEW_MESSAGE',111,39,13),(131,'2025-06-10 13:54:02.391084',_binary '','test sent you a message about \"tetest\"',NULL,'NEW_MESSAGE',111,39,13),(133,'2025-06-10 13:58:13.229083',_binary '','test sent you a message about \"test\"',NULL,'NEW_MESSAGE',115,39,1),(134,'2025-06-10 13:58:32.259668',_binary '','test sent you a message about \"test\"',NULL,'NEW_MESSAGE',115,39,1),(135,'2025-06-10 14:00:05.336498',_binary '','test sent you a message about \"telefon\"',NULL,'NEW_MESSAGE',97,39,13),(137,'2025-06-10 14:33:22.141473',_binary '','ioan gave you a 5-star rating',5,'RATING_RECEIVED',NULL,1,39),(139,'2025-06-10 14:54:48.554824',_binary '\0','test sent you a message about \"1\"',NULL,'NEW_MESSAGE',118,39,13),(140,'2025-06-10 14:55:08.729380',_binary '\0','test added your product \"1\" to their favorites',NULL,'PRODUCT_FAVORITED',118,39,13),(141,'2025-06-11 13:12:22.922331',_binary '','test added your product \"R\" to their favorites',NULL,'PRODUCT_FAVORITED',113,39,15),(142,'2025-06-11 13:12:24.882023',_binary '','test added your product \"R\" to their favorites',NULL,'PRODUCT_FAVORITED',113,39,15),(143,'2025-06-11 13:17:00.675877',_binary '','test added your product \"ronaldo\" to their favorites',NULL,'PRODUCT_FAVORITED',101,39,1),(144,'2025-06-11 14:09:18.077521',_binary '\0','test sent you a message about \"1\"',NULL,'NEW_MESSAGE',118,39,13),(150,'2025-06-13 13:19:37.039254',_binary '\0','cari28 sent you a message about \"iPhone XR – 64GB, Red\"',NULL,'NEW_MESSAGE',9,28,15),(151,'2025-06-13 13:19:38.193254',_binary '\0','cari28 sent you a message about \"iPhone XR – 64GB, Red\"',NULL,'NEW_MESSAGE',9,28,15),(152,'2025-06-13 13:25:41.966679',_binary '\0','test sent you a message about \"Samsung Galaxy S9 (Black)\"',NULL,'NEW_MESSAGE',5,39,28),(153,'2025-06-13 13:25:53.453630',_binary '\0','test added your product \"Samsung Galaxy S9 (Black)\" to their favorites',NULL,'PRODUCT_FAVORITED',5,39,28),(154,'2025-06-13 13:53:51.209912',_binary '\0','test added your product \"iPhone 11 – 64GB, Black\" to their favorites',NULL,'PRODUCT_FAVORITED',6,39,1),(155,'2025-06-13 13:54:00.331967',_binary '\0','test sent you a message about \"iPhone 11 – 64GB, Black\"',NULL,'NEW_MESSAGE',6,39,1),(156,'2025-06-13 14:02:14.947036',_binary '\0','test added your product \"Motorola G Power – 64GB, Silver\" to their favorites',NULL,'PRODUCT_FAVORITED',11,39,15),(157,'2025-06-13 14:04:39.503046',_binary '\0','test sent you a message about \"Motorola G Power – 64GB, Silver\"',NULL,'NEW_MESSAGE',11,39,15),(158,'2025-06-13 14:11:06.584699',_binary '\0','test added your product \"Motorola G Power – 64GB, Silver\" to their favorites',NULL,'PRODUCT_FAVORITED',11,39,15),(159,'2025-06-13 14:12:08.673286',_binary '\0','test added your product \"Motorola G Power – 64GB, Silver\" to their favorites',NULL,'PRODUCT_FAVORITED',11,39,15),(160,'2025-06-13 14:14:14.624156',_binary '\0','test added your product \"Motorola G Power – 64GB, Silver\" to their favorites',NULL,'PRODUCT_FAVORITED',11,39,15),(161,'2025-06-15 16:16:02.632269',_binary '\0','test sent you a message about \"iPhone 11 – 64GB, Black\"',NULL,'NEW_MESSAGE',6,39,1);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_image_urls`
--

DROP TABLE IF EXISTS `product_image_urls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_image_urls` (
  `product_id` bigint NOT NULL,
  `image_urls` varchar(255) DEFAULT NULL,
  KEY `FK8cnn3ywnlxdlahpdoj6riblst` (`product_id`),
  CONSTRAINT `FK8cnn3ywnlxdlahpdoj6riblst` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_image_urls`
--

LOCK TABLES `product_image_urls` WRITE;
/*!40000 ALTER TABLE `product_image_urls` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_image_urls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `product_id` bigint NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  KEY `FKqnq71xsohugpqwf3c9gxmsuy` (`product_id`),
  CONSTRAINT `FKqnq71xsohugpqwf3c9gxmsuy` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (95,'/uploads/0cbe0d6b-51ca-497c-afa7-d5d69428d8cc-download.jpeg'),(101,'/uploads/01152db9-eb96-42fe-a1b2-d2ac1dd2f7da-background3.png'),(106,'/uploads/845239f7-63bb-4fd9-9cba-1ce115e0fa77-WhatsApp Image 2025-04-13 at 19.30.34_ef22b13f.jpg'),(107,'/uploads/b3278b70-b733-4411-9826-96529fd6224b-WhatsApp Image 2025-04-13 at 19.30.34_ef22b13f.jpg'),(108,'/uploads/4a245b90-0608-4ac8-9369-a2ccd5fb94a8-Screenshot 2024-02-18 151819.png'),(109,'/uploads/ecda9896-fa67-4376-87f3-ac014c8143c7-Screenshot 2024-03-15 003656.png'),(109,'/uploads/661ffc67-3ac4-4072-b57c-7c0b7c10c65d-Screenshot 2024-03-13 182715.png'),(109,'/uploads/91e77e2d-1c02-4798-a5f6-68b025b9ca7b-Screenshot 2024-03-15 223736.png'),(109,'/uploads/691994a3-74e4-4dce-8656-66fe9e3e3f7b-Screenshot 2024-03-10 162244.png'),(91,'/uploads/f7bbc50b-5bc7-4eaa-9841-b3e82d87c09a-Screenshot 2024-03-10 162244.png'),(111,'/uploads/ecdf47d5-c771-465b-8371-dbd8a9cbe149-Screenshot 2024-02-18 145628.png'),(58,'/uploads/0a474545-a381-4114-9475-8d89b4be28e1-Screenshot 2024-06-03 190334.png'),(113,'/uploads/52989f48-b68e-42f2-9a4d-9dd1d34f87f1-Screenshot 2024-01-27 225810.png'),(115,'/uploads/8363bf72-bf44-41fd-8fab-2a97b3806265-Screenshot 2024-03-15 223736.png'),(116,'/uploads/d1fcf381-af80-428a-813f-aa0faae82e6b-Screenshot 2024-02-18 153854.png'),(118,'/uploads/80867a9e-afdb-4e6a-8819-20dfa719f17d-WhatsApp Image 2025-04-13 at 19.19.27_3c096c2c.jpg'),(76,'/uploads/f57273a4-09de-428d-aa13-c423e120266e-WhatsApp Image 2025-04-13 at 19.44.24_2d17b6b3.jpg'),(119,'/uploads/5d17def3-20db-4e78-a986-e4a5bb02894b-WhatsApp Image 2025-04-13 at 19.30.34_ef22b13f.jpg'),(121,'/uploads/5fc8d7a9-739b-4e35-9b1b-8196861cdb0f-Screenshot 2024-03-26 153145.png'),(117,'/uploads/f30e7dc7-c6c9-44cc-842b-5050b55f378d-Screenshot 2024-02-18 153854.png'),(1,'/uploads/781e7d00-d789-47a9-b089-2723a555f622-mark-adler-boss-80-buerostuhl.jpg'),(1,'/uploads/e8fb3a8d-a907-4c7f-8c71-3fa971ef1427-mark-adler-boss-80-buerostuhl (1).jpg'),(2,'/uploads/e57b535c-99e8-432d-afd2-7141a4308aa7-mark-adler-boss-80-buerostuhl.jpg'),(3,'/uploads/3efcdf07-a5b0-4dcd-afda-04d7bcd4d8a8-Screenshot 2025-06-13 152559.png'),(4,'/uploads/e8beb106-aab7-4020-9c5b-9b8e19c0e383-Screenshot 2025-06-13 153621.png'),(4,'/uploads/b4cf9732-ca78-46f2-bdc4-98a195d3aa57-Screenshot 2025-06-13 153633.png'),(5,'/uploads/d2b31dd0-6602-4b1d-868d-8c6a3811dafd-Screenshot 2025-06-13 153848.png'),(5,'/uploads/7d6a8546-255c-4889-8734-d1b2becbec7b-Screenshot 2025-06-13 153912.png'),(6,'/uploads/2b03e00d-b8c4-4139-8654-c28cd101584b-Screenshot 2025-06-13 154146.png'),(7,'/uploads/3ba55f15-3970-410c-a4e2-0bb0012040c6-Screenshot 2025-06-13 154146.png'),(9,'/uploads/4549a361-9b49-4683-ab7d-dcba29171243-Screenshot 2025-06-13 155558.png'),(10,'/uploads/37841053-23d4-4982-baf4-6336f25ea0e1-Screenshot 2025-06-13 155940.png'),(11,'/uploads/0e8cd065-eeaf-44aa-b344-9b4780a986f0-Screenshot 2025-06-13 160053.png'),(12,'/uploads/a9f8ba6d-81fc-4e60-989d-15087fc9874f-Screenshot 2025-06-13 160406.png'),(13,'/uploads/fe3a3ae5-692f-4bba-a9a2-95130ca0d8cd-Screenshot 2025-06-13 160506.png'),(14,'/uploads/d135f9ab-82a2-4300-b080-60070b2dc673-Screenshot 2025-06-13 160637.png'),(15,'/uploads/daf4ca0e-9a0b-4974-990a-7e5f6fb2ed67-Screenshot 2025-06-13 160753.png'),(16,'/uploads/766696c2-48a3-4b66-b0d3-b248388f064f-Screenshot 2025-06-13 160946.png'),(17,'/uploads/1087b8a2-745f-40f9-a197-5afac4448fb5-Screenshot 2025-06-13 161132.png'),(18,'/uploads/af862efb-3e77-4086-9bfa-2ddf21675d7a-Screenshot 2025-06-13 161328.png'),(18,'/uploads/54b85f1b-446c-4a97-b59f-e2bec03eee30-Screenshot 2025-06-13 161333.png'),(18,'/uploads/e4cd37ab-8e9c-4abf-bb13-8af1e6160f9a-Screenshot 2025-06-13 161336.png'),(19,'/uploads/c904ac53-6d6a-472f-89bf-653a227c845d-WhatsApp Image 2025-06-13 at 17.50.40_1ca1a894.jpg'),(19,'/uploads/b478bf38-bcb7-4a3f-9c32-02ec62a130fc-WhatsApp Image 2025-06-13 at 17.50.40_c696783b.jpg');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image_url` longtext,
  `location` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `product_condition` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'AVAILABLE',
  `is_active` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id`),
  KEY `fk_user` (`user_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FKdb050tk37qryv15hd932626th` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Home & Furniture','Ergonomic office chair with adjustable height and lumbar support. Minor signs of wear.',NULL,'Timisoara',150,'Modern Office Chair',1,'IKEA','Used - Like New','2025-06-13 12:23:03.562000','0770657106','AVAILABLE',_binary ''),(2,'Real Estate','1111111111111',NULL,'111111111111111111',111,'1',1,'11111111111111','New','2025-06-13 12:24:13.347000','11111111111111111111','AVAILABLE',_binary ''),(3,'Home & Furniture','Ergonomic office chair with adjustable height and lumbar support. Minor signs of wear.',NULL,'Timisoara',150,'Modern Office Chair',1,'IKEA','Used - Like New','2025-06-13 12:26:11.154000','0770657106','AVAILABLE',_binary ''),(4,'Electronics','Full HD LED monitor, perfect for home office or gaming.',NULL,'Alba Iulia',150,'HP Monitor 24-inch',28,'HP','Used - Good','2025-06-13 12:37:01.059000','0732100275','AVAILABLE',_binary ''),(5,'Electronics','Fully functional phone with new battery. Includes charger.',NULL,'Dumbravita',100,'Samsung Galaxy S9 (Black)',28,'Samsung','Used - Acceptable','2025-06-13 12:39:23.357000','+40700000000','AVAILABLE',_binary ''),(6,'Electronics','Gently used for 1 year. Minor scratches on the frame but the screen is in perfect condition. Battery health is at 87%. Comes with a silicone case and original charging cable. Fully functional and',NULL,'Arad',150,'iPhone 11 – 64GB, Black',1,'Apple','Used - Good','2025-06-13 12:42:00.577000','0770657106','AVAILABLE',_binary ''),(7,'Real Estate','3123123',NULL,'3121323',3132123,'12312',1,'132123','New','2025-06-13 12:51:47.959000','312312','AVAILABLE',_binary ''),(9,'Electronics','Sleek and powerful, this iPhone XR is in good condition with some cosmetic signs of use. Battery holds charge well. Comes with charger and transparent c',NULL,'Timisoara',135,'iPhone XR – 64GB, Red',15,'Apple','Used - Good','2025-06-13 12:56:12.574000','0770657106','AVAILABLE',_binary ''),(10,'Electronics','Description: 6.5” AMOLED display, triple camera setup, and water resistance. Well-maintained with minor frame wear. Includes fast charger.',NULL,'Timisoara',349,'Samsung Galaxy S20 FE – 128GB, Cloud Navy',15,'Samsung','Used - Good','2025-06-13 12:59:53.971000','0770657106','AVAILABLE',_binary ''),(11,'Electronics','Long battery life (up to 3 days), ideal for work or backup phone. Few light scratches on screen, but works flawlessly.',NULL,'Timisoara',200,'Motorola G Power – 64GB, Silver',15,'Motorola','Used - Like New','2025-06-13 13:01:42.629000','0770657106','AVAILABLE',_binary ''),(12,'Home & Furniture',': Rustic-style coffee table with solid wood surface. Light scratches from use but still sturdy and stylish.',NULL,'Alba Iulia',120,'Wooden Coffee Table',28,'Handmade','New','2025-06-13 13:04:22.872000','4070000000','AVAILABLE',_binary ''),(13,'Home & Furniture','Minimalist design, ideal for books, plants or storage boxes. Some paint wear on edges. Easy to assemble.',NULL,'Alba Iulia',55,'IKEA Bookshelf (White, 5 Shelves)',28,'IKEA','Used - Like New','2025-06-13 13:06:02.020000','+4070000000','AVAILABLE',_binary ''),(14,'Home & Furniture','mfortable chairs with metal legs and padded seats. Used in a smoke-free, pet-free home.',NULL,'Alba Iulia',75,'Set of Dining chairs',28,'Handmade','New','2025-06-13 13:07:27.219000','+4070000000','AVAILABLE',_binary ''),(15,'Fashion & Beauty','Stylish long coat with belt and hood. Worn only 2-3 times. Great for cold weather.',NULL,'Arad',15,'Winter Coat – Women’s M',39,'Zara','Used - Good','2025-06-13 13:09:15.343000','0756781234','AVAILABLE',_binary ''),(16,'Education & Books','Collection of Romanian and international classics, all in very good condition. Perfect for literature lovers.',NULL,'Arad',35,'Classic Novels Book Set',39,'Edex','New','2025-06-13 13:10:43.701000','0756781234','AVAILABLE',_binary ''),(17,'Electronics','Wireless, foldable headphones with great sound quality. Light wear on ear pads, battery lasts over 12 hours.',NULL,'Arad',40,'Bluetooth Headphones – JBL TUNE 500BT',39,'JBL','New','2025-06-13 13:12:07.011000','0756781234','AVAILABLE',_binary ''),(18,'Hobbies, Sports & Kids','A lovely bundle of toys including building blocks, soft plush animals, and interactive educational toys. All items are clean, safe, and ready for a new home. Ideal for toddlers aged 2 to 5. Given away for free',NULL,'Arad',1,'Kids’ Toy Bundle (Ages 2–5) – DONATION',39,'LEGO','Used - Like New','2025-06-13 13:15:02.257000','0756781234','AVAILABLE',_binary ''),(19,'Electronics','Selling a Samsung Galaxy S22 (second-hand) in great condition – fully functional with no issues. Lightly used, well taken care of, and always kept in a case.',NULL,'Timisoara',500,'Samsung Galaxy S22 Ultra',39,'Samsun','Used - Like New','2025-06-13 14:51:09.066000','0770657106','AVAILABLE',_binary '');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_active` bit(1) NOT NULL,
  `comment` varchar(1000) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `flagged` bit(1) NOT NULL,
  `reviewed` bit(1) NOT NULL,
  `score` int NOT NULL,
  `verified` bit(1) NOT NULL,
  `reviewer_id` bigint NOT NULL,
  `seller_id` bigint NOT NULL,
  `rater_id` bigint DEFAULT NULL,
  `delivery_confirmed` bit(1) NOT NULL,
  `selected_delivery_option` varchar(255) DEFAULT NULL,
  `shipment_tracking_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKlqk0um24dql1k0ldnfphtd2ru` (`reviewer_id`),
  KEY `FKl20yhqx69ehajn8u9w506dc7h` (`seller_id`),
  CONSTRAINT `FKl20yhqx69ehajn8u9w506dc7h` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKlqk0um24dql1k0ldnfphtd2ru` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
INSERT INTO `ratings` VALUES (1,_binary '','sss','2025-05-18 04:55:11.396922',_binary '\0',_binary '\0',5,_binary '',28,1,28,_binary '','USPS - Ground Advantage','91da27dddded4c8aa6a4e1e11c8e6eae'),(2,_binary '','slab','2025-05-18 04:56:46.591936',_binary '\0',_binary '\0',4,_binary '',28,13,28,_binary '\0',NULL,NULL),(3,_binary '','sss','2025-05-18 04:57:04.301184',_binary '\0',_binary '\0',5,_binary '',28,13,28,_binary '\0',NULL,NULL),(4,_binary '','ssssssss','2025-05-18 04:57:16.100079',_binary '\0',_binary '\0',5,_binary '',28,13,28,_binary '\0',NULL,NULL),(5,_binary '','scam','2025-05-18 05:14:10.664567',_binary '\0',_binary '\0',5,_binary '',13,15,13,_binary '\0',NULL,NULL),(6,_binary '','scam','2025-05-18 05:27:23.065115',_binary '\0',_binary '\0',4,_binary '',13,28,13,_binary '\0',NULL,NULL),(7,_binary '','111','2025-05-18 05:29:08.603282',_binary '\0',_binary '\0',1,_binary '',13,35,13,_binary '\0',NULL,NULL),(8,_binary '','sal\n','2025-05-18 05:35:34.488649',_binary '\0',_binary '\0',4,_binary '',15,13,15,_binary '\0',NULL,NULL),(9,_binary '','scam','2025-05-18 05:38:23.037305',_binary '\0',_binary '\0',3,_binary '',1,28,1,_binary '\0',NULL,NULL),(10,_binary '','Test rating for shipment tracking','2025-05-18 15:33:31.000000',_binary '\0',_binary '\0',5,_binary '',2,1,NULL,_binary '\0',NULL,NULL),(11,_binary '','123456','2025-06-01 12:28:01.026667',_binary '\0',_binary '\0',5,_binary '',15,1,15,_binary '\0',NULL,NULL),(12,_binary '','scam','2025-06-01 12:58:15.690645',_binary '\0',_binary '\0',5,_binary '',36,15,36,_binary '\0',NULL,NULL),(13,_binary '','scam','2025-06-02 13:50:41.419449',_binary '\0',_binary '\0',5,_binary '',13,17,13,_binary '\0',NULL,NULL),(14,_binary '','scam\n','2025-06-02 13:53:17.471419',_binary '\0',_binary '\0',5,_binary '',17,1,17,_binary '\0',NULL,NULL),(15,_binary '','13245523','2025-06-04 02:37:40.012701',_binary '\0',_binary '\0',5,_binary '',17,15,17,_binary '\0',NULL,NULL),(16,_binary '','xx','2025-06-08 23:27:04.267344',_binary '\0',_binary '\0',2,_binary '',1,13,1,_binary '\0',NULL,NULL),(17,_binary '','s','2025-06-10 11:08:23.973753',_binary '\0',_binary '\0',5,_binary '',39,13,39,_binary '\0',NULL,NULL),(18,_binary '','s','2025-06-10 14:33:22.134486',_binary '\0',_binary '\0',5,_binary '',1,39,1,_binary '\0',NULL,NULL),(19,_binary '','good','2025-06-11 14:09:58.276278',_binary '\0',_binary '\0',5,_binary '',39,28,39,_binary '\0',NULL,NULL);
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `search_history`
--

DROP TABLE IF EXISTS `search_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `search_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `brand` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `item_condition` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `max_price` double DEFAULT NULL,
  `min_price` double DEFAULT NULL,
  `query` varchar(255) DEFAULT NULL,
  `timestamp` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8ll2cxj6i83mnrcyxrxl4b7dm` (`user_id`),
  CONSTRAINT `FK8ll2cxj6i83mnrcyxrxl4b7dm` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=251 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `search_history`
--

LOCK TABLES `search_history` WRITE;
/*!40000 ALTER TABLE `search_history` DISABLE KEYS */;
INSERT INTO `search_history` VALUES (1,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-27 10:39:32.833183',28),(2,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-27 10:39:44.914814',28),(3,NULL,NULL,NULL,NULL,NULL,NULL,'31','2025-05-27 10:39:57.304301',28),(4,NULL,NULL,NULL,NULL,NULL,NULL,'31','2025-05-27 10:40:06.843166',28),(5,NULL,NULL,NULL,NULL,NULL,NULL,'car','2025-05-27 10:40:21.978455',28),(6,NULL,NULL,NULL,NULL,NULL,NULL,'777','2025-05-27 10:42:29.866202',28),(7,NULL,NULL,NULL,NULL,NULL,NULL,'lap','2025-05-27 10:44:41.389798',28),(8,NULL,NULL,NULL,NULL,NULL,NULL,'masina','2025-05-27 10:44:46.724778',28),(9,NULL,NULL,NULL,NULL,NULL,NULL,'masina','2025-05-27 10:44:51.457744',28),(10,NULL,NULL,NULL,NULL,NULL,NULL,'caine','2025-05-27 10:44:58.634759',28),(11,NULL,NULL,NULL,NULL,NULL,NULL,'telefon','2025-05-27 10:45:14.584602',28),(12,'Apple',NULL,NULL,NULL,NULL,NULL,NULL,'2025-05-27 10:45:58.290813',28),(13,NULL,NULL,NULL,NULL,NULL,NULL,'la[p','2025-05-27 10:48:09.918379',28),(14,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-27 10:48:14.121994',28),(15,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-27 10:48:24.747526',28),(16,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-27 10:48:30.983774',28),(17,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-27 10:48:57.529288',28),(18,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-27 10:50:15.840022',28),(19,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-27 10:53:26.438882',28),(20,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-27 10:53:44.868979',28),(21,NULL,NULL,NULL,NULL,NULL,NULL,'telefon','2025-05-27 10:54:29.686768',28),(22,NULL,NULL,NULL,NULL,NULL,NULL,'telefon','2025-05-27 10:57:35.756080',28),(23,NULL,NULL,NULL,NULL,NULL,NULL,'car','2025-05-27 10:58:27.814342',28),(24,NULL,'Home & Furniture',NULL,NULL,NULL,NULL,NULL,'2025-05-27 10:58:49.173596',28),(25,NULL,NULL,NULL,NULL,NULL,NULL,'777','2025-05-27 10:59:14.765274',28),(26,NULL,NULL,NULL,NULL,NULL,NULL,'777','2025-05-27 10:59:25.712433',28),(27,NULL,NULL,NULL,NULL,NULL,NULL,'7777','2025-05-27 10:59:31.653539',28),(28,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-27 11:00:42.908289',28),(29,NULL,NULL,NULL,NULL,NULL,NULL,'cacat','2025-05-27 11:01:14.928326',28),(30,NULL,NULL,NULL,NULL,NULL,NULL,'tete','2025-05-27 11:01:51.069456',28),(31,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-27 11:03:50.642446',28),(32,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-27 11:11:31.445747',28),(33,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-27 11:11:41.475392',28),(34,NULL,NULL,NULL,NULL,NULL,NULL,'telefon','2025-05-27 11:11:57.583290',28),(35,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-27 11:16:25.912663',28),(36,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-27 11:16:41.314024',28),(37,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-27 11:18:26.243317',28),(38,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-27 11:20:51.233790',28),(39,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 11:45:03.872262',1),(40,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 11:48:40.510146',1),(41,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 11:48:49.772913',1),(42,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 11:49:38.849592',1),(43,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 11:50:42.157700',1),(44,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 11:51:07.545946',1),(45,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 11:53:33.958052',1),(46,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 11:53:38.792211',1),(47,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 11:54:04.991319',1),(48,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 11:54:48.738606',1),(49,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 11:55:12.906749',1),(50,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 11:55:33.960371',1),(51,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 11:55:56.742223',1),(52,NULL,NULL,NULL,NULL,NULL,NULL,'telefon','2025-05-28 11:56:15.705987',1),(53,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 11:56:23.488000',1),(54,NULL,NULL,NULL,NULL,NULL,NULL,'telefon','2025-05-28 11:56:34.094809',1),(55,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 11:56:40.426149',1),(56,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 11:56:46.401160',1),(57,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 11:56:53.446617',1),(58,NULL,NULL,NULL,NULL,NULL,NULL,'cacat','2025-05-28 11:57:06.639251',1),(59,NULL,NULL,NULL,NULL,NULL,NULL,'MESSI','2025-05-28 11:57:36.467474',1),(60,NULL,NULL,NULL,NULL,NULL,NULL,'MSSI','2025-05-28 11:57:42.160173',1),(61,NULL,NULL,NULL,NULL,NULL,NULL,'MESSI','2025-05-28 11:57:45.753914',1),(62,NULL,NULL,NULL,NULL,NULL,NULL,'MESSI','2025-05-28 11:58:01.402438',1),(63,NULL,NULL,NULL,NULL,NULL,NULL,'cacat','2025-05-28 11:58:50.773709',1),(64,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 12:02:26.148230',1),(65,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 12:03:28.819274',1),(66,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 12:04:54.489024',1),(67,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 12:05:42.715202',1),(68,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 12:06:14.769101',1),(69,NULL,NULL,NULL,NULL,NULL,NULL,'telefon','2025-05-28 12:06:30.907808',1),(70,NULL,NULL,NULL,NULL,NULL,NULL,'telefon','2025-05-28 12:06:36.938884',1),(71,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 12:07:14.899500',1),(72,NULL,NULL,NULL,NULL,NULL,NULL,'telefon','2025-05-28 12:08:09.730552',1),(73,NULL,NULL,NULL,NULL,NULL,NULL,'telefon','2025-05-28 12:09:16.417595',1),(74,NULL,NULL,NULL,NULL,NULL,NULL,'telefon','2025-05-28 12:09:29.968154',1),(75,NULL,'Home & Furniture',NULL,NULL,NULL,NULL,NULL,'2025-05-28 12:11:15.367092',1),(76,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 12:12:19.532199',1),(77,NULL,NULL,NULL,NULL,NULL,NULL,'telefon','2025-05-28 12:13:03.800236',1),(78,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 12:13:35.949226',1),(79,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 12:14:33.805023',1),(80,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 12:17:58.759288',1),(81,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 12:18:40.319526',1),(82,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 12:18:58.287014',1),(83,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 12:23:21.306769',1),(84,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 12:23:30.182436',1),(85,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 12:23:45.044199',1),(86,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 12:24:04.663787',1),(87,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 12:25:19.182858',1),(88,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 12:25:34.641384',1),(89,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 12:28:08.194989',1),(90,NULL,NULL,NULL,NULL,NULL,NULL,'RONALDO','2025-05-28 12:28:30.344590',1),(91,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 12:30:36.184721',1),(92,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 12:30:49.147052',1),(93,NULL,NULL,NULL,NULL,NULL,NULL,'messi','2025-05-28 12:31:00.565881',1),(94,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 12:32:55.056581',1),(95,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 12:37:53.436293',1),(96,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 12:45:07.504623',1),(97,NULL,NULL,NULL,NULL,NULL,NULL,'tete','2025-05-28 12:46:08.336603',1),(98,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 12:46:16.286933',1),(99,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 12:51:21.320576',13),(100,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 13:11:18.698559',13),(101,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 13:20:27.910792',13),(102,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 13:23:14.090467',13),(103,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 13:23:18.593295',13),(104,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 13:25:33.029459',13),(105,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 13:30:47.733110',13),(106,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 13:36:28.519105',13),(107,NULL,NULL,NULL,NULL,NULL,NULL,'LAPTE','2025-05-28 13:42:48.904972',13),(108,NULL,NULL,NULL,NULL,NULL,NULL,'LAPTW','2025-05-28 13:42:58.615201',13),(109,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 13:43:03.314312',13),(110,NULL,NULL,NULL,NULL,NULL,NULL,'car','2025-05-28 13:43:23.333274',13),(111,NULL,NULL,NULL,NULL,NULL,NULL,'ronaldo','2025-05-28 13:44:31.652503',13),(112,NULL,NULL,NULL,NULL,NULL,NULL,'3123','2025-05-28 13:44:43.401138',13),(113,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 13:47:43.791856',13),(114,NULL,NULL,NULL,NULL,NULL,NULL,'car','2025-05-28 13:48:40.175224',13),(115,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 13:49:54.995871',1),(116,NULL,NULL,NULL,NULL,NULL,NULL,'car','2025-05-28 13:49:59.655560',1),(117,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-05-28 13:50:18.288812',13),(118,NULL,NULL,NULL,NULL,NULL,NULL,'car','2025-05-28 13:50:22.992047',13),(119,NULL,NULL,NULL,NULL,NULL,NULL,'car','2025-05-28 13:52:07.729301',13),(120,NULL,NULL,NULL,NULL,NULL,NULL,'3','2025-05-28 13:52:25.799905',13),(121,NULL,NULL,NULL,NULL,NULL,NULL,'l','2025-05-28 14:00:46.524970',13),(122,NULL,NULL,NULL,NULL,NULL,NULL,'3','2025-05-28 14:01:05.968733',13),(123,NULL,NULL,NULL,NULL,NULL,NULL,'car','2025-05-28 14:05:25.807546',13),(124,NULL,NULL,NULL,NULL,NULL,NULL,'c','2025-05-29 17:30:34.225619',13),(125,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-06-01 12:40:03.925141',1),(126,NULL,NULL,NULL,NULL,NULL,NULL,'111','2025-06-01 13:02:44.623344',15),(127,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-06-01 13:33:57.605317',1),(128,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-06-01 13:35:35.014597',1),(129,NULL,NULL,NULL,NULL,NULL,NULL,'laptwe','2025-06-01 13:36:04.573252',1),(130,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-06-01 13:37:16.231961',1),(131,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-06-01 13:38:41.106528',1),(132,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-06-01 13:39:28.638986',1),(133,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-06-01 14:00:31.838061',1),(134,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-06-01 16:52:14.439510',1),(135,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-06-01 16:52:24.010000',1),(136,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-06-01 16:52:46.086417',1),(137,NULL,NULL,NULL,NULL,NULL,NULL,'MIHAITA','2025-06-01 16:57:33.118466',1),(138,NULL,NULL,NULL,NULL,NULL,NULL,'111','2025-06-01 16:58:20.940697',1),(139,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-06-01 22:25:13.061267',28),(140,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-06-01 22:25:22.313655',28),(141,NULL,NULL,NULL,NULL,NULL,NULL,'car','2025-06-01 22:25:44.746662',28),(142,NULL,NULL,NULL,NULL,NULL,NULL,'lap','2025-06-01 22:30:52.421458',1),(143,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-06-01 22:33:39.691909',1),(144,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-01 22:52:44.331242',1),(145,NULL,NULL,NULL,NULL,NULL,NULL,'LAP','2025-06-02 00:25:03.372268',28),(146,NULL,NULL,NULL,NULL,NULL,NULL,'satana','2025-06-02 00:35:38.694502',28),(147,NULL,NULL,NULL,NULL,NULL,NULL,'11','2025-06-02 01:20:40.068649',28),(148,NULL,NULL,NULL,NULL,NULL,NULL,'lap','2025-06-02 12:53:25.625671',15),(149,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-06-02 13:55:32.933744',17),(150,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-06-02 13:56:11.948847',17),(151,NULL,NULL,NULL,NULL,NULL,NULL,'lalp','2025-06-02 14:02:18.413052',1),(152,NULL,NULL,NULL,NULL,NULL,NULL,'s','2025-06-02 14:03:00.380655',1),(153,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-06-02 14:43:49.333483',1),(154,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 17:51:20.025014',13),(155,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-06-02 23:11:35.548069',13),(156,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:13:40.152064',13),(157,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:14:02.644928',13),(158,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:16:43.565391',13),(159,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:18:19.127292',13),(160,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:18:42.521402',13),(161,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:19:03.736849',13),(162,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:20:03.111390',13),(163,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:24:27.749135',13),(164,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:27:04.156007',13),(165,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:27:40.234625',13),(166,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:27:44.659498',13),(167,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:27:49.637491',13),(168,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:28:34.075010',13),(169,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:29:25.602417',13),(170,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:29:47.199340',13),(171,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:29:50.718257',13),(172,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:30:07.291760',13),(173,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:30:10.394946',13),(174,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:31:05.862101',13),(175,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:31:16.293671',13),(176,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:32:54.580373',13),(177,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:33:58.552739',13),(178,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:34:09.552688',13),(179,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:36:23.931611',13),(180,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:36:51.613636',13),(181,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:36:57.542060',13),(182,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:37:29.407348',13),(183,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:37:33.047353',13),(184,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:39:44.464549',13),(185,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:40:50.628909',13),(186,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:41:42.252377',13),(187,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:41:45.412098',13),(188,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:54:04.664135',13),(189,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-02 23:55:06.592915',13),(190,NULL,NULL,NULL,NULL,NULL,NULL,'log','2025-06-02 23:57:24.814990',13),(191,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-03 00:00:57.717632',13),(192,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-03 10:24:41.598701',1),(193,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-03 10:25:19.366386',1),(194,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-03 10:31:51.715608',1),(195,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-03 12:14:58.382243',28),(196,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-03 12:20:07.741840',28),(197,NULL,NULL,NULL,NULL,NULL,NULL,'28','2025-06-03 21:44:22.340042',28),(198,NULL,NULL,NULL,NULL,NULL,NULL,'28','2025-06-03 21:44:33.195663',28),(199,NULL,NULL,NULL,NULL,NULL,NULL,' produs11','2025-06-03 21:45:35.432933',28),(200,NULL,NULL,NULL,NULL,NULL,NULL,'satana','2025-06-03 21:48:31.335693',1),(201,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-03 22:02:42.943565',1),(202,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-03 22:03:01.863510',1),(203,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-03 22:10:48.550785',1),(204,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-03 22:12:28.717126',1),(205,NULL,NULL,NULL,NULL,NULL,NULL,'lapte','2025-06-03 22:13:00.096568',1),(206,NULL,NULL,NULL,NULL,NULL,NULL,'tetest','2025-06-03 22:13:32.360160',1),(207,NULL,NULL,NULL,NULL,NULL,NULL,'tetest','2025-06-03 22:13:57.901198',1),(208,NULL,NULL,NULL,NULL,NULL,NULL,'te','2025-06-03 22:16:04.365831',1),(209,NULL,NULL,NULL,NULL,NULL,NULL,'ceapa','2025-06-03 22:17:38.376364',1),(210,NULL,NULL,NULL,NULL,NULL,NULL,'test10','2025-06-03 22:18:45.994225',1),(211,NULL,NULL,NULL,NULL,NULL,NULL,'tete','2025-06-03 22:22:20.080067',15),(212,NULL,NULL,NULL,NULL,NULL,NULL,'tete','2025-06-03 22:25:26.768723',15),(213,NULL,NULL,NULL,NULL,NULL,NULL,'R','2025-06-03 22:29:14.796213',15),(214,NULL,NULL,NULL,NULL,NULL,NULL,'R','2025-06-03 22:29:34.454029',15),(215,NULL,NULL,NULL,NULL,NULL,NULL,'tete','2025-06-03 23:29:46.732650',1),(216,NULL,NULL,NULL,NULL,NULL,NULL,'tetest','2025-06-03 23:35:10.321214',1),(217,NULL,NULL,NULL,NULL,NULL,NULL,'tetest','2025-06-03 23:35:21.722735',1),(218,NULL,NULL,NULL,NULL,NULL,NULL,'111','2025-06-04 02:20:14.474085',1),(219,NULL,NULL,NULL,NULL,NULL,NULL,'test','2025-06-04 03:09:17.881842',17),(220,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-08 17:33:40.360029',1),(221,NULL,NULL,'New',NULL,NULL,NULL,'logitec','2025-06-08 22:14:43.311737',1),(222,NULL,NULL,'Used - Like New',NULL,NULL,NULL,'logitech','2025-06-08 22:14:55.240946',1),(223,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-09 00:06:55.415970',1),(224,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-09 00:35:30.370638',1),(225,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-09 02:03:53.991122',1),(226,NULL,NULL,NULL,NULL,NULL,NULL,'11111111111','2025-06-10 00:54:20.525130',1),(227,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-10 11:06:31.012909',1),(228,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-10 14:30:54.046580',1),(229,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-13 12:24:21.159775',1),(230,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-13 12:24:42.201846',1),(231,NULL,NULL,NULL,NULL,NULL,NULL,'modern','2025-06-13 12:26:15.520217',1),(232,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-13 12:51:21.574925',1),(233,NULL,NULL,NULL,NULL,NULL,NULL,'12312','2025-06-13 12:51:51.812093',1),(234,NULL,NULL,NULL,NULL,NULL,NULL,'apple','2025-06-13 12:56:24.727790',15),(235,NULL,NULL,NULL,NULL,NULL,NULL,'apple','2025-06-13 13:02:16.349278',28),(236,NULL,NULL,NULL,NULL,NULL,NULL,'xr','2025-06-13 13:02:29.527170',28),(237,NULL,NULL,NULL,NULL,NULL,NULL,'xr','2025-06-13 13:16:57.933120',28),(238,NULL,NULL,NULL,NULL,NULL,NULL,'xr','2025-06-13 13:19:32.673038',28),(239,NULL,NULL,NULL,NULL,NULL,NULL,'samsung ','2025-06-13 13:25:10.506751',39),(240,NULL,NULL,NULL,NULL,NULL,NULL,'samsung','2025-06-13 13:35:35.656965',39),(241,NULL,NULL,NULL,NULL,NULL,NULL,'apple','2025-06-13 13:43:20.337535',39),(242,NULL,NULL,NULL,NULL,NULL,NULL,'iphone 11','2025-06-13 13:48:15.720256',39),(243,NULL,NULL,NULL,NULL,NULL,NULL,'monitor','2025-06-13 13:52:23.823892',39),(244,NULL,NULL,NULL,NULL,NULL,NULL,'iphone 11','2025-06-13 13:53:27.794020',39),(245,NULL,NULL,NULL,NULL,NULL,NULL,'iphone 11','2025-06-13 13:55:07.428683',39),(246,NULL,NULL,NULL,NULL,NULL,NULL,'iphone 11','2025-06-13 13:55:38.762792',39),(247,NULL,NULL,NULL,NULL,NULL,NULL,'iphone xr','2025-06-13 13:57:15.050985',39),(248,NULL,NULL,NULL,NULL,NULL,NULL,'samsung galaxy s10','2025-06-13 13:58:41.912507',39),(249,NULL,NULL,NULL,NULL,NULL,NULL,'11','2025-06-15 16:15:20.394024',1),(250,NULL,NULL,NULL,NULL,NULL,NULL,'1','2025-06-15 16:51:53.453238',1);
/*!40000 ALTER TABLE `search_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_transactions`
--

DROP TABLE IF EXISTS `shipping_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_transactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `estimated_days` int DEFAULT NULL,
  `from_city` varchar(255) DEFAULT NULL,
  `from_country` varchar(255) DEFAULT NULL,
  `from_email` varchar(255) DEFAULT NULL,
  `from_name` varchar(255) DEFAULT NULL,
  `from_phone` varchar(255) DEFAULT NULL,
  `from_state` varchar(255) DEFAULT NULL,
  `from_street` varchar(255) DEFAULT NULL,
  `from_zip` varchar(255) DEFAULT NULL,
  `parcel_height` varchar(255) DEFAULT NULL,
  `parcel_length` varchar(255) DEFAULT NULL,
  `parcel_weight` varchar(255) DEFAULT NULL,
  `parcel_width` varchar(255) DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `rate_id` varchar(255) DEFAULT NULL,
  `service` varchar(255) DEFAULT NULL,
  `shipment_id` varchar(255) DEFAULT NULL,
  `to_city` varchar(255) DEFAULT NULL,
  `to_country` varchar(255) DEFAULT NULL,
  `to_email` varchar(255) DEFAULT NULL,
  `to_name` varchar(255) DEFAULT NULL,
  `to_phone` varchar(255) DEFAULT NULL,
  `to_state` varchar(255) DEFAULT NULL,
  `to_street` varchar(255) DEFAULT NULL,
  `to_zip` varchar(255) DEFAULT NULL,
  `transaction_number` varchar(255) DEFAULT NULL,
  `rating_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_q7qyc9ilkhpl7lvb68bl0ssnc` (`rating_id`),
  CONSTRAINT `FKdss5c0urateqtp1u2a4y324aw` FOREIGN KEY (`rating_id`) REFERENCES `ratings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_transactions`
--

LOCK TABLES `shipping_transactions` WRITE;
/*!40000 ALTER TABLE `shipping_transactions` DISABLE KEYS */;
INSERT INTO `shipping_transactions` VALUES (1,NULL,'2025-05-18 11:18:46.442527',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,NULL,'2025-05-18 11:20:49.689679',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,NULL,'2025-05-18 11:24:33.475227',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,NULL,'2025-05-18 11:30:33.257328',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,NULL,'2025-05-18 11:35:54.990939',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,NULL,'2025-05-18 11:36:36.022565',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,NULL,'2025-05-18 11:36:56.245332',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,NULL,'2025-05-18 11:40:01.245791',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,NULL,'2025-05-18 11:42:11.884190',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,NULL,'2025-05-18 11:45:37.870141',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,NULL,'2025-05-18 11:46:15.101350',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,NULL,'2025-05-18 11:47:25.950047',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,NULL,'2025-05-18 11:47:46.597684',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,NULL,'2025-05-18 11:48:15.429374',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,NULL,'2025-05-18 11:51:33.836416',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,NULL,'2025-05-18 12:05:16.471904',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,NULL,'2025-05-18 12:06:50.559602',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TEST-TRANSACTION-123',NULL),(18,NULL,'2025-05-18 12:08:09.735965',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,NULL,'2025-05-18 12:08:35.552178',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,'9.37','2025-06-10 11:02:02.094428','USD',5,'Woodridge','US','john@example.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','UPS','07511d936d624791b89786ed23064f4f','Ground Saver','961ecc0527cb4716a910c19ee33e4486','San Francisco','US','jane@example.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-4e7c57e1',NULL),(21,'9.37','2025-06-10 11:03:30.663302','USD',5,'Woodridge','US','john@example.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','UPS','07511d936d624791b89786ed23064f4f','Ground Saver','961ecc0527cb4716a910c19ee33e4486','San Francisco','US','jane@example.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-afda42d5',NULL),(22,'8.24','2025-06-10 11:05:07.658250','USD',4,'Woodridge','US','john@example.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','1754ec1302074e3eb04b8528471ea724','Ground Advantage','4d2b523b97144fc7a8bfe728f176b85c','San Francisco','US','jane@example.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-e2d572cf',NULL),(23,'8.24','2025-06-10 11:05:16.248410','USD',4,'Woodridge','US','john@example.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','1754ec1302074e3eb04b8528471ea724','Ground Advantage','4d2b523b97144fc7a8bfe728f176b85c','San Francisco','US','jane@example.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-78168d61',NULL),(24,'8.24','2025-06-10 11:05:29.150067','USD',4,'Woodridge','US','john@example.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','1754ec1302074e3eb04b8528471ea724','Ground Advantage','4d2b523b97144fc7a8bfe728f176b85c','San Francisco','US','jane@example.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-9c06a058',NULL),(25,'63.00','2025-06-10 11:20:40.058529','USD',1,'Woodridge','US','john@example.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','e2bbbfe3a1a849ebb5f782fd71695ebf','Priority Mail Express','5499b3dcbc0e4ab0ad7c8adbba4b0db2','San Francisco','US','jane@example.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-9452a669',NULL),(26,'83.49','2025-06-10 11:55:10.151909','USD',1,'Woodridge','US','john@example.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','UPS','d4f5947f9ec340b8a6ee0508f25d8f85','Next Day Air® Early','c260f5a21e4d48a88f722f813f85f7fd','San Francisco','US','jane@example.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-aac3fcfa',NULL),(27,'83.49','2025-06-10 11:55:27.791575','USD',1,'Woodridge','US','john@example.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','UPS','d4f5947f9ec340b8a6ee0508f25d8f85','Next Day Air® Early','c260f5a21e4d48a88f722f813f85f7fd','San Francisco','US','jane@example.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-64e04518',NULL),(28,'8.24','2025-06-10 11:56:34.718559','USD',4,'Woodridge','US','john@example.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','f0be66c16f7244f0bd92069e404cfaa0','Ground Advantage','18026527eaee4b269078e5f43811f7c3','San Francisco','US','jane@example.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-97931315',NULL),(29,'10.52','2025-06-10 12:05:59.510704','USD',3,'Woodridge','US','bradeaioan2602@gmail.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','023d6a3aa8a44ee6b736f03ebc286956','Priority Mail','9fcc5ee22acb42bca7dab000ea4f8866','San Francisco','US','bradeaioan2602@gmail.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-a6562623',NULL),(30,'83.49','2025-06-10 12:10:10.347011','USD',1,'Woodridge','US','bradeaioan2602@gmail.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','UPS','26f32559eef2407ba4c7b26a69ad9338','Next Day Air® Early','749ab5e3be424e4796341fcbe4cc61b2','San Francisco','US','bradeaioan2602@gmail.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-370cd353',NULL),(31,'63.00','2025-06-10 12:12:36.283490','USD',1,'Woodridge','US','bradeaioan2602@gmail.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','cd10cf6787574b71bdec497d77ad527d','Priority Mail Express','213bd526d828473b978193c6ac4f5b73','San Francisco','US','bradeaioan2602@gmail.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-4f966e98',NULL),(32,'63.00','2025-06-10 12:13:21.909257','USD',1,'Woodridge','US','bradeaioan2602@gmail.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','ba9219493f6a49cfacb00dc3a54b76ed','Priority Mail Express','2cc9ca81cdf244e7a464b665b1d175db','San Francisco','US','bradeaioan2602@gmail.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-d9c0a447',NULL),(33,'63.00','2025-06-10 12:14:39.620249','USD',1,'Woodridge','US','bradeaioan2602@gmail.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','2eaf9d2086dd4153b7fe348012a6300d','Priority Mail Express','e23323563b1a480584e87039681408bf','San Francisco','US','bradeaioan2602@gmail.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-06c3fb71',NULL),(34,'63.00','2025-06-10 12:48:10.764540','USD',1,'Woodridge','US','bradeaioan2602@gmail.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','1227d372c0d2470eb97c738ef6e9f663','Priority Mail Express','ecf3062bddda43c4805fd4dc5a1258d8','San Francisco','US','bradeaioan2602@gmail.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-e38770e2',NULL),(35,'8.24','2025-06-10 13:35:13.904158','USD',4,'Woodridge','US','bradeaioan2602@gmail.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','2d375595ee164253af588d65c5482354','Ground Advantage','47b36a7ec16244b0aac1e2223e0057bb','San Francisco','US','bradeaioan2602@gmail.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-abeac9ae',NULL),(36,'16.19','2025-06-10 13:56:10.723469','USD',3,'Woodridge','US','bradeaioan2602@gmail.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','UPS','00882425f3c14a869c482fb069f5ff6f','3 Day Select®','24cf12fd500e4d64a65601198bedbd30','San Francisco','US','bradeaioan2602@gmail.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-ba98bd1b',NULL),(37,'63.00','2025-06-10 14:37:40.830000','USD',1,'Woodridge','US','bradeaioan2602@gmail.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','2065b3c6927b4ae0992cdd7946bcff6f','Priority Mail Express','41ab00bc1cd647de91930086fccb0d59','San Francisco','US','bradeaioan2602@gmail.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-e751c168',NULL),(38,'10.52','2025-06-10 14:55:42.063463','USD',3,'Woodridge','US','bradeaioan2602@gmail.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','7f0de263d7324c808548621b619aff8e','Priority Mail','b37273d3620344a098f66286d940f75d','San Francisco','US','bradeaioan2602@gmail.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-eeb77512',NULL),(39,'63.00','2025-06-10 17:16:24.118755','USD',1,'Woodridge','US','john@example.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','41aeee1a23b4498ab41b2572189d925b','Priority Mail Express','d02c16bb95164de18c6f8eac9ef516a1','San Francisco','US','jane@example.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-895659c9',NULL),(40,'10.52','2025-06-11 13:14:16.716337','USD',3,'Woodridge','US','andreieduard269@yahoo.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','ccc18e678b5749299f87dfc3dfa2f8a1','Priority Mail','89ac6fdbd5a6407daaf50c9ee3d2bdcb','San Francisco','US','andreieduard269@yahoo.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-6432e843',NULL),(41,'53.49','2025-06-11 14:10:55.748279','USD',1,'Woodridge','US','ioan.bradea02@e-uvt.ro','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','9.8','1','15','UPS','392ab4a7ee2b409f964fe8318556e52b','Next Day Air®','35a48a135c6344bbb7dc745dd21224f1','San Francisco','US','ioan.bradea02@e-uvt.ro','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-240fe01a',NULL),(42,'63.00','2025-06-13 14:28:43.145042','USD',1,'Woodridge','US','ionut.bradea@yahoo.com7','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','31d9c57296ff425394d3bfdddc64e64e','Priority Mail Express','b8c98600fc624d8995ec464bd07c8347','San Francisco','US','jane@example.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-5e5a3e86',NULL),(43,'8.24','2025-06-13 14:29:53.921028','USD',4,'Woodridge','US','bradeaioan2602@gmail.com77','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','9715c745552e4194b740b53dc9a0f9f0','Ground Advantage','84c30bfded6c4b45876c6bed3c1e6ffe','San Francisco','US','jane@example.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-dc52764c',NULL),(44,'9.37','2025-06-13 14:44:03.790108','USD',5,'Woodridge','US','bradeaioan2602@gmail.com77','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','UPS','33db89dc5bf74884802eadd6e2a486eb','Ground Saver','4f45b8f538664246a09e7fe58fab7104','San Francisco','US','bradeaioan202@gmail.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-3b6f112d',NULL),(45,'10.52','2025-06-13 14:45:19.107321','USD',2,'Woodridge','US','john@example.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','5d4d554d6bd44d1d8b931647d17f7b8c','Priority Mail','ad603a8bf53347e987e49e0e1fe4a055','San Francisco','US','jane@example.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-01141df2',NULL),(46,'8.24','2025-06-13 14:46:15.964552','USD',4,'Woodridge','US','bradeaioan2602@gmail.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','97ea7a4d851e4f8ba9cfd1af2b97ef73','Ground Advantage','df97487da5844e5a8ba7ffbbc491ba71','San Francisco','US','bradeaioan2602@gmail.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-411b9484',NULL),(47,'10.52','2025-06-13 14:46:47.605461','USD',3,'Woodridge','US','john@example.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','47783e22aaf643a49c1eed6305942102','Priority Mail','b54c5632007749ea8055c8c19ef915a4','San Francisco','US','jane@example.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-37a13286',NULL),(48,'16.19','2025-06-13 14:48:04.261981','USD',3,'Woodridge','US','john@example.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','UPS','33d71bbd11a642489ed024d7de7c7fe1','3 Day Select®','df24bc2028b64abfa32ae18f520e49ae','San Francisco','US','jane@example.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-7e638307',NULL),(49,'8.24','2025-06-15 16:31:31.248043','USD',4,'Woodridge','US','bradeaioan2602@gmail.com','John Doe','+1 555 555 5555','IL','6512 Greene Rd.','60517','20','10','1','15','USPS','5b322f458e8043bf81533759b0c37ad8','Ground Advantage','91da27dddded4c8aa6a4e1e11c8e6eae','San Francisco','US','bradeaioan2602@gmail.com','Jane Smith','+1 555 555 1234','CA','388 Townsend St','94107','SHP-9a55088b',NULL);
/*!40000 ALTER TABLE `shipping_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_recommendation_history`
--

DROP TABLE IF EXISTS `user_recommendation_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_recommendation_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `recommendation_count` int DEFAULT NULL,
  `recommended_at` datetime(6) DEFAULT NULL,
  `product_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `product_id_reference` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKtqrv0xlm7ebfgo76sk37uie7` (`product_id`),
  KEY `FKq2j3ctcluinyffao8ara2og8o` (`user_id`),
  CONSTRAINT `FKq2j3ctcluinyffao8ara2og8o` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKtqrv0xlm7ebfgo76sk37uie7` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_recommendation_history`
--

LOCK TABLES `user_recommendation_history` WRITE;
/*!40000 ALTER TABLE `user_recommendation_history` DISABLE KEYS */;
INSERT INTO `user_recommendation_history` VALUES (1,436,'2025-06-11 14:10:32.194000',91,1,NULL),(2,404,'2025-06-11 14:09:10.781000',92,1,NULL),(4,418,'2025-06-11 14:10:32.083000',95,1,NULL),(5,454,'2025-06-11 14:10:32.099000',100,1,NULL),(7,440,'2025-06-11 14:10:32.185000',58,1,NULL),(10,437,'2025-06-11 14:09:10.870000',76,1,NULL),(12,401,'2025-06-11 14:10:32.111000',97,1,NULL),(16,8,'2025-05-28 11:57:45.837000',101,1,NULL),(18,8,'2025-05-28 11:58:05.161000',102,1,NULL),(19,161,'2025-06-10 12:55:28.256000',101,13,NULL),(20,160,'2025-06-10 12:55:28.147000',102,13,NULL),(23,166,'2025-06-10 12:55:28.241000',58,13,NULL),(27,169,'2025-06-10 12:55:28.251000',91,13,NULL),(28,158,'2025-06-10 12:55:28.260000',92,13,NULL),(29,156,'2025-06-10 12:53:40.161000',100,13,NULL),(31,169,'2025-06-06 16:12:04.713000',76,28,NULL),(32,134,'2025-06-06 16:12:04.526000',58,28,NULL),(33,162,'2025-06-04 16:43:42.390000',100,28,NULL),(35,151,'2025-06-06 16:12:04.698000',97,28,NULL),(37,149,'2025-06-06 16:12:04.729000',101,28,NULL),(40,159,'2025-06-06 16:12:04.746000',103,28,NULL),(42,166,'2025-06-06 16:12:04.519000',102,28,NULL),(43,142,'2025-06-06 16:12:04.540000',95,28,NULL),(45,324,'2025-06-11 14:10:32.189000',103,1,NULL),(46,16,'2025-06-02 13:50:25.746000',103,15,NULL),(48,16,'2025-06-02 13:47:01.729000',102,15,NULL),(50,39,'2025-06-03 22:29:16.285000',91,15,NULL),(51,54,'2025-06-03 22:29:29.411000',76,15,NULL),(53,46,'2025-06-03 22:29:30.958000',97,15,NULL),(54,19,'2025-06-02 13:50:25.749000',101,15,NULL),(57,46,'2025-06-03 22:29:30.962000',95,15,NULL),(59,52,'2025-06-03 22:29:30.945000',92,15,NULL),(62,319,'2025-06-11 14:10:32.174000',106,1,NULL),(64,39,'2025-06-03 22:29:30.932000',108,15,NULL),(65,53,'2025-06-03 22:29:29.437000',107,15,NULL),(66,42,'2025-06-03 22:29:30.941000',106,15,NULL),(69,14,'2025-06-04 03:14:34.903000',108,17,NULL),(70,10,'2025-06-04 03:08:32.640000',107,17,NULL),(71,12,'2025-06-04 03:14:34.969000',106,17,NULL),(73,9,'2025-06-04 03:09:25.079000',103,17,NULL),(74,13,'2025-06-04 03:14:34.893000',102,17,NULL),(75,11,'2025-06-04 03:08:32.645000',91,17,NULL),(76,8,'2025-06-04 03:08:26.926000',92,17,NULL),(77,9,'2025-06-04 03:09:25.010000',58,17,NULL),(78,11,'2025-06-04 03:14:34.979000',97,17,NULL),(79,246,'2025-06-11 14:07:58.606000',108,1,NULL),(80,225,'2025-06-11 14:10:32.105000',107,1,NULL),(81,96,'2025-06-10 12:55:28.176000',108,13,NULL),(82,96,'2025-06-10 12:53:40.148000',107,13,NULL),(83,86,'2025-06-10 12:55:28.232000',106,13,NULL),(85,177,'2025-06-11 14:10:32.201000',109,1,NULL),(86,86,'2025-06-04 16:43:53.143000',109,28,NULL),(87,141,'2025-06-11 14:10:32.180000',111,1,NULL),(90,35,'2025-06-03 22:29:30.949000',111,15,NULL),(92,119,'2025-06-11 14:10:32.078000',113,1,NULL),(93,33,'2025-06-10 12:55:28.246000',113,13,NULL),(97,9,'2025-06-04 03:14:34.908000',113,17,NULL),(99,10,'2025-06-04 03:08:28.771000',111,17,NULL),(101,10,'2025-06-04 03:08:22.544000',109,17,NULL),(102,11,'2025-06-04 03:14:34.988000',100,17,NULL),(104,10,'2025-06-04 03:09:25.084000',76,17,NULL),(105,8,'2025-06-04 03:14:34.965000',101,17,NULL),(109,6,'2025-06-04 03:08:32.663000',95,17,NULL),(110,10,'2025-06-06 16:12:04.705000',111,28,NULL),(111,7,'2025-06-06 16:12:04.548000',113,28,NULL),(113,4,'2025-06-04 03:14:34.954000',115,17,NULL),(114,5,'2025-06-04 16:43:53.132000',115,28,NULL),(115,31,'2025-06-11 14:07:58.737000',117,1,NULL),(116,24,'2025-06-10 12:55:28.235000',117,13,NULL),(117,19,'2025-06-10 12:55:28.265000',116,13,NULL),(118,21,'2025-06-10 12:47:29.576000',115,13,NULL),(119,31,'2025-06-11 14:10:32.094000',119,1,NULL),(120,35,'2025-06-11 14:10:32.164000',118,1,NULL),(122,4,'2025-06-11 14:10:32.163000',121,1,NULL),(123,42,'2025-06-15 16:31:02.932000',10,39,NULL),(124,58,'2025-06-15 16:51:57.953000',5,39,NULL),(125,53,'2025-06-15 16:51:57.927000',14,39,NULL),(126,44,'2025-06-15 16:51:57.946000',13,39,NULL),(127,48,'2025-06-15 16:51:57.921000',12,39,NULL),(128,48,'2025-06-15 16:27:45.247000',11,39,NULL),(129,42,'2025-06-15 16:51:57.862000',9,39,NULL),(130,53,'2025-06-15 16:51:57.926000',7,39,NULL),(131,51,'2025-06-15 16:51:57.941000',6,39,NULL),(132,43,'2025-06-15 16:31:02.915000',3,39,NULL),(133,47,'2025-06-15 16:51:57.937000',1,39,NULL),(134,39,'2025-06-15 16:31:02.845000',4,39,NULL),(135,43,'2025-06-15 16:51:57.946000',2,39,NULL);
/*!40000 ALTER TABLE `user_recommendation_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'ion@gmail.com','Ioan Bradea2','$2a$10$DH3SkUvgvwvc.rVM3yMNy.JIoHJPVHyObu0w48Qfbq3/a5D4ehuMa','ioan','Timișoara','0756781234','http://localhost:8080/uploads/62ad350e-54a3-433b-91c6-bc5a1ead59f6-106+ Forêt Wallpapers _ Free download _ Best Collection.jpeg',NULL),(2,'ion2@gmail.com','ion','$2a$10$SNA9oKlLkMmOxa618r0kj.eN/XAAI/5PIB1Ck.dkzZwnAj2SSM/ja','ioan2',NULL,NULL,NULL,NULL),(3,'ion22@gmail.com','ion','$2a$10$l3xzsyRc.a.fmB01NTt6Du37cvtt42YCN4kO7DBoYNODfBnFAJVYa','ioa2n2',NULL,NULL,NULL,NULL),(4,'ioan2@com','ioan22','$2a$10$btfSshk4JfETcTeeb4kNL.7vSO6eJN9SEvMCXOHwzhxYyBFsOznVC','123456',NULL,NULL,NULL,NULL),(5,'ioan222@com','ioan','$2a$10$s6WnzsJlHDeyuCpmTpyTU.lPXeLmPMTvnof.voJaUd1FSmWhiw/VG','ioan222',NULL,NULL,NULL,NULL),(6,'ioan.bradea02@yahoo.com','John','$2a$10$XJX1dZPW49RSEfnDwDh2FOTQit9p076TeZH5duFtqy2eFLhoX7Pgm','ioan2222',NULL,NULL,NULL,NULL),(7,'ion@ion','ion','$2a$10$uw2Up67CjUeDpva5ozDi/.4KauDPtZXlpfw9afxERdcfQWEXEwECS','ion',NULL,NULL,NULL,NULL),(8,'23123@gmail.com','312312','$2a$10$Fj13fpA2PSjPDVZYNjb/CemC81wN20nSwG686.I3TgQDqQgtxztZ.','312312',NULL,NULL,NULL,NULL),(9,'JON@JON','wd','$2a$10$x1Tz9c4rjOgMyf6Vwd/F4e69gR.4UkYLEGIgxZgO/vMBFMLVEdb.i','JON',NULL,NULL,NULL,NULL),(10,'ceapa@com','ceapa','$2a$10$ACUo8o7khoXPPPNnFnlImOSQ0Pf5KD8KNZLo/0KKwdOV6OYja/8J.','ceapa',NULL,NULL,NULL,NULL),(11,'ioan.bradea022@yahoo.comm','John','$2a$10$NAJoUiwz8jSsl2FZ5S2GpOZ0ajtQFecH2XU6tOYlNCCmVnFBQX4b6','ioan2222m',NULL,NULL,NULL,NULL),(12,'test@example.com','John Doe','$2a$10$V3.ZNwnLC0Wn6mfsxl12nehUcrbUHAz0PiQksPG34SYda6pcJiWkC','testuser',NULL,NULL,NULL,NULL),(13,'sapte@gmail.com','ioan','$2a$10$vaqigE2kPX6vWi/pGBV42O9/5so/tRDZ3r5lv6qIG6fNnwAl5RsE6','sapte',NULL,NULL,NULL,NULL),(14,'123123@123123','13123','$2a$10$gnXknyw11VaDwFGxhDVUa.WXEnlrjTol/t2DWpQRiWxaNcrsO.Ure','123123',NULL,NULL,NULL,NULL),(15,'tata@gmail.com','TATA','$2a$10$wbs/QE/DTCtOmUDFlnmoT.eeqThQwj3pR2IY3r/1t3bhTHHTF4W2S','tata',NULL,NULL,NULL,NULL),(16,'test@exampl2e.com','John Doe','$2a$10$UMuWX.3hK10KQPIzb3I94.ITITeZ/Kpc9l98f.U.XPF1YymVbHjHK','testus2er',NULL,NULL,NULL,NULL),(17,'12345@12345','ioan','$2a$10$VxiAL2yE3Jy9.bfnGub9SeM9lpOWSe5iMOufqwDMffLrZVF2QE7nO','12345',NULL,NULL,NULL,NULL),(18,'tete@tete.com','tete','$2a$10$O0O1cxu1Ma2qqGQdze6JX.8ZHaNE/O3BNHnoqAw3.7pF98GKIsWo2','tete',NULL,NULL,NULL,NULL),(19,'lapte@gmail.com','Lapte','$2a$10$2gsPwK.2GA1owVEOjUj1NOiMWEEuL172h23TETv5aaKaX2WjkJrsK','lapte',NULL,NULL,NULL,NULL),(20,'123@123','123','$2a$10$eeq82RFWEsbuJHMxzddRb.RvLV61B0O3ZChooAj50XwXH/oV4ObaW','123',NULL,NULL,NULL,NULL),(21,'312312@12321','4124124','$2a$10$gXN.bHTQDYnRvON7o0c6j.Nhn7Ads1OHiR2CqpLdjscGLrzMWIYAS','12312312312',NULL,NULL,NULL,NULL),(22,'ionut.bradea@yahoo.com22','knknk','$2a$10$WWpe4hxmx7Hg.yefn.D06ODXfgjIk3yvMaQjZfXJkWzANBwTLvNqS','knmkm',NULL,NULL,NULL,NULL),(23,'3213123@com','123123','$2a$10$r7CG9q/jyN0VKSO.MLRL/.8mz7z04krrgxZjJXrMpCC/lIlidwmZi','3123123@com',NULL,NULL,NULL,NULL),(24,'12345@gmal','lapte','$2a$10$ko702GYn6cbHvXqiwByqq.eP.dqWjTBH3BVViXFAkbTgESj1vLVp6','12345666',NULL,NULL,NULL,NULL),(25,'123123@1231','3123123123','$2a$10$BJoFx2Bt9yGkqHTiuyWnfeEqRnP1i.nbNwnmP8pv6rYKB8MOb2zOS','123123123',NULL,NULL,NULL,NULL),(26,'123123@31231','3123','$2a$10$qx9Dz9H2D7tmlrUdwCiZ/e/Cf.RUYR9Oj03SSL/K1oiR.aT73qH.u','1312',NULL,NULL,NULL,NULL),(27,'1234566@carina','1234566','$2a$10$V64AjFtCxwDJHKjaktu50OmUTD6VioB4JgRZuGKDxoFzrLHDz.NZe','1234566',NULL,NULL,NULL,NULL),(28,'elena@cimpianu','Cari222','$2a$10$Tk67cdFIiib.2hBN1.qrV.azV4IZxYn0qXU2n6B3vTKy8SCu6WgDC','cari28','Alba','03123213','http://localhost:8080/uploads/8685d9e5-62f0-48b4-94fc-25ce3dc03862-background3.png',NULL),(29,'ioan.bradea02@e-uvt.ro','Ioan Bradea','$2a$10$kE9/iDmF0SPNfXBmyOUH7.GELkFPqL0YVb9otTd6qzw.Je9fpT2d2','joejoe',NULL,NULL,NULL,NULL),(30,'bradeaioan2602@gmail.com','bradea','$2a$10$1ZUF0SCpABLR2Z21l0BK9uoo2bkZ7wy1XrCXScea8Zu.TS.GQ.qcW','ioan2602',NULL,NULL,NULL,NULL),(31,'mihai@mihai','mihai','$2a$10$4bspA7PGIKuRqcJ5oQvwSuN.JfpD5uj/4BeuE8UkBx5sw5dEgtb3i','mihai',NULL,NULL,NULL,NULL),(32,'21231232@m.com','132213123','$2a$10$NuUi1TyiEMHh5g0NdRbiOebYV/rNc99fjl7runOvz/81FJK0WhJCC','12312312',NULL,NULL,NULL,NULL),(33,'brabra@gmail.com','ioan26','$2a$10$yuoVR4cD3OjkdSUwCIFPjePXBJhtMZxIIav3U/OOYATkWlZRvaufC','ioan7',NULL,NULL,NULL,NULL),(35,'12345@gmail.com','12312321','$2a$10$7EUGkej.YBR3iBhklH/ZwOU32tfrYboa.93n03d5a2/VPxVCzF8Yu','12345555',NULL,NULL,NULL,NULL),(36,'test7@gmail.com','John Doe','$2a$10$S/e4H2MHHGC9Aj3FedDlLuPcB9Dw8/2e9bitvVyOYXaTfyBUxvaNy','test7',NULL,NULL,NULL,NULL),(37,'1111@1111','111111111','$2a$10$wEW3tkh2YyQOiCISdM8k3O4cLYMt5kWYbQLLOOhzoWVsQ3HVrXg5K','11111',NULL,NULL,NULL,NULL),(38,'111111@yahoo.com','TEST','$2a$10$ZnsGG3j4NUFzTpzGKR.ic.WLMDd7rrcyWPwFxho8LZTdYfnVbL2JO','111',NULL,NULL,NULL,NULL),(39,'test@test.com','test2','$2a$10$h9agHCwasBVg.RuGIqaRgOKYITI4coo8anXs0o/9GX7vuVtpy93Na','test',NULL,NULL,'http://localhost:8080/uploads/9cc53356-b571-4a3a-9091-d4befcf7409e-WhatsApp Image 2025-04-13 at 19.30.34_ef22b13f.jpg',NULL),(40,'1@yahoo.com','11111','$2a$10$e9T6CjA6HG2Qq0XXSWYlS.XW0qJW.U3Eq87nAwbPtyjfGJ5Blgyv6','111111111111111111',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-15 20:13:55
