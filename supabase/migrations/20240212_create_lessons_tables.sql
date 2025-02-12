-- Create sections table
CREATE TABLE sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    license_type TEXT NOT NULL,
    order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create subsections table
CREATE TABLE subsections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    license_type TEXT NOT NULL,
    order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create lessons table
CREATE TABLE lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subsection_id UUID REFERENCES subsections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT[] NOT NULL,
    license_type TEXT NOT NULL,
    order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_sections_license_type ON sections(license_type);
CREATE INDEX idx_subsections_license_type ON subsections(license_type);
CREATE INDEX idx_lessons_license_type ON lessons(license_type);

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_sections_updated_at
    BEFORE UPDATE ON sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subsections_updated_at
    BEFORE UPDATE ON subsections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
    BEFORE UPDATE ON lessons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data for Code 8 lessons
INSERT INTO sections (title, description, license_type, order) VALUES
('VEHICLE CONTROLS AND INSTRUMENTS', 'Learn about basic vehicle controls and instruments', 'code_8', 1),
('ROAD SIGNS AND MARKINGS', 'Understanding road signs and markings', 'code_8', 2),
('RULES OF THE ROAD', 'Essential rules and regulations for driving', 'code_8', 3),
('SAFETY AND EMERGENCY', 'Safety procedures and emergency protocols', 'code_8', 4);

-- Insert subsections
WITH section_ids AS (
    SELECT id, title FROM sections WHERE license_type = 'code_8'
)
INSERT INTO subsections (section_id, title, description, license_type, order) 
SELECT 
    section_ids.id,
    subsection_data.title,
    subsection_data.description,
    'code_8',
    subsection_data.order
FROM (
    VALUES 
        ('VEHICLE CONTROLS AND INSTRUMENTS', 'Basic Controls', 'Learn about basic vehicle controls', 1),
        ('VEHICLE CONTROLS AND INSTRUMENTS', 'Mirrors and Visibility', 'Understanding mirrors and visibility', 2),
        ('VEHICLE CONTROLS AND INSTRUMENTS', 'Vehicle Lighting', 'Vehicle lighting systems', 3),
        ('ROAD SIGNS AND MARKINGS', 'Regulatory Signs', 'Understanding regulatory signs', 1),
        ('ROAD SIGNS AND MARKINGS', 'Warning Signs', 'Understanding warning signs', 2),
        ('ROAD SIGNS AND MARKINGS', 'Information Signs', 'Understanding information signs', 3)
) AS subsection_data(section_title, title, description, order)
JOIN section_ids ON section_ids.title = subsection_data.section_title;

-- Insert lessons
WITH subsection_ids AS (
    SELECT id, title FROM subsections WHERE license_type = 'code_8'
)
INSERT INTO lessons (subsection_id, title, content, license_type, order)
SELECT 
    subsection_ids.id,
    lesson_data.title,
    lesson_data.content,
    'code_8',
    lesson_data.order
FROM (
    VALUES 
        ('Basic Controls', 'Steering Wheel', ARRAY['Function: Steer vehicle in particular direction', 'Proper grip positions', 'Control techniques'], 1),
        ('Basic Controls', 'Foot Controls', ARRAY['Clutch: Disengage engine for gear change', 'Foot Brake: Reduce speed or stop', 'Accelerator: Increase or decrease speed'], 2),
        ('Basic Controls', 'Hand Controls', ARRAY['Parking Brake: Hold vehicle stationary', 'Gear Lever: Select gears', 'Indicator: Signal turning intentions', 'Hooter: Give warning signals'], 3),
        ('Mirrors and Visibility', 'Rear-view Mirror', ARRAY['Interior mirror usage', 'Regular checking intervals', 'Blind spot awareness'], 1),
        ('Mirrors and Visibility', 'Exterior Mirrors', ARRAY['Proper adjustment', 'When to check', 'Blind spot coverage'], 2)
) AS lesson_data(subsection_title, title, content, order)
JOIN subsection_ids ON subsection_ids.title = lesson_data.subsection_title; 