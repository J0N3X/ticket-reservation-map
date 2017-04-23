-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 23.04.2017 klo 12:02
-- Palvelimen versio: 10.1.21-MariaDB
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tapahtuma_1_paikat`
--

-- --------------------------------------------------------

--
-- Rakenne taululle `paikat`
--

CREATE TABLE `paikat` (
  `paikka` varchar(4) NOT NULL,
  `status` varchar(12) NOT NULL,
  `xCoord` float NOT NULL,
  `yCoord` float NOT NULL,
  `owner` varchar(16) NOT NULL,
  `avTime` int(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

--
-- Vedos taulusta `paikat`
--

INSERT INTO `paikat` (`paikka`, `status`, `xCoord`, `yCoord`, `owner`, `avTime`) VALUES
('', '', 0, 0, '', 0),
('a1', 'free', 362.305, 646.16, 'Dataday', 1492941374),
('a2', 'free', 375.441, 646.16, 'Dataday', 1492941344);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `paikat`
--
ALTER TABLE `paikat`
  ADD PRIMARY KEY (`paikka`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
