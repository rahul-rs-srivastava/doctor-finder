
USE doctordb;

CREATE TABLE doctors (loc VARCHAR(255), area VARCHAR(255), doc VARCHAR(255), qual VARCHAR(255), rating INT,
    entryID INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(entryID));
    INSERT INTO doctors (loc, area, doc, qual, rating) values ("Bangalore", "Internal Medicine", "Dr. V. Krishnan", "MBBS, MD, DM", 4);
    INSERT INTO doctors (loc, area, doc, qual, rating) values ("Bangalore", "Internal Medicine", "Dr. Shalini Joshi", "MBBS, MD", 3);
    INSERT INTO doctors (loc, area, doc, qual, rating) values ("Bangalore", "Internal Medicine", "Dr. Geeta Subramaniam", "MBBS", 3);
    INSERT INTO doctors (loc, area, doc, qual, rating) values ("Bangalore", "ENT", "Dr. Srinivas", "MBBS, MS", 3);
    INSERT INTO doctors (loc, area, doc, qual, rating) values ("Bangalore", "ENT", "Dr. Ashok", "MBBS, MS", 3);


