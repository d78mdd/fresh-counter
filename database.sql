


(
for RPI :


mysql> CREATE USER 'mysqluser'@'localhost' IDENTIFIED BY 'mysqluser';

( flush privileges; )

mysql> grant all privileges on *.* to 'mysqluser'@'localhost';

mysql -umysqluser -pmysqluser

)





CREATE DATABASE `users` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
`users`


USE users;


CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` varchar(5) DEFAULT NULL,
  `time` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




ALTER TABLE `users`.`users` 
CHANGE COLUMN `time` `time` TIMESTAMP NULL DEFAULT NULL ;



INSERT INTO users (`number`,`time`) VALUES ("1", Now())  ;





then edit the app.js file > var connection





ALTER TABLE `users`.`users` 
CHANGE COLUMN `number` `products` INT(5) NULL DEFAULT NULL ;

ALTER TABLE `users`.`users` 
CHANGE COLUMN `time` `timestamp` TIMESTAMP NULL DEFAULT NULL ;



















