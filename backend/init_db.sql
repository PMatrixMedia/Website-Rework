-- PhaseMatrix Blog Database Schema
-- Run this script after creating the database

CREATE DATABASE IF NOT EXISTS phasematrix_blog;
USE phasematrix_blog;

CREATE TABLE IF NOT EXISTS authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content LONGTEXT,
    image_url VARCHAR(500),
    author_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS post_tags (
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Seed data
INSERT INTO authors (name, avatar_url) VALUES ('PhaseMatrix', NULL);

INSERT INTO tags (name) VALUES ('welcome'), ('updates'), ('design'), ('news'), ('features'), ('roadmap');

INSERT INTO posts (title, excerpt, content, author_id, image_url) VALUES
('Welcome to PhaseMatrix Media Blog', 'Updates and insights from our team. Stay tuned for the latest news, tutorials, and behind-the-scenes content.', 'This is the official blog of PhaseMatrix Media. We will be posting updates, tutorials, and insights here regularly.', 1, NULL),
('Website Redesign in Progress', 'We''re rebuilding our site with a fresh look, improved navigation, and mobile-friendly design. Expect more updates soon.', 'Our team has been hard at work on a complete website overhaul. The new design focuses on intuitive navigation and mobile responsiveness.', 1, NULL),
('New Features Coming Soon', 'Explore what we have in store for the future. New features, integrations, and improvements are on the roadmap.', 'We have exciting features in the pipeline. Stay tuned for announcements and early access opportunities.', 1, NULL);

INSERT INTO post_tags (post_id, tag_id) SELECT 1, id FROM tags WHERE name IN ('welcome', 'updates');
INSERT INTO post_tags (post_id, tag_id) SELECT 2, id FROM tags WHERE name IN ('design', 'news');
INSERT INTO post_tags (post_id, tag_id) SELECT 3, id FROM tags WHERE name IN ('features', 'roadmap');
