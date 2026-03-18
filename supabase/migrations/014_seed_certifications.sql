-- Migration: Reseed Certifications with Complete Names
-- Description: Clear existing certifications and insert properly named ones with full names (no abbreviations)

-- First, delete all existing certifications
DELETE FROM certifications;

-- Insert certifications with complete, professional names
-- Schema: name, phase_number, is_obtained, icon_url
INSERT INTO public.certifications (name, phase_number, is_obtained, icon_url) VALUES 
-- Obtained - Only the degree
('Bachelor of Science in Computer Science', 1, true, '/assets/badges/maseno-university.png'),

-- Certifications in Pursuit
('AWS Solutions Architect - Associate', 3, false, '/assets/badges/aws-saa.png'),
('AWS Machine Learning - Specialty', 6, false, '/assets/badges/aws-mls.png'),
('Certified Kubernetes Administrator', 5, false, '/assets/badges/cka.png'),
('Certified Kubernetes Application Developer', 5, false, '/assets/badges/ckad.png'),
('HashiCorp Terraform Associate', 3, false, '/assets/badges/terraform-associate.png'),
('Databricks Certified Data Engineer', 4, false, '/assets/badges/databricks.png'),
('Google Cloud Professional Machine Learning Engineer', 8, false, '/assets/badges/gcp-ml.png')
ON CONFLICT (name) DO UPDATE SET
    phase_number = EXCLUDED.phase_number,
    is_obtained = EXCLUDED.is_obtained,
    icon_url = EXCLUDED.icon_url;
