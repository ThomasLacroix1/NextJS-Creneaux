Example : 

INSERT INTO "Intervenant" (name, slots)
VALUES 
('Intervenant 2', '{
    "default": [
        {
            "days": "lundi, mardi, jeudi, vendredi",
            "from": "8:30",
            "to": "17:30"
        },
        {
            "days": "mercredi",
            "from": "8:30",
            "to": "12:30"
        }
    ]
}'),
('Intervenant 3', '{
    "default": [
        {
            "days": "lundi, mardi, mercredi, jeudi, vendredi",
            "from": "8:00",
            "to": "19:30"
        }
    ]
}'),
('Intervenant 4', '{
        "default": [{
            "days": "lundi, mardi, mercredi, jeudi, vendredi",
            "from": "8:00",
            "to": "18:30"
        }],
        "S38": [{
            "days": "lundi",
            "from": "9:00",
            "to": "11:30"
        }, {
            "days": "lundi",
            "from": "14:00",
            "to": "17:00"
        }, {
            "days": "mardi, mercredi, jeudi, vendredi",
            "from": "8:00",
            "to": "18:30"
        }],
        "S40": [{
            "days": "lundi, mardi, mercredi, jeudi",
            "from": "8:00",
            "to": "18:30"
        }, {
            "days": "vendredi",
            "from": "8:00",
            "to": "12:30"
        }],
        "S41": [{
            "days": "lundi, mardi, vendredi",
            "from": "8:00",
            "to": "18:30"
        }, {
            "days": "mercredi",
            "from": "8:00",
            "to": "12:00"
        }]
    }');

Migration : 
npx prisma migrate dev --name init