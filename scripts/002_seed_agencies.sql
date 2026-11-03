-- Insert cleaning agencies
INSERT INTO agencies (name, type, province, city, rating, review_count, description, services, phone, email) VALUES
('CleanPro Sardegna', 'pulizie', 'Cagliari', 'Cagliari', 4.8, 127, 'Agenzia leader nelle pulizie professionali per case vacanza e strutture ricettive. Esperienza ventennale nel settore hospitality.', ARRAY['Pulizie appartamenti', 'Sanificazione', 'Cambio biancheria', 'Check-out cleaning'], '+39 070 123 4567', 'info@cleanprosardegna.it'),
('Pulizie Perfette Costa Smeralda', 'pulizie', 'Sassari', 'Porto Cervo', 4.7, 98, 'Specializzati in ville di lusso e resort. Staff multilingue e disponibilità h24 durante la stagione estiva.', ARRAY['Pulizie ville', 'Pulizie piscine', 'Servizio lavanderia', 'Gestione chiavi'], '+39 0789 234 567', 'contatto@puliziecostasmeralda.it'),
('EcoClean Nuoro', 'pulizie', 'Nuoro', 'Nuoro', 4.9, 156, 'Pulizie ecologiche con prodotti certificati. Perfetti per property manager attenti alla sostenibilità.', ARRAY['Pulizie ecologiche', 'Sanificazione ozono', 'Pulizie finali', 'Manutenzione ordinaria'], '+39 0784 345 678', 'eco@eclean-nuoro.it'),
('Pulizie Express Olbia', 'pulizie', 'Sassari', 'Olbia', 4.6, 89, 'Servizio rapido per turnover veloce. Ideali per B&B e case vacanza con check-in ravvicinati.', ARRAY['Pulizie rapide', 'Cambio biancheria', 'Rifornimento cortesia'], '+39 0789 456 789', 'info@pulizieexpress-olbia.it'),
('PuliziaTop Oristano', 'pulizie', 'Oristano', 'Oristano', 4.5, 72, 'Servizio completo di pulizie per appartamenti turistici nella zona di Oristano e Mari Ermi.', ARRAY['Pulizie settimanali', 'Pulizie straordinarie', 'Lavaggio vetri'], '+39 0783 567 890', 'contatti@puliziatop-or.it');

-- Insert maintenance agencies
INSERT INTO agencies (name, type, province, city, rating, review_count, description, services, phone, email) VALUES
('Manutenzione Express', 'manutenzione', 'Sassari', 'Alghero', 4.9, 134, 'Interventi rapidi su impianti elettrici, idraulici e climatizzazione. Disponibili per emergenze 24/7.', ARRAY['Idraulica', 'Elettricità', 'Climatizzazione', 'Pronto intervento'], '+39 079 678 901', 'express@manutenzione-alghero.it'),
('SardegnaManutenzioni', 'manutenzione', 'Cagliari', 'Villasimius', 4.6, 91, 'Team di professionisti certificati per manutenzione ordinaria e straordinaria di strutture turistiche.', ARRAY['Manutenzione ordinaria', 'Riparazioni', 'Giardinaggio', 'Manutenzione piscine'], '+39 070 789 012', 'info@sardegnamanutenzioni.it'),
('Fix&Go Oristano', 'manutenzione', 'Oristano', 'Cabras', 4.5, 67, 'Piccole e grandi riparazioni per immobili turistici. Elettricisti e idraulici qualificati.', ARRAY['Riparazioni elettriche', 'Riparazioni idrauliche', 'Falegnameria', 'Serrature'], '+39 0783 890 123', 'fixandgo@manutenzionior.it'),
('TechHouse Nuoro', 'manutenzione', 'Nuoro', 'Dorgali', 4.7, 78, 'Specializzati in impianti tecnologici: wi-fi, domotica, videosorveglianza per property manager moderni.', ARRAY['Impianti wi-fi', 'Domotica', 'Videosorveglianza', 'Smart lock'], '+39 0784 901 234', 'tech@techouse-nuoro.it');

-- Insert some sample reviews
INSERT INTO reviews (agency_id, reviewer_name, rating, comment) VALUES
((SELECT id FROM agencies WHERE name = 'CleanPro Sardegna'), 'Marco Rossi', 5, 'Servizio impeccabile, sempre puntuali e professionali.'),
((SELECT id FROM agencies WHERE name = 'CleanPro Sardegna'), 'Laura Bianchi', 5, 'Collaboro con loro da 3 anni, mai un problema.'),
((SELECT id FROM agencies WHERE name = 'EcoClean Nuoro'), 'Giovanni Serra', 5, 'Ottima qualità e prodotti ecologici. Molto apprezzati dagli ospiti.'),
((SELECT id FROM agencies WHERE name = 'Manutenzione Express'), 'Paolo Carta', 5, 'Intervento rapidissimo per perdita acqua. Salvati!'),
((SELECT id FROM agencies WHERE name = 'Manutenzione Express'), 'Sofia Piras', 5, 'Professionali e competenti. Li consiglio.');
