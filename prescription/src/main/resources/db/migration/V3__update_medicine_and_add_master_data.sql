
CREATE TABLE generics (
                          generic_id BIGINT PRIMARY KEY,
                          generic_name VARCHAR(255) NOT NULL,
                          indication_description TEXT,
                          therapeutic_class_description TEXT,
                          pharmacology_description TEXT,
                          dosage_description TEXT,
                          administration_description TEXT,
                          interaction_description TEXT,
                          contraindications_description TEXT,
                          side_effects_description TEXT,
                          pregnancy_and_lactation_description TEXT,
                          precautions_description TEXT,
                          pediatric_usage_description TEXT,
                          overdose_effects_description TEXT,
                          storage_conditions_description TEXT,
                          INDEX idx_generic_name (generic_name)
);

CREATE TABLE manufacturers (
                               manufacturer_id BIGINT PRIMARY KEY,
                               manufacturer_name VARCHAR(255) NOT NULL,
                               INDEX idx_manufacturer_name (manufacturer_name)
);

ALTER TABLE medicines DROP COLUMN generic_name;
ALTER TABLE medicines DROP COLUMN side_effects;
ALTER TABLE medicines DROP COLUMN indications;

ALTER TABLE medicines ADD COLUMN brand_id BIGINT FIRST;
ALTER TABLE medicines ADD COLUMN dosage_form VARCHAR(100) AFTER medicine_type;
ALTER TABLE medicines ADD COLUMN generic_id BIGINT AFTER strength;
ALTER TABLE medicines ADD COLUMN manufacturer_id BIGINT AFTER generic_id;

ALTER TABLE medicines ADD CONSTRAINT fk_medicine_generic FOREIGN KEY (generic_id) REFERENCES generics(generic_id);
ALTER TABLE medicines ADD CONSTRAINT fk_medicine_manufacturer FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(manufacturer_id);

CREATE INDEX idx_brand_name ON medicines(brand_name);