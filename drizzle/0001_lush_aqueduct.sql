CREATE TABLE `chatHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `foodLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`foodId` int NOT NULL,
	`mealType` enum('breakfast','lunch','dinner','snack') NOT NULL,
	`quantity` decimal(5,2) NOT NULL DEFAULT '1',
	`calories` int NOT NULL,
	`protein` decimal(5,1) NOT NULL,
	`carbs` decimal(5,1) NOT NULL,
	`fat` decimal(5,1) NOT NULL,
	`loggedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `foodLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `foods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`calories` int NOT NULL,
	`protein` decimal(5,1) NOT NULL,
	`carbs` decimal(5,1) NOT NULL,
	`fat` decimal(5,1) NOT NULL,
	`servingSize` varchar(64),
	`category` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `foods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`calorieTarget` int NOT NULL DEFAULT 2000,
	`proteinTarget` decimal(5,1) NOT NULL DEFAULT '150',
	`carbsTarget` decimal(5,1) NOT NULL DEFAULT '200',
	`fatTarget` decimal(5,1) NOT NULL DEFAULT '65',
	`hydrationTarget` int NOT NULL DEFAULT 2000,
	`weightGoal` decimal(5,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `goals_id` PRIMARY KEY(`id`),
	CONSTRAINT `goals_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`age` int,
	`weight` decimal(5,2),
	`height` decimal(5,2),
	`activityLevel` varchar(64),
	`goalType` enum('lose','maintain','gain') DEFAULT 'maintain',
	`unitPreference` enum('metric','imperial') DEFAULT 'metric',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `weightEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`weight` decimal(5,2) NOT NULL,
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `weightEntries_id` PRIMARY KEY(`id`)
);
