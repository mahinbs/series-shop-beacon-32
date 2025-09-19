-- Add age_rating column to books table
ALTER TABLE books ADD COLUMN age_rating VARCHAR(20) DEFAULT 'all' CHECK (age_rating IN ('all', 'teen', 'mature', '18+'));

-- Add comment to the column
COMMENT ON COLUMN books.age_rating IS 'Age rating for the book content: all, teen, mature, 18+';