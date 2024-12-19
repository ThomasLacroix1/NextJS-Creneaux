CREATE TABLE Intervenants (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    key VARCHAR(255) NOT NULL,
    creationdate DATE NOT NULL,
    enddate DATE,
    availability JSON,
    modifieddate DATE,
    workweek JSON
);

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

INSERT INTO Intervenants (email, firstname, lastname, key, creationdate, enddate, availability, workweek) 
VALUES
    ('intervenant.A@unilim.fr', 'Intervenant', 'A', 'A-key', '2023-01-10', '2023-10-15', '{}', '{}'),
    ('intervenant.G@unilim.fr', 'Intervenant', 'G', 'G-key', '2024-01-10', '2025-10-15', '{}', '{}'), 
    ('intervenant.B@unilim.fr', 'Intervenant', 'B', 'B-key', '2023-02-12', '2023-09-01', '{}', '{}'),
    ('intervenant.H@unilim.fr', 'Intervenant', 'H', 'H-key', '2024-02-12', '2025-09-01', '{}', '{}'), 
    ('intervenant.C@unilim.fr', 'Intervenant', 'C', 'C-key', '2023-03-15', '2023-08-20', '{}', '{}'),
    ('intervenant.I@unilim.fr', 'Intervenant', 'I', 'I-key', '2024-03-15', '2025-08-20', '{}', '{}'), 
    ('intervenant.D@unilim.fr', 'Intervenant', 'D', 'D-key', '2023-04-20', '2023-07-15', '{}', '{}'),
    ('intervenant.J@unilim.fr', 'Intervenant', 'J', 'J-key', '2024-04-20', '2025-07-15', '{}', '{}'), 
    ('intervenant.K@unilim.fr', 'Intervenant', 'K', 'K-key', '2024-05-25', '2025-06-10', '{}', '{}'), 
    ('intervenant.E@unilim.fr', 'Intervenant', 'E', 'E-key', '2023-05-25', '2023-06-10', '{}', '{}'),
    ('intervenant.L@unilim.fr', 'Intervenant', 'L', 'L-key', '2024-06-30', '2025-05-05', '{}', '{}'), 
    ('intervenant.F@unilim.fr', 'Intervenant', 'F', 'F-key', '2023-06-30', '2023-05-05', '{}', '{}'),
    ('intervenant.M@unilim.fr', 'Intervenant', 'M', 'M-key', '2024-07-10', '2025-04-15', '{}', '{}'), 
    ('intervenant.N@unilim.fr', 'Intervenant', 'N', 'N-key', '2024-08-12', '2025-03-01', '{}', '{}'), 
    ('intervenant.O@unilim.fr', 'Intervenant', 'O', 'O-key', '2024-09-15', '2025-02-20', '{}', '{}'), 
    ('intervenant.P@unilim.fr', 'Intervenant', 'P', 'P-key', '2024-10-20', '2025-01-15', '{}', '{}');

INSERT INTO Users (email, password) 
VALUES ('user@example.com', '$2b$10$8Cy5.6UE5CWeuTa/drheA.NyNG7oac/KrMAqQ1Rs0m1QuQwuTl0sO');
