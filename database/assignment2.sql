-- Query One
INSERT INTO account 
	(account_firstname, account_lastname, account_email, account_password)
VALUES 
	('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Query Two
UPDATE account 
SET 
    account_type = 'Admin'
WHERE
    account_id = 1;

-- Query Three
DELETE FROM account 
WHERE
    account_id = 1;
    
-- Query Four
UPDATE inventory 
SET 
    inv_description = REPLACE(inv_description,
        'small interiors',
        'a huge interior')
WHERE
    inv_id = 10;

-- Query Five
SELECT 
    inv_make, inv_model, classification_name
FROM
    inventory
        INNER JOIN
    classification ON inventory.classification_id = classification.classification_id
WHERE
    inventory.classification_id = 2;
    
-- Query Six
-- make sure they only run once otherwise there will be many /vehicles/ in a row
UPDATE inventory 
SET 
    inv_image = REPLACE(inv_image,
        '/images',
        '/images/vehicles');

UPDATE inventory 
SET 
    inv_thumbnail = REPLACE(inv_thumbnail,
        '/images',
        '/images/vehicles');