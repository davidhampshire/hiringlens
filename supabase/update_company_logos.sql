-- Update logo_url and website_url for real companies
-- Uses logo.clearbit.com for free, high-quality logos
-- If Clearbit stops working, the UI falls back to colourful letter avatars automatically

UPDATE companies SET
  logo_url = 'https://logo.clearbit.com/accenture.com',
  website_url = 'https://accenture.com'
WHERE slug = 'accenture-digital';

UPDATE companies SET
  logo_url = 'https://logo.clearbit.com/spotify.com',
  website_url = 'https://spotify.com'
WHERE slug = 'spotify-uk';

UPDATE companies SET
  logo_url = 'https://logo.clearbit.com/monzo.com',
  website_url = 'https://monzo.com'
WHERE slug = 'monzo-bank';

UPDATE companies SET
  logo_url = 'https://logo.clearbit.com/deliveroo.co.uk',
  website_url = 'https://deliveroo.co.uk'
WHERE slug = 'deliveroo';

UPDATE companies SET
  logo_url = 'https://logo.clearbit.com/bbc.co.uk',
  website_url = 'https://bbc.co.uk'
WHERE slug = 'bbc-studios';

UPDATE companies SET
  logo_url = 'https://logo.clearbit.com/rolls-royce.com',
  website_url = 'https://rolls-royce.com'
WHERE slug = 'rolls-royce';

UPDATE companies SET
  logo_url = 'https://logo.clearbit.com/astrazeneca.com',
  website_url = 'https://astrazeneca.com'
WHERE slug = 'astrazeneca';

UPDATE companies SET
  logo_url = 'https://logo.clearbit.com/revolut.com',
  website_url = 'https://revolut.com'
WHERE slug = 'revolut';

UPDATE companies SET
  logo_url = 'https://logo.clearbit.com/sky.com',
  website_url = 'https://sky.com'
WHERE slug = 'sky-group';

UPDATE companies SET
  logo_url = 'https://logo.clearbit.com/ocado.com',
  website_url = 'https://ocado.com'
WHERE slug = 'ocado-technology';
