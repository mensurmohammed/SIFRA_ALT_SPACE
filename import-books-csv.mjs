import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const csvData = `BookID,ISBN,Source,Title,Author,Category,PublicationYear,Language,Description,CoverImage,Edition,ShelfLocation
1ff9c1ce-f14d-4e81-b67e-f6615bb1f6e2,9789385031656,Google Books,The Scarlet Letter : Om Illustrated Classics,Nathaniel Hawthorne,Fiction,2018,en,"Roger Chillingworth, an aging scholar, returns to Puritan Boston and finds a crowd gathered to witness an official punishment. He spots a young woman holding a baby, whom he recognises as his wife, Hester Prynne, standing on the platform. Hester has been found guilty of “the most sinful act”. She refuses to reveal the father of her child and so, is ordered to wear the scarlet letter ‘A’ for the rest of her life as a mark of shame.Hester accepts her punishment and struggles to create a new life for her daughter Pearl. For the next seven years, she endures the accusing stares of the society, but holds her head high through the trials and tribulations. Reverend Dimmesdale, Hester’s pastor is the only person,who empathises with her. Meanwhile, Roger Chillingworth is full of vengeance and determined to exact revenge from Hester’s lover.The Scarlet Letter tells the tale of Roger Chillingworth, Hester Prynneand Arthur Dimmesdale as they struggle with their internal conflicts in the morally rigid 17th century society.",https://books.google.com/books/content?id=qVnDDAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api,,
51da130d-9035-4841-beb6-a1aadb5bb75f,9789380070889,Google Books,King Arthur And The Knights Of The Round Table : Om Illustrated Classics,Howard Pyle,,2018,en,"This is the story of one of the most magical legends, that of King Arthur and his noble knights of the Round Table. It all begins when young Arthur meets the wise Merlin and fulfils his destiny, by easily extracting a charmed sword that none could lift, and becoming King of the land.Read about the fascinating adventures of King Arthur and the valiant Knights of the Realm as they set forth on their quest for the Holy Grail, right until the Last Battle.",https://books.google.com/books/content?id=BEfDDAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api,,
0731f734-ae41-4095-b841-192d152fe92e,9789352762842,Google Books,The Return of Sherlock Holmes,A. Conan Doyle,,2018,en,,https://books.google.com/books/content?id=MCY9ugEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
cb9a7326-713f-4f3f-b639-9e862e1bb055,9781445100418,Google Books,Stock Exchanges,Sean Connolly,Stock exchanges,2010,en,"This series looks at different types of financial institutions. It explains their origins and how they have developed into the major forces that they are today. It also looks at world trade and aid work and how they affect, and are affected by, the overall economic situation.",https://books.google.com/books/content?id=ksuSQAAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
9810fd95-6773-4459-99f7-13c084570bee,9789380703251,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9789380703251-L.jpg,,
3dafe8cf-ecce-4634-bc7e-7a4a1baad472,9782914453905,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9782914453905-L.jpg,,
f5f3bccf-4dc2-4463-8cd9-2bcc5926a52c,9789382607045,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9789382607045-L.jpg,,
42f353d3-6a7b-4582-9546-15796fee86ac,9789383202720,Open Library,"Alice In Wonderland [Hardcover] [Jan 01, 2015] Lewis Carroll",Lewis Carroll,,2015,,,https://covers.openlibrary.org/b/isbn/9789383202720-L.jpg,,
27b4fac3-511d-4081-9739-1774d8f62bcc,9789380070902,Google Books,The War Of The Worlds : Om Illustrated Classics,H G Wells,Fiction,2018,en,"The inhabitants of Mars have attacked Earth! It’s pandemonium everywhere. Cities and countryside are razed to the ground as dreaded aliens unleash their fiery power. Nobody realises that the world, as they know it, is coming to an end when a flaming spaceship hits the earth and out come strange creatures ready to devour everything that comes in their path. Can the world be saved at all? Will these strange, tentacled aliens be stopped before all is burnt and lost forever? Will the earth bloom again? Find out as you read the thrilling story of the time when two worlds fought the most destructive war ever.",https://books.google.com/books/content?id=cEbDDAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api,,
bee78aee-7b09-4835-a5b4-9aecc239e08f,9789380070957,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9789380070957-L.jpg,,
e7fd4810-0a88-4646-97ab-6dd7225eb7c8,9789384625740,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9789384625740-L.jpg,,
82d17ae9-3022-437a-ad85-92ef52ce4a13,9780816043897,Google Books,The Encyclopedia of Stanley Kubrick,"Gene D. Phillips, Rodney Hill",Performing Arts,2002,en,"Surveys the director's life and career with information on his films, key people in his life, technical information, themes, locations, and film theory.",https://books.google.com/books/content?id=5sSbAQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
d221fba7-acf5-4a77-9dfe-bba8ec4e922a,9781408139967,Open Library,Theatre in pieces,Graeme Miller,"Drama, Technique, English literature",2011,,,https://covers.openlibrary.org/b/isbn/9781408139967-L.jpg,,
3f3ed0cb-7ef8-4594-958c-62fb47c9c0b8,9780340984468,Open Library,Studying Film,Nathan Abrams,"Motion pictures, PERFORMING ARTS, Reference, Motion pictures, study and teaching",2010,,,https://covers.openlibrary.org/b/isbn/9780340984468-L.jpg,,
1a306cd0-7f7d-493f-b453-b0b32a195f49,9780754829904,Google Books,Goya: His Life & Works in 500 Images,Susie Hodge,Art,2015,en,"A biography and gallery of one of Spain's great masters, stunningly illustrated throughout.",https://books.google.com/books/content?id=85_BrQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
5ea3e1e8-8cf8-4fa8-a63b-12a6e7f20a62,9780754830245,Google Books,The Bruegels,Nigel Rodgers,Art,2016,en,"Pieter Bruegel the Elder is one of the world's most original artists who founded a dynasty of painters. His most popular works include Children's Games, Hunters in the Snow and Peasant Wedding Feast. He collaborated with Rubens on several important works. The first part of the book tells the story of the Bruegel family, including his sons Pieter the Younger and Jan theElder. The second part is a glorious wide-ranging gallery of their work. Unlike other Old Masters, the Bruegels focused on ordinary people: farmers, workers, children, dancing, celebrating, working. Their work, often surprisingly modern in tone, still speaks to us today.",https://books.google.com/books/content?id=DJHrsgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
6dce91b3-f7a6-44ad-bb8d-557887838c09,9781529063608,Open Library,Just Work,"Kim Malone Scott, Gabra Zackman, Kim Scott",Economics,2021,,,https://covers.openlibrary.org/b/isbn/9781529063608-L.jpg,,
ff5e6e98-782a-459d-bb72-4f0faf486bf0,9781787632745,Open Library,Upstream,,Psychology,,,,https://covers.openlibrary.org/b/isbn/9781787632745-L.jpg,,
2af50312-4266-480f-aee9-1de6895903ad,9788196264765,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9788196264765-L.jpg,,
47683efe-bd68-4ee0-b68e-a4362dda3540,9780857424921,Google Books,Time Within Time,Andrei Tarkovsky,Performing Arts,2019,en,"""Tarkovsky for me is the greatest,"" wrote Ingmar Bergman. Andrey Tarkovsky only made seven films, but all are celebrated for its striking visual images, quietly patient dramatic structures, and visionary symbolism. Time within Time is both a diary and a notebook, maintained by Tarkovsky from 1970 until his death. Intense and intimate, it offers reflections on Dostoyevsky, Tolstoy, Hermann Hesse, Thomas Mann, and others. He writes movingly of his family, especially his father, Arseniy Tarkovsky, whose poems appear in his films. He records haunting dreams in detail and speaks of the state of society and the future of art, noting significant world events and purely personal dramas along with fascinating accounts of his own filmmaking. Rounding out this volume are Tarkovsky's plans and notes for his stage version of Hamlet; a detailed proposal for a film adaptation of Dostoyevsky's The Idiot; and a glimpse of the more public Tarkovsky answering questions put to him by interviewers.",https://books.google.com/books/content?id=_vtCAQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
682446df-8118-4358-a4a6-aefa38bdee46,9788119660605,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9788119660605-L.jpg,,
4bc3a959-5104-4106-ac81-5266bf90e881,9789350090053,Google Books,Essays,"Bacon, Francis",,,en,,https://covers.openlibrary.org/b/isbn/9789350090053-L.jpg,,
b7079c20-f4e7-4648-ab7b-76b1b93d4563,9781853264795,Google Books,Symposium and the Death of Socrates,Plato,Family & Relationships,1997,en,"""Symposium"" gives an account of the sparkling society that was Athens at the height of her empire. The other dialogues collected here under the title ""The Death of Socrates"" tell the tale of how Socrates was put on trial for impiety, found guilty and sentenced to death.",https://books.google.com/books/content?id=Ag-Tk01IIOMC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api,,
15cb3442-a12d-4ace-a8b5-b25f958830c5,9789393050861,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9789393050861-L.jpg,,
788a3f01-33ce-4759-af28-5348fd323e0e,9780241404867,Google Books,Philosophy for Polar Explorers,Erling Kagge,,2019,en,"For millennia exploration has been central to man's quest for meaning and knowledge. For when we set our sights on the horizons, we bring everything us around into focus. Erling Kagge was the first man in history to reach all of the Earth's poles by foot - the North, the South and the summit of Everest. In Philosophy for Polar Explorers, he sets out all that he has learned from his many expeditions in sixteen concise meditations on life above and below the tree line. Part philosophy, part explorer's handbook, this an expert guide on how we can all go further, achieve more, and discover a more meaningful existence.",https://books.google.com/books/content?id=KTfSwQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
ebe05a25-e013-4f3b-abba-6548df487670,9780300251371,Google Books,Through Vincent's Eyes,"Eik Kahng, Todd Cronan, David Francois Misteli, Rachel Skokowski, Marnin Young",ART,2021,en,"A revelatory resituation of Van Gogh's familiar works in the company of the surprising variety of nineteenth-century art and literature he most revered Vincent van Gogh's (1853-1890) idiosyncratic style grew out of a deep admiration for and connection to the nineteenth-century art world. This fresh look at Van Gogh's influences explores the artist's relationship to the Barbizon School painters Jean-François Millet and Georges Michel--Van Gogh's self-proclaimed mentors--as well as to Realists like Jean-François Raffaëlli and Léon Lhermitte. New scholarship offers insights into Van Gogh's emulation of Adolphe Monticelli, his absorption of the Hague School through Anton Mauve and Jozef Israëls, and his keen interest in the work of the Impressionists. This copiously illustrated volume also discusses Van Gogh's allegiance to the colorism of Eugène Delacroix, as well as his alliance with the Realist literature of Charles Dickens and George Eliot. Although Van Gogh has often been portrayed as an insular and tortured savant, Through Vincent's Eyes provides a fascinating deep dive into the artist's sources of inspiration that reveals his expansive interest in the artistic culture of his time. Published in association with the Santa Barbara Museum of Art Published in association with the Santa Barbara Museum of Art Exhibition Schedule: Columbus Museum of Art (November 12, 2021-February 6, 2022) Santa Barbara Museum of Art (February 27-May 22, 2022)",https://books.google.com/books/content?id=BYhczQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
a4490052-0cde-44cd-b69d-63ef23f7418e,9783937718224,Open Library,Shanghai Architecture & Design,daab,"Architecture, History, Interior architecture",2005,,,https://covers.openlibrary.org/b/isbn/9783937718224-L.jpg,,
bc42dd28-1947-4d79-b720-bf0358b68095,9781847943743,Open Library,Feel-Good Productivity,Ali Abdaal,,2023,,,https://covers.openlibrary.org/b/isbn/9781847943743-L.jpg,,
72e835ed-b945-43f0-946a-223553dd6407,9781471177255,Open Library,Never Grow Up,Jackie Chan,Autobiography and memoir,2019,,,https://covers.openlibrary.org/b/isbn/9781471177255-L.jpg,,
089d4e83-1557-4762-972c-b98744a599a8,9788198334725,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9788198334725-L.jpg,,
8db68a63-c504-4475-b006-9ffe4dcdb1ab,9780470624159,Open Library,The little book that still beats the market,Joel Greenblatt,"Speculation, Portfolio management, Investments, Stock exchanges, Success in business",2010,,"""Updated with a new introduction and afterword""--Jacket.

Previous ed. published as: The little book that beats the market.",https://covers.openlibrary.org/b/isbn/9780470624159-L.jpg,,
d20a0871-4cd3-49b0-a516-a0ec9e774611,9781473918870,Google Books,Youth Cultures,Andy Bennett,Social Science,2017,en,"SAGE BENCHMARKS IN CULTURE & SOCIETY SAGE Benchmarks in Culture & Society presents four-volume collections of key classic and contemporary articles on the substantive interdisciplinary topics at the heart of the social sciences. This series explores core topics of research and debate, including cultural theory, representation, identity, popular music and material culture. Each set presents a full contextualizing introduction by the editor and draws upon articles that map out each topic’s history and debates, and its theory and methods. This series presents the ‘gold standard’ for university libraries throughout the world that are seeking to solidify their social science reference collections.",https://books.google.com/books/content?id=RWiyDAEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
c65caa70-09ec-4b0b-867f-28577bb68817,9781789294064,Google Books,Thought Economics,Vikas Shah,Current events,2022,en,"In this fully updated paperback edition, including brand-new interviews from Shaquille O'Neal, Brian Eno, and Matthew McConaughey among others, Vikas Shah shares his most thought-provoking conversations to date.",https://books.google.com/books/content?id=I7aCzgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
e52db6b9-7560-4982-83fc-7e5075c64d6d,9781292286877,Google Books,CONNECT,GUY. LUBITSH-WHITE LUBITSH (TAMI.),Economics,2020,en,,https://books.google.com/books/content?id=jW2CzQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
e5a0d35d-e508-40cf-9913-20966a2fbeb9,9781911717096,Open Library,Untitled 332537,Yuval Noah Harari,,2024,,,https://covers.openlibrary.org/b/isbn/9781911717096-L.jpg,,
c2d99c03-f2b2-4dbe-ad89-4547af7f03d7,9780912986500,Open Library,World Without Cancer,G. Edward Griffin,"Chemotherapy, Laetrile, Cancer, Vitamin B17, nutrition",2018,,,https://covers.openlibrary.org/b/isbn/9780912986500-L.jpg,,
01e871d8-ad51-4e23-b047-d388d5b8a3c4,9780143478249,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9780143478249-L.jpg,,
ec3d6a17-f864-4f78-94b5-3e7adcfc0766,9781787304475,Open Library,The City and Its Uncertain Walls,Haruki Marukami,,2024,,,https://covers.openlibrary.org/b/isbn/9781787304475-L.jpg,,
807ad825-0b84-49a4-9ad9-2d7f0ef74f5f,9781119891970,Google Books,The Ethics Toolkit,"Julian Baggini, Peter S. Fosl",Philosophy,2024,en,"A new edition of the bestselling guide which equips readers with the skills necessary for engaging in ethical reflection The Ethics Toolkit offers an engaging and approachable introduction to the core concepts, principles, and methods of contemporary ethics. Explaining to students and general readers how to think critically about ethics and actually use philosophical concepts, this innovative volume provides the tools and knowledge required to engage intelligently in ethical study, deliberation, and debate. Invaluable as both a complete guide and a handy reference, this versatile resource provides clear and authoritative information on a diverse range of topics, from fundamental concepts and major ethical frameworks to contemporary critiques and ongoing debates. Throughout the text, Fosl and Baggini highlight the crucial role ethics plays in our lives, exploring autonomy, free will, consciousness, fairness, responsibility, consent, intersectionality, sex and gender, and much more. Substantially revised and expanded, the second edition of The Ethics Toolkit contains a wealth of new entries, new recommended readings, more detailed textual references, and numerous timely real-world and hypothetical examples. Uses clear and accessible language appropriate for use inside and beyond the classroom Contains cross-referenced entries to help readers connect and contrast ideas Engages both non-Western and Western philosophy Offer insights into key issues in ethics with a firm grounding in the history of philosophy Includes an appendix of tools for the practice of ethics, including links to podcasts, web and print resources, and prominent ethics organizations Written by the authors of the popular The Philosophers’ Toolkit, this new edition of The Ethics Toolkit is a must-have resource for anyone interested in ethics, from general readers to undergraduate and graduate students.",https://books.google.com/books/content?id=mZvfEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api,,
50214f38-bfb1-46a8-a3c4-3fd15a475cfd,9781292017471,Open Library,Leading constant change,Philip Webb,Organizational change,2015,,Includes bibliographical references and index.,https://covers.openlibrary.org/b/isbn/9781292017471-L.jpg,,
e6239bc7-3c56-4cef-9372-32337c7f4eba,9781292329994,Open Library,Build Your Community,Richard Millington,Commerce,2021,,,https://covers.openlibrary.org/b/isbn/9781292329994-L.jpg,,
7729aa37-a87f-4fc0-a6e6-b1ac5da533fa,9783937718798,Google Books,"Art spaces. Ediz. italiana, inglese, spagnola, francese e tedesca",Barbara Linz,Architecture,2006,en,"Set in different landscapes, this title contains photographic portraits of trucks and their drivers.",https://books.google.com/books/content?id=61ZJAQAAIAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
01baa3a1-47f9-428e-a56f-d7990459e39f,9780857023391,Google Books,Primary Humanities,"Tony Pickford, Wendy Garner, Elaine Jackson",Education,2013,en,"Providing a broad and balanced overview of the teaching of primary history and primary geography Primary Humanities: Learning Through Enquiry is indispensable reading for all primary teacher education students wishing to develop their understanding of teaching humanities subjects. Enquiry processes are central to learning and teaching in both History and Geography. This book aims to demystify and justify the approaches, identifying their common features and unique attributes. Using an enquiry-based approach as a means of exploring teaching, it combines theoretical coverage with practical examples to develop an informed and engaging survey of humanities teaching in the primary classroom. Covering issues such as planning and assessment in history and geography, using resources in teaching and exploring creative and cross-curricular approaches in humanities, Tony Pickford and Wendy Garner provide clear theory-informed guidance vital for success in the modern primary classroom. This is essential reading for all students studying primary history and geography on primary initial teacher education courses including undergraduate (BEd, BA with QTS), postgraduate (PGCE, SCITT), and employment-based routes into teaching, and NQTs.",https://books.google.com/books/content?id=w0FbuQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
085b970b-60f1-4e14-9c80-5551912aa97a,9781473999114,Open Library,NQT,"Wendy Jolliffe, David Waugh","Effective teaching, First year teachers",2017,,,https://covers.openlibrary.org/b/isbn/9781473999114-L.jpg,,
94c0ad9c-2257-472d-93c2-ed6fc71be69d,9780072388350,Open Library,The Art of Public Speaking,Stephen E. Lucas,"Public speaking, open_syllabus_project, Handbooks, manuals, Communication, Speech",2000,,,https://covers.openlibrary.org/b/isbn/9780072388350-L.jpg,,
785d701e-91fc-4bac-9134-7a355bf20712,9780393913316,Open Library,The Norton anthology of world literature,Martin Puchner,"Literature, Collections, Literature, collections",2012,,"""Volume A.""

Includes bibliographical references and index.",https://covers.openlibrary.org/b/isbn/9780393913316-L.jpg,,
ee763325-55f0-43a8-9b3d-62055e981645,9780393913309,Open Library,The Norton anthology of world literature,Martin Puchner,"Literature, Collections, Literature, collections",2012,,"""Volume A.""

Includes bibliographical references and index.",https://covers.openlibrary.org/b/isbn/9780393913309-L.jpg,,
757a041d-2c10-4205-9deb-d18870bae221,9780393913293,Google Books,The Norton Anthology of World Literature,Martin Puchner,Literature,2012,en,"The Third Edition now includes several thematic teaching clusters that bring together a number of short texts around an important cultural theme, such as Creation and the Cosmos, Travel and Conquest, Literature about Literature, God, Church, and Self. These clusters give instructors and students short counterpoints to or elaborations on the themes and topics covered in the anthologys major works, and they also provide direct textual support of broad historical or cultural contexts that are described in the part introductions or individual headnotes.",https://books.google.com/books/content?id=j2L_ygAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
db13309d-5fe4-402f-8bee-a2b95398e1b4,9789386410023,Open Library,Who killed Osho?,"Vaidya, Abhay (Journalist)","Death and burial, History, Death, Causes, Osho International Foundation",2017,,Includes bibliographical references.,https://covers.openlibrary.org/b/isbn/9789386410023-L.jpg,,
37c17553-17ee-4b1f-96d6-d73080ffcbfb,9780670092291,Open Library,Little Book of Comfort,Ruskin Bond,Quotations,2019,,,https://covers.openlibrary.org/b/isbn/9780670092291-L.jpg,,
d670cb30-3e16-457f-88d1-4a04cf57297e,9781846046674,Open Library,Stoic Guide to a Happy Life,Massimo Pigliucci,,2020,,,https://covers.openlibrary.org/b/isbn/9781846046674-L.jpg,,
ca3419c2-48c8-4a6a-9dc6-3200bdc2f30d,9789352766437,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9789352766437-L.jpg,,
8b02d3f7-0910-4550-83a7-d1d28762fd28,9789352763399,Open Library,The Originals The Adventures of Tom Sawyer and Huckleberry Finn,Tom Sawyer,,7-17,,,https://covers.openlibrary.org/b/isbn/9789352763399-L.jpg,,
3f481197-c6fb-46ac-a323-d1d49dfd46c5,9788197221309,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9788197221309-L.jpg,,
6eceac0e-d794-43f9-a5e0-209f5ef904a7,9788119756919,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9788119756919-L.jpg,,
ad22c226-135a-45ce-8474-abf6c4ffedc7,9789352762903,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9789352762903-L.jpg,,
43cc6ebe-17bc-4397-a443-da07b21d5605,9788196300494,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9788196300494-L.jpg,,
84d1eb22-94a4-40e7-93d6-398ec01b5a71,9780857238993,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9780857238993-L.jpg,,
43f2d0ea-d3db-4aed-a808-e81fb8384d59,9781784875206,Open Library,Bell,Iris Murdoch,"Fiction, Married women, Gay men, Church bells, Religious communities",2019,,,https://covers.openlibrary.org/b/isbn/9781784875206-L.jpg,,
2e26d679-577e-4754-b286-d0a3d5c6e6eb,9781784875213,Open Library,Under the Net,Iris Murdoch,"Classic Literature, Fiction, Women authors, English fiction, Philosophers",2019,,,https://covers.openlibrary.org/b/isbn/9781784875213-L.jpg,,
e7b055d0-78c5-44c2-844f-58b8c56cadd4,9781911077039,Open Library,The Fever Code [Paperback],James Dashner,"JUVENILE FICTION / Action & Adventure / General, Survival, Fiction, Science fiction, Natural disasters",2017,,,https://covers.openlibrary.org/b/isbn/9781911077039-L.jpg,,
abbe6a4e-eb9c-4dff-b80a-b6df2673215b,9789351039686,Open Library,Scorch Trials Movie Tie-in Edition [Paperback] James Dashner,James Dashner,,2017,,,https://covers.openlibrary.org/b/isbn/9789351039686-L.jpg,,
9f63091b-e59c-4e4f-8715-fa4f9dceb922,9781910655917,Google Books,The Death Cure,James Dashner,Juvenile Fiction,2018,en,"Soon to be a major motion picture! The Trials are over. WICKED have collected all the information they can. Now it's up to the Gladers to complete the blueprint for the cure to the Flare with a final voluntary test. But something has happened that no one at WICKED has foreseen: Thomas has remembered more than they think. And he knows WICKED can't be trusted ... The time for lies is over. But the truth is more dangerous than anyone could have imagined. With the Gladers divided, can they all make it?",https://books.google.com/books/content?id=zPF4tAEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
014a4cd1-81f2-4556-9c55-a035a193db7e,9789351033134,Open Library,"The Maze Runner [Paperback] [Sep 22, 2014] James Dashner",James Dashner,,9-22,,,https://covers.openlibrary.org/b/isbn/9789351033134-L.jpg,,
cdc9abf3-d09f-4115-9cbb-945fec150d9b,9781587310737,Open Library,Who Believes Is Not Alone,"Georg Gänswein, Saverio Gaeta",,2023,,,https://covers.openlibrary.org/b/isbn/9781587310737-L.jpg,,
3010567a-be63-4756-90a8-2d86986cbf65,9781500420536,Google Books,Suicide Med,Freida McFadden,Medical colleges,2014,en,"There's a reason Southside Medical School has been nicknamed ""Suicide Med."" For the last six years, every year one student has taken his own life. Except for last year. Last year was a murder-suicide. The press has pointed to the heavy workload as the culprit in the high suicide rate. Some students believe that the school is cursed. And others believe that the deaths may not be suicides at all-that it's no coincidence that Dr. Conlon, Southside's quirky but beloved anatomy professor, joined the staff on the very year that the suicides began. Either way, the same question echoes through the minds of every first year student at Suicide Med: Who will be next to die?",https://books.google.com/books/content?id=JHV3oAEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
82c20a9f-2edd-4035-a59f-d703b6bfb1cf,9781529149357,Open Library,Not All Heroes Wear Capes,Jonathan Lancaster,,2023,,,https://covers.openlibrary.org/b/isbn/9781529149357-L.jpg,,
1ecd8f57-9ca2-4a70-894c-c15d2dda9da5,9781509558254,Google Books,A Brief Global History of the Left,Shlomo Sand,,2023,en,,https://books.google.com/books/content?id=mzfwzwEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
c8c0965d-be07-420a-bed5-1d393215b307,9781785043390,Google Books,The Pain-Free Mindset,Deepak Ravindran,Health & Fitness,2021,en,"If you know anyone who works in the NHS. A nurse, doctor, physio, dietitian, administrator, manager, literally anyone. Gift them this book. Dr Rupy Aujla This book is an absolute must have for anyone who wants to take back control of their lives - and most importantly - their pain. Kate Silverton There is no easy fix when it comes to chronic pain. Opioids are often the first, addictive resort and surgery rarely achieves the pain free outcome promised. But while there is no single fix, there is a way out and it starts with your mindset. This is the powerful approach of The Pain-Free Mindset, where NHS pain consultant Dr Ravindran brings his 20 years of experience to offer you an effective set of techniques that will help you take back control and overcome your pain. In this groundbreaking guide you will: ·Discover what happens to your body and brain when you experience pain ·Learn how you can change the way you perceive and respond to pain - without taking addictive medication ·Find the best pain-management plan for you and your lifestyle Packed with science-backed tips and inspiring case studies this book will transform your mindset and show that you have the power to live pain free.",https://books.google.com/books/content?id=2O-QEAAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
eb02061e-b97c-4e2a-9e8b-3a4c7f51b423,9788172235031,Open Library,"Men Are From Mars, Women Are From Venus",John Gray,"Marriage, Communication in marriage, Man-woman relationships, Communication, sex differences, Sex differences (psychology)",2005,,"Source title: Men Are From Mars, Women Are From Venus: Get Seriously Involved with the Classic Guide to Surviving the Opposite Sex",https://covers.openlibrary.org/b/isbn/9788172235031-L.jpg,,
da5dc714-3308-48c4-ae45-17b304a5d594,9781861979780,Open Library,33 Strategies of War,"Robert Greene, Don Leslie","Business, Nonfiction, Psychology, Control (Psychology), Interpersonal conflict",2007,,,https://covers.openlibrary.org/b/isbn/9781861979780-L.jpg,,
8d3887b9-3bc5-4e02-9229-3804118c3411,9781622038329,Open Library,The way of the superior man,David Deida,"Man-woman relationships, Conduct of life, Men, Masculinity, SOCIAL SCIENCE",2017,,,https://covers.openlibrary.org/b/isbn/9781622038329-L.jpg,,
3869ae13-8fac-4984-9831-580afe64b351,9781905654291,Open Library,Breaking Dawn,Stephenie Meyer,"series:Twilight, series:Luz_e_Escuridão School stories, Edward Cullen (Fictitious character), Vampires, Bella Swan (Fictitious character)",2008,,,https://covers.openlibrary.org/b/isbn/9781905654291-L.jpg,,
96a3b619-800a-4f2d-8013-9954498af6bd,9789388241786,Google Books,The Book of Rumi,Rumi,Literary Collections,,en,"It is said that: “After nourishment, shelter and companionship, stories are the thing we need most in the world”. This new collection of Rumi stories fills that need. A luminous translation by Maryam mafi brings the classic poet Rumi’s distinctive and timeless Sufi lessons to a new audience, transforming the original verses into prose that conveys the vibrancy of the medieval setting and at the same time also sounds fresh. This beautifully produced volume also reiterates Rumi’s value in modern society. This fresh prose translation of 105 short teaching stories by Rumi, which form the core of the six-volume masnavi, explores the hidden spiritual aspects of everyday experience. Rumi transforms the seemingly mundane events of daily life into profound Sufi teaching moments. These prose gems open the mystical portal to the world of the ancient mystic. Rumi’s voice alternates between playful and authoritative, whether he is telling stories of ordinary lives or inviting the discerning reader to higher levels of introspection and attainment of transcendent values. Mafi’s translations Delicately reflect the nuances of Rumi’s poetry while retaining the positive tone of all of Rumi’s writings, as well as the sense of suspense and drama that mark the essence of the masnavi.",https://books.google.com/books/content?id=HkunDwAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
0d193412-d383-40e4-8d5e-495258299a6b,9789999053297,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9789999053297-L.jpg,,
295fdb51-a151-4cf8-a9f0-67d1035be44b,9780241257531,Open Library,Six Thinking Hats,"Edward de Bono, Feng yang","Creative ability, Thought and thinking, Problem solving, Creative thinking, Reasoning",2017,,,https://covers.openlibrary.org/b/isbn/9780241257531-L.jpg,,
77a14e11-7493-4cb8-8f8f-5bc2ea4ead21,5581598146189,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/5581598146189-L.jpg,,
fd5a1287-adc5-4d61-b62a-144a863f0e5b,9781915261472,Google Books,Tips for Teachers: 400+ Ideas to Improve Your Teaching,Craig Barton,Education,2023,en,"Teaching is complex. But there are simple ideas we can enact to help our teaching be more effective. This book contains over 400 such ideas. The ideas come from two sources. First, from the wonderful guests on my Tips for Teachers podcast - education heavyweights such as Dylan Wiliam, Daisy Christodoulou and Tom Sherrington, as well as talented teachers who are not household names but have so much wisdom to share. Then there''s what I have learned from working with amazing teachers and students in hundreds of schools around the world. Inside you will find 22 ideas to enhance mini-whiteboard use, 15 ideas to improve the start of your lesson, 14 ideas to help make Silent Teacher effective, seven ways to respond if a student says they don''t know, and lots, lots more. Each idea can be implemented the very next time you step into a classroom. So, whatever your level of experience, subject or phase, there are plenty of ideas in this book to help take your teaching to the next level. Book contents Chapter 1: How to use this book Tip 1. How to use this book to improve your teaching Tip 2. How to give yourself the best chance of making a lasting change Chapter 2: Habits and routines Why are habits and routines important? Tip 3. Eight ideas to help introduce a routine Tip 4. Beware of the Valley of Latent Potential Tip 5. Two ideas to help a routine stick Tip 6. Develop a set of high-value activity structures Tip 7. Six ideas to help establish positive norms in your classroom Tip 8. Four types of words to consider removing from your teaching vocabulary Chapter 3: The means of participation A challenge Tip 9. Front-load the means of participation Tip 10. Ten ideas to improve Cold Call Tip 11. Eight reasons to strive for mass participation more frequently Tip 12. Twenty-two ideas to improve the use of mini-whiteboards Tip 13. Five ideas to improve the use of voting systems Tip 14. Nine ideas to improve Call and Response Tip 15. Fifteen ideas to improve Partner Talk Tip 16. Six ideas to improve group work Tip 17. Use the means of participation holy trinity Tip 18. Never rely on a mental note Tip 19. The best tool for the long term might not be the best tool for now Chapter 4: Checking for understanding Tip 20. Think of questions as a check for misunderstanding Tip 21. Use the temptation to ask for self-report as a cue to ask a better question Tip 22. Lengthen wait times after asking a question Tip 23. Lengthen wait times after an answer Tip 24. Ten types of questions to ask when checking for understanding Tip 25. Try these three frameworks for learner-generated examples Tip 26. Three ways to use diagnostic questions to check for understanding Tip 27. Provide scaffolds for verbal responses Tip 28. Six key times to check for understanding Tip 29. Ten ideas to improve Exit Tickets Tip 30. Pick the student least likely to know Tip 31. Start with whoever got 8 out of 10 Tip 32. Ten ideas to help create a culture of error Tip 33. Three ideas to encourage students to ask questions Chapter 5: Responsive teaching Tip 34. Trick your students to test if they really understand Tip 35. Never round-up Tip 36. Six ideas if a student says ''I don''t know'' Tip 37. What to do when some students understand and some don''t Tip 38. What to do when some students still don''t understand Tip 39. How students can own and record classroom discussions Tip 40. Share students'' work with the rest of the class Chapter 6: Planning Tip 41. Seven ideas to improve a scheme of work Tip 42. Six ideas to help start the planning process Tip 43. Plan to do less, but better Tip 44. Ask yourself: ''What are my students likely to be thinking about?'' Tip 45. Write out ideal student responses Tip 46. Four ideas to help you plan for and respond to errors Tip 47. Two ideas to help teachers engage in Deep Work Tip 48. Aim to close the loop when sending an email Chapter 7: Prior knowledge Tip 49. Plan relevant prior knowledge Tip 50. Prioritise relevant prior knowledge Tip 51. Assess relevant prior knowledge Tip 52. Respond to prior knowledge assessment Tip 53. Assess relevant prior knowledge for each idea, not for the whole sequence Chapter 8: Explanations, modelling and worked examples Tip 54. Five ideas to show students why what we are learning today matters Tip 55. Use related examples and non-examples to explain technical language Tip 56. Fourteen ideas to improve the explanation of a concept Tip 57. Teach decision making separately Tip 58. Five ideas to improve our choice of examples Tip 59. Model techniques live Tip 60. Use a teacher worked-examples book Tip 61. Use student worked-examples books Tip 62. Make use of the power of Example-Problem Pairs Tip 63. Fourteen ideas to improve Silent Teacher Tip 64. Use self-explanation prompts to help develop your students'' understanding Tip 65. Six ideas to improve ''copy down the worked example'' Tip 66. Vary the means of participation for the We Do Tip 67. Three errors to avoid with the Your Turn questions Tip 68. Reflect after a worked example Tip 69. Beware of seductive details Chapter 9: Student practice Tip 70. Eight ideas to improve student practice time Tip 71. How to harness the hidden power of interleaving Tip 72. Consider using Intelligent Practice Tip 73. Consider using ''no-number'' questions Tip 74. Nine ideas to help you observe student work with a purpose Tip 75. Occasionally let students do work in someone else''s book Chapter 10: Memory and retrieval Retrieval opportunities Tip 76. Show your students the Forgetting Curve Tip 77. Show your students the path to high storage and retrieval strength Tip 78. Show your students the limits of working memory Tip 79. Show your students how long-term memory helps thinking Tip 80. Show your students that being familiar with something is not the same as knowing it Tip 81. Ensure you provide retrieval opportunities for all content Tip 82. When designing retrieval opportunities, aim for 80% Tip 83. Vary the types of retrieval questions you ask Tip 84. Consider providing prompts and cues during retrieval opportunities Tip 85. Get your students to assign confidence scores to their answers Tip 86. Make corrections quizzable Tip 87. Twenty-one ideas to improve your Low-Stakes Quizzes Tip 88. Fifteen ideas to improve the Do Now Tip 89. Consider using Trello to help organise the disorganised Chapter 11: Homework, marking and feedback Tip 90. Make homework feed into lessons Tip 91. Eight ideas to improve homework Tip 92. Two things to check if homework or test scores are a surprise Tip 93. Be careful how you respond to ''silly'' mistakes Tip 94. Turn feedback into detective work Tip 95. Consider recording verbal feedback Tip 96. Twelve ideas to improve whole-class feedback Chapter 12: Improving as a teacher Tip 97. Find the expertise within your team Tip 98. Five different people to learn from Tip 99. Revisit education books and podcast episodes Tip 100. Four things to consider when trying something new Tip 101. Five ideas to help tackle the negativity radio Tip 102. Consider slowing down your career Tip 103. Sixteen ideas to improve the delivery of CPD Tip 104. Micro tips Tip 105. If you want more tips...",https://books.google.com/books/content?id=SyNzzwEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api,,
a2f79cba-bb4b-47ae-99d2-45f8ff36f77f,9781853260155,Open Library,The picture of Dorian Gray,Oscar Wilde,"British and irish fiction (fictional works by one author), Conduct of life, fiction, Fantasy fiction, Appearance (Philosophy), Fiction",1992,,"""Complete and unabridged.""

""The text is taken from the Paris edition published in Montmartre, 1908.""

Includes bibliography.",https://covers.openlibrary.org/b/isbn/9781853260155-L.jpg,,
ec696199-b220-42d4-80c8-cb3a996c5ddd,9788119172566,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9788119172566-L.jpg,,
e3c25945-1bc8-43b0-b1bc-0049a26cbc63,9788119172351,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9788119172351-L.jpg,,
5ae1778c-0e3a-4716-aa43-6d6e6feb0d8f,9788119172290,Not Found,,,,,,,https://covers.openlibrary.org/b/isbn/9788119172290-L.jpg,,
`;

// Simple CSV parser supporting quoted strings and multiline fields
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const result = [];
  let curRow = [];
  let curVal = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        curVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      curRow.push(curVal);
      curVal = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      curRow.push(curVal);
      curVal = "";
      if (curRow.some(cell => cell.trim().length > 0)) {
        result.push(curRow);
      }
      curRow = [];
    } else {
      curVal += char;
    }
  }
  if (curVal || curRow.length > 0) {
    curRow.push(curVal);
    result.push(curRow);
  }
  return result;
}

async function main() {
  const parsed = parseCSV(csvData);
  const headers = parsed[0];
  const rows = parsed.slice(1);

  console.log(`Found ${rows.length} records to import.`);

  // First create a default Category if needed
  let defaultCategory = await prisma.bookCategory.findFirst({
    where: { CategoryName: "General" },
  });

  if (!defaultCategory) {
    defaultCategory = await prisma.bookCategory.create({
      data: { CategoryName: "General", Description: "General collection" },
    });
  }

  const categoryCache = new Map();
  categoryCache.set("general", defaultCategory.CategoryID);

  let updatedCount = 0;
  let createdCount = 0;
  let skippedCount = 0;

  for (const row of rows) {
    const bookID = row[0]?.trim();
    const isbn = row[1]?.trim();
    const source = row[2]?.trim();
    let title = row[3]?.trim();
    let author = row[4]?.trim();
    let categoryName = row[5]?.trim();
    const pubYearStr = row[6]?.trim();
    const language = row[7]?.trim();
    const description = row[8]?.trim();
    const coverImage = row[9]?.trim();
    const edition = row[10]?.trim();
    const shelfLocation = row[11]?.trim();

    if (!isbn && !bookID) {
      skippedCount++;
      continue;
    }

    // Clean up category name (take first if comma-separated)
    if (categoryName && categoryName.includes(",")) {
      categoryName = categoryName.split(",")[0].trim();
    }
    if (!categoryName) {
      categoryName = "General";
    }

    let categoryID = categoryCache.get(categoryName.toLowerCase());
    if (!categoryID) {
      let cat = await prisma.bookCategory.findFirst({
        where: { CategoryName: { equals: categoryName, mode: "insensitive" } },
      });
      if (!cat) {
        cat = await prisma.bookCategory.create({
          data: { CategoryName: categoryName },
        });
      }
      categoryID = cat.CategoryID;
      categoryCache.set(categoryName.toLowerCase(), categoryID);
    }

    // Clean up Title & Author fallbacks
    if (!title || title === "Not Found" || title === '""') {
      title = isbn ? `Book (${isbn})` : `Book (${bookID.slice(0, 8)})`;
    }
    if (!author || author === '""') {
      author = "Unknown Author";
    }

    const pubYear = pubYearStr && !isNaN(parseInt(pubYearStr)) ? parseInt(pubYearStr) : null;

    // Check if book exists by ISBN or BookID
    let existingBook = null;
    if (isbn) {
      existingBook = await prisma.book.findFirst({ where: { ISBN: isbn } });
    }
    if (!existingBook && bookID) {
      existingBook = await prisma.book.findUnique({ where: { BookID: bookID } });
    }

    const bookData = {
      ISBN: isbn || null,
      Title: title,
      Author: author,
      CategoryID: categoryID,
      PublicationYear: pubYear,
      Language: language || null,
      Description: description || null,
      CoverImage: coverImage || null,
      Edition: edition || null,
      ShelfLocation: shelfLocation || null,
    };

    let targetBookId = "";

    if (existingBook) {
      // Overwrite existing book
      await prisma.book.update({
        where: { BookID: existingBook.BookID },
        data: bookData,
      });
      targetBookId = existingBook.BookID;
      updatedCount++;
    } else {
      // Create new book
      const newBook = await prisma.book.create({
        data: {
          BookID: bookID || undefined,
          ...bookData,
        },
      });
      targetBookId = newBook.BookID;
      createdCount++;
    }

    // Ensure at least one copy exists for this book
    const existingCopiesCount = await prisma.bookCopy.count({
      where: { BookID: targetBookId },
    });

    if (existingCopiesCount === 0) {
      const barcode = `BC-${isbn || targetBookId.slice(0, 8)}-1`;
      await prisma.bookCopy.create({
        data: {
          BookID: targetBookId,
          Barcode: barcode,
          Status: "Available",
          Condition: "Good",
        },
      });
    }
  }

  console.log(`Import Finished!`);
  console.log(`Created: ${createdCount}, Overwritten: ${updatedCount}, Skipped: ${skippedCount}`);
}

main()
  .catch((e) => {
    console.error("Import error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
